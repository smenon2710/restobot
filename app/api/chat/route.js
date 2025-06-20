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
You are a helpful and friendly restaurant recommendation assistant. 
Use the conversation history to understand follow-up questions. 
You can incorporate the following research:
- Web Search Results: ${webResults}
- Reddit Reviews: ${redditResults}
If the user asks vague questions like "what to order there?", resolve "there" from earlier conversation.
Keep answers short, friendly, and specific.
    `.trim()
  };

  const fullMessages = [systemMessage, ...messages];

  const answer = await askLLM(fullMessages);

  return Response.json({ answer });
}
