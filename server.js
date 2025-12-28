import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodeFetch from "node-fetch";

dotenv.config();
const app = express();

const fetch = globalThis.fetch || nodeFetch;

/* ✅ CORS — FIXED */
app.use(cors({
  origin: [
    "https://what-if-git-main-aditi-chourasias-projects.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

/* ✅ Explicit preflight handling */
app.options("*", cors());

app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { whatIf, currentLife } = req.body;

  if (!whatIf) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const storyPrompt = `Write a beautiful, realistic day-in-the-life story.

Scenario: ${whatIf}
Current situation: ${currentLife || "Not specified"}

Write with these sections:
Title, Morning, Midday, Afternoon, Evening, Reflection.`;

    const storyResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: storyPrompt }],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      }
    );

    if (!storyResponse.ok) {
      const err = await storyResponse.text();
      throw new Error(err);
    }

    const data = await storyResponse.json();
    const text = data.choices[0].message.content;

    const story = parseStory(text, whatIf);

    res.json({
      story,
      imageUrl: `https://picsum.photos/1024/1024?random=${Date.now()}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Generation failed" });
  }
});

function parseStory(text, whatIf) {
  const sections = {
    title: whatIf,
    morning: "",
    midday: "",
    afternoon: "",
    evening: "",
    reflection: "",
  };

  const patterns = {
    morning: /\*\*Morning:\*\*([\s\S]*?)(?=\*\*Midday|\Z)/i,
    midday: /\*\*Midday:\*\*([\s\S]*?)(?=\*\*Afternoon|\Z)/i,
    afternoon: /\*\*Afternoon:\*\*([\s\S]*?)(?=\*\*Evening|\Z)/i,
    evening: /\*\*Evening:\*\*([\s\S]*?)(?=\*\*Reflection|\Z)/i,
    reflection: /\*\*Reflection:\*\*([\s\S]*)/i,
  };

  for (const key in patterns) {
    const match = text.match(patterns[key]);
    if (match) sections[key] = match[1].trim();
  }

  return sections;
}

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`✨ API running on port ${PORT}`);
});
