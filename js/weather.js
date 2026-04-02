/* === weather.js — Погода OpenWeatherMap === */

const WEATHER_API_KEY = '9057c4b98fd893160015f5d4bc3696cc';

async function getWeather() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=de`
            );
            const d = await res.json();

            if (!d.main) return;

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

            if (tempEl)  tempEl.innerText  = `${city} ${icon} ${temp}°C`;
            if (pressEl) pressEl.innerText = Math.round(d.main.pressure * 0.75006);
            if (humEl)   humEl.innerText   = d.main.humidity;

        } catch (e) {
            console.error('Ошибка погоды:', e);
        }
    });
}
