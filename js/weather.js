/* === weather.js — Погода OpenWeatherMap + Качество воздуха === */

const WEATHER_API_KEY = '9057c4b98fd893160015f5d4bc3696cc';
let currentCity = 'Hattingen'; 

async function getWeather() {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${WEATHER_API_KEY}&units=metric&lang=de`
        );
        const d = await res.json();

        if (!d.main) {
            console.error('Город не найден:', d.message);
            return;
        }

        const temp = Math.round(d.main.temp);
        const city = d.name;
        const code = d.weather[0].id;
        
        // ДОБАВЛЕНО: Сохраняем координаты для запроса качества воздуха
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
            tempEl.onclick = (e) => {
                e.stopPropagation();
                const newCity = prompt('Введите название города:', currentCity);
                if (newCity && newCity.trim() !== '') {
                    currentCity = newCity.trim();
                    getWeather();
                }
            };
        }
        
        if (pressEl) pressEl.innerText = Math.round(d.main.pressure * 0.75006);
        if (humEl)   humEl.innerText   = d.main.humidity;

        // ДОБАВЛЕНО: Запускаем проверку воздуха по полученным координатам
        getAirPollution(lat, lon);

    } catch (e) {
        console.error('Ошибка погоды:', e);
    }
}

/* === ДОБАВЛЕННЫЕ ФУНКЦИИ ДЛЯ ВОЗДУХА === */
async function getAirPollution(lat, lon) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
        );
        const data = await res.json();
        
        const aqiIndex = data.list[0].main.aqi;
        updateAQIUI(aqiIndex);
    } catch (e) {
        console.error('Ошибка качества воздуха:', e);
    }
}

function updateAQIUI(index) {
    const valEl  = document.getElementById('aqi-value');
    const icoEl  = document.getElementById('aqi-icon');

    if (!valEl || !icoEl) return;

    let color, status, icon;

    switch (index) {
        case 1: color = "#2ecc71"; status = "Отлично"; icon = "🍃"; break;
        case 2: color = "#f1c40f"; status = "Терпимо"; icon = "💨"; break;
        case 3: color = "#e67e22"; status = "Средне";  icon = "🌫️"; break;
        case 4: color = "#e74c3c"; status = "Вредно";  icon = "⚠️"; break;
        case 5: color = "#9b59b6"; status = "Опасно";  icon = "😷"; break;
        default: color = "#fff"; status = "--"; icon = "🍃";
    }

    valEl.innerText = index;
    valEl.style.color = color;
    icoEl.innerText = icon;
    icoEl.style.color = color;
    icoEl.style.textShadow = `0 0 8px ${color}66`;
}
/* ======================================= */

// НИЖЕ — ТВОЙ ОРИГИНАЛЬНЫЙ КОД БЕЗ ИЗМЕНЕНИЙ

function toggleLabel(element) {
    if (!element) return;

    const isShown = element.classList.contains('show-text');

    document.querySelectorAll('.w-item').forEach(item => {
        item.classList.remove('show-text');
    });

    if (!isShown) {
        element.classList.add('show-text');

        // Позиционируем по центру экрана
        const label = element.querySelector('.w-label');
        if (label) {
            const itemRect = element.getBoundingClientRect();
            const screenCenterX = window.innerWidth / 2;
            const offset = screenCenterX - (itemRect.left + itemRect.width / 2);
            label.style.left = `calc(50% + ${offset}px)`;
        }

        // Скрываем подсказку при скролле погоды
        const scrollContainer = document.querySelector('.weather-scroll-container');
        if (scrollContainer) {
            const hideOnScroll = () => {
                element.classList.remove('show-text');
                scrollContainer.removeEventListener('scroll', hideOnScroll);
            };
            scrollContainer.addEventListener('scroll', hideOnScroll, { once: true });
        }

        setTimeout(() => {
            if (element.classList.contains('show-text')) {
                element.classList.remove('show-text');
            }
        }, 3000);
    }
}

function toggleWeatherScroll() {
    const scrollContainer = document.querySelector('.weather-scroll-container');
    if (scrollContainer) {
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        if (scrollContainer.scrollLeft < maxScrollLeft / 2) {
            scrollContainer.scrollTo({ left: scrollContainer.scrollWidth, behavior: 'smooth' });
        } else {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }
}

// Запуск при загрузке страницы
getWeather();