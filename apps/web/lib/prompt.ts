import type { ChartSnapshot } from "@tuvi/shared";

export const buildPrompt = (template: { system: string; user: string }, snapshot: ChartSnapshot) => {
  const safeSnapshot = {
    fullName: snapshot.fullName,
    gender: snapshot.gender,
    solarDate: snapshot.solarDate,
    lunarDate: snapshot.lunarDate,
    hour: snapshot.hour,
    viewingYear: snapshot.viewingYear,
    menhElement: snapshot.menhElement,
    menhCuc: snapshot.menhCuc,
    thanPosition: snapshot.thanPosition,
    palaces: snapshot.palaces.map((palace) => ({
      label: palace.label,
      diaChi: palace.diaChi,
      mainStars: palace.mainStars,
      subStars: palace.subStars
    }))
  };

  const chartSnapshotJson = JSON.stringify(safeSnapshot, null, 2);
  const userPrompt = template.user.replace("{{chart_snapshot}}", chartSnapshotJson);

  return {
    systemPrompt: template.system,
    userPrompt
  };
};
