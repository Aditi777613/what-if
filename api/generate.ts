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
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content:
                'Write a calm, reflective alternate-life story. Soft, emotional, realistic.'
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

    return res.status(200).json({
      story: {
        title: 'What If…',
        morning: text,
        midday: '',
        afternoon: '',
        evening: '',
        reflection: ''
      },
      imageUrl: null
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Generation failed' })
  }
}
