import { NextResponse } from "next/server";
import { listCharts } from "../../../../lib/repositories/chart-repository";
import { requireCmsSession } from "../../../../lib/cms-auth";

export const GET = async (request: Request) => {
  const session = await requireCmsSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 10);
  const { items, total } = await listCharts(page, pageSize);

  return NextResponse.json({
    items: items.map((chart) => ({
      id: chart.id,
      createdAt: chart.createdAt,
      fullName: chart.input?.normalized?.fullName ?? "",
      gender: chart.input?.gender ?? "",
      viewingYear: chart.input?.viewingYear ?? 0
    })),
    total
  });
};
