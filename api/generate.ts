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
          messages: [
            {
              role: 'system',
              content: `
You are a reflective storyteller.

Write ONE alternate-life story divided STRICTLY into these sections:

MORNING:
MIDDAY:
AFTERNOON:
EVENING:
REFLECTION:

Rules:
- Each section must be 3–5 sentences
- Emotional, calm, realistic
- Do NOT add extra headings
- Use ONLY the labels above
`
            },
            {
              role: 'user',
              content: `What if: ${whatIf}\nCurrent life: ${currentLife || 'Not provided'}`
            }
          ],
          temperature: 0.8
        })
      }
    )

    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content

    if (!text) {
      throw new Error('Invalid response from Groq')
    }

    // ---- SAFE SECTION PARSER ----
    const extract = (label: string) => {
      const regex = new RegExp(
        `${label}:([\\s\\S]*?)(?=MORNING:|MIDDAY:|AFTERNOON:|EVENING:|REFLECTION:|$)`,
        'i'
      )
      return text.match(regex)?.[1]?.trim() || ''
    }

    return res.status(200).json({
      story: {
        title: 'What If…',
        morning: extract('MORNING'),
        midday: extract('MIDDAY'),
        afternoon: extract('AFTERNOON'),
        evening: extract('EVENING'),
        reflection: extract('REFLECTION')
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
