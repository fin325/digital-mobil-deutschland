window.silktideConsentManager.init({
  // Настройки фона и иконки
  background: {
    showBackground: true
  },
  cookieIcon: {
    position: "bottomLeft"
  },
  position: {
    banner: "bottomCenter"
  },
  
  // ВАЖНО: теперь используется consentTypes, а не cookieTypes
  consentTypes: [ 
    {
      id: "necessary",
      label: "Notwendig", // ВАЖНО: используется 'label' вместо 'name'
      description: "<p>Diese Cookies sind technisch erforderlich, damit die Website richtig funktioniert. Sie können nicht deaktiviert werden.</p>",
      required: true
    },
    {
      id: "analytics",
      label: "Statistik",
      description: "<p>Diese Cookies helfen uns zu verstehen, wie Besucher die Website nutzen. Dazu gehört das Laden von Nachrichten über RSS-Feeds (z. B. tagesschau.de).</p>",
      required: false
    },
    {
      id: "advertising",
      label: "Werbung & externe Inhalte",
      description: "<p>Diese Cookies ermöglichen das Abspielen von YouTube-Videos und andere externe Inhalte. Sie werden nur mit Ihrer ausdrücklichen Einwilligung gesetzt.</p>",
      required: false
    }
  ],

  // Тексты для баннера и окна настроек
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
  }
});
