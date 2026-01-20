import { NextResponse } from "next/server";
import { getChartWithSnapshot } from "../../../../lib/repositories/chart-repository";

export const GET = async (_: Request, { params }: { params: { id: string } }) => {
  const chart = await getChartWithSnapshot(params.id);
  if (!chart?.snapshot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: chart.id,
    snapshot: chart.snapshot.snapshot
  });
};
