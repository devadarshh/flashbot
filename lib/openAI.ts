import OpenAI from "openai";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false, // For development - set to true in production
});

const customFetch = (url: RequestInfo | URL, init?: RequestInit) => {
  return fetch(url, {
    ...init,
    // @ts-ignore - Node.js specific
    agent: url.toString().startsWith("https") ? agent : undefined,
  });
};

let _openai: OpenAI | null = null;

export const getOpenAI = () => {
  if (!_openai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing credentials. Please set the `GEMINI_API_KEY` environment variable.");
    }
    _openai = new OpenAI({
      apiKey,
      fetch: customFetch,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });
  }
  return _openai;
};

// For backward compatibility, provide a getter
export const openai = new Proxy({}, {
  get(target, prop) {
    return Reflect.get(getOpenAI(), prop);
  },
}) as OpenAI;

export async function summarizeMarkdown(markdown: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
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
          content: markdown,
        },
      ],
    });

    return completion.choices[0].message.content?.trim() ?? "";
  } catch (error) {
    console.error("Error in summarizeMarkdown:", error);
    throw error;
  }
}

export async function summarizeConversation(messages: any[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
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
  } catch (error) {
    console.error("Error in summarizeConversation:", error);
    throw error;
  }
}
