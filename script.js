const apiKey = '9057c4b98fd893160015f5d4bc3696cc';

// --- ЧАСЫ ---
function updateClock() {
    const now = new Date();
    // Формат ЧЧ:ММ:СС
    const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const timeElement = document.getElementById('current-time');
    if (timeElement) timeElement.innerText = timeStr;
}

// --- ПОГОДА ---
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
        }, (err) => console.log("Геолокация отклонена или недоступна"));
    }
}

// --- ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК ---
function showTab(tabId, event) {
    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    // Убираем активный класс у всех кнопок
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    // Показываем нужную вкладку
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');
    
    // Делаем нажатую кнопку активной (из любого ряда навигации)
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    
    // Прокрутка наверх при смене вкладки
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ---
document.addEventListener('DOMContentLoaded', () => {
    // Запускаем погоду
    getWeather();
    
    // Устанавливаем текущую дату
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const options = { day: 'numeric', month: 'long' };
        // Формат: "31 März"
        dateEl.innerText = new Date().toLocaleDateString('de-DE', options);
    }
    
    // Запускаем часы
    updateClock();
    setInterval(updateClock, 1000);
});

// --- GOOGLE TRANSLATE ---
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
