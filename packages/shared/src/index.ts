import { z } from "zod";

export const genderSchema = z.enum(["male", "female"]);
export const calendarTypeSchema = z.enum(["solar", "lunar"]);

export const natalChartInputSchema = z.object({
  fullName: z.string().min(1, "Họ tên là bắt buộc"),
  gender: genderSchema,
  calendarType: calendarTypeSchema,
  day: z.coerce.number().int().min(1).max(31),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(1900).max(2100),
  hour: z.coerce.number().int().min(0).max(23),
  minute: z.coerce.number().int().min(0).max(59),
  viewingYear: z.coerce.number().int().min(1900).max(2100)
});

export type NatalChartInput = z.infer<typeof natalChartInputSchema>;

export type PalaceKey =
  | "menh"
  | "phuMau"
  | "phucDuc"
  | "dienTrach"
  | "quanLoc"
  | "noBoc"
  | "thienDi"
  | "tatAch"
  | "taiBach"
  | "tuTuc"
  | "phuThe"
  | "huynhDe";

export type PalaceSnapshot = {
  key: PalaceKey;
  label: string;
  diaChi: string;
  mainStars: string[];
  subStars: string[];
  notes: string;
};

export type ChartSnapshot = {
  id: string;
  fullName: string;
  gender: string;
  solarDate: string;
  lunarDate: string;
  hour: string;
  viewingYear: number;
  menhElement: string;
  menhCuc: string;
  thanPosition: string;
  palaces: PalaceSnapshot[];
  skeletonNote: string;
};

export type AIReadingStatus = "pending" | "running" | "done" | "failed";

export type AIReadingSnapshot = {
  id: string;
  status: AIReadingStatus;
  contentMarkdown?: string | null;
  provider?: string | null;
  model?: string | null;
  promptVersion?: string | null;
  errorMessage?: string | null;
};
