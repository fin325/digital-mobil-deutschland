class AppHeader extends HTMLElement {
    connectedCallback() {
        const isRu = document.documentElement.lang === 'ru';
        const langLabel = isRu 
            ? '<span class="icon-emoji icon-1f1f7-1f1fa"></span> → <span class="icon-emoji icon-1f1e9-1f1ea"></span>' 
            : '<span class="icon-emoji icon-1f1e9-1f1ea"></span> → <span class="icon-emoji icon-1f1f7-1f1fa"></span>';

        const texts = {
            loading:   isRu ? 'Загрузка...'                   : 'Laden...',
            humidity:  isRu ? 'Влажность воздуха'             : 'Luftfeuchtigkeit',
            aqi:       isRu ? 'Качество воздуха (1-отлично)'  : 'Luftqualität (1 – sehr gut)',
            geo:       isRu ? 'Геомагнитная активность (1-спокойно)' : 'Geomagnetik (1-ruhig)',
            pressure:  isRu ? 'Атмосферное давление'          : 'Luftdruck',
            unitPress: isRu ? ' мм рт.ст.'                    : ' hPa',
            city:      isRu ? 'Город Хаттинген'               : 'Stadt Hattingen',
            clouds:    isRu ? 'Облачность'                    : 'Bewölkung',
            wind:      isRu ? 'Ветер (м/с)'                   : 'Wind (m/s)',
            sunrise:   isRu ? 'Восход'                         : 'Sonnenaufgang',
            sunset:    isRu ? 'Закат'                          : 'Sonnenuntergang',
            moon:      isRu ? 'Фаза луны'                     : 'Mondphase',
            no2:       isRu ? 'NO₂ (μg/m³)'                   : 'NO₂ (μg/m³)',
            co:        isRu ? 'CO (μg/m³)'                    : 'CO (μg/m³)',
            o3:        isRu ? 'O₃ (μg/m³)'                    : 'O₃ (μg/m³)',
        };

        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';

        let langHref;
        if (isRu) {
            if (filename === 'index.html' || filename === '') {
                langHref = '/';
            } else {
                langHref = '/tabs/' + filename;
            }
        } else {
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

                            <span class="w-item" id="city-temp">${texts.loading}</span>
                            <span class="divider">|</span>

                            <span class="w-item" onclick="toggleLabel(this)">
                                <span class="icon-emoji icon-1f4a7"></span>
                                <span class="w-label">${texts.humidity}</span>
                                <span id="hum">--</span>%
                            </span>
                            <span class="divider">|</span>

                            <span class="w-item" id="aqi-item" onclick="toggleLabel(this)">
                                <span id="aqi-icon" class="icon-emoji icon-1f343"></span>
                                <span class="w-label">${texts.aqi}</span>
                                <span id="aqi-value">--</span>
                            </span>
                            <span class="divider">|</span>

                            <span class="w-item" onclick="toggleLabel(this)">
                                <span class="icon-emoji icon-1f9f2"></span>
                                <span class="w-label">${texts.geo}</span>
                                <span id="geo">2</span>
                            </span>
                            <span class="divider">|</span>

                            <span class="w-item" onclick="toggleLabel(this)">
                                <span class="icon-emoji icon-23f2"></span>
                                <span class="w-label">${texts.pressure}</span>
                                <span id="press">--</span>${texts.unitPress}
                            </span>
                            <span class="divider">|</span>

                            <span class="w-item" onclick="toggleLabel(this)">
                                <span class="icon-emoji icon-2601"></span>
                                <span class="w-label">${texts.clouds}</span>
                                <span id="clouds">--</span>%
                            </span>
                            <span class="divider">|</span>

                            <span class="w-item" onclick="toggleLabel(this)">
                                <span class="icon-emoji icon-1f32c"></span>
                                <span class="w-label">${texts.wind}</span>
                                <span id="wind">--</span>
                            </span>
                            <span class="divider">|</span>

                            <span class="w-item" onclick="toggleLabel(this)">
                                <span class="icon-emoji icon-1f305"></span>
                                <span class="w-label">${texts.sunrise}</span>
                                <span id="sunrise">--:--</span>
                            </span>
                            <span class="divider">|</span>

                            <span class="w-item" onclick="toggleLabel(this)">
                                <span class="icon-emoji icon-1f307"></span>
                                <span class="w-label">${texts.sunset}</span>
                                <span id="sunset">--:--</span>
                            </span>
                            <span class="divider">|</span>

                            <span class="w-item" onclick="toggleLabel(this)">
                                <span id="moon-icon" class="icon-emoji icon-1f315"></span>
                                <span class="w-label">${texts.moon}: <span id="moon-label"></span></span>
                            </span>
                            <span class="divider">|</span>

                            <span class="w-item" onclick="toggleLabel(this)">
                                <span class="icon-emoji icon-1f3ed"></span>
                                <span class="w-label">${texts.no2}</span>
                                <span id="no2-value">--</span>
                            </span>
                            <span class="divider">|</span>

                            <span class="w-item" onclick="toggleLabel(this)">
                                <span class="icon-emoji icon-1f4a8"></span>
                                <span class="w-label">${texts.co}</span>
                                <span id="co-value">--</span>
                            </span>
                            <span class="divider">|</span>

                            <span class="w-item" onclick="toggleLabel(this)">
                                <span class="icon-emoji icon-1f31e"></span>
                                <span class="w-label">${texts.o3}</span>
                                <span id="o3-value">--</span>
                            </span>

                        </div>
                    </div>
                    <button class="weather-arrow-btn" onclick="toggleWeatherScroll()">⇄</button>
                </div>
            </div>
            <div class="site-header">
                <div class="site-header-text">
                    <div class="site-title">Digital & Mobil in Deutschland</div>
                    <div class="site-subtitle">${texts.city}</div>
                </div>
                <a href="${langHref}" class="lang-btn">${langLabel}</a>
            </div>
        `;
    }
}
customElements.define('app-header', AppHeader);

class ScrollHint extends HTMLElement {
    connectedCallback() {
        const isRu = document.documentElement.lang === 'ru';
        const hintText = isRu ? 'Свайп меню' : 'Swipe-Menü';

        this.innerHTML = `
            <div class="scroll-hint-container">
                <div class="scroll-hint-left">
                    <div class="swipe-finger-wrapper">
                        <div class="swipe-finger"><span class="icon-emoji icon-1f447-1f3fc"></span></div>
                    </div>
                    <span class="scroll-hint-text">${hintText}</span>
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
