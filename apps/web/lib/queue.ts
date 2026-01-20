import { Queue } from "bullmq";

export const aiQueue = new Queue("ai-reading", {
  connection: {
    url: process.env.REDIS_URL ?? "redis://localhost:6379"
  }
});
