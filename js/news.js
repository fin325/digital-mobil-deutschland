/* === news.js — Новости DE (Tagesschau) / RU (Meduza) === */

async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    const lang = document.documentElement.lang || 'de';

    const feeds = {
        de: 'https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml',
        ru: 'https://meduza.io/rss/all'
    };

    const sources = { de: 'tagesschau.de', ru: 'Meduza' };
    const urls    = { de: 'https://www.tagesschau.de', ru: 'https://meduza.io' };

    const errorMsg = {
        de: 'Fehler beim Laden der Nachrichten.',
        ru: 'Ошибка загрузки новостей.'
    };

    // Обновляем подписи источника
    const src    = sources[lang] || sources.de;
    const srcUrl = urls[lang] || urls.de;

    const sourceEl = document.getElementById('news-source');
    const hintEl   = document.getElementById('news-hint');

    if (sourceEl) sourceEl.innerHTML = `Quelle: <a href="${srcUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit;">${src}</a>`;
    if (hintEl) hintEl.textContent = lang === 'ru'
        ? `Источник: ${src}`
        : `Hinweis: Nachrichten via RSS von ${src}.`;

    // Загружаем новости
    const rssUrl = feeds[lang] || feeds.de;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const res  = await fetch(apiUrl);
        const data = await res.json();

        if (data.status === 'ok') {
            container.innerHTML = '';
            data.items.slice(0, 5).forEach(item => {
                const div = document.createElement('div');
                div.className = 'news-item';
                div.innerHTML = `
                    <a href="${item.link}" target="_blank"
                       class="news-title">${item.title}</a>
                    <p class="news-desc">
                        ${item.description.split('.')[0]}...</p>
                `;
                container.appendChild(div);
            });
        } else {
            container.innerHTML = errorMsg[lang] || errorMsg.de;
        }
    } catch (e) {
        container.innerHTML = errorMsg[lang] || errorMsg.de;
    }
}

window.loadTagesschauNews = loadNews;
window.loadNews = loadNews;
