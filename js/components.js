class AppHeader extends HTMLElement {
    connectedCallback() {
        const isRu = document.documentElement.lang === 'ru';
const langLabel = isRu ? '🇷🇺 → 🇩🇪' : '🇩🇪 → 🇷🇺';

// Определяем текущий файл
const path = window.location.pathname;
const filename = path.split('/').pop() || 'index.html';

let langHref;
if (isRu) {
    // ru/magnet.html → /tabs/magnet.html, ru/index.html → /
    if (filename === 'index.html' || filename === '') {
        langHref = '/';
    } else {
        langHref = '/tabs/' + filename;
    }
} else {
    // /tabs/magnet.html → /ru/magnet.html, /index.html → /ru/
    if (filename === 'index.html' || filename === '' || path === '/') {
        langHref = '/ru/';
    } else {
        langHref = '/ru/' + filename;
    }
}
        
        this.innerHTML = `
            <div class="top-bar">
                <div class="top-bar-content">
                    <div class="date-time-block">
                        <span id="current-date"></span>
                        <span id="current-time"></span>
                        <span class="divider" style="position: absolute; right: 0; top: 50%; transform: translateY(-50%);">|</span>
                    </div>

                    <div class="weather-scroll-container">
                        <div class="weather-info" id="full-weather-bar">
                            <span class="w-item" id="city-temp">Laden...</span>
                            <span class="divider">|</span>
                            <span class="w-item" onclick="toggleLabel(this)">
                                💧 <span class="w-label">Влажность воздуха:</span> <span id="hum">--</span>%
                            </span>
                            <span class="divider">|</span>
                            <span class="w-item" id="aqi-item" onclick="toggleLabel(this)">
                                <span id="aqi-icon">🍃</span> 
                                <span class="w-label">Качество воздуха 5(максимум):</span> 
                                <span id="aqi-value">--</span>
                            </span>
                            <span class="divider">|</span>
                            <span class="w-item" onclick="toggleLabel(this)">
                                🧲 <span class="w-label">Геомагнитная активность:</span> <span id="geo">2</span>
                            </span>
                            <span class="divider">|</span>
                            <span class="w-item" onclick="toggleLabel(this)">
                                ⏲️ <span class="w-label">Атмосферное давление:</span> <span id="press">--</span> mmHg
                            </span>
                        </div>
                    </div>
                    <button class="weather-arrow-btn" onclick="toggleWeatherScroll()">⇄</button>
                </div> 
            </div>
            <div class="site-header">
                <div class="site-header-text">
                    <div class="site-title">Digital & Mobil in Deutschland</div>
                    <div class="site-subtitle">Stadt Hattingen</div>
                </div>
                <a href="${langHref}" class="lang-btn">${langLabel}</a>
            </div>
        `;
    }
}
customElements.define('app-header', AppHeader);


class ScrollHint extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="scroll-hint-container">
                <div class="scroll-hint-left">
                    <div class="swipe-finger-wrapper">
                        <div class="swipe-finger">👇🏼</div>
                    </div>
                    <span class="scroll-hint-text">Menü mit Wischfunktion</span>
                </div>
                <div class="scroll-arrows">
                    <button class="arrow-btn" onclick="scrollTabs(-1)">←</button>
                    <button class="arrow-btn" onclick="scrollTabs(1)">→</button>
                </div>
            </div>
        `;
    }
}
customElements.define('scroll-hint', ScrollHint);
