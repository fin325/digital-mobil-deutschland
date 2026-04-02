function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const timeElement = document.getElementById('current-time');
    if (timeElement) timeElement.innerText = timeStr;
}

/* === weather.js — Погода OpenWeatherMap === */

const WEATHER_API_KEY = '9057c4b98fd893160015f5d4bc3696cc';
let currentCity = 'Hattingen'; // Устанавливаем город по умолчанию

async function getWeather() {
    try {
        // Делаем запрос по названию города (q=${currentCity}) вместо координат
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${WEATHER_API_KEY}&units=metric&lang=de`
        );
        const d = await res.json();

        // Если город не найден или API вернуло ошибку
        if (!d.main) {
            console.error('Город не найден или произошла ошибка:', d.message);
            alert('Город не найден! Возвращаем предыдущий.');
            return;
        }

        const temp = Math.round(d.main.temp);
        const city = d.name; // Используем официальное название от API
        const code = d.weather[0].id;

        let icon = '☁️';
        if (code === 800)     icon = '☀️';
        else if (code > 800)  icon = '☁️';
        else if (code >= 600) icon = '❄️';
        else if (code >= 300) icon = '🌧️';

        const tempEl  = document.getElementById('city-temp');
        const pressEl = document.getElementById('press');
        const humEl   = document.getElementById('hum');

        if (tempEl) {
            tempEl.innerText  = `${city} ${icon} ${temp}°C`;
            tempEl.style.cursor = 'pointer'; // Добавляем курсор-указатель, чтобы было понятно, что можно кликнуть
            tempEl.title = 'Нажмите, чтобы изменить город'; // Подсказка при наведении
            
            // Назначаем действие при клике
            tempEl.onclick = () => {
                const newCity = prompt('Введите название города:', currentCity);
                // Если пользователь ввел что-то и не нажал "Отмена"
                if (newCity && newCity.trim() !== '') {
                    currentCity = newCity.trim(); // Обновляем текущий город
                    getWeather(); // Загружаем погоду для нового города
                }
            };
        }
        
        if (pressEl) pressEl.innerText = Math.round(d.main.pressure * 0.75006);
        if (humEl)   humEl.innerText   = d.main.humidity;

    } catch (e) {
        console.error('Ошибка погоды:', e);
    }
}

// Запускаем функцию при загрузке скрипта
getWeather();


async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;
    
    const rssUrl = 'https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.status === 'ok') {
            container.innerHTML = '';
            data.items.slice(0, 5).forEach(item => {
                const div = document.createElement('div');
                div.className = 'news-item';
                div.innerHTML = `<a href="${item.link}" target="_blank" class="news-title">${item.title}</a><p class="news-desc">${item.description.split('.')[0]}...</p>`;
                container.appendChild(div);
            });
        }
    } catch (e) { container.innerHTML = 'Fehler beim Laden.'; }
}

// --- ОБНОВЛЕННАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ---
function showTab(tabId, event) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
        
        // Дополнительная логика для Iframe новостей Hattingen
        if (tabId === 'news-hattingen') {
            const ifr = targetTab.querySelector('iframe');
            if (ifr && !ifr.getAttribute('src')) {
                ifr.setAttribute('src', 'https://www.hattingen.de/stadt_hattingen/Rathaus/Verwaltung/News/');
            }
        }
    }
    
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    window.scrollTo(0,0);
}

document.addEventListener('DOMContentLoaded', () => {
    getWeather();
    loadNews();
    
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const options = { day: 'numeric', month: 'long' };
        dateEl.innerText = new Date().toLocaleDateString('de-DE', options).replace('.', '');
    }
    
    updateClock();
    setInterval(updateClock, 1000);
});

// --- ЛОГИКА GOOGLE TRANSLATE ---
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'de',
        includedLanguages: 'ru,uk,en,tr,ar',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

(function loadGoogleTranslate() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
})();
