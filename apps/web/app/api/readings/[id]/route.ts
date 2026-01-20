import { NextResponse } from "next/server";
import { getReading } from "../../../../lib/repositories/reading-repository";

export const GET = async (_: Request, { params }: { params: { id: string } }) => {
  const reading = await getReading(params.id);
  if (!reading) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: reading.id,
    status: reading.status,
    content: reading.content,
    errorMessage: reading.errorMessage
  });
};
