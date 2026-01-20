import { getLunarMonthBySolarTerm, jdFromDate, solarToLunar } from "./lunar-calendar";

export type Star = {
  id: string;
  name: string;
  type: "main" | "aux";
  element?: "kim" | "moc" | "thuy" | "hoa" | "tho";
};

export type Palace = {
  name: string;
  branch: string;
  stars: Star[];
};

export type TuViChart = {
  fourPillars: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  destiny: {
    menh: string;
    cuc: string;
    yinYang: "duong" | "am";
  };
  palaces: Palace[];
  metadata: {
    timezone: string;
    method: "Nam Tong - Tan Bien";
  };
};

const diaChi = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const thienCan = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];

const palaceOrder = [
  "Mệnh",
  "Phụ Mẫu",
  "Phúc Đức",
  "Điền Trạch",
  "Quan Lộc",
  "Nô Bộc",
  "Thiên Di",
  "Tật Ách",
  "Tài Bạch",
  "Tử Tức",
  "Phu Thê",
  "Huynh Đệ"
];

const mainStars = [
  "Tử Vi",
  "Thiên Cơ",
  "Thái Dương",
  "Vũ Khúc",
  "Thiên Đồng",
  "Liêm Trinh",
  "Thiên Phủ",
  "Thái Âm",
  "Tham Lang",
  "Cự Môn",
  "Thiên Tướng",
  "Thiên Lương",
  "Thất Sát",
  "Phá Quân"
];

const auxStars = [
  "Lộc Tồn",
  "Văn Xương",
  "Văn Khúc",
  "Tả Phù",
  "Hữu Bật",
  "Thiên Khôi",
  "Thiên Việt",
  "Long Trì",
  "Phượng Các",
  "Thiên Mã"
];

const getCanChiFromIndex = (canIndex: number, chiIndex: number) => {
  const can = thienCan[(canIndex + 10) % 10];
  const chi = diaChi[(chiIndex + 12) % 12];
  return `${can} ${chi}`;
};

const getCanChiYear = (year: number) => {
  const canIndex = (year - 4) % 10;
  const chiIndex = (year - 4) % 12;
  return getCanChiFromIndex(canIndex, chiIndex);
};

const getCanChiMonth = (year: number, monthIndex: number) => {
  const canIndex = (year * 12 + monthIndex + 3) % 10;
  const chiIndex = (monthIndex + 1) % 12;
  return getCanChiFromIndex(canIndex, chiIndex);
};

const getCanChiDay = (jd: number) => {
  const canIndex = (jd + 9) % 10;
  const chiIndex = (jd + 1) % 12;
  return getCanChiFromIndex(canIndex, chiIndex);
};

const getHourChiIndex = (hour: number) => Math.floor(((hour + 1) % 24) / 2);

const getCanChiHour = (dayCanIndex: number, hourChiIndex: number) => {
  const canIndex = (dayCanIndex * 2 + hourChiIndex) % 10;
  return getCanChiFromIndex(canIndex, hourChiIndex);
};

const getYinYang = (year: number) => {
  const canIndex = (year - 4) % 10;
  return canIndex % 2 === 0 ? "duong" : "am";
};

const elementByYear = ["kim", "moc", "thuy", "hoa", "tho"] as const;

const cucByMonth = ["Thủy nhị cục", "Mộc tam cục", "Kim tứ cục", "Thổ ngũ cục", "Hỏa lục cục"];

const buildStars = (seed: number, source: string[], type: "main" | "aux"): Star[] =>
  source.map((name, index) => ({
    id: `${type}-${index}-${seed}`,
    name,
    type
  }));

const distributeStars = (palaces: Palace[], stars: Star[], seed: number) => {
  stars.forEach((star, index) => {
    const palaceIndex = (seed + index) % palaces.length;
    palaces[palaceIndex].stars.push(star);
  });
};

export const generateTuViChart = (
  birthDate: Date,
  birthTime: { hour: number; minute: number },
  gender: "male" | "female",
  timezone = "Asia/Ho_Chi_Minh"
): TuViChart => {
  const timezoneOffset = 7;
  const lunar = solarToLunar(
    {
      day: birthDate.getDate(),
      month: birthDate.getMonth() + 1,
      year: birthDate.getFullYear()
    },
    timezoneOffset
  );
  const monthByTerm = getLunarMonthBySolarTerm(birthDate, timezoneOffset);
  const jd = jdFromDate(birthDate.getDate(), birthDate.getMonth() + 1, birthDate.getFullYear());
  const dayCanIndex = (jd + 9) % 10;
  const hourChiIndex = getHourChiIndex(birthTime.hour);
  const menhIndex = (monthByTerm - 1 + hourChiIndex) % 12;

  const palaces: Palace[] = palaceOrder.map((name, index) => ({
    name,
    branch: diaChi[(menhIndex + index) % 12],
    stars: []
  }));

  const mainStarSet = buildStars(lunar.year, mainStars, "main");
  const auxStarSet = buildStars(lunar.day + lunar.month, auxStars, "aux");
  distributeStars(palaces, mainStarSet, lunar.day);
  distributeStars(palaces, auxStarSet, lunar.month);

  return {
    fourPillars: {
      year: getCanChiYear(lunar.year),
      month: getCanChiMonth(lunar.year, monthByTerm),
      day: getCanChiDay(jd),
      hour: getCanChiHour(dayCanIndex, hourChiIndex)
    },
    destiny: {
      menh: elementByYear[lunar.year % 5],
      cuc: cucByMonth[(monthByTerm - 1) % cucByMonth.length],
      yinYang: getYinYang(lunar.year)
    },
    palaces,
    metadata: {
      timezone,
      method: "Nam Tong - Tan Bien"
    }
  };
};
