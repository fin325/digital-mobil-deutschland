/* === weather-display.js — отображение погоды из sessionStorage === */
/* === С fallback: при пустом кэше делает запросы к /api/*       === */

(function() {
    const isRu = document.documentElement.lang === 'ru';

    // ── Направление ветра ──────────────────────────────────
    function windDirection(deg) {
        const dirs = ['↑N','↗NE','→E','↘SE','↓S','↙SW','←W','↖NW'];
        return dirs[Math.round(deg / 45) % 8];
    }

    // ── Фаза луны ──────────────────────────────────────────
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

    function formatTime(unixTs) {
        const d = new Date(unixTs * 1000);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    // ── Применить данные погоды ────────────────────────────
    function displayWeather(d) {
        const temp = Math.round(d.main.temp);
        const city = d.name;
        const code = d.weather[0].id;

        let iconClass = 'icon-cloud';
        if (code === 800)     iconClass = 'icon-2600';
        else if (code > 800)  iconClass = 'icon-2601';
        else if (code >= 600) iconClass = 'icon-2744';
        else if (code >= 300) iconClass = 'icon-1f327';

        const tempEl = document.getElementById('city-temp');
        if (tempEl) {
            tempEl.innerHTML = `${city} <span class="icon-emoji ${iconClass}"></span> ${temp}°C`;
        }

        const pressEl = document.getElementById('press');
        if (pressEl) {
            pressEl.innerText = isRu
                ? Math.round(d.main.pressure * 0.75006)
                : Math.round(d.main.pressure);
        }

        const humEl = document.getElementById('hum');
        if (humEl) humEl.innerText = d.main.humidity;

        const cloudsEl = document.getElementById('clouds');
        if (cloudsEl) cloudsEl.innerText = d.clouds?.all ?? '--';

        const windEl = document.getElementById('wind');
        if (windEl && d.wind) {
            const spd = Math.round(d.wind.speed);
            const dir = windDirection(d.wind.deg ?? 0);
            windEl.innerText = `${spd} ${dir}`;
        }

        const sunriseEl = document.getElementById('sunrise');
        const sunsetEl  = document.getElementById('sunset');
        if (sunriseEl && d.sys?.sunrise) sunriseEl.innerText = formatTime(d.sys.sunrise);
        if (sunsetEl  && d.sys?.sunset)  sunsetEl.innerText  = formatTime(d.sys.sunset);

        const moonEl = document.getElementById('moon-icon');
        if (moonEl) {
            const moon = getMoonPhase();
            moonEl.className = `icon-emoji ${moon.icon}`;
            moonEl.title = moon.name;
            const moonLabelEl = document.getElementById('moon-label');
            if (moonLabelEl) moonLabelEl.innerText = moon.name;
        }
    }

    // ── Применить данные качества воздуха ──────────────────
    function displayAQI(aqiIndex, components) {
        const valEl = document.getElementById('aqi-value');
        const icoEl = document.getElementById('aqi-icon');

        if (valEl && icoEl) {
            let color, iconClass;
            switch (aqiIndex) {
                case 1: color = "#2ecc71"; iconClass = "icon-1f343"; break;
                case 2: color = "#f1c40f"; iconClass = "icon-1f4a8"; break;
                case 3: color = "#e67e22"; iconClass = "icon-1f32b"; break;
                case 4: color = "#e74c3c"; iconClass = "icon-26a0";  break;
                case 5: color = "#9b59b6"; iconClass = "icon-1f637"; break;
                default: color = "#fff";   iconClass = "icon-1f343";
            }
            valEl.innerText = aqiIndex;
            valEl.style.color = color;
            icoEl.className = `icon-emoji ${iconClass}`;
            icoEl.style.filter = `drop-shadow(0 0 4px ${color})`;
        }

        if (components) {
            const no2El = document.getElementById('no2-value');
            const coEl  = document.getElementById('co-value');
            const o3El  = document.getElementById('o3-value');
            if (no2El) no2El.innerText = Math.round(components.no2);
            if (coEl)  coEl.innerText  = Math.round(components.co);
            if (o3El)  o3El.innerText  = Math.round(components.o3);
        }
    }

    // ── Применить геомагнитку ──────────────────────────────
    function displayMagnet(kp) {
        const el = document.getElementById('geo');
        if (!el) return;

        el.innerText = Math.round(kp * 10) / 10;

        let color;
        if (kp <= 2)      color = '#2ecc71';
        else if (kp <= 4) color = '#f1c40f';
        else if (kp <= 6) color = '#e67e22';
        else              color = '#e74c3c';

        el.style.color = color;
        el.style.fontWeight = 'bold';
    }

    // ── Применить курс EUR ─────────────────────────────────
    function displayEur(rate) {
        const eurEl = document.getElementById('eur-value');
        if (eurEl && rate) eurEl.textContent = rate + ' ₴';
    }

    // ── Fallback-загрузчики (если в sessionStorage пусто) ──
    async function fetchWeatherFallback() {
        const city = localStorage.getItem('userCity') || 'Hattingen';
        try {
            const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}&lang=${isRu ? 'ru' : 'de'}`);
            const d = await res.json();
            if (!d.main) return null;
            if (window.canSaveToStorage && window.canSaveToStorage()) {
                try { sessionStorage.setItem('weatherData', JSON.stringify(d)); } catch (e) {}
            }
            displayWeather(d);
            return d;
        } catch (e) {
            console.error('weather-display fallback weather error:', e);
            return null;
        }
    }

    async function fetchAqiFallback(lat, lon) {
        try {
            const res = await fetch(`/api/air?lat=${lat}&lon=${lon}`);
            const data = await res.json();
            if (!data.list || !data.list[0]) return;
            const aqiIndex   = data.list[0].main.aqi;
            const components = data.list[0].components;
            if (window.canSaveToStorage && window.canSaveToStorage()) {
                try { sessionStorage.setItem('aqiData', JSON.stringify({ aqiIndex, components })); } catch (e) {}
            }
            displayAQI(aqiIndex, components);
        } catch (e) {
            console.error('weather-display fallback aqi error:', e);
        }
    }

    async function fetchEurFallback() {
        try {
            const res = await fetch('/api/eur-rate');
            const data = await res.json();
            const rate = data.rate?.toFixed(2);
            if (rate) {
                if (window.canSaveToStorage && window.canSaveToStorage()) {
                    try { sessionStorage.setItem('eurRate', rate); } catch (e) {}
                }
                displayEur(rate);
            }
        } catch (e) {
            console.error('weather-display fallback eur error:', e);
        }
    }

    // ── Чтение из sessionStorage и отрисовка + fallback ────
    (async function init() {
        // 1. Погода
        let weatherData = null;
        try {
            const cached = sessionStorage.getItem('weatherData');
            if (cached) {
                weatherData = JSON.parse(cached);
                if (weatherData && weatherData.main) {
                    displayWeather(weatherData);
                } else {
                    weatherData = null;
                }
            }
        } catch (e) {}
        if (!weatherData) {
            weatherData = await fetchWeatherFallback();
        }

        // 2. Качество воздуха
        let aqiCached = null;
        try {
            const raw = sessionStorage.getItem('aqiData');
            if (raw) {
                aqiCached = JSON.parse(raw);
                if (aqiCached && typeof aqiCached.aqiIndex === 'number') {
                    displayAQI(aqiCached.aqiIndex, aqiCached.components);
                } else {
                    aqiCached = null;
                }
            }
        } catch (e) {}
        if (!aqiCached && weatherData?.coord) {
            await fetchAqiFallback(weatherData.coord.lat, weatherData.coord.lon);
        }

        // 3. Геомагнитка (только из кэша, без fallback)
        try {
            const magnetCached = sessionStorage.getItem('magnetData');
            if (magnetCached) {
                const { kp_index } = JSON.parse(magnetCached);
                if (typeof kp_index === 'number') displayMagnet(kp_index);
            }
        } catch (e) {}

        // 4. Курс EUR
        let eurCached = null;
        try {
            eurCached = sessionStorage.getItem('eurRate');
            if (eurCached) displayEur(eurCached);
        } catch (e) {}
        if (!eurCached) {
            await fetchEurFallback();
        }
    })();

    // ── UI: тогл меток ─────────────────────────────────────
    window.toggleLabel = function(element) {
        if (!element) return;
        const isShown = element.classList.contains('show-text');
        document.querySelectorAll('.w-item').forEach(item => item.classList.remove('show-text'));

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

            setTimeout(() => element.classList.remove('show-text'), 3000);
        }
    };

    window.toggleWeatherScroll = function() {
        const scrollContainer = document.querySelector('.weather-scroll-container');
        if (scrollContainer) {
            const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            scrollContainer.scrollTo({
                left: scrollContainer.scrollLeft < maxScrollLeft / 2
                    ? scrollContainer.scrollWidth : 0,
                behavior: 'smooth'
            });
        }
    };
})();
