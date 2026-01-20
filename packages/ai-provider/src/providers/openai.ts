import type { AIProvider, ProviderInput, ProviderResponse } from "../index";

const buildRequest = (input: ProviderInput) => ({
  model: process.env.AI_MODEL ?? "gpt-4o-mini",
  messages: [
    { role: "system", content: input.systemPrompt },
    { role: "user", content: input.prompt }
  ],
  temperature: 0.7
});

export const createOpenAIProvider = (): AIProvider => ({
  generate: async (input: ProviderInput): Promise<ProviderResponse> => {
    const baseUrl = process.env.AI_BASE_URL ?? "https://api.openai.com/v1";
    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
      throw new Error("Thiếu AI_API_KEY cho OpenAI");
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(buildRequest(input)),
      signal: input.timeoutMs ? AbortSignal.timeout(input.timeoutMs) : undefined
    });

    if (!response.ok) {
      throw new Error(`OpenAI lỗi: ${response.status}`);
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content ?? "";
    return {
      content,
      model: payload.model ?? process.env.AI_MODEL ?? "openai",
      provider: "openai",
      usageTokens: payload.usage?.total_tokens,
      costUsd: undefined
    };
  }
});
