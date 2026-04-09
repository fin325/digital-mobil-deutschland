
class AppHeader extends HTMLElement {
    connectedCallback() {
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
                    <div class="site-title">Digital & Mobil in Deutschland</div>
                    <div class="site-subtitle">Stadt Hattingen</div>
                </div>
        `;
    }
}
// Регистрируем компонент шапки
customElements.define('app-header', AppHeader);


// 2. Компонент подсказки для свайпа (Указатель и стрелки)
class ScrollHint extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="scroll-hint-container">
                <div class="scroll-hint-left">
                    <div class="swipe-finger-wrapper">
                        <div class="swipe-finger">👇🏼</div>
                    </div>
                    <span class="scroll-hint-text">Свайп меню</span>
                </div>
                <div class="scroll-arrows">
                    <button class="arrow-btn" onclick="scrollTabs(-1)">←</button>
                    <button class="arrow-btn" onclick="scrollTabs(1)">→</button>
                </div>
            </div>
        `;
    }
}
// ВАЖНО: Регистрируем компонент подсказки (именно этой строчки не хватало!)
customElements.define('scroll-hint', ScrollHint);