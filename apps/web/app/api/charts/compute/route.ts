import { NextResponse } from "next/server";
import { natalChartInputSchema } from "@tuvi/shared";
import { computeChart } from "../../../../lib/services/chart-service";
import { logger } from "../../../../lib/logger";

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const input = natalChartInputSchema.parse(body);
    const { chart, snapshot } = await computeChart(input);
    return NextResponse.json({ id: chart.id, snapshot });
  } catch (error) {
    logger.error({ err: error }, "Compute chart thất bại");
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
};
