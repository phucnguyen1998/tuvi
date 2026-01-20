import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { natalChartInputSchema } from "@tuvi/shared";
import { computeChart } from "../../../../lib/services/chart-service";
import { logger } from "../../../../lib/logger";

export const POST = async (request: Request) => {
  try {
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      logger.error({ err: jsonError }, "Failed to parse JSON body");
      return NextResponse.json(
        { error: "Invalid JSON", message: jsonError instanceof Error ? jsonError.message : String(jsonError) },
        { status: 400 }
      );
    }

    logger.info({ body }, "Received compute request");
    const input = natalChartInputSchema.parse(body);
    logger.info({ input }, "Validated input");
    const { chart, snapshot } = await computeChart(input);
    return NextResponse.json({ id: chart.id, snapshot });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.error({ err: error, issues: error.issues }, "Compute chart validation thất bại");
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ err: error, message: errorMessage, stack: error instanceof Error ? error.stack : undefined }, "Compute chart thất bại");
    return NextResponse.json(
      { error: "Invalid input", message: errorMessage },
      { status: 400 }
    );
  }
};
