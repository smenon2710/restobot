import { askLLM } from '@/lib/llm';
import { searchReddit, webSearch } from '@/lib/search';

export async function POST(req) {
  const { messages } = await req.json();

  // Get the most recent user question for context-based search
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

  const redditResults = await searchReddit(lastUserMessage);
  const webResults = await webSearch(lastUserMessage);

  const systemMessage = {
    role: 'system',
    content: `
You are Restobot — a helpful and friendly restaurant recommendation assistant.

You can:
- Recommend restaurants
- Suggest dishes
- Compare places to eat
- Provide directions
- Handle follow-up questions using chat memory

If the user greets you (e.g. "hi", "hello", "what can you do?"), respond with a friendly welcome and explain briefly what you can help with. Encourage them to ask about food or restaurants.

You can also incorporate the following research into your answers:
- Web Search Results: ${webResults}
- Reddit Reviews: ${redditResults}

If the user asks vague questions like "what to order there?", resolve "there" from earlier conversation.If not clear, ask for clarification.

Keep responses friendly, conversational, and helpful.
    `.trim()
  };

  const fullMessages = [systemMessage, ...messages];

  const answer = await askLLM(fullMessages);

  return Response.json({ answer });
}
