/* === news.js — Новости Deutsche Welle (DE/RU) === */

async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    const lang = document.documentElement.lang || 'de';

    const errorMsg = {
        de: 'Fehler beim Laden der Nachrichten.',
        ru: 'Ошибка загрузки новостей.'
    };

    try {
        const res = await fetch(`/api/news?lang=${lang}`);
        const xml = await res.text();
        const doc = new DOMParser().parseFromString(xml, 'text/xml');
        const items = doc.querySelectorAll('item');

        if (items.length === 0) {
            container.innerHTML = errorMsg[lang] || errorMsg.de;
            return;
        }

        container.innerHTML = '';
        let count = 0;
        items.forEach(item => {
            if (count >= 5) return;
            const title = item.querySelector('title')?.textContent || '';
            const link  = item.querySelector('link')?.textContent || '';
            const desc  = (item.querySelector('description')?.textContent || '').split('.')[0];

            const div = document.createElement('div');
            div.className = 'news-item';
            div.innerHTML = `
                <a href="${link}" target="_blank"
                   class="news-title">${title}</a>
                <p class="news-desc">${desc}...</p>
            `;
            container.appendChild(div);
            count++;
        });
    } catch (e) {
        container.innerHTML = errorMsg[lang] || errorMsg.de;
    }
}

window.loadTagesschauNews = loadNews;
window.loadNews = loadNews;
