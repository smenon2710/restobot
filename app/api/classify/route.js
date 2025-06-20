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
  - About food, restaurants, meals, or dishes
  - Asking for directions to a restaurant
  - Greeting the assistant (e.g. "hi", "what can you do")
  - Comparing multiple restaurants (e.g. "Thai Villa vs Soothr")
  
  Say "NO" only if the message is clearly unrelated (e.g. physics, photosynthesis, tech).
  
  Examples:
  "What should I order at Four Charles?" → YES  
  "recommend something at Cheesecake Factory" → YES  
  "hi there" → YES  
  "What can you do?" → YES  
  "What is the difference between X and Y?" → YES  
  "Compare X and Y" → YES  
  "What is quantum mechanics?" → NO  
  "What is photosynthesis?" → NO
  
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
