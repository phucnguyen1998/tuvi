import { NextResponse } from "next/server";
import { getChartWithSnapshot } from "../../../../../lib/repositories/chart-repository";
import { requireCmsSession } from "../../../../../lib/cms-auth";

export const GET = async (_: Request, { params }: { params: { id: string } }) => {
  const session = await requireCmsSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chart = await getChartWithSnapshot(params.id);
  if (!chart) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: chart.id,
    createdAt: chart.createdAt,
    input: {
      fullName: chart.input?.normalized?.fullName ?? "",
      gender: chart.input?.gender ?? "",
      viewingYear: chart.input?.viewingYear ?? 0
    },
    readings: chart.readings.map((reading) => ({
      id: reading.id,
      status: reading.status,
      createdAt: reading.createdAt,
      promptVersion: reading.promptVersion
    }))
  });
};
