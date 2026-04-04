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

        // 1. Обновляем город и температуру
        if (tempEl) {
            tempEl.innerText = `${city} ${icon} ${temp}°C`;
            // Убедимся, что клик по городу вызывает смену города, а не подсказку
            tempEl.onclick = (e) => {
                e.stopPropagation(); // Чтобы не срабатывали лишние события
                const newCity = prompt('Введите название города:', currentCity);
                if (newCity && newCity.trim() !== '') {
                    currentCity = newCity.trim();
                    getWeather();
                }
            };
        }
        
        // 2. Обновляем ТОЛЬКО числа (используем innerText на конкретных ID)
        // Это сохраняет в целости наши <span class="w-label"> в HTML
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

    // Проверяем, показана ли подсказка сейчас
    const isShown = element.classList.contains('show-text');

    // 1. Закрываем все открытые подсказки на странице
    document.querySelectorAll('.w-item').forEach(item => {
        item.classList.remove('show-text');
    });

    // 2. Если была скрыта — открываем
    if (!isShown) {
        element.classList.add('show-text');

        // 3. Автоматически скрываем через 3 секунды
        // Используем проверку, чтобы не закрыть то, что уже закрыто вручную
        setTimeout(() => {
            if (element.classList.contains('show-text')) {
                element.classList.remove('show-text');
            }
        }, 3000);
    }
}

/**
 * Функция прокрутки ленты погоды
 */
function toggleWeatherScroll() {
    const scrollContainer = document.querySelector('.weather-scroll-container');
    if (scrollContainer) {
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        // Если прокручено меньше половины — в конец, иначе — в начало
        if (scrollContainer.scrollLeft < maxScrollLeft / 2) {
            scrollContainer.scrollTo({ left: scrollContainer.scrollWidth, behavior: 'smooth' });
        } else {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }
}

// Запуск при загрузке страницы
getWeather();
