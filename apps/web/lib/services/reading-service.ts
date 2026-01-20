import type { ChartSnapshot } from "@tuvi/shared";
import { aiQueue } from "../queue";
import { createAuditLog } from "../repositories/audit-repository";
import { createReading } from "../repositories/reading-repository";
import { buildPrompt } from "../prompt";
import { getPromptTemplate } from "../repositories/prompt-repository";

export const requestReading = async (chartId: string, snapshot: ChartSnapshot, promptVersion = "v1") => {
  const promptTemplate = await getPromptTemplate(promptVersion);
  if (!promptTemplate) {
    throw new Error("Không tìm thấy prompt template");
  }

  const { systemPrompt, userPrompt } = buildPrompt(promptTemplate, snapshot);
  const reading = await createReading({
    chartId,
    prompt: userPrompt,
    systemPrompt,
    promptVersion
  });

  await createAuditLog({
    action: "create",
    entity: "AIReading",
    entityId: reading.id,
    metadata: { chartId, promptVersion }
  });

  await aiQueue.add("generate-reading", { readingId: reading.id });

  return reading;
};
