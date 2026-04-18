/* === weather.js — Wetter OpenWeatherMap + Luftqualität === */

const WEATHER_API_KEY = '9057c4b98fd893160015f5d4bc3696cc';
let currentCity = localStorage.getItem('userCity') || 'Hattingen';

const CACHE_TTL = 10 * 60 * 1000; // 10 Minuten

const isRu = document.documentElement.lang === 'ru';

async function getWeather() {
    try {
        const cached = localStorage.getItem('weatherCache');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_TTL && parsed.city === currentCity) {
                applyWeatherData(parsed.data);
                return;
            }
        }
    } catch (e) {}

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${WEATHER_API_KEY}&units=metric&lang=de`
        );
        const d = await res.json();

        if (!d.main) {
            console.error(isRu ? 'Город не найден:' : 'Stadt nicht gefunden:', d.message);
            return;
        }

        try {
            localStorage.setItem('weatherCache', JSON.stringify({
                data: d,
                timestamp: Date.now(),
                city: currentCity
            }));
        } catch (e) {}

        applyWeatherData(d);

    } catch (e) {
        console.error(isRu ? 'Ошибка погоды:' : 'Wetter-Fehler:', e);
    }
}

function applyWeatherData(d) {
    try {
        const temp = Math.round(d.main.temp);
        const city = d.name;
        const code = d.weather[0].id;
        const lat  = d.coord.lat;
        const lon  = d.coord.lon;

        if (currentCity !== city) {
            currentCity = city;
            localStorage.setItem('userCity', city);
        }

        let iconClass = 'icon-cloud';
        if (code === 800)     iconClass = 'icon-2600';
        else if (code > 800)  iconClass = 'icon-2601';
        else if (code >= 600) iconClass = 'icon-2744';
        else if (code >= 300) iconClass = 'icon-1f327';

        const tempEl  = document.getElementById('city-temp');
        const pressEl = document.getElementById('press');
        const humEl   = document.getElementById('hum');

        if (tempEl) {
            tempEl.innerHTML = `${city} <span class="icon-emoji ${iconClass}"></span> ${temp}°C`;
            tempEl.onclick = (e) => {
                e.stopPropagation();

                const promptMsg = isRu
                    ? 'Пожалуйста, введите название города:'
                    : 'Bitte den Namen der Stadt eingeben:';

                const newCity = prompt(promptMsg, currentCity);
                if (newCity && newCity.trim() !== '') {
                    currentCity = newCity.trim();
                    localStorage.setItem('userCity', currentCity);

                    localStorage.removeItem('weatherCache');
                    localStorage.removeItem('aqiCache');
                    getWeather();
                }
            };
        }

        if (pressEl) pressEl.innerText = Math.round(d.main.pressure * 0.75006);
        if (humEl)   humEl.innerText   = d.main.humidity;

        getAirPollution(lat, lon);

    } catch (e) {
        console.error(isRu ? 'Ошибка применения данных:' : 'Fehler beim Anwenden der Wetterdaten:', e);
    }
}

async function getAirPollution(lat, lon) {
    try {
        const cached = localStorage.getItem('aqiCache');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_TTL) {
                updateAQIUI(parsed.index);
                return;
            }
        }
    } catch (e) {}

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
        );
        const data = await res.json();
        const aqiIndex = data.list[0].main.aqi;

        try {
            localStorage.setItem('aqiCache', JSON.stringify({
                index: aqiIndex,
                timestamp: Date.now()
            }));
        } catch (e) {}

        updateAQIUI(aqiIndex);

    } catch (e) {
        console.error(isRu ? 'Ошибка качества воздуха:' : 'Fehler bei der Luftqualität:', e);
    }
}

function updateAQIUI(index) {
    const valEl = document.getElementById('aqi-value');
    const icoEl = document.getElementById('aqi-icon');

    if (!valEl || !icoEl) return;

    let color, iconClass;

    switch (index) {
        case 1: color = "#2ecc71"; iconClass = "icon-1f343";    break;
        case 2: color = "#f1c40f"; iconClass = "icon-1f4a8";    break;
        case 3: color = "#e67e22"; iconClass = "icon-1f32b";     break;
        case 4: color = "#e74c3c"; iconClass = "icon-26a0"; break;
        case 5: color = "#9b59b6"; iconClass = "icon-1f637";    break;
        default: color = "#fff";   iconClass = "icon-1f343";
    }

    valEl.innerText = index;
    valEl.style.color = color;

    // Меняем className напрямую — без innerHTML и вложенных span
    icoEl.className = `icon-emoji ${iconClass}`;
    icoEl.style.filter = `drop-shadow(0 0 4px ${color})`;
}

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

// Start
getWeather();
