import { NextResponse } from "next/server";
import type { ChartSnapshot } from "@tuvi/shared";
import { getChartWithSnapshot } from "../../../../../lib/repositories/chart-repository";
import { requestReading } from "../../../../../lib/services/reading-service";
import { rateLimit } from "../../../../../lib/rate-limit";

export const POST = async (request: Request, { params }: { params: { id: string } }) => {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const limit = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 10);
  const rate = rateLimit(`reading:${ip}`, limit, 60_000);

  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  const chart = await getChartWithSnapshot(params.id);
  if (!chart?.snapshot) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const reading = await requestReading(params.id, chart.snapshot.snapshot as ChartSnapshot);
  return NextResponse.json({
    id: reading.id,
    status: reading.status
  });
};
