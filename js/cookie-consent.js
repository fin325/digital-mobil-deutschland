// js/cookie-consent.js

silktideCookieBannerManager.updateCookieBannerConfig({
  background: { showBackground: true },
  cookieIcon: { position: "bottomLeft" },
  cookieTypes: [
    {
      id: "necessary",
      name: "Notwendig",
      description: "<p>Diese Cookies sind technisch erforderlich, damit die Website richtig funktioniert.</p>",
      required: true
    },
    {
      id: "analytics",
      name: "Statistik",
      description: "<p>Dazu gehört das Laden von Nachrichten über RSS-Feeds (tagesschau.de).</p>",
      required: false,
      onAccept: function() {
        loadNews();
      },
      onReject: function() {
        const placeholder = document.getElementById('news-placeholder');
        const container = document.getElementById('news-container');
        if (placeholder) placeholder.style.display = "block";
        if (container) container.style.display = "none";
      }
    },
    {
      id: "advertising",
      name: "Werbung & externe Inhalte",
      description: "<p>YouTube-Videos und PDF-Tools.</p>",
      required: false,
      onAccept: function() {
        const videoPlaceholders = document.querySelectorAll('.video-placeholder');
        videoPlaceholders.forEach(p => { if (typeof p.onclick === 'function') p.click(); });

        if (document.getElementById('pdf-placeholder')) loadPdfCompressor();
        if (document.getElementById('photo-placeholder')) loadPhotoToPdf();
      },
      onReject: function() {
        // PDF компрессор
        const pdfPh = document.getElementById('pdf-placeholder');
        const pdfIframe = document.getElementById('pdf-iframe');
        if (pdfPh) pdfPh.style.display = "block";
        if (pdfIframe) { pdfIframe.style.display = "none"; pdfIframe.src = ""; }

        // Фото в PDF
        const photoPh = document.getElementById('photo-placeholder');
        const photoIframe = document.getElementById('photo-iframe');
        if (photoPh) photoPh.style.display = "block";
        if (photoIframe) { photoIframe.style.display = "none"; photoIframe.src = ""; }
      }
    }
  ],
  text: {
    banner: {
      description: "<p>Wir verwenden Cookies... <a href=\"#\" onclick=\"event.preventDefault(); document.querySelector('.datenschutz-button').click(); return false;\">Datenschutzerklärung</a></p>",
      acceptAllButtonText: "Alle akzeptieren",
      rejectNonEssentialButtonText: "Nur notwendige",
      preferencesButtonText: "Einstellungen"
    },
    preferences: {
      title: "Cookie-Einstellungen",
      description: "<p>Sie können auswählen, welche Cookies Sie zulassen möchten.</p>"
    }
  },
  position: { banner: "bottomCenter" }
});

// ====================== ФУНКЦИИ ======================

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
    const ph = document.getElementById('photo-placeholder');
    const iframe = document.getElementById('photo-iframe');
    if (ph && iframe) {
        iframe.src = "https://photo-to-pdf-converter-efhy6yri2rkf4g5wnhbwqm.streamlit.app/?embed=true";
        iframe.style.display = "block";
        ph.style.display = "none";
    }
}

function loadPdfCompressor() {
    const ph = document.getElementById('pdf-placeholder');
    const iframe = document.getElementById('pdf-iframe');
    if (ph && iframe) {
        iframe.src = "https://pdf-compressor-web.onrender.com";
        iframe.style.display = "block";
        ph.style.display = "none";
    }
}
