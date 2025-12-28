import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import nodeFetch from "node-fetch";

dotenv.config();
const app = express();

const fetch = globalThis.fetch || nodeFetch;

app.use(cors({
  origin: ['https://what-if-ecru.vercel.app', 'http://localhost:5173'],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  const { whatIf, currentLife } = req.body;

  if (!whatIf) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    console.log("🎯 Generating story for:", whatIf);
    
    // Use Groq (FREE, FAST, NO QUOTA ISSUES!)
    const storyPrompt = `Write a beautiful, realistic day-in-the-life story.

Scenario: ${whatIf}
Current situation: ${currentLife || "Not specified"}

Write a warm, detailed narrative with these sections:

**Title:** [A poetic 3-6 word title]

**Morning:**
[2 detailed paragraphs about the morning in this alternate life]

**Midday:**
[2 detailed paragraphs about midday activities]

**Afternoon:**
[2 detailed paragraphs about afternoon experiences]

**Evening:**
[2 detailed paragraphs about evening wind-down]

**Reflection:**
[2 thoughtful paragraphs reflecting on this life path]

Make it feel real, emotional, and grounded in specific details.`;

    console.log("📝 Calling Groq API (FREE!)...");
    
    const storyResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Free, fast, excellent
        messages: [
          {
            role: "user",
            content: storyPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    console.log("📡 Groq Response Status:", storyResponse.status);

    if (!storyResponse.ok) {
      const errorText = await storyResponse.text();
      console.error("❌ Groq API Error:", errorText);
      throw new Error(`Groq API error: ${errorText}`);
    }

    const storyData = await storyResponse.json();
    console.log("✅ Story received from Groq");
    
    const storyText = storyData.choices[0].message.content;
    console.log("📖 Story text length:", storyText.length);

    // Parse story
    const story = parseStory(storyText, whatIf);
    console.log("✅ Story parsed successfully");

    // Use free Picsum for images (works 100% of the time)
    const imageUrl = `https://picsum.photos/1024/1024?random=${Date.now()}`;
    console.log("🎨 Using Picsum image");

    res.json({
      story,
      imageUrl,
    });

  } catch (err) {
    console.error("💥 Generation error:", err);
    res.status(500).json({
      error: "Generation failed",
      details: err.message,
    });
  }
});

function parseStory(text, whatIf) {
  const sections = {
    title: "",
    morning: "",
    midday: "",
    afternoon: "",
    evening: "",
    reflection: "",
  };

  // Extract title - multiple patterns
  const titlePatterns = [
    /\*\*Title:\*\*\s*(.+?)(?:\n|$)/i,
    /^Title:\s*(.+?)(?:\n|$)/im,
    /^#\s*(.+?)$/m,
    /^\*\*(.+?)\*\*$/m,
  ];

  for (const pattern of titlePatterns) {
    const match = text.match(pattern);
    if (match) {
      sections.title = match[1].trim().replace(/[*_]/g, '');
      break;
    }
  }

  if (!sections.title) {
    sections.title = whatIf.split(' ').slice(0, 6).join(' ');
  }

  // Extract sections with various formats
  const sectionPatterns = {
    morning: /\*\*Morning:\*\*\s*\n([\s\S]*?)(?=\n\s*\*\*Midday:|$)/i,
    midday: /\*\*Midday:\*\*\s*\n([\s\S]*?)(?=\n\s*\*\*Afternoon:|$)/i,
    afternoon: /\*\*Afternoon:\*\*\s*\n([\s\S]*?)(?=\n\s*\*\*Evening:|$)/i,
    evening: /\*\*Evening:\*\*\s*\n([\s\S]*?)(?=\n\s*\*\*Reflection:|$)/i,
    reflection: /\*\*Reflection:\*\*\s*\n([\s\S]*?)$/i,
  };

  for (const [key, pattern] of Object.entries(sectionPatterns)) {
    const match = text.match(pattern);
    if (match) {
      sections[key] = match[1].trim();
    }
  }

  // Fallback: distribute paragraphs if structured extraction fails
  if (!sections.morning) {
    const paragraphs = text
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(p => p.length > 50)
      .filter(p => !p.match(/^\*\*(title|morning|midday|afternoon|evening|reflection):/i));

    if (paragraphs.length >= 5) {
      const perSection = Math.ceil(paragraphs.length / 5);
      sections.morning = paragraphs.slice(0, perSection).join("\n\n");
      sections.midday = paragraphs.slice(perSection, perSection * 2).join("\n\n");
      sections.afternoon = paragraphs.slice(perSection * 2, perSection * 3).join("\n\n");
      sections.evening = paragraphs.slice(perSection * 3, perSection * 4).join("\n\n");
      sections.reflection = paragraphs.slice(perSection * 4).join("\n\n");
    } else if (paragraphs.length > 0) {
      sections.morning = paragraphs[0] || "";
      sections.midday = paragraphs[1] || paragraphs[0] || "";
      sections.afternoon = paragraphs[2] || paragraphs[1] || "";
      sections.evening = paragraphs[3] || paragraphs[2] || "";
      sections.reflection = paragraphs[4] || "This path opens new doors and possibilities.";
    }
  }

  return sections;
}

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`✨ API running on http://localhost:${PORT}`);
});
