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
        url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        url => `https://corsproxy.io/?${encodeURIComponent(url)}`
    ];

    for (const makeUrl of proxies) {
        try {
            const res = await fetch(makeUrl(rssUrl));
            if (!res.ok) continue;

            const text = await res.text();
            const doc = new DOMParser().parseFromString(text, 'text/xml');
            const items = doc.querySelectorAll('item');

            if (items.length === 0) continue;

            const news = [];
            items.forEach((item, i) => {
                if (i >= 5) return;
                news.push({
                    title: item.querySelector('title')?.textContent || '',
                    link:  item.querySelector('link')?.textContent || '',
                    desc: (item.querySelector('description')?.textContent || '').split('.')[0]
                });
            });

            renderNews(container, news);
            return;
        } catch (e) {
            console.warn('Proxy failed:', e);
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
