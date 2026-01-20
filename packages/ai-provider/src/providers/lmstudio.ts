import type { AIProvider, ProviderInput, ProviderResponse } from "../index";

const buildRequest = (input: ProviderInput) => ({
  model: process.env.AI_MODEL ?? "local-model",
  messages: [
    { role: "system", content: input.systemPrompt },
    { role: "user", content: input.prompt }
  ],
  temperature: 0.7
});

export const createLmStudioProvider = (): AIProvider => ({
  generate: async (input: ProviderInput): Promise<ProviderResponse> => {
    const baseUrl = process.env.AI_BASE_URL ?? "http://localhost:1234/v1";
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildRequest(input)),
      signal: input.timeoutMs ? AbortSignal.timeout(input.timeoutMs) : undefined
    });

    if (!response.ok) {
      throw new Error(`LM Studio lỗi: ${response.status}`);
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content ?? "";
    return {
      content,
      model: payload.model ?? process.env.AI_MODEL ?? "local-model",
      provider: "lmstudio",
      usageTokens: payload.usage?.total_tokens
    };
  }
});
