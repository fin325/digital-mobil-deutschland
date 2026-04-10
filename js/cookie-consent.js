// js/cookie-consent.js

silktideCookieBannerManager.updateCookieBannerConfig({
  background: {
    showBackground: true
  },
  cookieIcon: {
    position: "bottomLeft"
  },
  cookieTypes: [
    {
      id: "necessary",
      name: "Notwendig",
      description: "<p>Diese Cookies sind technisch erforderlich, damit die Website richtig funktioniert. Sie können nicht deaktiviert werden.</p>",
      required: true
    },
    {
      id: "analytics",
      name: "Statistik",
      description: "<p>Diese Cookies helfen uns zu verstehen, wie Besucher die Website nutzen. Dazu gehört das Laden von Nachrichten über RSS-Feeds (z. B. tagesschau.de).</p>",
      required: false,
      
      onAccept: function() {
        loadNews();
      }
    },
    {
      id: "advertising",
      name: "Werbung & externe Inhalte",
      description: "<p>Diese Cookies ermöglichen das Abspielen von YouTube-Videos и загрузку externer Tools (PDF-Kompressor, Foto zu PDF).</p>",
      required: false,
      
      onAccept: function() {
        // YouTube
        const videoPlaceholders = document.querySelectorAll('.video-placeholder');
        videoPlaceholders.forEach(function(placeholder) {
            if (typeof placeholder.onclick === 'function') {
                placeholder.click();
            }
        });

        // PDF-приложения
        if (document.getElementById('pdf-placeholder')) loadPdfCompressor();
        if (document.getElementById('photo-placeholder')) loadPhotoToPdf();
      }
    }
  ],
  text: {
    banner: {
      description: `<p>Wir verwenden Cookies, um die Nutzung zu verbessern, personalisierte Inhalte (YouTube) anzubieten und unsere Website zu analysieren. 
      <a href="#" onclick="event.preventDefault(); document.querySelector('.datenschutz-button').click(); return false;">Datenschutzerklärung</a> 
      und <a href="#" onclick="event.preventDefault(); document.querySelector('.impressum-button').click(); return false;">Impressum</a> 
      finden Sie über die entsprechenden Buttons auf dieser Seite.</p>`,
      acceptAllButtonText: "Alle akzeptieren",
      rejectNonEssentialButtonText: "Nur notwendige",
      preferencesButtonText: "Einstellungen"
    },
    preferences: {
      title: "Cookie-Einstellungen anpassen",
      description: "<p>Wir respektieren Ihr Recht auf Privatsphäre. Sie können auswählen, welche Cookies Sie zulassen möchten.</p>"
    }
  },
  position: {
    banner: "bottomCenter"
  }
});

// ====================== ФУНКЦИИ ЗАГРУЗКИ ======================

function loadNews() {
    if (!document.getElementById('news-placeholder')) {
        document.addEventListener('DOMContentLoaded', loadNews, { once: true });
        return;
    }

    const placeholder = document.getElementById('news-placeholder');
    const container = document.getElementById('news-container');

    if (!placeholder || !container) return;

    placeholder.style.display = "none";
    container.style.display = "block";

    if (typeof window.loadTagesschauNews === 'function') {
        window.loadTagesschauNews();
    } else {
        console.warn("loadTagesschauNews function not found");
    }
}

function loadPhotoToPdf() {
    if (!document.getElementById('photo-placeholder')) {
        document.addEventListener('DOMContentLoaded', loadPhotoToPdf, { once: true });
        return;
    }

    const placeholder = document.getElementById('photo-placeholder');
    const iframe = document.getElementById('photo-iframe');
    if (iframe && placeholder) {
        iframe.src = "https://photo-to-pdf-converter-efhy6yri2rkf4g5wnhbwqm.streamlit.app/?embed=true";
        iframe.style.display = "block";
        placeholder.style.display = "none";
    }
}

function loadPdfCompressor() {
    if (!document.getElementById('pdf-placeholder')) {
        document.addEventListener('DOMContentLoaded', loadPdfCompressor, { once: true });
        return;
    }

    const placeholder = document.getElementById('pdf-placeholder');
    const iframe = document.getElementById('pdf-iframe');
    if (iframe && placeholder) {
        iframe.src = "https://pdf-compressor-web.onrender.com";
        iframe.style.display = "block";
        placeholder.style.display = "none";
    }
}
