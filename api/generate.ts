export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { whatIf, currentLife } = req.body

  if (!whatIf) {
    return res.status(400).json({ error: 'whatIf is required' })
  }

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: `
You MUST output FIVE SEPARATE PARAGRAPHS.
Each paragraph represents a different time of day.

DO NOT merge them.
DO NOT add explanations.
DO NOT add markdown.

Output EXACTLY in this format:

MORNING:
<paragraph>

MIDDAY:
<paragraph>

AFTERNOON:
<paragraph>

EVENING:
<paragraph>

REFLECTION:
<paragraph>
`
            },
            {
              role: 'user',
              content: `What if: ${whatIf}\nCurrent life: ${currentLife || 'Not provided'}`
            }
          ]
        })
      }
    )

    const data = await response.json()
    const raw = data?.choices?.[0]?.message?.content

    if (!raw) {
      throw new Error('Invalid response from Groq')
    }

    // ---------- HARD PARSER ----------
    const sections: Record<string, string> = {
      MORNING: '',
      MIDDAY: '',
      AFTERNOON: '',
      EVENING: '',
      REFLECTION: ''
    }

    let currentKey: keyof typeof sections | null = null

    raw.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed in sections) {
        currentKey = trimmed as keyof typeof sections
      } else if (currentKey) {
        sections[currentKey] += trimmed + ' '
      }
    })

    // ---------- FAILSAFE ----------
    // If model still dumped everything into MORNING
    const filled = Object.values(sections).filter(v => v.trim()).length

    if (filled <= 1) {
      const sentences = raw
        .replace(/MORNING:|MIDDAY:|AFTERNOON:|EVENING:|REFLECTION:/gi, '')
        .split('.')
        .map(s => s.trim())
        .filter(Boolean)

      const chunk = Math.ceil(sentences.length / 5)

      sections.MORNING = sentences.slice(0, chunk).join('. ') + '.'
      sections.MIDDAY = sentences.slice(chunk, chunk * 2).join('. ') + '.'
      sections.AFTERNOON = sentences.slice(chunk * 2, chunk * 3).join('. ') + '.'
      sections.EVENING = sentences.slice(chunk * 3, chunk * 4).join('. ') + '.'
      sections.REFLECTION = sentences.slice(chunk * 4).join('. ') + '.'
    }

    return res.status(200).json({
      story: {
        title: 'What If…',
        morning: sections.MORNING.trim(),
        midday: sections.MIDDAY.trim(),
        afternoon: sections.AFTERNOON.trim(),
        evening: sections.EVENING.trim(),
        reflection: sections.REFLECTION.trim()
      },
      imageUrl: null
    })
  } catch (err: any) {
    console.error('❌ Generation failed:', err)
    return res.status(500).json({
      error: 'Generation failed',
      details: err?.message || 'Unknown error'
    })
  }
}
