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
            // Важно: если внутри city-temp есть w-label, innerText его сотрет.
            // Поэтому обновляем текст аккуратно, если нужно сохранить структуру.
            tempEl.innerHTML = `<span class="w-label">Нажмите для смены города</span> ${city} ${icon} ${temp}°C`;
            
            tempEl.onclick = (e) => {
                // Если кликнули именно для смены города (двойной клик или логика API)
                // Но так как у нас toggleLabel на всех айтемах, добавим проверку:
                if (e.detail === 2) { // Смена города по двойному клику
                    const newCity = prompt('Введите название города:', currentCity);
                    if (newCity && newCity.trim() !== '') {
                        currentCity = newCity.trim();
                        getWeather();
                    }
                } else {
                    toggleLabel(tempEl);
                }
            };
        }
        
        // 2. Обновляем только числовые значения
        if (pressEl) pressEl.innerText = Math.round(d.main.pressure * 0.75006);
        if (humEl)   humEl.innerText   = d.main.humidity;

    } catch (e) {
        console.error('Ошибка погоды:', e);
    }
}

/**
 * Улучшенная функция показа подсказки на уровне текста
 */
function toggleLabel(element) {
    if (!element) return;

    // Проверяем, открыта ли подсказка уже
    const isAlreadyShown = element.classList.contains('show-text');

    // 1. Сначала убираем класс show-text у ВСЕХ элементов (чтобы подсказки не накладывались)
    document.querySelectorAll('.w-item').forEach(item => {
        item.classList.remove('show-text');
    });

    // 2. Если подсказка не была открыта — открываем её
    if (!isAlreadyShown) {
        element.classList.add('show-text');

        // 3. Авто-скрытие через 2.5 секунды, чтобы текст вернулся
        setTimeout(() => {
            element.classList.remove('show-text');
        }, 2500);
    }
}

/**
 * Функция прокрутки ленты
 */
function toggleWeatherScroll() {
    const scrollContainer = document.querySelector('.weather-scroll-container');
    if (scrollContainer) {
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const currentScroll = scrollContainer.scrollLeft;

        if (currentScroll < maxScrollLeft / 2) {
            scrollContainer.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
        } else {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }
}

// Запуск
getWeather();
