const https = require('https');

export default function handler(req, res) {
    const lang = req.query.lang || 'de';

    const feeds = {
        de: 'https://rss.dw.com/rdf/rss-de',
        ru: 'https://rss.dw.com/rdf/rss-ru-all'
    };

    const url = feeds[lang] || feeds.de;

    https.get(url, (response) => {
        let data = '';
        response.on('data', chunk => { data += chunk; });
        response.on('end', () => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 's-maxage=300');
            res.status(200).send(data);
        });
    }).on('error', (err) => {
        res.status(500).json({ error: err.message });
    });
}
