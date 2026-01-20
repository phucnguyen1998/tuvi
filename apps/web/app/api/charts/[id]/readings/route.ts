import { NextResponse } from "next/server";
import { listReadingsByChart } from "../../../../../lib/repositories/reading-repository";

export const GET = async (_: Request, { params }: { params: { id: string } }) => {
  const readings = await listReadingsByChart(params.id);
  return NextResponse.json({ items: readings });
};
