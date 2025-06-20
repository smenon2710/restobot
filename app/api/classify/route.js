import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { query } = await req.json();

  const prompt = `
  You are a query classifier for a restaurant chatbot.
  
  Respond with ONLY "YES" or "NO" to indicate whether the following user message should be handled by the assistant.
  
  Say "YES" if the message is:
  - A restaurant question (recommendations, food, directions, etc.)
  - A greeting like "hi", "hello", "hey", or "what can you do?"
  
  Say "NO" only if it's clearly unrelated to food, restaurants, or starting a conversation.
  
  Examples:
  "recommend something at Cheesecake Factory" → YES
  "What should I order at Four Charles?" → YES
  "How to get to ABC Kitchen?" → YES
  "Hello" → YES
  "hi there" → YES
  "what can you do?" → YES
  "What is photosynthesis?" → NO
  "Explain quantum computing" → NO
  
  User message: "${query}"
  `.trim();
  

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = completion.choices[0].message.content.trim();
  const isRestaurantRelated = raw.toUpperCase().startsWith('YES');

  return Response.json({
    isRestaurantRelated,
    debug: {
      prompt,
      modelResponse: raw,
    },
  });
}
