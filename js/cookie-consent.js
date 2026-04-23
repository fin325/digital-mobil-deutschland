// js/cookie-consent.js

const _isRu = document.documentElement.lang === 'ru';

const _t = {
  necessary: {
    name: _isRu ? "Необходимые" : "Notwendig",
    description: _isRu
      ? "<p>Эти файлы cookie технически необходимы для корректной работы сайта. Их нельзя отключить.</p>"
      : "<p>Diese Cookies sind technisch erforderlich, damit die Website richtig funktioniert. Sie können nicht deaktiviert werden.</p>"
  },
  analytics: {
    name: _isRu ? "Статистика" : "Statistik",
    description: _isRu
      ? "<p>Эти файлы cookie помогают нам понять, как посетители используют сайт. Сюда входит загрузка новостей через RSS-ленты (например, tagesschau.de).</p>"
      : "<p>Diese Cookies helfen uns zu verstehen, wie Besucher die Website nutzen. Dazu gehört das Laden von Nachrichten über RSS-Feeds (z. B. tagesschau.de).</p>"
  },
  advertising: {
    name: _isRu ? "Реклама и внешний контент" : "Werbung & externe Inhalte",
    description: _isRu
      ? "<p>Эти файлы cookie позволяют воспроизводить видео с YouTube и загружать внешние инструменты (PDF-компрессор, фото в PDF).</p>"
      : "<p>Diese Cookies ermöglichen das Abspielen von YouTube-Videos und das Laden externer Tools (PDF-Kompressor, Foto zu PDF).</p>"
  },
  banner: {
    description: _isRu
      ? `<p>Мы используем файлы cookie для улучшения работы сайта, персонализации контента (YouTube) и анализа посещаемости. 
      <a href="#" onclick="event.preventDefault(); document.querySelector('.datenschutz-button').click(); return false;">Политику конфиденциальности</a> 
      и <a href="#" onclick="event.preventDefault(); document.querySelector('.impressum-button').click(); return false;">Импрессум</a> 
      можно найти через соответствующие кнопки на этой странице.</p>`
      : `<p>Wir verwenden Cookies, um die Nutzung zu verbessern, personalisierte Inhalte (YouTube) anzubieten und unsere Website zu analysieren. 
      <a href="#" onclick="event.preventDefault(); document.querySelector('.datenschutz-button').click(); return false;">Datenschutzerklärung</a> 
      und <a href="#" onclick="event.preventDefault(); document.querySelector('.impressum-button').click(); return false;">Impressum</a> 
      finden Sie über die entsprechenden Buttons auf dieser Seite.</p>`,
    acceptAll: _isRu ? "Принять все" : "Alle akzeptieren",
    rejectNonEssential: _isRu ? "Только необходимые" : "Nur notwendige",
    preferences: _isRu ? "Настройки" : "Einstellungen"
  },
  preferences: {
    title: _isRu ? "Настройка параметров cookie" : "Cookie-Einstellungen anpassen",
    description: _isRu
      ? "<p>Мы уважаем ваше право на конфиденциальность. Вы можете выбрать, какие файлы cookie разрешить.</p>"
      : "<p>Wir respektieren Ihr Recht auf Privatsphäre. Sie können auswählen, welche Cookies Sie zulassen möchten.</p>"
  }
};

silktideCookieBannerManager.updateCookieBannerConfig({
  background: { showBackground: true },
  cookieIcon: { position: "bottomLeft" },
  cookieTypes: [
    {
      id: "necessary",
      name: _t.necessary.name,
      description: _t.necessary.description,
      required: true
    },
    {
      id: "analytics",
      name: _t.analytics.name,
      description: _t.analytics.description,
      required: false,
      onAccept: function() {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', loadNews, { once: true });
        } else {
          loadNews();
        }
      },
      onReject: function() {
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
      name: _t.advertising.name,
      description: _t.advertising.description,
      required: false,
      onAccept: function() {
        function loadVideos() {
          document.querySelectorAll('[id^="video-placeholder-"]').forEach(function(ph) {
            const btn = ph.querySelector('button');
            if (btn) btn.click();
          });
          // PDF-инструменты НЕ грузим здесь — они загрузятся когда пользователь
          // откроет вкладку через showInnerTab
        }
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', loadVideos, { once: true });
        } else {
          loadVideos();
        }
      },
      onReject: function() {
        document.querySelectorAll('[id^="video-placeholder-"]').forEach(function(ph) {
          const num = ph.id.replace('video-placeholder-', '');
          const iframe = document.getElementById('video-iframe-' + num);
          ph.style.display = "flex";
          if (iframe) { iframe.style.display = "none"; iframe.src = ""; }
        });
        // Сбрасываем PDF-инструменты и флаги загрузки
        const pdfPh = document.getElementById('pdf-placeholder');
        const pdfIframe = document.getElementById('pdf-iframe');
        if (pdfPh) pdfPh.style.display = "block";
        if (pdfIframe) { pdfIframe.style.display = "none"; pdfIframe.src = ""; }
        window._pdfLoaded = false;

        const photoPh = document.getElementById('photo-placeholder');
        const photoIframe = document.getElementById('photo-iframe');
        if (photoPh) photoPh.style.display = "block";
        if (photoIframe) { photoIframe.style.display = "none"; photoIframe.src = ""; }
        window._photoLoaded = false;
      }
    }
  ],
  text: {
    banner: {
      description: _t.banner.description,
      acceptAllButtonText: _t.banner.acceptAll,
      rejectNonEssentialButtonText: _t.banner.rejectNonEssential,
      preferencesButtonText: _t.banner.preferences
    },
    preferences: {
      title: _t.preferences.title,
      description: _t.preferences.description
    }
  },
  position: { banner: "bottomCenter" }
});

// ====================== ФУНКЦИИ ЗАГРУЗКИ ======================

function loadNews() {
  const placeholder = document.getElementById('news-placeholder');
  const container = document.getElementById('news-container');
  if (placeholder) placeholder.style.display = "none";
  if (container) container.style.display = "block";
  if (typeof window.loadTagesschauNews === 'function') {
    window.loadTagesschauNews();
  } else {
    console.error("Функция loadTagesschauNews не найдена!");
  }
}

function loadPhotoToPdf() {
  if (window._photoLoaded) return;
  const ph = document.getElementById('photo-placeholder');
  const iframe = document.getElementById('photo-iframe');
  if (!ph || !iframe) return;
  window._photoLoaded = true;
  iframe.src = "https://photo-to-pdf-converter-efhy6yri2rkf4g5wnhbwqm.streamlit.app/?embed=true";
  iframe.style.display = "block";
  ph.style.display = "none";
}

function loadPdfCompressor() {
  if (window._pdfLoaded) return;
  const ph = document.getElementById('pdf-placeholder');
  const iframe = document.getElementById('pdf-iframe');
  if (!ph || !iframe) return;
  window._pdfLoaded = true;
  fetch('https://pdf-compressor-web.onrender.com/wakeup', { mode: 'no-cors' }).catch(() => {});
  iframe.src = "https://pdf-compressor-web.onrender.com";
  iframe.style.display = "block";
  ph.style.display = "none";
}
