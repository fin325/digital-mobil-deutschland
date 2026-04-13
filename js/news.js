/* === news.js — Мультиязычные новости Deutsche Welle (DW) === */

// Определяем язык страницы
const isRu = document.documentElement.lang === 'ru';

async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    // Переводим текст загрузки
    container.innerHTML = isRu ? 'Загрузка новостей...' : 'Lade Nachrichten...';

    // Выбираем официальную RSS-ленту Deutsche Welle в зависимости от языка
    const rssUrl = isRu 
        ? 'https://rss.dw.com/xml/rss-ru-news'  // Новости DW на русском
        : 'https://rss.dw.com/xml/rss-de-news'; // Новости DW на немецком
        
    // Используем rss2json для конвертации XML в удобный JSON
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    try {
        const res  = await fetch(apiUrl);
        const data = await res.json();

        if (data.status === 'ok') {
            container.innerHTML = '';
            
            // Берем первые 5 новостей
            data.items.slice(0, 5).forEach(item => {
                const div = document.createElement('div');
                div.className = 'news-item';
                
                // DW иногда присылает длинные описания. 
                // Отрезаем текст по первой точке, чтобы карточки смотрелись компактно.
                let desc = item.description ? item.description.split('.')[0] + '...' : '';

                div.innerHTML = `
                    <a href="${item.link}" target="_blank" class="news-title">${item.title}</a>
                    <p class="news-desc">${desc}</p>
                `;
                container.appendChild(div);
            });
        } else {
            throw new Error('Fehler beim Abrufen des RSS-Feeds');
        }
    } catch (e) {
        // Переводим текст ошибки
        container.innerHTML = isRu 
            ? 'Ошибка при загрузке новостей.' 
            : 'Fehler beim Laden der Nachrichten.';
    }
}

// Делаем функцию доступной глобально (название оставил прежним, чтобы не пришлось менять в других файлах)
window.loadTagesschauNews = loadNews;
