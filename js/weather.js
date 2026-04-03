/* === weather.js — Погода OpenWeatherMap === */

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

        let icon = '☁️';
        if (code === 800)     icon = '☀️';
        else if (code > 800)  icon = '☁️';
        else if (code >= 600) icon = '❄️';
        else if (code >= 300) icon = '🌧️';

        const tempEl  = document.getElementById('city-temp');
        const pressEl = document.getElementById('press');
        const humEl   = document.getElementById('hum');

        // Обновляем температуру и город
        if (tempEl) {
            tempEl.innerText = `${city} ${icon} ${temp}°C`;
            tempEl.onclick = () => {
                const newCity = prompt('Введите название города:', currentCity);
                if (newCity && newCity.trim() !== '') {
                    currentCity = newCity.trim();
                    getWeather();
                }
            };
        }
        
        // Обновляем только числа, чтобы не стереть иконки и скрытые подписи
        if (pressEl) pressEl.innerText = Math.round(d.main.pressure * 0.75006);
        if (humEl)   humEl.innerText   = d.main.humidity;

    } catch (e) {
        console.error('Ошибка погоды:', e);
    }
}

/**
 * Функция для показа/скрытия текстовых описаний (Влажность, Давление и т.д.)
 * Вызывается через onclick="toggleLabel(this)" в HTML
 */
function toggleLabel(element) {
    if (element) {
        element.classList.toggle('show-text');
    }
}

/**
 * Функция прокрутки всей ленты погоды в начало или конец
 */
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

// Запуск при загрузке
getWeather();
