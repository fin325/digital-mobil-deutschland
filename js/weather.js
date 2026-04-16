/* === weather.js — Wetter OpenWeatherMap + Luftqualität === */

const WEATHER_API_KEY = '9057c4b98fd893160015f5d4bc3696cc';
let currentCity = localStorage.getItem('userCity') || 'Hattingen';

const CACHE_TTL = 10 * 60 * 1000; // 10 минут

// Определяем язык страницы
const isRu = document.documentElement.lang === 'ru';

async function getWeather() {
    try {
        const cached = localStorage.getItem('weatherCache');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_TTL && parsed.city === currentCity) {
                applyWeatherData(parsed.data);
                return;
            }
        }
    } catch (e) {}

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${WEATHER_API_KEY}&units=metric&lang=de`
        );
        const d = await res.json();

        if (!d.main) {
            console.error(isRu ? 'Город не найден:' : 'Stadt nicht gefunden:', d.message);
            return;
        }

        try {
            localStorage.setItem('weatherCache', JSON.stringify({
                data: d,
                timestamp: Date.now(),
                city: currentCity
            }));
        } catch (e) {}

        applyWeatherData(d);

    } catch (e) {
        console.error(isRu ? 'Ошибка погоды:' : 'Wetter-Fehler:', e);
    }
}

function applyWeatherData(d) {
    try {
        const temp = Math.round(d.main.temp);
        const city = d.name; 
        const code = d.weather[0].id;
        const lat  = d.coord.lat;
        const lon  = d.coord.lon;

        if (currentCity !== city) {
            currentCity = city;
            localStorage.setItem('userCity', city);
        }

        // Иконки для основной погоды
        let icon = `<span class="icon-emoji icon-cloud"></span>`; 
        if (code === 800)     icon = `<span class="icon-emoji icon-sun"></span>`;
        else if (code > 800)  icon = `<span class="icon-emoji icon-cloud"></span>`;
        else if (code >= 600) icon = `<span class="icon-emoji icon-snow"></span>`;
        else if (code >= 300) icon = `<span class="icon-emoji icon-rain"></span>`;

        const tempEl  = document.getElementById('city-temp');
        const pressEl = document.getElementById('press');
        const humEl   = document.getElementById('hum');

        if (tempEl) {
            // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: .innerHTML вместо .innerText
            tempEl.innerHTML = `${city} ${icon} ${temp}°C`;
            tempEl.onclick = (e) => {
                e.stopPropagation();
                const promptMsg = isRu 
                    ? 'Пожалуйста, введите название города:' 
                    : 'Bitte den Namen der Stadt eingeben:';
                
                const newCity = prompt(promptMsg, currentCity);
                if (newCity && newCity.trim() !== '') {
                    currentCity = newCity.trim();
                    localStorage.setItem('userCity', currentCity);
                    localStorage.removeItem('weatherCache');
                    localStorage.removeItem('aqiCache');
                    getWeather();
                }
            };
        }

        if (pressEl) pressEl.innerText = Math.round(d.main.pressure * 0.75006);
        if (humEl)   humEl.innerText   = d.main.humidity;

        getAirPollution(lat, lon);

    } catch (e) {
        console.error(isRu ? 'Ошибка применения данных:' : 'Fehler при применении данных:', e);
    }
}

async function getAirPollution(lat, lon) {
    try {
        const cached = localStorage.getItem('aqiCache');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_TTL) {
                updateAQIUI(parsed.index);
                return;
            }
        }
    } catch (e) {}

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
        );
        const data = await res.json();
        const aqiIndex = data.list[0].main.aqi;

        try {
            localStorage.setItem('aqiCache', JSON.stringify({
                index: aqiIndex,
                timestamp: Date.now()
            }));
        } catch (e) {}

        updateAQIUI(aqiIndex);

    } catch (e) {
        console.error(isRu ? 'Ошибка качества воздуха:' : 'Fehler Luftqualität:', e);
    }
}

function updateAQIUI(index) {
    const valEl = document.getElementById('aqi-value');
    const icoEl = document.getElementById('aqi-icon');

    if (!valEl || !icoEl) return;

    let color, icon;

    // Используем обратные кавычки (Ё) для безопасной вставки HTML
    switch (index) {
        case 1: color = "#2ecc71"; icon = `<span class="icon-emoji icon-leaf"></span>`; break;
        case 2: color = "#f1c40f"; icon = `<span class="icon-emoji icon-air"></span>`; break;
        case 3: color = "#e67e22"; icon = `<span class="icon-emoji icon-fog"></span>`; break;
        case 4: color = "#e74c3c"; icon = `<span class="icon-emoji icon-attention"></span>`; break;
        case 5: color = "#9b59b6"; icon = `<span class="icon-emoji icon-mask"></span>`; break;
        default: color = "#fff";   icon = `<span class="icon-emoji icon-leaf"></span>`;
    }

    // 1. Устанавливаем цифру индекса
    valEl.innerText = index;
    valEl.style.color = color;
    
    // 2. Устанавливаем иконку и её цвет
    // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: .innerHTML
    icoEl.innerHTML = icon; 
    icoEl.style.color = color; // Это сработает только с масками в CSS
    icoEl.style.textShadow = `0 0 8px ${color}66`;
}

// Функции меток и прокрутки оставляем без изменений...
function toggleLabel(element) { /* ... код без изменений ... */ }
function toggleWeatherScroll() { /* ... код без изменений ... */ }

getWeather();
