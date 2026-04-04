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
            tempEl.style.cursor = 'pointer';
            tempEl.title = ''; // убираем стандартный браузерный tooltip

            // Кастомный tooltip на уровне строки погоды
            let tooltip = document.getElementById('weather-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'weather-tooltip';
                tooltip.innerText = 'Нажмите, чтобы изменить город';
                document.querySelector('.top-bar').appendChild(tooltip);
            }

            tempEl.onmouseenter = () => tooltip.style.opacity = '1';
            tempEl.onmouseleave = () => tooltip.style.opacity = '0';

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
