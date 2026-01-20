import { NextResponse } from "next/server";
import type { ChartSnapshot } from "@tuvi/shared";
import { requireCmsSession } from "../../../../../../lib/cms-auth";
import { getChartWithSnapshot } from "../../../../../../lib/repositories/chart-repository";
import { requestReading } from "../../../../../../lib/services/reading-service";

export const POST = async (request: Request, { params }: { params: { id: string } }) => {
  const session = await requireCmsSession();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const promptVersion = searchParams.get("promptVersion") ?? "v1";

  const chart = await getChartWithSnapshot(params.id);
  if (!chart?.snapshot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const reading = await requestReading(params.id, chart.snapshot.snapshot as ChartSnapshot, promptVersion);
  return NextResponse.json({ id: reading.id, status: reading.status });
};
