import { NextResponse } from "next/server";
import { createAuditLog } from "../../../../lib/repositories/audit-repository";
import { createPromptTemplate, listPromptTemplates } from "../../../../lib/repositories/prompt-repository";
import { requireCmsSession } from "../../../../lib/cms-auth";

export const GET = async () => {
  const session = await requireCmsSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await listPromptTemplates();
  return NextResponse.json({ items });
};

export const POST = async (request: Request) => {
  const session = await requireCmsSession();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const template = await createPromptTemplate(body);
  await createAuditLog({
    action: "create",
    entity: "PromptTemplate",
    entityId: template.id,
    metadata: { version: template.version }
  });
  return NextResponse.json(template);
};
