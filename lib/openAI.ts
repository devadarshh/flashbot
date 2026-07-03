import OpenAI from "openai";

export const XAI_MODEL = process.env.XAI_MODEL ?? "grok-4.3";

let _openai: OpenAI | null = null;

export const getOpenAI = () => {
  if (!_openai) {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Missing credentials. Please set the `XAI_API_KEY` environment variable.",
      );
    }
    _openai = new OpenAI({
      apiKey,
      baseURL: "https://api.x.ai/v1",
    });
  }
  return _openai;
};

export async function summarizeMarkdown(markdown: string) {
  let retries = 3;
  let delay = 2000;

  while (retries > 0) {
    try {
      const openai = getOpenAI();
      const completion = await openai.chat.completions.create({
        model: XAI_MODEL,
        temperature: 0.1,
        max_tokens: 900,
        messages: [
          {
            role: "system",
            content: `
You are a data summarization engine for an AI chatbot.
Convert the input website markdown/text into a CLEAN, DENSE SUMMARY.
Output ONLY plain text in ONE continuous paragraph.
Remove all UI, nav, and marketing fluff.
Keep ONLY factual content for support.
MUST be under 2000 words.`,
          },
          {
            role: "user",
            content: markdown || "No content found in file.",
          },
        ],
      });

      return completion.choices[0].message.content?.trim() ?? "";
    } catch (error: any) {
      if (error.status === 429 && retries > 1) {
        console.warn(
          `Rate limit hit. Retrying in ${delay}ms... (${retries - 1} retries left)`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        retries--;
        delay *= 2;
        continue;
      }
      console.error("Error in summarizeMarkdown:", error);
      throw error;
    }
  }
}

export async function summarizeConversation(messages: any[]) {
  let retries = 3;
  let delay = 2000;

  while (retries > 0) {
    try {
      const openai = getOpenAI();
      const completion = await openai.chat.completions.create({
        model: XAI_MODEL,
        temperature: 0.3,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content:
              "Summarize the following conversation history into a concise paragraph, preserving key details and user intent. The final output MUST be under 2000 words.",
          },
          ...messages,
        ],
      });

      return completion.choices[0].message.content?.trim() ?? "";
    } catch (error: any) {
      if (error.status === 429 && retries > 1) {
        console.warn(
          `Rate limit hit in conversation summary. Retrying in ${delay}ms... (${retries - 1} retries left)`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        retries--;
        delay *= 2;
        continue;
      }
      console.error("Error in summarizeConversation:", error);
      throw error;
    }
  }
}
