import { prisma } from "@tuvi/db";

export const listPromptTemplates = async () => {
  return prisma.promptTemplate.findMany({ orderBy: { createdAt: "desc" } });
};

export const createPromptTemplate = async (data: {
  version: string;
  title: string;
  system: string;
  user: string;
}) => {
  return prisma.promptTemplate.create({ data });
};

export const getPromptTemplate = async (version: string) => {
  return prisma.promptTemplate.findUnique({ where: { version } });
};
