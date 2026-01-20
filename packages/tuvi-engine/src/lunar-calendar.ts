/* eslint-disable no-magic-numbers */
/**
 * Lịch pháp Việt Nam theo thuật toán Hồ Ngọc Đức.
 * Tham khảo: https://www.informatik.uni-leipzig.de/~duc/amlich/
 * Ghi chú: triển khai tính toán Julian Day, Trăng Sóc, kinh độ Mặt Trời và chuyển đổi Âm ↔ Dương.
 * Ưu tiên tính đúng, không dùng bảng tra cứu tĩnh.
 */

export type LunarDate = {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
};

export type SolarDate = {
  day: number;
  month: number;
  year: number;
};

const PI = Math.PI;

const INT = (value: number) => Math.floor(value);

export const jdFromDate = (dd: number, mm: number, yy: number) => {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
};

export const jdToDate = (jd: number): SolarDate => {
  let a = jd;
  let b;
  let c;
  if (a > 2299160) {
    const alpha = INT((a - 1867216.25) / 36524.25);
    b = a + 1 + alpha - INT(alpha / 4);
  } else {
    b = a;
  }
  const bb = b + 1524;
  const cc = INT((bb - 122.1) / 365.25);
  const dd = INT(365.25 * cc);
  const ee = INT((bb - dd) / 30.6001);
  const day = bb - dd - INT(30.6001 * ee);
  const month = ee < 14 ? ee - 1 : ee - 13;
  const year = month > 2 ? cc - 4716 : cc - 4715;
  return { day, month, year };
};

const sunLongitude = (jdn: number) => {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = PI / 180;
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = (L * dr) % (2 * PI);
  return L;
};

export const getSolarLongitude = (julianDay: number) => sunLongitude(julianDay);

const getNewMoonDay = (k: number, timeZone: number) => {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 -= 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 += 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 -= 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 -= 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 += 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  const JdNew = Jd1 + C1 - deltat;
  return INT(JdNew + 0.5 + timeZone / 24);
};

const getLunarMonth11 = (yy: number, timeZone: number) => {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.53058868);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = INT((getSolarLongitude(nm - timeZone / 24) / PI) * 6);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
};

const getLeapMonthOffset = (a11: number, timeZone: number) => {
  const k = INT(0.5 + (a11 - 2415021) / 29.53058868);
  let last = 0;
  let i = 1;
  let arc = INT((getSolarLongitude(getNewMoonDay(k + i, timeZone) - timeZone / 24) / PI) * 6);
  do {
    last = arc;
    i += 1;
    arc = INT((getSolarLongitude(getNewMoonDay(k + i, timeZone) - timeZone / 24) / PI) * 6);
  } while (arc !== last && i < 14);
  return i - 1;
};

export const solarToLunar = (date: SolarDate, timezone = 7): LunarDate => {
  const dayNumber = jdFromDate(date.day, date.month, date.year);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timezone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timezone);
  }
  let a11 = getLunarMonth11(date.year, timezone);
  let b11 = a11;
  let lunarYear = date.year;
  if (a11 >= monthStart) {
    lunarYear = date.year;
    a11 = getLunarMonth11(date.year - 1, timezone);
  } else {
    lunarYear = date.year + 1;
    b11 = getLunarMonth11(date.year + 1, timezone);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarMonth = diff + 11;
  let isLeapMonth = false;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timezone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        isLeapMonth = true;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return { day: lunarDay, month: lunarMonth, year: lunarYear, isLeapMonth };
};

export const lunarToSolar = (lunar: LunarDate, timezone = 7): SolarDate => {
  let a11;
  let b11;
  if (lunar.month < 11) {
    a11 = getLunarMonth11(lunar.year - 1, timezone);
    b11 = getLunarMonth11(lunar.year, timezone);
  } else {
    a11 = getLunarMonth11(lunar.year, timezone);
    b11 = getLunarMonth11(lunar.year + 1, timezone);
  }
  const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunar.month - 11;
  if (off < 0) {
    off += 12;
  }
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timezone);
    const leapMonth = leapOff - 2;
    if (lunar.isLeapMonth && lunar.month !== leapMonth) {
      return jdToDate(getNewMoonDay(k + off, timezone) + lunar.day - 1);
    }
    if (lunar.isLeapMonth || off >= leapOff) {
      off += 1;
    }
  }
  const monthStart = getNewMoonDay(k + off, timezone);
  return jdToDate(monthStart + lunar.day - 1);
};

export const getSolarTerm = (date: Date, timezone = 7) => {
  const jd = jdFromDate(date.getDate(), date.getMonth() + 1, date.getFullYear());
  const longitude = getSolarLongitude(jd - timezone / 24);
  const termIndex = INT(((longitude / PI) * 6 + 24) % 24);
  return termIndex;
};

export const getLunarMonthBySolarTerm = (date: Date, timezone = 7) => {
  const termIndex = getSolarTerm(date, timezone);
  // Theo Nam Tông: tháng bắt đầu tại tiết khí chính (Trung khí). Tháng 11 bắt đầu tại Đông chí (termIndex 18).
  const month = ((termIndex + 3) % 24) / 2 + 1;
  return INT(month);
};
