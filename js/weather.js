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

        // Обновляем город и температуру
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
        
        // Обновляем числа
        if (pressEl) pressEl.innerText = Math.round(d.main.pressure * 0.75006);
        if (humEl)   humEl.innerText   = d.main.humidity;

    } catch (e) {
        console.error('Ошибка погоды:', e);
    }
}

/**
 * ГЛОБАЛЬНАЯ ПОДСКАЗКА (Идеальное решение проблемы обрезки)
 */
function toggleLabel(element) {
    if (!element) return;

    // Ищем текст внутри HTML, который нужно показать
    const labelSpan = element.querySelector('.w-label');
    if (!labelSpan) return;

    // Создаем глобальное облачко, если его еще нет на странице
    let globalTip = document.getElementById('global-weather-tooltip');
    if (!globalTip) {
        globalTip = document.createElement('div');
        globalTip.id = 'global-weather-tooltip';
        globalTip.className = 'w-label-global';
        document.body.appendChild(globalTip);
        
        // Как только начинаем скроллить погоду — прячем подсказку
        const scrollContainer = document.querySelector('.weather-scroll-container');
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', () => {
                globalTip.style.display = 'none';
                document.querySelectorAll('.w-item').forEach(i => i.classList.remove('show-text'));
            });
        }
    }

    // Если кликнули на ту же иконку — просто закрываем
    if (element.classList.contains('show-text')) {
        element.classList.remove('show-text');
        globalTip.style.display = 'none';
        return;
    }

    // Сбрасываем эффекты у других иконок
    document.querySelectorAll('.w-item').forEach(item => item.classList.remove('show-text'));
    element.classList.add('show-text');

    // Передаем текст в глобальную подсказку и показываем её
    globalTip.innerHTML = labelSpan.innerHTML;
    globalTip.style.display = 'block';

    // ВЫЧИСЛЯЕМ ИДЕАЛЬНУЮ ПОЗИЦИЮ (поверх всего экрана)
    const rect = element.getBoundingClientRect();
    globalTip.style.top = (rect.bottom + 10) + 'px'; // Чуть ниже иконки
    
    // Выравниваем по левому краю, но защищаем от обрезки справа
    let leftPos = rect.left;
    if (leftPos + globalTip.offsetWidth > window.innerWidth) {
        leftPos = window.innerWidth - globalTip.offsetWidth - 10;
    }
    globalTip.style.left = leftPos + 'px';

    // Автоскрытие через 3 секунды
    clearTimeout(window.weatherTooltipTimeout);
    window.weatherTooltipTimeout = setTimeout(() => {
        element.classList.remove('show-text');
        globalTip.style.display = 'none';
    }, 3000);
}

/**
 * Функция прокрутки
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
