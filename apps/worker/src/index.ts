import { Worker } from "bullmq";
import { createProvider } from "@tuvi/ai-provider";
import { prisma } from "@tuvi/db";
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  transport:
    process.env.NODE_ENV === "production"
      ? undefined
      : {
          target: "pino-pretty",
          options: { colorize: true }
        }
});

const connection = {
  url: process.env.REDIS_URL ?? "redis://localhost:6379"
};

const provider = createProvider();

const worker = new Worker(
  "ai-reading",
  async (job) => {
    const { readingId } = job.data as { readingId: string };

    const reading = await prisma.aIReading.findUnique({ where: { id: readingId } });
    if (!reading) {
      throw new Error("Không tìm thấy AIReading");
    }

    await prisma.aIReading.update({
      where: { id: readingId },
      data: { status: "running" }
    });

    const start = Date.now();
    try {
      const response = await provider.generate({
        prompt: reading.prompt,
        systemPrompt: reading.systemPrompt,
        timeoutMs: Number(process.env.AI_TIMEOUT_MS ?? 60000)
      });

      const latencyMs = Date.now() - start;
      await prisma.aIReading.update({
        where: { id: readingId },
        data: {
          status: "done",
          content: response.content,
          provider: response.provider,
          model: response.model,
          usageTokens: response.usageTokens,
          costUsd: response.costUsd,
          latencyMs
        }
      });

      logger.info({ readingId }, "Hoàn tất AI reading");
      return response;
    } catch (error) {
      const latencyMs = Date.now() - start;
      await prisma.aIReading.update({
        where: { id: readingId },
        data: {
          status: "failed",
          errorMessage: error instanceof Error ? error.message : String(error),
          latencyMs
        }
      });
      logger.error({ err: error, readingId }, "AI reading thất bại");
      throw error;
    }
  },
  { connection }
);

worker.on("ready", () => {
  logger.info("Worker AI đã sẵn sàng");
});

worker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, err }, "Job thất bại");
});
