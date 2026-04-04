/* === weather.js — Погода + Качество воздуха OpenWeatherMap === */

const WEATHER_API_KEY = '9057c4b98fd893160015f5d4bc3696cc';
let currentCity = 'Hattingen'; // Стандартный город при загрузке

async function getWeather() {
    try {
        // 1. Запрос основной погоды для получения температуры и КООРДИНАТ
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${WEATHER_API_KEY}&units=metric&lang=de`
        );
        const d = await res.json();

        if (!d.main) {
            alert('Город не найден. Пожалуйста, проверьте название.');
            return;
        }

        const temp = Math.round(d.main.temp);
        const city = d.name;
        const code = d.weather[0].id;

        // Координаты (нужны для запроса воздуха)
        const lat = d.coord.lat;
        const lon = d.coord.lon;

        let icon = '☁️';
        if (code === 800)     icon = '☀️';
        else if (code > 800)  icon = '☁️';
        else if (code >= 600) icon = '❄️';
        else if (code >= 300) icon = '🌧️';

        const tempEl  = document.getElementById('city-temp');
        const pressEl = document.getElementById('press');
        const humEl   = document.getElementById('hum');

        if (tempEl) {
            tempEl.innerText = `${city} ${icon} ${temp}°C`;
            // Клик по городу для смены
            tempEl.onclick = (e) => {
                e.stopPropagation();
                const newCity = prompt('Введите название города:', currentCity);
                if (newCity && newCity.trim() !== '') {
                    currentCity = newCity.trim();
                    getWeather(); // Перезапуск всей цепочки для нового города
                }
            };
        }
        
        if (pressEl) pressEl.innerText = Math.round(d.main.pressure * 0.75006);
        if (humEl)   humEl.innerText   = d.main.humidity;

        // 2. АВТОМАТИЧЕСКИЙ ЗАПРОС ВОЗДУХА по полученным координатам
        getAirPollution(lat, lon);

    } catch (e) {
        console.error('Ошибка при получении погоды:', e);
    }
}

/**
 * Запрос данных о загрязнении (Air Pollution API)
 */
async function getAirPollution(lat, lon) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
        );
        const data = await res.json();
        
        // Индекс от OpenWeatherMap: 1 (Good) до 5 (Very Poor)
        const aqiIndex = data.list[0].main.aqi;
        updateAQIUI(aqiIndex);

    } catch (e) {
        console.error('Ошибка качества воздуха:', e);
    }
}

/**
 * Обновление интерфейса AQI (Цвет, иконка, надпись)
 */
function updateAQIUI(index) {
    const valEl  = document.getElementById('aqi-value');
    const icoEl  = document.getElementById('aqi-icon');

    if (!valEl || !icoEl) return;

    let color, status, icon;

    // Маппинг индекса (1-5)
    switch (index) {
        case 1:
            color = "#2ecc71"; // Зеленый
            status = "Отлично";
            icon = "🍃";
            break;
        case 2:
            color = "#f1c40f"; // Желтый
            status = "Терпимо";
            icon = "💨";
            break;
        case 3:
            color = "#e67e22"; // Оранжевый
            status = "Средне";
            icon = "🌫️";
            break;
        case 4:
            color = "#e74c3c"; // Красный
            status = "Вредно";
            icon = "⚠️";
            break;
        case 5:
            color = "#9b59b6"; // Фиолетовый
            status = "Опасно";
            icon = "😷";
            break;
        default:
            color = "#fff";
            status = "--";
            icon = "🍃";
    }

    valEl.innerText = `${index} (${status})`;
    valEl.style.color = color;
    icoEl.innerText = icon;
    icoEl.style.color = color;
    icoEl.style.textShadow = `0 0 8px ${color}66`;
}

/**
 * Функция для всплывающих подсказок (Labels)
 */
function toggleLabel(element) {
    if (!element) return;
    const isShown = element.classList.contains('show-text');

    document.querySelectorAll('.w-item').forEach(item => {
        item.classList.remove('show-text');
    });

    if (!isShown) {
        element.classList.add('show-text');
        
        const label = element.querySelector('.w-label');
        if (label) {
            const itemRect = element.getBoundingClientRect();
            const screenCenterX = window.innerWidth / 2;
            const offset = screenCenterX - (itemRect.left + itemRect.width / 2);
            label.style.left = `calc(50% + ${offset}px)`;
        }

        setTimeout(() => {
            element.classList.remove('show-text');
        }, 3000);
    }
}

// Запуск при старте
getWeather();
