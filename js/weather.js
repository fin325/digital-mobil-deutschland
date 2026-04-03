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
            tempEl.style.cursor = 'pointer'; // Добавляем курсор-указатель, чтобы было понятно, что можно кликнуть
            tempEl.title = 'Нажмите, чтобы изменить город'; // Подсказка при наведении
            
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

function toggleWeatherScroll() {
    const scrollContainer = document.querySelector('.weather-scroll-container');

    if (scrollContainer) {
        // Вычисляем, насколько вообще можно прокрутить блок вправо
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;

        // Если ползунок находится ближе к началу (прокручено меньше половины)
        if (scrollContainer.scrollLeft < maxScrollLeft / 2) {
            // Крутим в самый конец
            scrollContainer.scrollTo({
                left: scrollContainer.scrollWidth,
                behavior: 'smooth'
            });
        } else {
            // Иначе (мы уже в конце) — крутим обратно в самое начало
            scrollContainer.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        }
    }
}


// Запускаем функцию при загрузке скрипта
getWeather();
