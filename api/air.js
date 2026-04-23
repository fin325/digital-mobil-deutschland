export default async function handler(req, res) {
  const { lat, lon } = req.query;

  // Валидация координат
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
    return res.status(400).json({ error: 'Invalid coordinates' });
  }

  try {
    const apiRes = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latNum}&lon=${lonNum}&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    const data = await apiRes.json();

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1200');
    res.status(apiRes.ok ? 200 : apiRes.status).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Air pollution fetch failed' });
  }
}
