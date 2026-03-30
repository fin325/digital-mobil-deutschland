const apiKey = '9057c4b98fd893160015f5d4bc3696cc';

function updateClock() {
    const now = new Date();
    // Мы оставили формат ЧЧ:ММ:СС как в оригинале
    const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const timeElement = document.getElementById('current-time');
    if (timeElement) timeElement.innerText = timeStr;
}

async function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${apiKey}&units=metric&lang=de`);
                const d = await res.json();
                if (d.main) {
                    const temp = Math.round(d.main.temp);
                    const city = d.name;
                    const code = d.weather[0].id;
                    let icon = '☁️';
                    if (code === 800) icon = '☀️';
                    else if (code > 800) icon = '☁️';
                    else if (code >= 600) icon = '❄️';
                    else if (code >= 300) icon = '🌧️';

                    const tempEl = document.getElementById('city-temp');
                    const pressEl = document.getElementById('press');
                    const humEl = document.getElementById('hum');

                    if (tempEl) tempEl.innerText = `${city} ${icon} ${temp}°C`;
                    if (pressEl) pressEl.innerText = Math.round(d.main.pressure * 0.75006);
                    if (humEl) humEl.innerText = d.main.humidity;
                }
            } catch (e) { console.error("Ошибка погоды:", e); }
        });
    }
}

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

function showTab(tabId, event) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');
    
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    window.scrollTo(0,0);
}

// Запуск всех функций при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    getWeather();
    loadNews();
    
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const options = { day: 'numeric', month: 'long' };
        dateEl.innerText = new Date().toLocaleDateString('de-DE', options);
    }
    
    updateClock();
    setInterval(updateClock, 1000);
});

// Эта функция ДОЛЖНА называться именно так, как указано в ссылке Google (cb=...)
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'de',
        // Список языков: русский, украинский, английский, турецкий, арабский
        includedLanguages: 'ru,uk,en,tr,ar', 
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

