import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askLLM(messages) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // Cheaper model
    messages: messages,
  });

  return response.choices[0].message.content.trim();
}
