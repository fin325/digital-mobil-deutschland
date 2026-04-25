// js/cookie-consent.js

const _isRu = document.documentElement.lang === 'ru';

silktideCookieBannerManager.updateCookieBannerConfig({
  background: { showBackground: true },
  cookieIcon: { position: "bottomLeft" },

  cookieTypes: [
    // ── 1. NOTWENDIG / НЕОБХОДИМЫЕ ─────────────────────────
    {
      id: "necessary",
      name: _isRu ? "Необходимые" : "Notwendig",
      description: _isRu
        ? "<p>Технически необходимые файлы для работы сайта. Сюда входят: сохранение ваших cookie-настроек и выбранного города для виджета погоды. Эти файлы не могут быть отключены.</p>"
        : "<p>Technisch erforderliche Dateien für den Betrieb der Website. Dazu gehören: Speicherung Ihrer Cookie-Einstellungen sowie der von Ihnen gewählten Stadt für die Wetteranzeige. Diese Dateien können nicht deaktiviert werden.</p>",
      required: true
    },

    // ── 2. FUNKTIONAL / ФУНКЦИОНАЛЬНЫЕ (новости) ───────────
    {
      id: "functional",
      name: _isRu ? "Функциональные" : "Funktional",
      description: _isRu
        ? "<p>Расширенный функционал сайта, требующий передачи данных внешним сервисам:</p><ul><li><strong>Новости через rss2json</strong> — RSS-каналы tagesschau.de или ru.euronews.com. При загрузке ваш IP-адрес передаётся на серверы rss2json.</li></ul><p>Без вашего согласия эти функции не активируются.</p>"
        : "<p>Erweiterte Funktionen der Website, die eine Datenübermittlung an externe Dienste erfordern:</p><ul><li><strong>Nachrichten über rss2json</strong> — RSS-Feeds von tagesschau.de oder ru.euronews.com. Beim Laden wird Ihre IP-Adresse an die Server von rss2json übermittelt.</li></ul><p>Ohne Ihre Einwilligung werden diese Funktionen nicht aktiviert.</p>",
      required: false,

      onAccept: function () {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', loadNews, { once: true });
        } else {
          loadNews();
        }
      },

      onReject: function () {
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
        ? "<p>Загрузка встроенного контента и инструментов от внешних провайдеров:</p><ul><li><strong>YouTube-видео</strong> (Google Ireland Ltd. / США) — в режиме расширенной защиты данных.</li><li><strong>PDF-компрессор</strong> (Render Services Inc., США).</li><li><strong>Фото в PDF</strong> (Streamlit / Snowflake Inc., США).</li></ul><p>При загрузке ваш IP-адрес и данные браузера передаются соответствующим провайдерам. Дополнительно отправляется фоновый ping для пробуждения сервера PDF-компрессора (избегание Cold-Start).</p>"
        : "<p>Laden eingebetteter Inhalte und Tools von externen Anbietern:</p><ul><li><strong>YouTube-Videos</strong> (Google Ireland Ltd. / USA) — im erweiterten Datenschutzmodus.</li><li><strong>PDF-Kompressor</strong> (Render Services Inc., USA).</li><li><strong>Foto zu PDF</strong> (Streamlit / Snowflake Inc., USA).</li></ul><p>Beim Laden werden Ihre IP-Adresse und Browserdaten an die jeweiligen Anbieter übertragen. Zusätzlich wird ein Hintergrund-Ping zum Aufwecken des PDF-Kompressor-Servers gesendet (Cold-Start-Vermeidung).</p>",
      required: false,

      onAccept: function () {
        // 🔥 Фоновое пробуждение Render-сервера
        // 🔥 Background wake-up of Render server
        // 🔥 Hintergrund-Aufwecken des Render-Servers
        fetch('https://pdf-compressor-web.onrender.com/wakeup', { mode: 'no-cors' })
          .catch(() => {});

        function loadAllExternal() {

          // ▶️ Видео
          document.querySelectorAll('[id^="video-placeholder-"] button')
            .forEach(btn => btn.click());

          // 📄 PDF
          const pdfBtn = document.querySelector('#pdf-placeholder button');
          if (pdfBtn) pdfBtn.click();

          // 🖼 Photo
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

        // Видео
        document.querySelectorAll('[id^="video-placeholder-"]').forEach(function (ph) {
          const num = ph.id.replace('video-placeholder-', '');
          resetIframe(ph.id, 'video-iframe-' + num);
        });

        // PDF + Photo
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
