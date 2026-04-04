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
        
        if (pressEl) pressEl.innerText = Math.round(d.main.pressure * 0.75006);
        if (humEl)   humEl.innerText   = d.main.humidity;

    } catch (e) {
        console.error('Ошибка погоды:', e);
    }
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

// Инерционный скролл
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.weather-scroll-container');
    if (!container) return;

    let startX = 0;
    let startScrollLeft = 0;
    let velX = 0;
    let lastX = 0;
    let lastTime = 0;
    let rafId = null;
    let isDragging = false;

    container.addEventListener('touchstart', e => {
        cancelAnimationFrame(rafId);
        isDragging = true;
        startX = e.touches[0].pageX;
        startScrollLeft = container.scrollLeft;
        lastX = startX;
        lastTime = Date.now();
        velX = 0;
    }, { passive: true });

    container.addEventListener('touchmove', e => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX;
        const now = Date.now();
        const dt = now - lastTime;
        if (dt > 0) {
            velX = (lastX - x) / dt;
        }
        lastX = x;
        lastTime = now;
        container.scrollLeft = startScrollLeft + (startX - x);
    }, { passive: false });

    container.addEventListener('touchend', () => {
        isDragging = false;
        inertia();
    });

    container.addEventListener('touchcancel', () => {
        isDragging = false;
        cancelAnimationFrame(rafId);
    });

    function inertia() {
        if (Math.abs(velX) < 0.3) return;
        velX *= 0.92;
        container.scrollLeft += velX * 16;
        rafId = requestAnimationFrame(inertia);
    }
});

// Запуск при загрузке страницы
getWeather();
