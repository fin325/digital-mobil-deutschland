export default async function handler(req, res) {
  try {
    const apiRes = await fetch(
      'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json'
    );

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: 'NOAA fetch failed' });
    }

    const data = await apiRes.json();

    // Возвращаем только последнее значение, а не весь массив —
    // меньше трафика и меньше данных для кэша
    const latest = data[data.length - 1];

    // Кэш на 30 минут
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    res.status(200).json({ kp_index: latest.kp_index, time_tag: latest.time_tag });
  } catch (e) {
    res.status(500).json({ error: 'Geomagnetic fetch failed' });
  }
}
