const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `Ты — MigraHelp AI, помощник для мигрантов в Казахстане. Ты помогаешь с вопросами о:
- Оформление документов (ИИН, РВП, ВНЖ, трудовой патент, регистрация)
- Поиск жилья, отелей и хостелов в Алматы
- Рестораны и кафе для разного бюджета
- Медицинские услуги и страховка
- Юридическая помощь и права мигрантов
- Полезные адреса: ЦОНы, миграционная полиция, больницы

Отвечай кратко, по делу, на языке пользователя. Если не знаешь точный ответ — честно скажи и предложи обратиться в соответствующую организацию. Будь дружелюбным и поддерживающим.`;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API error:', errorData);
      return res.status(response.status).json({ error: 'AI service error' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Извините, не удалось получить ответ.';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
