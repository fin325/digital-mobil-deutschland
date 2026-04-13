/* === news.js — Новости Deutsche Welle (DE/RU) === */

async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    const lang = document.documentElement.lang || 'de';

    const feeds = {
        de: 'https://rss.dw.com/rdf/rss-de',
        ru: 'https://rss.dw.com/rdf/rss-ru-all'
    };

    const errorMsg = {
        de: 'Fehler beim Laden der Nachrichten.',
        ru: 'Ошибка загрузки новостей.'
    };

    const rssUrl = feeds[lang] || feeds.de;
    const errText = errorMsg[lang] || errorMsg.de;

    const proxies = [
        url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        url => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
        url => `https://proxy.corsfix.com/?${encodeURIComponent(url)}`,
        url => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
    ];

    for (let i = 0; i < proxies.length; i++) {
        try {
            const proxyUrl = proxies[i](rssUrl);
            const res = await fetch(proxyUrl);
            if (!res.ok) continue;

            const raw = await res.text();

            // rss2json возвращает JSON
            if (proxyUrl.includes('rss2json')) {
                try {
                    const data = JSON.parse(raw);
                    if (data.status === 'ok' && data.items?.length) {
                        renderNews(container, data.items.map(it => ({
                            title: it.title,
                            link: it.link,
                            desc: (it.description || '').split('.')[0]
                        })));
                        return;
                    }
                } catch(e) {}
                continue;
            }

            // allorigins возвращает JSON с полем contents
            let xml = raw;
            if (proxyUrl.includes('allorigins')) {
                try {
                    const json = JSON.parse(raw);
                    xml = json.contents || '';
                } catch(e) {
                    continue;
                }
            }

            const doc = new DOMParser().parseFromString(xml, 'text/xml');
            const items = doc.querySelectorAll('item');
            if (items.length === 0) continue;

            const news = [];
            items.forEach((item, idx) => {
                if (idx >= 5) return;
                news.push({
                    title: item.querySelector('title')?.textContent || '',
                    link:  item.querySelector('link')?.textContent || '',
                    desc: (item.querySelector('description')?.textContent || '').split('.')[0]
                });
            });

            renderNews(container, news);
            return;
        } catch (e) {
            console.warn('Proxy ' + i + ' failed:', e);
        }
    }

    container.innerHTML = errText;
}

function renderNews(container, items) {
    container.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'news-item';
        div.innerHTML = `
            <a href="${item.link}" target="_blank"
               class="news-title">${item.title}</a>
            <p class="news-desc">${item.desc}...</p>
        `;
        container.appendChild(div);
    });
}

window.loadTagesschauNews = loadNews;
window.loadNews = loadNews;
