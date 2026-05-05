export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || prompt.length > 2000) {
    return res.status(400).json({ error: 'Invalid prompt' });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!response.ok) {
      return res.status(500).json({ error: 'Generation failed' });
    }
    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    return res.status(200).json({ text });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
