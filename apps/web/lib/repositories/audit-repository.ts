import { prisma } from "@tuvi/db";

export const createAuditLog = async (data: {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: unknown;
}) => {
  return prisma.auditLog.create({
    data: {
      actorId: data.actorId ?? null,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId ?? null,
      metadata: data.metadata
    }
  });
};
