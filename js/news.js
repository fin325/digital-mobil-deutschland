/* === news.js — Двуязычные новости DW === */

async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    // Определяем язык страницы
    const lang = document.documentElement.lang || 'de';

    const feeds = {
        ru: 'https://rss.dw.com/rdf/rss-rus',
        de: 'https://rss.dw.com/rdf/rss-de'
    };

    const errorMsg = {
        ru: 'Ошибка загрузки новостей.',
        de: 'Fehler beim Laden der Nachrichten.'
    };

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
                        ${item.description.split('.')[0]}...
                    </p>
                `;
                container.appendChild(div);
            });
        }
    } catch (e) {
        container.innerHTML = errorMsg[lang] || errorMsg.de;
    }
}

window.loadTagesschauNews = loadNews;
