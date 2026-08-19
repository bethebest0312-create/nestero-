export async function generateViaOpenAI(prompt: string) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return { text: `Local fallback: ${prompt}` }

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 512 })
    })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { text: `OpenAI error ${res.status}: ${text}` }
    }
    const data = await res.json()
    const msg = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || JSON.stringify(data)
    return { text: msg }
  } catch (err) {
    console.error('OpenAI call failed', err)
    return { text: `OpenAI call failed — fallback: ${prompt}` }
  }
}
