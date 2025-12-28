import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodeFetch from "node-fetch";

dotenv.config();
const app = express();

const fetch = globalThis.fetch || nodeFetch;

/* ✅ CORS — FINAL & CORRECT */
app.use(cors({
  origin: [
    "https://what-if-ecru.vercel.app",
    "https://what-if-git-main-aditi-chourasias-projects.vercel.app",
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

/* ✅ Render-safe preflight */
app.options("*", (req, res) => res.sendStatus(204));

app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { whatIf, currentLife } = req.body;

  if (!whatIf) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const prompt = `
Write a calm, realistic alternate-life story.

Rules (IMPORTANT):
- Do NOT use markdown (**)
- Do NOT repeat section titles inside content
- Use EXACT section labels on new lines only:

TITLE:
MORNING:
MIDDAY:
AFTERNOON:
EVENING:
REFLECTION:

Each section must contain 2 short paragraphs.
No extra text before or after sections.

Scenario: ${whatIf}
Current life: ${currentLife || "Not specified"}
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
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    const story = parseStory(text, whatIf);

    res.json({
      story,
      imageUrl: `https://picsum.photos/1024/1024?random=${Date.now()}`
    });

  } catch (err) {
    console.error("❌ Generation error:", err);
    res.status(500).json({ error: "Generation failed" });
  }
});

/* 🔒 BULLETPROOF PARSER */
function parseStory(text, whatIf) {
  const clean = (s = "") =>
    s
      .replace(/^(TITLE|MORNING|MIDDAY|AFTERNOON|EVENING|REFLECTION):?/gi, "")
      .trim();

  const get = (label) => {
    const regex = new RegExp(
      `${label}:([\\s\\S]*?)(?=\\n[A-Z ]+:|$)`,
      "i"
    );
    const match = text.match(regex);
    return match ? clean(match[1]) : "";
  };

  const story = {
    title: get("TITLE") || whatIf,
    morning: get("MORNING"),
    midday: get("MIDDAY"),
    afternoon: get("AFTERNOON"),
    evening: get("EVENING"),
    reflection: get("REFLECTION"),
  };

  /* ✅ HARD FALLBACK — NEVER EMPTY */
  const allText = text
    .split(/\n+/)
    .map(t => t.trim())
    .filter(t => t.length > 40);

  if (!story.morning && allText.length) {
    const chunk = Math.ceil(allText.length / 5);
    story.morning = allText.slice(0, chunk).join("\n\n");
    story.midday = allText.slice(chunk, chunk * 2).join("\n\n");
    story.afternoon = allText.slice(chunk * 2, chunk * 3).join("\n\n");
    story.evening = allText.slice(chunk * 3, chunk * 4).join("\n\n");
    story.reflection =
      allText.slice(chunk * 4).join("\n\n") ||
      "Every imagined life teaches us something about the one we live.";
  }

  return story;
}

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`✨ API running on port ${PORT}`);
});
