import { describe, expect, it } from "vitest";
import { computeChartSnapshot } from "./index";

const baseInput = {
  fullName: "Test",
  gender: "male" as const,
  calendarType: "solar" as const,
  day: 15,
  month: 5,
  year: 2000,
  hour: 10,
  minute: 30,
  viewingYear: 2026
};

describe("computeChartSnapshot", () => {
  it("tạo snapshot ổn định cho case 1", () => {
    const snapshot = computeChartSnapshot(baseInput);
    expect(snapshot.fullName).toBe("Test");
    expect(snapshot.palaces).toHaveLength(12);
    expect(snapshot.palaces[0].label).toBe("Mệnh");
  });

  it("tạo snapshot ổn định cho case 2", () => {
    const snapshot = computeChartSnapshot({ ...baseInput, fullName: "An", gender: "female" });
    expect(snapshot.gender).toBe("Nữ");
    expect(snapshot.viewingYear).toBe(2026);
    expect(snapshot.menhElement).toBe("Thổ");
  });

  it("tạo snapshot ổn định cho case 3", () => {
    const snapshot = computeChartSnapshot({ ...baseInput, day: 1, month: 1, year: 1990 });
    expect(snapshot.solarDate).toBe("01/01/1990");
    expect(snapshot.palaces[0].diaChi).toBe("Thân");
  });

  it("tạo snapshot ổn định cho case 4", () => {
    const snapshot = computeChartSnapshot({ ...baseInput, calendarType: "lunar" });
    expect(snapshot.lunarDate).toContain("/");
    expect(snapshot.lunarDate).not.toContain("giả lập");
  });

  it("tạo snapshot ổn định cho case 5", () => {
    const snapshot = computeChartSnapshot({ ...baseInput, hour: 23, minute: 45 });
    expect(snapshot.hour).toBe("23:45");
    expect(snapshot.palaces[0].mainStars.length).toBe(2);
  });
});
