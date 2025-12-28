import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { whatIf, currentLife } = req.body;

    if (!whatIf) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a reflective storyteller generating calm, realistic alternate-life narratives.",
        },
        {
          role: "user",
          content: `What if: ${whatIf}\nCurrent life: ${currentLife || "Not provided"}`,
        },
      ],
      temperature: 0.7,
    });

    const story = completion.choices[0]?.message?.content;

    res.status(200).json({ story });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Generation failed" });
  }
}
