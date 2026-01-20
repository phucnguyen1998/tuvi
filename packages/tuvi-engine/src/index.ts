import type { ChartSnapshot, NatalChartInput, PalaceSnapshot } from "@tuvi/shared";

const palaceOrder: PalaceSnapshot[] = [
  { key: "menh", label: "Mệnh", diaChi: "Tý", mainStars: ["Tử Vi"], subStars: ["Thiên Phủ"], notes: "TODO: tính sao chính" },
  { key: "phuMau", label: "Phụ Mẫu", diaChi: "Sửu", mainStars: ["Thiên Tướng"], subStars: [], notes: "TODO" },
  { key: "phucDuc", label: "Phúc Đức", diaChi: "Dần", mainStars: ["Thiên Lương"], subStars: [], notes: "TODO" },
  { key: "dienTrach", label: "Điền Trạch", diaChi: "Mão", mainStars: ["Thái Dương"], subStars: [], notes: "TODO" },
  { key: "quanLoc", label: "Quan Lộc", diaChi: "Thìn", mainStars: ["Vũ Khúc"], subStars: [], notes: "TODO" },
  { key: "noBoc", label: "Nô Bộc", diaChi: "Tỵ", mainStars: ["Thiên Cơ"], subStars: [], notes: "TODO" },
  { key: "thienDi", label: "Thiên Di", diaChi: "Ngọ", mainStars: ["Liêm Trinh"], subStars: [], notes: "TODO" },
  { key: "tatAch", label: "Tật Ách", diaChi: "Mùi", mainStars: ["Thất Sát"], subStars: [], notes: "TODO" },
  { key: "taiBach", label: "Tài Bạch", diaChi: "Thân", mainStars: ["Tham Lang"], subStars: [], notes: "TODO" },
  { key: "tuTuc", label: "Tử Tức", diaChi: "Dậu", mainStars: ["Cự Môn"], subStars: [], notes: "TODO" },
  { key: "phuThe", label: "Phu Thê", diaChi: "Tuất", mainStars: ["Thiên Đồng"], subStars: [], notes: "TODO" },
  { key: "huynhDe", label: "Huynh Đệ", diaChi: "Hợi", mainStars: ["Thái Âm"], subStars: [], notes: "TODO" }
];

const pad = (value: number) => value.toString().padStart(2, "0");

export const computeChartSnapshot = (input: NatalChartInput): ChartSnapshot => {
  const solarDate = `${pad(input.day)}/${pad(input.month)}/${input.year}`;
  const lunarDate = input.calendarType === "lunar" ? solarDate : "TODO: chuyển đổi âm lịch";
  const hourLabel = `${pad(input.hour)}:${pad(input.minute)}`;

  return {
    id: crypto.randomUUID(),
    fullName: input.fullName,
    gender: input.gender === "male" ? "Nam" : "Nữ",
    solarDate,
    lunarDate,
    hour: hourLabel,
    viewingYear: input.viewingYear,
    menhElement: "Kim",
    menhCuc: "Kim tứ cục",
    thanPosition: "Thân cư Mệnh",
    palaces: palaceOrder,
    skeletonNote:
      "TODO: Thuật toán an sao, an thân, can chi, cục số và đại vận cần hoàn thiện. Hiện tại dùng dữ liệu skeleton để UI ổn định."
  };
};
