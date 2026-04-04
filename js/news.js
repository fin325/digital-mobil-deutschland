/* === news.js — Загрузка новостей Tagesschau === */

async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    const rssUrl = 'https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml';
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
                    <a href="${item.link}" target="_blank" class="news-title">${item.title}</a>
                    <p class="news-desc">${item.description.split('.')[0]}...</p>
                `;
                container.appendChild(div);
            });
        }
    } catch (e) {
        container.innerHTML = 'Fehler beim Laden.';
    }
}

