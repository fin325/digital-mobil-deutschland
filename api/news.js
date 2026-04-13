export default async function handler(req, res) {
    const lang = req.query.lang || 'de';

    const feeds = {
        de: 'https://rss.dw.com/rdf/rss-de',
        ru: 'https://rss.dw.com/rdf/rss-ru-all'
    };

    try {
        const response = await fetch(feeds[lang] || feeds.de);
        const xml = await response.text();

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 's-maxage=300');
        res.status(200).send(xml);
    } catch (error) {
        res.status(500).json({ error: 'Failed' });
    }
}
