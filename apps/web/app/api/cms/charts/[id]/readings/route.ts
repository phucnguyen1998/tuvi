import { NextResponse } from "next/server";
import { listReadingsByChart } from "../../../../../../lib/repositories/reading-repository";
import { requireCmsSession } from "../../../../../../lib/cms-auth";

export const GET = async (_: Request, { params }: { params: { id: string } }) => {
  const session = await requireCmsSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const readings = await listReadingsByChart(params.id);
  return NextResponse.json({ items: readings });
};
