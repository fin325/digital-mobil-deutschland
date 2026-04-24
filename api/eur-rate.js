export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=10800');
  try {
    const r = await fetch(
      'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json&valcode=EUR'
    );
    const data = await r.json();
    res.status(200).json({ rate: data[0]?.rate ?? null });
  } catch (e) {
    res.status(500).json({ rate: null });
  }
}
