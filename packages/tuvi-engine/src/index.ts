import type { ChartSnapshot, NatalChartInput, PalaceSnapshot } from "@tuvi/shared";

const diaChiList = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const thienCanList = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];

const palaceKeys: PalaceSnapshot["key"][] = [
  "menh",
  "phuMau",
  "phucDuc",
  "dienTrach",
  "quanLoc",
  "noBoc",
  "thienDi",
  "tatAch",
  "taiBach",
  "tuTuc",
  "phuThe",
  "huynhDe"
];

const palaceLabels: Record<PalaceSnapshot["key"], string> = {
  menh: "Mệnh",
  phuMau: "Phụ Mẫu",
  phucDuc: "Phúc Đức",
  dienTrach: "Điền Trạch",
  quanLoc: "Quan Lộc",
  noBoc: "Nô Bộc",
  thienDi: "Thiên Di",
  tatAch: "Tật Ách",
  taiBach: "Tài Bạch",
  tuTuc: "Tử Tức",
  phuThe: "Phu Thê",
  huynhDe: "Huynh Đệ"
};

const mainStars = ["Tử Vi", "Thiên Cơ", "Thái Dương", "Vũ Khúc", "Thiên Đồng", "Liêm Trinh", "Thiên Phủ"];
const subStars = ["Tả Phù", "Hữu Bật", "Văn Xương", "Văn Khúc", "Thiên Khôi", "Thiên Việt", "Long Đức", "Phúc Đức"];

const pad = (value: number) => value.toString().padStart(2, "0");

const getCanChiYear = (year: number) => {
  const canIndex = (year - 4) % 10;
  const chiIndex = (year - 4) % 12;
  return {
    can: thienCanList[(canIndex + 10) % 10],
    chi: diaChiList[(chiIndex + 12) % 12]
  };
};

const getHourChiIndex = (hour: number) => Math.floor(((hour + 1) % 24) / 2);

const rotateIndex = (start: number, offset: number) => (start + offset + 12) % 12;

const assignStars = (seed: number, count: number, source: string[]) => {
  const result: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const index = (seed + i * 3) % source.length;
    result.push(source[index]);
  }
  return result;
};

export const computeChartSnapshot = (input: NatalChartInput): ChartSnapshot => {
  const solarDate = `${pad(input.day)}/${pad(input.month)}/${input.year}`;
  const lunarDate = input.calendarType === "lunar" ? solarDate : `${solarDate} (giả lập)`;
  const hourLabel = `${pad(input.hour)}:${pad(input.minute)}`;

  const { can, chi } = getCanChiYear(input.year);
  const hourChiIndex = getHourChiIndex(input.hour);
  const menhIndex = rotateIndex(input.month - 1, hourChiIndex);
  const thanIndex = rotateIndex(menhIndex, 4);

  const menhElement = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"][input.year % 5];
  const menhCuc = ["Thủy nhị cục", "Mộc tam cục", "Kim tứ cục", "Thổ ngũ cục", "Hỏa lục cục"][input.month % 5];

  const palaces = palaceKeys.map((key, index) => {
    const diaChiIndex = rotateIndex(menhIndex, index);
    const seed = input.year + index + input.month + input.day + hourChiIndex;
    return {
      key,
      label: palaceLabels[key],
      diaChi: diaChiList[diaChiIndex],
      mainStars: assignStars(seed, 2, mainStars),
      subStars: assignStars(seed + 1, 2, subStars),
      notes: `An sao mô phỏng theo năm ${can} ${chi}, cần hiệu chỉnh theo thuật toán chuẩn.`
    };
  });

  return {
    id: crypto.randomUUID(),
    fullName: input.fullName,
    gender: input.gender === "male" ? "Nam" : "Nữ",
    solarDate,
    lunarDate,
    hour: hourLabel,
    viewingYear: input.viewingYear,
    menhElement,
    menhCuc,
    thanPosition: `Thân cư ${palaceLabels[palaceKeys[(thanIndex + 12) % 12]]}`,
    palaces,
    skeletonNote:
      "Thuật toán an sao hiện đang ở mức mô phỏng: đã tính Can Chi năm, vị trí Mệnh/Thân, gán sao theo seed cố định để đảm bảo ổn định dữ liệu."
  };
};
