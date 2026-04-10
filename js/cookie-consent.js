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
      required: false
    },
    {
      id: "advertising",
      name: "Werbung & externe Inhalte",
      description: "<p>Diese Cookies ermöglichen das Abspielen von YouTube-Videos und другие externe Inhalte. Sie werden nur mit Ihrer ausdrücklichen Einwilligung gesetzt.</p>",
      required: false,
      
      // === АВТОМАТИЗАЦИЯ YOUTUBE + PDF ПРИЛОЖЕНИЙ ===
      onAccept: function() {
        // === Автоматизация YouTube (твой старый код) ===
        const videoPlaceholders = document.querySelectorAll('.video-placeholder');
        videoPlaceholders.forEach(function(placeholder) {
            if (typeof placeholder.onclick === 'function') {
                placeholder.click();
            }
        });

        // === НОВАЯ АВТОМАТИЗАЦИЯ ДЛЯ PDF ПРИЛОЖЕНИЙ ===
        // Загружаем оба инструмента автоматически при согласии на "Werbung"
        const pdfPlaceholder = document.getElementById('pdf-placeholder');
        const photoPlaceholder = document.getElementById('photo-placeholder');

        if (pdfPlaceholder) {
            loadPdfCompressor();
        }
        if (photoPlaceholder) {
            loadPhotoToPdf();
        }
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

// === Функции загрузки iframe (оставляем как было) ===

function loadPhotoToPdf() {
    const placeholder = document.getElementById('photo-placeholder');
    const iframe = document.getElementById('photo-iframe');
    
    if (iframe && placeholder) {
        iframe.src = "https://photo-to-pdf-converter-efhy6yri2rkf4g5wnhbwqm.streamlit.app/?embed=true";
        iframe.style.display = "block";
        placeholder.style.display = "none";
    }
}

function loadPdfCompressor() {
    const placeholder = document.getElementById('pdf-placeholder');
    const iframe = document.getElementById('pdf-iframe');
    
    if (iframe && placeholder) {
        iframe.src = "https://pdf-compressor-web.onrender.com";
        iframe.style.display = "block";
        placeholder.style.display = "none";
    }
}