import OpenAI from "openai";

const openai = new OpenAI();

export async function askToAI(contentData: string) {
  const content = contentData.substring(0, 20);
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content }],
      model: "gpt-3.5-turbo",
      max_tokens: 100,
    });
    return completion.choices[0]?.message?.content;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
}
