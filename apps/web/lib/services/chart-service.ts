import type { NatalChartInput } from "@tuvi/shared";
import { natalChartInputSchema } from "@tuvi/shared";
import { computeChartSnapshot } from "@tuvi/tuvi-engine";
import { createAuditLog } from "../repositories/audit-repository";
import { createChart, upsertChartInput, upsertChartSnapshot } from "../repositories/chart-repository";

export const computeChart = async (input: NatalChartInput) => {
  const parsed = natalChartInputSchema.parse(input);
  const chart = await createChart();
  const snapshot = computeChartSnapshot(parsed);

  await upsertChartInput(chart.id, input, parsed);
  await upsertChartSnapshot(chart.id, snapshot);
  await createAuditLog({
    action: "create",
    entity: "NatalChart",
    entityId: chart.id,
    metadata: { fullName: parsed.fullName }
  });

  return { chart, snapshot };
};
