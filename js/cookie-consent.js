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
      description: "<p>Diese Cookies ermöglichen das Abspielen von YouTube-Videos und andere externe Inhalte. Sie werden nur mit Ihrer ausdrücklichen Einwilligung gesetzt.</p>",
      required: false,
      
      // === АВТОМАТИЗАЦИЯ YOUTUBE ===
      // Эта функция сработает, когда пользователь согласится на рекламу / внешние сервисы
      onAccept: function() {
        // Находим все оставшиеся черные квадраты-заглушки
        const placeholders = document.querySelectorAll('.video-placeholder');
        
        // "Кликаем" по каждому из них программно, чтобы запустить loadVideo / loadPlaylist
        placeholders.forEach(function(placeholder) {
            // Проверяем, есть ли еще событие onclick (мы удаляем его после загрузки)
            if (typeof placeholder.onclick === 'function') {
                placeholder.click();
            }
        });
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

// === Автозагрузка iframe только после нажатия кнопки ===

function loadPhotoToPdf() {
    const placeholder = document.getElementById('photo-placeholder');
    const iframe = document.getElementById('photo-iframe');
    
    iframe.src = "https://photo-to-pdf-converter-efhy6yri2rkf4g5wnhbwqm.streamlit.app/?embed=true";
    iframe.style.display = "block";
    placeholder.style.display = "none";
}

function loadPdfCompressor() {
    const placeholder = document.getElementById('pdf-placeholder');
    const iframe = document.getElementById('pdf-iframe');
    
    iframe.src = "https://pdf-compressor-web.onrender.com";
    iframe.style.display = "block";
    placeholder.style.display = "none";
}
