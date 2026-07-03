function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export async function countTokens(text: string): Promise<number> {
  return estimateTokens(text);
}

export async function countConversationTokens(
  messages: { role: string; content: string }[],
): Promise<number> {
  const combined = messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n");
  return estimateTokens(combined);
}
