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
        
        // Обновляем только числа внутри span, не трогая w-tooltip
        if (pressEl) pressEl.innerText = Math.round(d.main.pressure * 0.75006);
        if (humEl)   humEl.innerText   = d.main.humidity;

    } catch (e) {
        console.error('Ошибка погоды:', e);
    }
}

/**
 * Улучшенная функция для всплывающих подсказок (Tooltips)
 */
function toggleLabel(element) {
    if (!element) return;

    // Проверяем, открыта ли уже эта подсказка
    const isShown = element.classList.contains('show-text');

    // 1. Сначала закрываем вообще все открытые подсказки на странице
    document.querySelectorAll('.w-item').forEach(item => {
        item.classList.remove('show-text');
    });

    // 2. Если подсказка была закрыта — открываем её
    if (!isShown) {
        element.classList.add('show-text');

        // 3. Автоматически скрываем подсказку через 3 секунды
        // Чтобы она не висела вечно и не мешала
        setTimeout(() => {
            element.classList.remove('show-text');
        }, 3000);
    }
}

/**
 * Функция прокрутки ленты
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
