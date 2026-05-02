// js/cookie-consent.js

const _isRu = document.documentElement.lang === 'ru';

// ── Storage Guard ─────────────────────────────────────────────
// Возвращает true, если пользователь согласился на функциональные cookies.
// Используется во всех скриптах перед sessionStorage.setItem(...).
window.canSaveToStorage = function () {
    try {
        return localStorage.getItem('cookieConsent') === 'accepted';
    } catch (e) {
        return false;
    }
};

silktideCookieBannerManager.updateCookieBannerConfig({
  background: { showBackground: true },
  cookieIcon: { position: "bottomLeft" },

  cookieTypes: [
    // ── 1. NOTWENDIG / НЕОБХОДИМЫЕ ─────────────────────────
    {
      id: "necessary",
      name: _isRu ? "Необходимые" : "Notwendig",
      description: _isRu
        ? "<p>Технически необходимые данные для работы сайта (хранятся в Local Storage / Session Storage браузера, не в классических cookies):</p><ul><li><strong>Ваш выбор cookie-настроек</strong> (Silktide Consent Manager).</li><li><strong>Собственный статус согласия</strong> (ключ <code>cookieConsent</code>) — определяет, разрешено ли сохранять функциональные данные.</li><li><strong>История ИИ-чата в текущем сеансе</strong> (ключ <code>dmd_chat_history</code> в Session Storage) — автоматически удаляется при закрытии вкладки браузера.</li></ul><p>Эти данные не могут быть отключены, так как необходимы для базовой работы сайта.</p>"
        : "<p>Technisch erforderliche Daten für den Betrieb der Website (gespeichert im Local Storage / Session Storage des Browsers, nicht in klassischen Cookies):</p><ul><li><strong>Ihre Cookie-Auswahl</strong> (Silktide Consent Manager).</li><li><strong>Eigener Einwilligungs-Status</strong> (Schlüssel <code>cookieConsent</code>) — entscheidet, ob funktionale Daten gespeichert werden dürfen.</li><li><strong>KI-Chat-Verlauf der aktuellen Sitzung</strong> (Schlüssel <code>dmd_chat_history</code> im Session Storage) — wird beim Schließen des Browser-Tabs automatisch gelöscht.</li></ul><p>Diese Daten können nicht deaktiviert werden, da sie für die Grundfunktion der Website erforderlich sind.</p>",
      required: true
    },

    // ── 2. FUNKTIONAL / ФУНКЦИОНАЛЬНЫЕ ─────────────────────
    {
      id: "functional",
      name: _isRu ? "Функциональные" : "Funktional",
      description: _isRu
        ? "<p>С вашего согласия сайт сохраняет следующие функциональные данные локально в вашем браузере, чтобы избежать повторных серверных запросов и ускорить навигацию:</p><ul><li><strong>Выбранный вручную город</strong> для виджета погоды (Local Storage, ключ <code>userCity</code>).</li><li><strong>Кэш погоды, качества воздуха, геомагнитной активности и курса EUR/UAH</strong> (Session Storage — удаляется при закрытии вкладки).</li><li><strong>Загрузка новостей через rss2json</strong> — RSS-каналы tagesschau.de или ru.euronews.com. При загрузке ваш IP-адрес передаётся на серверы rss2json.com.</li></ul><p><strong>Без вашего согласия эти данные не сохраняются в памяти вашего браузера.</strong> Виджеты погоды, AQI и курса работают и без согласия — данные отображаются, но при переходе между страницами загружаются заново.</p>"
        : "<p>Mit Ihrer Einwilligung speichert die Website folgende funktionale Daten lokal in Ihrem Browser, um wiederholte Serveranfragen zu vermeiden und die Navigation zu beschleunigen:</p><ul><li><strong>Manuell gewählte Stadt</strong> für die Wetteranzeige (Local Storage, Schlüssel <code>userCity</code>).</li><li><strong>Cache von Wetter, Luftqualität, Geomagnetik und EUR/UAH-Kurs</strong> (Session Storage — wird beim Schließen des Tabs gelöscht).</li><li><strong>Laden von Nachrichten über rss2json</strong> — RSS-Feeds von tagesschau.de oder ru.euronews.com. Beim Laden wird Ihre IP-Adresse an die Server von rss2json.com übermittelt.</li></ul><p><strong>Ohne Ihre Einwilligung werden diese Daten nicht im Browser gespeichert.</strong> Die Widgets für Wetter, AQI und Wechselkurs funktionieren auch ohne Einwilligung — die Daten werden angezeigt, beim Wechsel zwischen Seiten jedoch erneut geladen.</p>",
      required: false,

      onAccept: function () {
        // 1) Ставим собственный флаг согласия для Storage Guard
        try { localStorage.setItem('cookieConsent', 'accepted'); } catch (e) {}

        // 2) Загружаем новости
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', loadNews, { once: true });
        } else {
          loadNews();
        }

        // 3) Перерисовываем виджеты — теперь setItem() уже разрешён,
        //    и кэш заполнится свежими данными
        if (typeof window.getWeather === 'function') {
          try { window.getWeather(); } catch (e) {}
        }
        if (typeof window.getGeomagneticActivity === 'function') {
          try { window.getGeomagneticActivity(); } catch (e) {}
        }
        if (typeof window.loadEurRate === 'function') {
          try { window.loadEurRate(); } catch (e) {}
        }
      },

      onReject: function () {
        // 1) Снимаем флаг согласия
        try { localStorage.setItem('cookieConsent', 'rejected'); } catch (e) {}

        // 2) Чистим уже накопленный кэш (на случай, если пользователь
        //    раньше нажимал «Принять», а теперь передумал)
        try {
          sessionStorage.removeItem('weatherData');
          sessionStorage.removeItem('aqiData');
          sessionStorage.removeItem('magnetData');
          sessionStorage.removeItem('eurRate');
          localStorage.removeItem('userCity');
        } catch (e) {}

        // 3) Прячем новости
        const placeholder = document.getElementById('news-placeholder');
        const container = document.getElementById('news-container');

        if (placeholder) placeholder.style.display = "block";
        if (container) {
          container.style.display = "none";
          container.innerHTML = "";
        }
      }
    },

    // ── 3. EXTERNE MEDIEN / ВНЕШНИЕ МЕДИА ─────────────────
    {
      id: "external_media",
      name: _isRu ? "Внешние медиа" : "Externe Medien",
      description: _isRu
        ? "<p>Загрузка встроенного контента и инструментов от внешних провайдеров:</p><ul><li><strong>YouTube-видео</strong> (Google Ireland Ltd., Ирландия / Google LLC, США) — в режиме расширенной защиты данных (youtube-nocookie.com).</li><li><strong>PDF-компрессор</strong> (Render Services Inc., США).</li><li><strong>Фото в PDF</strong> (Streamlit / Snowflake Inc., США).</li></ul><p>При загрузке ваш IP-адрес и данные браузера передаются соответствующим провайдерам в США / ЕС. Дополнительно отправляется фоновый ping для пробуждения сервера PDF-компрессора (избегание Cold-Start).</p><p>Без вашего согласия эти сервисы не загружаются.</p>"
        : "<p>Laden eingebetteter Inhalte und Tools von externen Anbietern:</p><ul><li><strong>YouTube-Videos</strong> (Google Ireland Ltd., Irland / Google LLC, USA) — im erweiterten Datenschutzmodus (youtube-nocookie.com).</li><li><strong>PDF-Kompressor</strong> (Render Services Inc., USA).</li><li><strong>Foto zu PDF</strong> (Streamlit / Snowflake Inc., USA).</li></ul><p>Beim Laden werden Ihre IP-Adresse und Browserdaten an die jeweiligen Anbieter in den USA / EU übertragen. Zusätzlich wird ein Hintergrund-Ping zum Aufwecken des PDF-Kompressor-Servers gesendet (Cold-Start-Vermeidung).</p><p>Ohne Ihre Einwilligung werden diese Dienste nicht geladen.</p>",
      required: false,

      onAccept: function () {
        fetch('https://pdf-compressor-web.onrender.com/wakeup', { mode: 'no-cors' })
          .catch(() => {});

        function loadAllExternal() {
          document.querySelectorAll('[id^="video-placeholder-"] button')
            .forEach(btn => btn.click());

          const pdfBtn = document.querySelector('#pdf-placeholder button');
          if (pdfBtn) pdfBtn.click();

          const photoBtn = document.querySelector('#photo-placeholder button');
          if (photoBtn) photoBtn.click();
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', loadAllExternal, { once: true });
        } else {
          loadAllExternal();
        }
      },

      onReject: function () {
        document.querySelectorAll('[id^="video-placeholder-"]').forEach(function (ph) {
          const num = ph.id.replace('video-placeholder-', '');
          resetIframe(ph.id, 'video-iframe-' + num);
        });

        resetIframe('pdf-placeholder', 'pdf-iframe');
        resetIframe('photo-placeholder', 'photo-iframe');
      }
    }
  ],

  text: {
    banner: {
      description: _isRu
        ? `<p>
        Мы используем cookies для работы сайта и можем загружать внешний контент (новости, видео, онлайн-инструменты), что требует передачи вашего IP-адреса третьим сторонам.
        <a href="#" onclick="event.preventDefault(); document.querySelector('.datenschutz-button').click();">Конфиденциальность</a> |
        <a href="#" onclick="event.preventDefault(); document.querySelector('.impressum-button').click();">Импрессум</a>
      </p>`
        : `<p>
        Wir verwenden Cookies für den Betrieb der Website und können externe Inhalte laden (Nachrichten, Videos, Online-Tools), was die Übermittlung Ihrer IP-Adresse an Drittanbieter erfordert.
        <a href="#" onclick="event.preventDefault(); document.querySelector('.datenschutz-button').click();">Datenschutz</a> |
        <a href="#" onclick="event.preventDefault(); document.querySelector('.impressum-button').click();">Impressum</a>
      </p>`,
      acceptAllButtonText: _isRu ? "Все принять" : "Alle akzeptieren",
      rejectNonEssentialButtonText: _isRu ? "Только необходимые" : "Nur notwendige",
      preferencesButtonText: _isRu ? "Настройки" : "Einstellungen"
    },

    preferences: {
      title: _isRu ? "Настройка cookie-параметров" : "Cookie-Einstellungen",
      description: _isRu
        ? "<p>Выберите, какие категории cookies и внешнего содержимого вы хотите разрешить. Подробное описание каждой категории — ниже. Вы можете изменить выбор в любое время через иконку cookies в левом нижнем углу.</p>"
        : "<p>Wählen Sie, welche Kategorien von Cookies und externen Inhalten Sie zulassen möchten. Eine detaillierte Beschreibung jeder Kategorie finden Sie unten. Sie können Ihre Auswahl jederzeit über das Cookie-Symbol unten links ändern.</p>"
    }
  },

  position: { banner: "bottomCenter" }
});


// ====================== ОБЩИЕ ФУНКЦИИ ======================

function loadIframe(placeholderId, iframeId, src, wakeupUrl = null) {
  const ph = document.getElementById(placeholderId);
  const iframe = document.getElementById(iframeId);

  if (!ph || !iframe || iframe.dataset.loaded) return;

  if (wakeupUrl) {
    fetch(wakeupUrl, { mode: 'no-cors' }).catch(() => {});
  }

  iframe.src = src;
  iframe.style.display = "block";
  iframe.dataset.loaded = 'true';
  ph.style.display = "none";
}

function resetIframe(phId, iframeId) {
  const ph = document.getElementById(phId);
  const iframe = document.getElementById(iframeId);

  if (ph) ph.style.display = "block";

  if (iframe) {
    iframe.style.display = "none";
    iframe.src = "";
    delete iframe.dataset.loaded;
  }
}


// ====================== ЗАГРУЗКИ ======================

function loadNews() {
  const placeholder = document.getElementById('news-placeholder');
  const container = document.getElementById('news-container');

  if (placeholder) placeholder.style.display = "none";
  if (container) container.style.display = "block";

  if (typeof window.loadTagesschauNews === 'function') {
    window.loadTagesschauNews();
  }
}


// 📄 PDF
function loadPdfCompressor() {
  loadIframe(
    'pdf-placeholder',
    'pdf-iframe',
    'https://pdf-compressor-web.onrender.com',
    'https://pdf-compressor-web.onrender.com/wakeup'
  );
}


// 🖼 Photo → PDF
function loadPhotoToPdf() {
  loadIframe(
    'photo-placeholder',
    'photo-iframe',
    'https://photo-to-pdf-converter-efhy6yri2rkf4g5wnhbwqm.streamlit.app/?embed=true'
  );
}