/* === weather.js — Wetter über eigenen Proxy + Luftqualität === */

let currentCity = localStorage.getItem('userCity') || 'Hattingen';

const isRu = document.documentElement.lang === 'ru';

const weatherMessages = {
    cityPrompt: isRu ? 'Пожалуйста, введите название города:' : 'Bitte den Namen der Stadt eingeben:',
    errorCity:   isRu ? 'Город не найден:'           : 'Stadt nicht gefunden:',
    errorWeather: isRu ? 'Ошибка погоды:'            : 'Wetter-Fehler:',
    errorApply:   isRu ? 'Ошибка применения данных:' : 'Fehler beim Anwenden der Wetterdaten:',
    errorAir:     isRu ? 'Ошибка качества воздуха:'  : 'Fehler bei der Luftqualität:'
};

// ── Направление ветра ──────────────────────────────────────────
function windDirection(deg) {
    const dirs = ['↑N','↗NE','→E','↘SE','↓S','↙SW','←W','↖NW'];
    return dirs[Math.round(deg / 45) % 8];
}

// ── Фаза луны (локальный расчёт, синодический цикл 29.53 дня) ──
function getMoonPhase() {
    const known = new Date(Date.UTC(2000, 0, 6, 18, 14));
    const cycle = 29.530588853;
    const now   = new Date();
    const diff  = (now - known) / (1000 * 60 * 60 * 24);
    const phase = ((diff % cycle) + cycle) % cycle;

    if (phase < 1.85)  return { name: isRu ? 'Новолуние'           : 'Neumond',            icon: 'icon-1f311' };
    if (phase < 5.54)  return { name: isRu ? 'Молодой серп'        : 'Zunehmende Sichel',  icon: 'icon-1f312' };
    if (phase < 9.22)  return { name: isRu ? 'Первая четверть'     : 'Erstes Viertel',     icon: 'icon-1f313' };
    if (phase < 12.91) return { name: isRu ? 'Прибывающая луна'    : 'Zunehmender Mond',   icon: 'icon-1f314' };
    if (phase < 16.61) return { name: isRu ? 'Полнолуние'          : 'Vollmond',           icon: 'icon-1f315' };
    if (phase < 20.30) return { name: isRu ? 'Убывающая луна'      : 'Abnehmender Mond',   icon: 'icon-1f316' };
    if (phase < 23.99) return { name: isRu ? 'Последняя четверть'  : 'Letztes Viertel',    icon: 'icon-1f317' };
    if (phase < 27.68) return { name: isRu ? 'Старый серп'         : 'Abnehmende Sichel',  icon: 'icon-1f318' };
    return               { name: isRu ? 'Новолуние'                : 'Neumond',            icon: 'icon-1f311' };
}

// ── Форматирование Unix timestamp → "HH:MM" ────────────────────
function formatTime(unixTs) {
    const d = new Date(unixTs * 1000);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
}

// ── Основной запрос погоды через собственный прокси ────────────
async function getWeather() {
    try {
        const res = await fetch(
            `/api/weather?city=${encodeURIComponent(currentCity)}&lang=${isRu ? 'ru' : 'de'}`
        );
        const d = await res.json();

        if (!d.main) {
            console.error(weatherMessages.errorCity, d.message);
            return;
        }

        applyWeatherData(d);

    } catch (e) {
        console.error(weatherMessages.errorWeather, e);
    }
}

function applyWeatherData(d) {
    try {
        const temp  = Math.round(d.main.temp);
        const city  = d.name;
        const code  = d.weather[0].id;
        const lat   = d.coord.lat;
        const lon   = d.coord.lon;

        if (currentCity !== city) {
            currentCity = city;
            localStorage.setItem('userCity', city);
        }

        // Иконка погоды
        let iconClass = 'icon-cloud';
        if (code === 800)     iconClass = 'icon-2600';
        else if (code > 800)  iconClass = 'icon-2601';
        else if (code >= 600) iconClass = 'icon-2744';
        else if (code >= 300) iconClass = 'icon-1f327';

        // 1. Температура
        const tempEl = document.getElementById('city-temp');
        if (tempEl) {
            tempEl.innerHTML = `${city} <span class="icon-emoji ${iconClass}"></span> ${temp}°C`;
            tempEl.onclick = (e) => {
                e.stopPropagation();
                const newCity = prompt(weatherMessages.cityPrompt, currentCity);
                if (newCity && newCity.trim() !== '') {
                    currentCity = newCity.trim();
                    localStorage.setItem('userCity', currentCity);
                    getWeather();
                }
            };
        }

        // 2. Давление
        const pressEl = document.getElementById('press');
        if (pressEl) {
            pressEl.innerText = isRu
                ? Math.round(d.main.pressure * 0.75006)
                : Math.round(d.main.pressure);
        }

        // 3. Влажность
        const humEl = document.getElementById('hum');
        if (humEl) humEl.innerText = d.main.humidity;

        // 4. Облачность
        const cloudsEl = document.getElementById('clouds');
        if (cloudsEl) cloudsEl.innerText = d.clouds?.all ?? '--';

        // 5. Ветер
        const windEl = document.getElementById('wind');
        if (windEl && d.wind) {
            const spd = Math.round(d.wind.speed);
            const dir = windDirection(d.wind.deg ?? 0);
            windEl.innerText = `${spd} ${dir}`;
        }

        // 6. Восход / Закат
        const sunriseEl = document.getElementById('sunrise');
        const sunsetEl  = document.getElementById('sunset');
        if (sunriseEl && d.sys?.sunrise) sunriseEl.innerText = formatTime(d.sys.sunrise);
        if (sunsetEl  && d.sys?.sunset)  sunsetEl.innerText  = formatTime(d.sys.sunset);

        // 7. Фаза луны
        const moonEl = document.getElementById('moon-icon');
        if (moonEl) {
            const moon = getMoonPhase();
            moonEl.className   = `icon-emoji ${moon.icon}`;
            moonEl.title       = moon.name;
            const moonLabelEl = document.getElementById('moon-label');
            if (moonLabelEl) moonLabelEl.innerText = moon.name;
        }

        getAirPollution(lat, lon);

    } catch (e) {
        console.error(weatherMessages.errorApply, e);
    }
}

// ── Качество воздуха через собственный прокси ──────────────────
async function getAirPollution(lat, lon) {
    try {
        const res  = await fetch(`/api/air?lat=${lat}&lon=${lon}`);
        const data = await res.json();

        if (!data.list || !data.list[0]) {
            console.error(weatherMessages.errorAir, data);
            return;
        }

        const aqiIndex   = data.list[0].main.aqi;
        const components = data.list[0].components;

        updateAQIUI(aqiIndex, components);

    } catch (e) {
        console.error(weatherMessages.errorAir, e);
    }
}

function updateAQIUI(index, components) {
    const valEl = document.getElementById('aqi-value');
    const icoEl = document.getElementById('aqi-icon');

    if (valEl && icoEl) {
        let color, iconClass;
        switch (index) {
            case 1: color = "#2ecc71"; iconClass = "icon-1f343"; break;
            case 2: color = "#f1c40f"; iconClass = "icon-1f4a8"; break;
            case 3: color = "#e67e22"; iconClass = "icon-1f32b"; break;
            case 4: color = "#e74c3c"; iconClass = "icon-26a0";  break;
            case 5: color = "#9b59b6"; iconClass = "icon-1f637"; break;
            default: color = "#fff";   iconClass = "icon-1f343";
        }
        valEl.innerText     = index;
        valEl.style.color   = color;
        icoEl.className     = `icon-emoji ${iconClass}`;
        icoEl.style.filter  = `drop-shadow(0 0 4px ${color})`;
    }

    if (!components) return;

    const no2El = document.getElementById('no2-value');
    const coEl  = document.getElementById('co-value');
    const o3El  = document.getElementById('o3-value');

    if (no2El) no2El.innerText = Math.round(components.no2);
    if (coEl)  coEl.innerText  = Math.round(components.co);
    if (o3El)  o3El.innerText  = Math.round(components.o3);
}

// ── UI: скролл и тогл меток ────────────────────────────────────
function toggleLabel(element) {
    if (!element) return;
    const isShown = element.classList.contains('show-text');
    document.querySelectorAll('.w-item').forEach(item => item.classList.remove('show-text'));

    if (!isShown) {
        element.classList.add('show-text');
        const label = element.querySelector('.w-label');
        if (label) {
            const itemRect     = element.getBoundingClientRect();
            const screenCenterX = window.innerWidth / 2;
            const offset       = screenCenterX - (itemRect.left + itemRect.width / 2);
            label.style.left   = `calc(50% + ${offset}px)`;
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
            element.classList.remove('show-text');
        }, 3000);
    }
}

function toggleWeatherScroll() {
    const scrollContainer = document.querySelector('.weather-scroll-container');
    if (scrollContainer) {
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        scrollContainer.scrollTo({
            left: scrollContainer.scrollLeft < maxScrollLeft / 2
                ? scrollContainer.scrollWidth : 0,
            behavior: 'smooth'
        });
    }
}

getWeather();
