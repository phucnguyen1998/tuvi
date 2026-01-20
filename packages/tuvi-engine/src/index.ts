import type { ChartSnapshot, NatalChartInput, PalaceSnapshot } from "@tuvi/shared";
import { generateTuViChart } from "./tuvi-engine";
import { solarToLunar } from "./lunar-calendar";

export * from "./lunar-calendar";
export * from "./tuvi-engine";

const pad = (value: number) => value.toString().padStart(2, "0");

const palaceMap: Record<PalaceSnapshot["key"], string> = {
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

export const computeChartSnapshot = (input: NatalChartInput): ChartSnapshot => {
  const solarDate = `${pad(input.day)}/${pad(input.month)}/${input.year}`;
  const lunar = solarToLunar({ day: input.day, month: input.month, year: input.year });
  const lunarDate = `${pad(lunar.day)}/${pad(lunar.month)}/${lunar.year}`;
  const hourLabel = `${pad(input.hour)}:${pad(input.minute)}`;

  const chart = generateTuViChart(
    new Date(input.year, input.month - 1, input.day),
    { hour: input.hour, minute: input.minute },
    input.gender
  );

  const palaces = chart.palaces.map((palace, index) => ({
    key: palaceKeys[index],
    label: palace.name,
    diaChi: palace.branch,
    mainStars: palace.stars.filter((star) => star.type === "main").map((star) => star.name),
    subStars: palace.stars.filter((star) => star.type === "aux").map((star) => star.name),
    notes: "TODO: Hoàn thiện an sao chi tiết theo Nam Tông/Tân Biên."
  }));

  return {
    id: crypto.randomUUID(),
    fullName: input.fullName,
    gender: input.gender === "male" ? "Nam" : "Nữ",
    solarDate,
    lunarDate,
    hour: hourLabel,
    viewingYear: input.viewingYear,
    menhElement: chart.destiny.menh,
    menhCuc: chart.destiny.cuc,
    thanPosition: "TODO: tính Thân cư cung theo Nam Tông",
    palaces,
    skeletonNote:
      "Thuật toán an sao đã có nền tảng lịch pháp và tứ trụ; cần bổ sung đầy đủ bảng sao, đại vận và quy tắc Nam Tông/Tân Biên."
  };
};
