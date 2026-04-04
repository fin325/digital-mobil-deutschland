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
            tempEl.onclick = (e) => {
                e.stopPropagation(); 
                const newCity = prompt('Введите название города:', currentCity);
                if (newCity && newCity.trim() !== '') {
                    currentCity = newCity.trim();
                    getWeather();
                }
            };
        }
        
        // 2. Обновляем числа
        if (pressEl) pressEl.innerText = Math.round(d.main.pressure * 0.75006);
        if (humEl)   humEl.innerText   = d.main.humidity;

    } catch (e) {
        console.error('Ошибка погоды:', e);
    }
}

/**
 * УМНАЯ ФУНКЦИЯ ПОДСКАЗОК (Решает проблему обрезки!)
 */
function toggleLabel(element) {
    if (!element) return;

    const isShown = element.classList.contains('show-text');

    // 1. Закрываем все открытые подсказки и стираем старые позиции
    document.querySelectorAll('.w-item').forEach(item => {
        item.classList.remove('show-text', 'tip-left', 'tip-right', 'tip-center');
    });

    // 2. Если была скрыта — открываем
    if (!isShown) {
        // УЗНАЕМ ГДЕ ИКОНКА (чтобы подсказка не обрезалась)
        const rect = element.getBoundingClientRect();
        const windowWidth = window.innerWidth;

        if (rect.left < 100) {
            element.classList.add('tip-left');   // Если слева -> открываем вправо
        } else if (rect.right > windowWidth - 100) {
            element.classList.add('tip-right');  // Если справа -> открываем влево
        } else {
            element.classList.add('tip-center'); // Если в центре -> открываем по центру
        }

        element.classList.add('show-text');

        // 3. Автоматически скрываем через 3 секунды
        setTimeout(() => {
            if (element.classList.contains('show-text')) {
                element.classList.remove('show-text', 'tip-left', 'tip-right', 'tip-center');
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
        
        if (scrollContainer.scrollLeft < maxScrollLeft / 2) {
            scrollContainer.scrollTo({ left: scrollContainer.scrollWidth, behavior: 'smooth' });
        } else {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }
}

// Запуск при загрузке страницы
getWeather();
