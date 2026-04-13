/* === weather.js — Wetter OpenWeatherMap + Luftqualität === */

const WEATHER_API_KEY = '9057c4b98fd893160015f5d4bc3696cc';
let currentCity = localStorage.getItem('userCity') || 'Hattingen';

const CACHE_TTL = 10 * 60 * 1000; // 10 Minuten

// Determine the page language once for the entire file
const isRu = document.documentElement.lang === 'ru';

async function getWeather() {
    try {
        // Check the cache
        const cached = localStorage.getItem('weatherCache');
        if (cached) {
            const parsed = JSON.parse(cached);
            if (Date.now() - parsed.timestamp < CACHE_TTL && parsed.city === currentCity) {
                applyWeatherData(parsed.data);
                return;
            }
        }
    } catch (e) {}

    // API-Anfrage
    try {
        // CHANGE HERE: Always request the weather in German (lang=de),
        // so OpenWeatherMap automatically translates entered city names (e.g., Munich -> München)
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
        const city = d.name; // name API (Deutsch)
        const code = d.weather[0].id;
        const lat  = d.coord.lat;
        const lon  = d.coord.lon;

        // CHANGE HERE: If the user entered the city in Russian or in lowercase,
        // we store the properly formatted German name returned by the server!
        if (currentCity !== city) {
            currentCity = city;
            localStorage.setItem('userCity', city);
        }

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
                
                // Translation of the city input box
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

    let color, icon;

    switch (index) {
        case 1: color = "#2ecc71"; icon = "🍃"; break;
        case 2: color = "#f1c40f"; icon = "💨"; break;
        case 3: color = "#e67e22"; icon = "🌫️"; break;
        case 4: color = "#e74c3c"; icon = "⚠️"; break;
        case 5: color = "#9b59b6"; icon = "😷"; break;
        default: color = "#fff";   icon = "🍃";
    }

    valEl.innerText = index;
    valEl.style.color = color;
    icoEl.innerText = icon;
    icoEl.style.color = color;
    icoEl.style.textShadow = `0 0 8px ${color}66`;
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
