// js/cookie-consent.js

const _isRu = document.documentElement.lang === 'ru';

silktideCookieBannerManager.updateCookieBannerConfig({
  background: { showBackground: true },
  cookieIcon: { position: "bottomLeft" },

  cookieTypes: [
    {
      id: "necessary",
      name: _isRu ? "Необходимые" : "Notwendig",
      description: _isRu
        ? "<p>Эти файлы cookie технически необходимы и не могут быть отключены.</p>"
        : "<p>Diese Cookies sind technisch erforderlich und können nicht deaktiviert werden.</p>",
      required: true
    },

    {
      id: "analytics",
      name: _isRu ? "Статистика" : "Statistik",
      description: _isRu
        ? "<p>Помогает нам понять, как посетители используют сайт.</p>"
        : "<p>Hilft uns zu verstehen, wie Besucher die Website nutzen.</p>",
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

    {
      id: "advertising",
      name: _isRu ? "Реклама и внешний контент" : "Werbung & externe Inhalte",
      description: _isRu
        ? "<p>YouTube, PDF-компрессор и инструмент «Фото в PDF».</p>"
        : "<p>YouTube, PDF-Kompressor und Foto-zu-PDF Tools.</p>",
      required: false,

      onAccept: function () {
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
        Мы используем файлы cookie для улучшения сайта, YouTube-видео и внешних инструментов.
        <a href="#" onclick="event.preventDefault(); document.querySelector('.datenschutz-button').click();">Конфиденциальность</a> |
        <a href="#" onclick="event.preventDefault(); document.querySelector('.impressum-button').click();">Импрессум</a>
      </p>`
        : `<p>
        Wir verwenden Cookies zur Verbesserung der Website, für YouTube-Videos und externe Tools.
        <a href="#" onclick="event.preventDefault(); document.querySelector('.datenschutz-button').click();">Datenschutz</a> |
        <a href="#" onclick="event.preventDefault(); document.querySelector('.impressum-button').click();">Impressum</a>
      </p>`,
      acceptAllButtonText: _isRu ? "Принять все" : "Alle akzeptieren",
      rejectNonEssentialButtonText: _isRu ? "Только необходимые" : "Nur notwendige",
      preferencesButtonText: _isRu ? "Настройки" : "Einstellungen"
    },

    preferences: {
      title: _isRu ? "Настройка параметров cookie" : "Cookie-Einstellungen",
      description: _isRu
        ? "<p>Выберите, какие файлы cookie вы хотите разрешить.</p>"
        : "<p>Wählen Sie, welche Cookies Sie zulassen möchten.</p>"
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
