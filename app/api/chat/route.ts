import { createOpenAI, openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const openAiProvider = createOpenAI({
    apiKey: "",
  });

  const model = openAiProvider.languageModel("gpt-4.1-nano");

  const result = streamText({
    model,
    messages,
  });

  return result.toDataStreamResponse();
}
