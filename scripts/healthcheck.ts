import { prisma } from "@tuvi/db";
import { createProvider } from "@tuvi/ai-provider";
import { Queue } from "bullmq";

const run = async () => {
  const db = await prisma.$queryRaw`SELECT 1`;
  console.log("DB OK", db);

  const queue = new Queue("ai-reading", {
    connection: { url: process.env.REDIS_URL ?? "redis://localhost:6379" }
  });
  await queue.waitUntilReady();
  console.log("Redis OK");

  const provider = createProvider();
  const response = await provider.generate({
    prompt: "Trả lời ngắn: OK",
    systemPrompt: "Bạn là trợ lý kiểm tra kết nối.",
    timeoutMs: 5000
  });
  console.log("AI OK", response.provider, response.model);

  await queue.close();
  await prisma.$disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
