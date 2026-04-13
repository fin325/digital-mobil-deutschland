/* === news.js — Загрузка новостей (DE: Tagesschau / RU: Euronews) === */

async function loadNews() {
    const container = document.getElementById('news-container');
    const placeholder = document.getElementById('news-placeholder');
    if (!container) return;

    const lang = document.documentElement.lang || 'de';

    const feeds = {
        de: 'https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml',
        ru: 'https://ru.euronews.com/rss'
    };

    const errorMsg = {
        de: 'Fehler beim Laden.',
        ru: 'Ошибка загрузки новостей.'
    };

    const rssUrl = feeds[lang] || feeds.de;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const res  = await fetch(apiUrl);
        const data = await res.json();

        if (data.status === 'ok') {
            container.innerHTML = '';
            container.style.display = '';
            if (placeholder) placeholder.style.display = 'none';

            data.items.slice(0, 5).forEach(item => {
                const div = document.createElement('div');
                div.className = 'news-item';
                div.innerHTML = `
                    <a href="${item.link}" target="_blank" class="news-title">${item.title}</a>
                    <p class="news-desc">${item.description.split('.')[0]}...</p>
                `;
                container.appendChild(div);
            });
        }
    } catch (e) {
        container.style.display = '';
        container.innerHTML = errorMsg[lang] || errorMsg.de;
        if (placeholder) placeholder.style.display = 'none';
    }

    // Обновить ссылку на источник
    const newsSource = document.getElementById('news-source');
    if (newsSource) {
        if (lang === 'ru') {
            newsSource.innerHTML = 'Источник: <a href="https://ru.euronews.com" target="_blank" rel="noopener noreferrer" style="color: inherit;">ru.euronews.com</a>';
        } else {
            newsSource.innerHTML = 'Quelle: <a href="https://www.tagesschau.de" target="_blank" rel="noopener noreferrer" style="color: inherit;">tagesschau.de</a>';
        }
    }
}

// Перезагрузить новости при смене языка (если уже были загружены)
window.addEventListener('languageChanged', () => {
    const container = document.getElementById('news-container');
    if (container && container.style.display !== 'none' && container.innerHTML !== '') {
        loadNews();
    }
});

// Доступно глобально
window.loadTagesschauNews = loadNews;
