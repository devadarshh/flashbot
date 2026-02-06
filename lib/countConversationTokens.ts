
export async function countTokens(text: string): Promise<number> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:countTokens?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }]
      }),
    });

    const data = await response.json();
    return data.totalTokens ?? 0;
  } catch (error) {
    console.error("Gemini Token Count Error:", error);
    return Math.ceil(text.length / 4);
  }
}
export async function countConversationTokens(
  messages: { role: string; content: string }[]
): Promise<number> {
  try {
    const contents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:countTokens?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });

    const data = await response.json();
    return data.totalTokens ?? 0;
  } catch (error) {
    console.error("Gemini Conversation Token Count Error:", error);
    return 0;
  }
}