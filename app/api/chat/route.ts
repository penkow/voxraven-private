import { createOpenAI, openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const openAiProvider = createOpenAI({
    apiKey:
      "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",
  });

  const model = openAiProvider.languageModel("gpt-4.1-nano");

  const result = streamText({
    model,
    messages,
  });

  return result.toDataStreamResponse();
}
