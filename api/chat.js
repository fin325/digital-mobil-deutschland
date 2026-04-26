// api/chat.js — Vercel Serverless Function для чата с Groq
// Endpoint: https://digital-mobil-deutschland.vercel.app/api/chat

export default async function handler(req, res) {
  // CORS headers (на всякий случай, если будешь тестировать с другого домена)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured on the server.' });
  }

  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Field "messages" must be a non-empty array.' });
    }

    const systemPrompt = `Du bist ein hilfreicher Assistent der Website "Digital & Mobil in Deutschland" (https://digital-mobil-deutschland.vercel.app) — ein kostenloses Informationsportal für Einwohner und Migranten in Hattingen, Bochum und NRW (Deutschland).

Die Website hat folgende Bereiche (Tabs):
- Startseite: Infos zum Interkulturellen Zentrum Magnet in Hattingen
- PDF für Mail: PDF-Kompressor und Foto-zu-PDF Converter
- DB: Deutsche Bahn Fahrplan & Transport
- Karten: Google Maps und Apple Maps für Hattingen
- Kontakt: hattingen325@gmail.com
- Nachrichten: aktuelle News via tagesschau.de RSS
- Hattingen: offizielle Stadtportal-Links (News, Tourismus, Bildung, Veranstaltungen)
- Gesetze: z.B. UkraineAufenthÄndFGV (Aufenthalt für ukrainische Staatsangehörige)
- Übersetzer: Google Translate, DeepL, Reverso Context
- Arbeit: Arbeitsagentur, Indeed, StepStone, XING + eigenes Job-Portal
- Ärzte: Doctolib, Jameda
- Miete: ImmoScout24, Kleinanzeigen, hwg eG, Gartenstadt Hüttenau, LEG, Vonovia, WG-Gesucht, Immowelt
- KI-Assistenten: Gemini, ChatGPT, Claude, Grok
- Projekt Info: Impressum, Datenschutz, technische Details

Wichtige Regeln:
1. Antworte in der Sprache des Nutzers (Deutsch oder Russisch). Wenn unklar — Deutsch.
2. Halte Antworten kurz, freundlich und hilfreich (2-5 Sätze).
3. Wenn die Frage zu einem Tab passt, sage dem Nutzer klar, welchen Tab er auf der Seite anklicken soll.
4. Erfinde keine Funktionen, die es auf der Seite nicht gibt.
5. Bei Fragen zu Behörden, Recht oder Medizin: gib allgemeine Hinweise und empfehle, sich an die zuständigen Stellen zu wenden.
6. Bei Notfällen (Feuer, Polizei, Krankenwagen): nenne 112 (Notruf) bzw. 110 (Polizei).`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error('Groq API error:', groqResponse.status, errText);
      return res.status(groqResponse.status).json({
        error: 'Groq API request failed',
        details: errText,
      });
    }

    const data = await groqResponse.json();
    const reply = data.choices?.[0]?.message?.content || '';

    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
