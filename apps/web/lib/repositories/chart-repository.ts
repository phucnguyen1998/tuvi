import { prisma } from "@tuvi/db";

export const createChart = async () => {
  return prisma.natalChart.create({ data: {} });
};

export const upsertChartInput = async (chartId: string, rawInput: unknown, normalized: unknown) => {
  return prisma.natalChartInput.upsert({
    where: { chartId },
    update: {
      rawInput,
      normalized,
      gender: (normalized as { gender: string }).gender,
      yearOfBirth: (normalized as { year: number }).year,
      viewingYear: (normalized as { viewingYear: number }).viewingYear
    },
    create: {
      chartId,
      rawInput,
      normalized,
      gender: (normalized as { gender: string }).gender,
      yearOfBirth: (normalized as { year: number }).year,
      viewingYear: (normalized as { viewingYear: number }).viewingYear
    }
  });
};

export const upsertChartSnapshot = async (chartId: string, snapshot: unknown) => {
  return prisma.natalChartSnapshot.upsert({
    where: { chartId },
    update: { snapshot },
    create: { chartId, snapshot }
  });
};

export const getChartWithSnapshot = async (chartId: string) => {
  return prisma.natalChart.findUnique({
    where: { id: chartId },
    include: { input: true, snapshot: true, readings: true }
  });
};

export const listCharts = async (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    prisma.natalChart.findMany({
      include: { input: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize
    }),
    prisma.natalChart.count()
  ]);

  return { items, total };
};
