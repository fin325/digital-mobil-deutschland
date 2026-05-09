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
            geo:       isRu ? 'Геомагнитная активность (0-9)' : 'Geomagnetik (1-ruhig)',
            pressure:  isRu ? 'Атмосферное давление'          : 'Luftdruck',
            unitPress: isRu ? ' мм рт.ст.'                    : ' hPa',
            city:      isRu ? 'Город Хаттинген'               : 'Stadt Hattingen',
            clouds:    isRu ? 'Облачность'                    : 'Bewölkung',
            wind:      isRu ? 'Ветер (м/с)'                   : 'Wind (m/s)',
            sunrise:   isRu ? 'Восход'                         : 'Sonnenaufgang',
            sunset:    isRu ? 'Закат'                          : 'Sonnenuntergang',
            moon:      isRu ? 'Фаза луны'                     : 'Mondphase',
            no2:       isRu ? 'NO₂-отлично до 40 (μg/m³)'                   : 'NO₂-sehr gut bis 40 (μg/m³)',
            co:        isRu ? 'CO-отлично до 4000 (μg/m³)'                    : 'CO-sehr gut bis 4000 (μg/m³)',
            o3:        isRu ? 'O₃-отлично до 100 (μg/m³)'                    : 'O₃-sehr gut bis 100 (μg/m³)',
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
                                <span class="icon-emoji icon-1f39a"></span>
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
                    <div class="site-title">
    <img src="/img/dmd-title.webp" alt="Digital & Mobil in Deutschland">
                     </div>
                    <div class="site-subtitle">${texts.city}</div>
                </div>
                <div id="eur-widget" class="eur-rate-widget" title="Офіційний курс НБУ">
        <span class="icon-1f1ea-1f1fa"></span>
        <span class="eur-label">EUR / UAH</span>
        <span class="eur-value" id="eur-value">…</span>
                </div>
                <a href="${langHref}" class="lang-btn">${langLabel}</a>
            </div>
        `;
    }
}
customElements.define('app-header', AppHeader);

// === Автоподгрузка скриптов погоды/геомагнитки в зависимости от страницы ===
(function() {
    const path = window.location.pathname;

    // Главная — это index.html в корне ('/') или в '/ru/'
    const isHomePage = (
        path === '/' ||
        path === '/index.html' ||
        path === '/ru/' ||
        path === '/ru/index.html'
    );

    // Префикс пути к скриптам:
    // - Только немецкая главная в корне → 'js/'
    // - Все остальные страницы (на 1 уровень глубже: tabs/, ru/) → '../js/'
    const isInRoot = (path === '/' || path === '/index.html');
    const prefix = isInRoot ? 'js/' : '../js/';

    function loadScript(src) {
        const s = document.createElement('script');
        s.src = src;
        s.defer = true;
        document.head.appendChild(s);
    }

    if (isHomePage) {
        loadScript(prefix + 'weather.js');
        loadScript(prefix + 'magnet.js');
        loadScript(prefix + 'eur-rate.js');
    } else {
        loadScript(prefix + 'weather-display.js');
    }
})();

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

// ====================== <legal-disclaimer> ======================
// Универсальный юридический дисклеймер для страниц с информацией
// о медицине, праве, миграционных вопросах и работе.
//
// Использование:
//   <legal-disclaimer type="medical"></legal-disclaimer>
//   <legal-disclaimer type="legal"></legal-disclaimer>
//   <legal-disclaimer type="jobs"></legal-disclaimer>
//   <legal-disclaimer type="migration"></legal-disclaimer>
//   <legal-disclaimer type="general"></legal-disclaimer>
//
// Язык определяется автоматически по <html lang="...">.

class LegalDisclaimer extends HTMLElement {
  connectedCallback() {
    const type = (this.getAttribute('type') || 'general').toLowerCase();
    const isRu = (document.documentElement.lang || 'de').toLowerCase().startsWith('ru');

    const TEXTS = {
     medical: {
        de: {
          title: 'Wichtiger medizinischer Hinweis',
          body: 'Diese Informationen ersetzen <strong>keine ärztliche Beratung</strong>. Im Notfall: <strong>112</strong> oder <strong>116 117</strong>.'
          },
         ru: {
          title: 'Важное медицинское уведомление',
          body: 'Эта информация <strong>не заменяет консультацию врача</strong>. В экстренных случаях: <strong>112</strong> или <strong>116 117</strong>.'
       }
      },
      legal: {
        de: {
          title: 'Wichtiger rechtlicher Hinweis',
          body: 'Die hier bereitgestellten Informationen zu Gesetzen, Verordnungen und Rechtslagen dienen ausschließlich Informationszwecken und stellen <strong>keine Rechtsberatung</strong> dar. Trotz sorgfältiger Recherche kann keine Gewähr für Richtigkeit, Vollständigkeit oder Aktualität übernommen werden. Für rechtsverbindliche Auskünfte wenden Sie sich bitte an eine zugelassene Rechtsanwältin/einen zugelassenen Rechtsanwalt oder die zuständige Behörde.'
        },
        ru: {
          title: 'Важное правовое уведомление',
          body: 'Информация о законах, постановлениях и правовом положении, представленная здесь, служит исключительно для информирования и <strong>не является юридической консультацией</strong>. Несмотря на тщательную проверку, мы не можем гарантировать корректность, полноту или актуальность информации. Для получения юридически обязывающих разъяснений обращайтесь к лицензированному адвокату или в компетентный орган.'
        }
      },
      migration: {
        de: {
          title: 'Wichtiger Hinweis zu Migrations- und Aufenthaltsrecht',
          body: 'Informationen zu Aufenthaltsrecht, Asyl, Einbürgerung und Migrationsverfahren ändern sich häufig und sind oft vom Einzelfall abhängig. Die hier bereitgestellten Inhalte stellen <strong>keine individuelle Rechtsberatung</strong> dar. Für Ihren konkreten Fall wenden Sie sich bitte an die zuständige Ausländerbehörde, das Bundesamt für Migration und Flüchtlinge (BAMF) oder eine Migrationsberatungsstelle (z.&nbsp;B. Caritas, Diakonie, AWO).'
        },
        ru: {
          title: 'Важное уведомление по миграционному праву',
          body: 'Информация о праве пребывания, убежище, получении гражданства и миграционных процедурах часто меняется и нередко зависит от конкретного случая. Размещённые здесь материалы <strong>не являются индивидуальной правовой консультацией</strong>. По вашему конкретному случаю обращайтесь в компетентное ведомство по делам иностранцев (Ausländerbehörde), Федеральное ведомство по делам миграции и беженцев (BAMF) или в консультационный центр для мигрантов (например, Caritas, Diakonie, AWO).'
        }
      },
      jobs: {
        de: {
          title: 'Hinweis zu Stellenangeboten',
          body: 'Die hier verlinkten Stellenbörsen und Jobangebote werden von Drittanbietern bereitgestellt. Wir haben <strong>keinen Einfluss auf die Inhalte, Aktualität oder Seriosität</strong> der dort gemachten Angaben. Für die Prüfung von Arbeitsverträgen und arbeitsrechtliche Fragen wenden Sie sich bitte an die Bundesagentur für Arbeit, eine Gewerkschaft oder eine Fachanwältin/einen Fachanwalt für Arbeitsrecht. Bei Verdacht auf unseriöse Angebote (Vorkasse, fehlende Firmendaten, unrealistische Versprechen) bitte unbedingt nicht reagieren.'
        },
        ru: {
          title: 'Уведомление о вакансиях',
          body: 'Биржи труда и вакансии, ссылки на которые приведены здесь, предоставляются сторонними провайдерами. Мы <strong>не имеем влияния на содержание, актуальность или достоверность</strong> размещённой там информации. Для проверки трудовых договоров и вопросов трудового права обращайтесь в Bundesagentur für Arbeit, профсоюз или к адвокату по трудовому праву. При подозрении на недобросовестные предложения (предоплата, отсутствие данных о компании, нереалистичные обещания) — ни в коем случае не реагируйте.'
        }
      },
      general: {
        de: {
          title: 'Hinweis',
          body: 'Die hier bereitgestellten Informationen dienen ausschließlich Informationszwecken. Trotz sorgfältiger Recherche kann keine Gewähr für Richtigkeit, Vollständigkeit oder Aktualität übernommen werden. Bei verbindlichen Fragen wenden Sie sich bitte an die zuständigen Stellen.'
        },
        ru: {
          title: 'Уведомление',
          body: 'Информация, размещённая здесь, служит исключительно для информирования. Несмотря на тщательную проверку, мы не можем гарантировать корректность, полноту или актуальность. По вопросам, требующим официальных ответов, обращайтесь в соответствующие инстанции.'
        }
      }
    };

    const set = TEXTS[type] || TEXTS.general;
    const txt = isRu ? set.ru : set.de;
    const stand = isRu ? 'Состояние информации: апрель 2026 г.' : 'Stand der Informationen: April 2026.';

    this.innerHTML = `
      <div class="legal-disclaimer" style="margin: 18px 0; padding: 14px 16px; border-radius: 10px; background: rgba(255,255,255,0.35); border-left: 3px solid #e67e22; font-size: 0.85rem; line-height: 1.55;">
        <p style="margin: 0 0 6px 0; font-weight: 700; color: #e67e22;">
          <span class="icon-emoji icon-26a0"></span> ${txt.title}
        </p>
        <p style="margin: 0 0 6px 0; opacity: 0.92;">${txt.body}</p>
        <p style="margin: 0; font-size: 0.78rem; opacity: 0.65; font-style: italic;">${stand}</p>
      </div>
    `;
  }
}

if (!customElements.get('legal-disclaimer')) {
  customElements.define('legal-disclaimer', LegalDisclaimer);
}

// ====================== <legal-footer> ======================
// Подвал с юридическими ссылками: Impressum | Datenschutz | Barrierefreiheit
// Автоматически определяет язык по <html lang="..."> и относительный путь.
//
// Использование (одинаково на любой странице):
//   <legal-footer></legal-footer>
class LegalFooter extends HTMLElement {
  connectedCallback() {
    const isRu = (document.documentElement.lang || 'de').toLowerCase().startsWith('ru');

    const path = window.location.pathname;
    const inTabs = path.includes('/tabs/');
    const inRu   = path.includes('/ru/');

    // Префикс для служебных страниц (Impressum, Datenschutz и т.д.)
    let prefix = '';
    if (isRu) {
      prefix = inRu ? '' : 'ru/';
    } else {
      prefix = inTabs ? '' : 'tabs/';
    }

    // Определяем правильный путь для главной страницы (index.html)
    let homeUrl = '';
    if (isRu) {
      homeUrl = inRu ? 'index.html' : (inTabs ? '../ru/index.html' : 'ru/index.html');
    } else {
      homeUrl = (inTabs || inRu) ? '../index.html' : 'index.html';
    }

    const TXT = isRu ? {
      label: 'Ссылки:',
      home: 'На главную',
      impressum: 'Impressum',
      datenschutz: 'Конфиденциальность',
      barrierefreiheit: 'Доступность'
    } : {
      label: 'Links zum',
      home: 'Hauptseite',
      impressum: 'Impressum',
      datenschutz: 'Datenschutz',
      barrierefreiheit: 'Barrierefreiheit'
    };

    this.innerHTML = `
      <div class="legal-footer-card" style="
        margin: 28px auto 16px auto;
        max-width: 560px;
        padding: 12px 18px;
        background: rgba(10, 25, 60, 0.55);
        backdrop-filter: blur(12px) saturate(140%);
        -webkit-backdrop-filter: blur(12px) saturate(140%);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 14px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        text-align: center;
        font-size: 0.85rem;
        line-height: 1.7;
        color: #fff;
      ">
        <span style="opacity: 0.75; margin-right: 4px;">${TXT.label}</span>
        
        <a href="${prefix}impressum.html" class="text-link" style="color:#fff;font-weight:700;text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:3px;">${TXT.impressum}&nbsp;→</a>
        <span style="margin: 0 6px; opacity: 0.4;">|</span>
        
        <a href="${prefix}datenschutz.html" class="text-link" style="color:#fff;font-weight:700;text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:3px;">${TXT.datenschutz}&nbsp;→</a>
        <span style="margin: 0 6px; opacity: 0.4;">|</span>
        
        <a href="${prefix}barrierefreiheit.html" class="text-link" style="color:#fff;font-weight:700;text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:3px;">${TXT.barrierefreiheit}&nbsp;→</a>
        <span style="margin: 0 6px; opacity: 0.4;">|</span>

        <!-- Ссылка на главную теперь последняя -->
        <a href="${homeUrl}" class="text-link" style="color:#fff;font-weight:700;text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:3px;">${TXT.home}&nbsp;→</a>
      </div>
    `;
  }
}

if (!customElements.get('legal-footer')) {
  customElements.define('legal-footer', LegalFooter);
}
