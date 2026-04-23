export default async function handler(req, res) {
  const { city = 'Hattingen', lang = 'de' } = req.query;

  // Валидация входных данных
  if (typeof city !== 'string' || city.length > 100) {
    return res.status(400).json({ error: 'Invalid city' });
  }
  if (lang !== 'de' && lang !== 'ru') {
    return res.status(400).json({ error: 'Invalid lang' });
  }

  try {
    const apiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric&lang=${lang}`
    );
    const data = await apiRes.json();

    // Кэш на стороне Vercel на 10 минут
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.status(apiRes.ok ? 200 : apiRes.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Weather fetch failed' });
  }
}
