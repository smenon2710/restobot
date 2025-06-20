import { askLLM } from '@/lib/llm';
import { searchReddit, webSearch } from '@/lib/search';

export async function POST(req) {
  const { messages, classifierHint } = await req.json();

  // Get the most recent user message for targeted search
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

  // Perform tool lookups
  const redditResults = await searchReddit(lastUserMessage);
  const webResults = await webSearch(lastUserMessage);

  // System prompt guiding the assistant
  const systemMessage = {
    role: 'system',
    content: `
You are Restobot — a helpful, friendly restaurant recommendation assistant.

You can:
- Suggest restaurants and places to eat
- Recommend dishes at specific restaurants
- Compare two restaurants
- Help with directions to restaurants
- Answer follow-up questions using chat memory
- Greet the user and explain your capabilities

The user's last message was classified as: ${classifierHint ? 'restaurant-related' : 'possibly off-topic'}.
Use this as a soft hint only. Always prioritize conversation context.

If the user says something like "restaurants near me", let them know you can't access their current location and ask them to specify a location like a city or neighborhood.

Use these tools:
- Web Search Results: ${webResults}
- Reddit Reviews: ${redditResults}

If a message is vague (e.g., "what to order there"), use prior messages to infer meaning.

Keep your tone friendly, concise, and conversational.
    `.trim()
  };

  const fullMessages = [systemMessage, ...messages];

  const answer = await askLLM(fullMessages);

  return Response.json({ answer });
}
