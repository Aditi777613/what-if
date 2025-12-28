import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodeFetch from "node-fetch";

dotenv.config();
const app = express();

const fetch = globalThis.fetch || nodeFetch;

app.use(cors({
  origin: [
    "https://what-if-ecru.vercel.app",
    "https://what-if-git-main-aditi-chourasias-projects.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.options("*", (req, res) => res.sendStatus(204));
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { whatIf, currentLife } = req.body;

  if (!whatIf) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const storyPrompt = `
Write a realistic, emotional day-in-the-life story.

Scenario: ${whatIf}
Current situation: ${currentLife || "Not specified"}

STRICT RULES:
- Do NOT include markdown symbols
- Do NOT repeat headings inside content
- Output sections ONLY in this order:

Title:
Morning:
Midday:
Afternoon:
Evening:
Reflection:
`;

    const response = await fetch(
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

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const data = await response.json();
    const rawText = data.choices[0].message.content;

    const story = parseStory(rawText, whatIf);

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
  // Remove markdown + extra junk
  const clean = text
    .replace(/\*\*/g, "")
    .replace(/#+\s?/g, "")
    .replace(/\r/g, "")
    .trim();

  const grab = (label, next) => {
    const regex = next
      ? new RegExp(`${label}:([\\s\\S]*?)${next}:`, "i")
      : new RegExp(`${label}:([\\s\\S]*)$`, "i");
    const match = clean.match(regex);
    return match ? match[1].trim() : "";
  };

  return {
    title: grab("Title", "Morning") || whatIf,
    morning: grab("Morning", "Midday"),
    midday: grab("Midday", "Afternoon"),
    afternoon: grab("Afternoon", "Evening"),
    evening: grab("Evening", "Reflection"),
    reflection: grab("Reflection"),
  };
}

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`✨ API running on port ${PORT}`);
});
