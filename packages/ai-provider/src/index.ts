import { createLogger } from "./logger";
import { createLmStudioProvider } from "./providers/lmstudio";
import { createOpenAIProvider } from "./providers/openai";

export type ProviderResponse = {
  content: string;
  model: string;
  provider: string;
  usageTokens?: number;
  costUsd?: number;
};

export type ProviderInput = {
  prompt: string;
  systemPrompt: string;
  timeoutMs?: number;
};

export type AIProvider = {
  generate: (input: ProviderInput) => Promise<ProviderResponse>;
};

export const createProvider = (): AIProvider => {
  const providerName = process.env.AI_PROVIDER ?? "lmstudio";
  const logger = createLogger();

  if (providerName === "openai") {
    logger.info({ providerName }, "Sử dụng OpenAI provider");
    return createOpenAIProvider();
  }

  logger.info({ providerName }, "Sử dụng LM Studio provider");
  return createLmStudioProvider();
};
