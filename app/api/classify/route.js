import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { query } = await req.json();

  const prompt = `
You are a restaurant-focused query classifier. Respond with ONLY "YES" or "NO".

Classify whether the user's message is about:
- A restaurant
- A place to eat
- Food or meals
- Directions to or recommendations about restaurants

Examples:
"recommend something at Cheesecake Factory" → YES
"What should I order at Four Charles?" → YES
"How to get to ABC Kitchen?" → YES
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
