import { prisma } from "@tuvi/db";

export const createReading = async (data: {
  chartId: string;
  prompt: string;
  systemPrompt: string;
  promptVersion: string;
}) => {
  return prisma.aIReading.create({
    data: {
      chartId: data.chartId,
      prompt: data.prompt,
      systemPrompt: data.systemPrompt,
      promptVersion: data.promptVersion
    }
  });
};

export const listReadingsByChart = async (chartId: string) => {
  return prisma.aIReading.findMany({
    where: { chartId },
    orderBy: { createdAt: "desc" }
  });
};

export const getReading = async (readingId: string) => {
  return prisma.aIReading.findUnique({ where: { id: readingId } });
};
