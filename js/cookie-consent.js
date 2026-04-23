// js/cookie-consent.js

silktideCookieBannerManager.updateCookieBannerConfig({
background: { showBackground: true },
cookieIcon: { position: “bottomLeft” },
cookieTypes: [
{
id: “necessary”,
name: “Notwendig”,
description: “<p>Diese Cookies sind technisch erforderlich, damit die Website richtig funktioniert. Sie können nicht deaktiviert werden.</p>”,
required: true
},
{
id: “analytics”,
name: “Statistik”,
description: “<p>Diese Cookies helfen uns zu verstehen, wie Besucher die Website nutzen. Dazu gehört das Laden von Nachrichten über RSS-Feeds (z. B. tagesschau.de).</p>”,
required: false,
onAccept: function() {
if (document.readyState === ‘loading’) {
document.addEventListener(‘DOMContentLoaded’, loadNews, { once: true });
} else {
loadNews();
}
},
onReject: function() {
const placeholder = document.getElementById(‘news-placeholder’);
const container = document.getElementById(‘news-container’);
if (placeholder) placeholder.style.display = “block”;
if (container) {
container.style.display = “none”;
container.innerHTML = “”;
}
}
},
{
id: “advertising”,
name: “Werbung & externe Inhalte”,
description: “<p>Diese Cookies ermöglichen das Abspielen von YouTube-Videos und das Laden externer Tools (PDF-Kompressor, Foto zu PDF).</p>”,
required: false,
onAccept: function() {
function loadVideos() {
document.querySelectorAll(’[id^=“video-placeholder-”]’).forEach(function(ph) {
const btn = ph.querySelector(‘button’);
if (btn) btn.click();
});
if (document.getElementById(‘pdf-placeholder’)) loadPdfCompressor();
if (document.getElementById(‘photo-placeholder’)) loadPhotoToPdf();
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
      if (iframe) { iframe.style.display = "none"; iframe.src = ""; delete iframe.dataset.loaded; }
    });

    const pdfPh = document.getElementById('pdf-placeholder');
    const pdfIframe = document.getElementById('pdf-iframe');
    if (pdfPh) pdfPh.style.display = "block";
    if (pdfIframe) { pdfIframe.style.display = "none"; pdfIframe.src = ""; delete pdfIframe.dataset.loaded; }

    const photoPh = document.getElementById('photo-placeholder');
    const photoIframe = document.getElementById('photo-iframe');
    if (photoPh) photoPh.style.display = "block";
    if (photoIframe) { photoIframe.style.display = "none"; photoIframe.src = ""; delete photoIframe.dataset.loaded; }
  }
}

],
text: {
banner: {
description: `<p>Wir verwenden Cookies, um die Nutzung zu verbessern, personalisierte Inhalte (YouTube) anzubieten und unsere Website zu analysieren.  <a href="#" onclick="event.preventDefault(); document.querySelector('.datenschutz-button').click(); return false;">Datenschutzerklärung</a>  und <a href="#" onclick="event.preventDefault(); document.querySelector('.impressum-button').click(); return false;">Impressum</a>  finden Sie über die entsprechenden Buttons auf dieser Seite.</p>`,
acceptAllButtonText: “Alle akzeptieren”,
rejectNonEssentialButtonText: “Nur notwendige”,
preferencesButtonText: “Einstellungen”
},
preferences: {
title: “Cookie-Einstellungen anpassen”,
description: “<p>Wir respektieren Ihr Recht auf Privatsphäre. Sie können auswählen, welche Cookies Sie zulassen möchten.</p>”
}
},
position: { banner: “bottomCenter” }
});

// ====================== ФУНКЦИИ ЗАГРУЗКИ ======================

function loadNews() {
const placeholder = document.getElementById(‘news-placeholder’);
const container = document.getElementById(‘news-container’);
if (placeholder) placeholder.style.display = “none”;
if (container) container.style.display = “block”;

if (typeof window.loadTagesschauNews === 'function') {
    window.loadTagesschauNews();
} else {
    console.error("Функция loadTagesschauNews не найдена!");
}

}

function loadPhotoToPdf() {
const ph = document.getElementById(‘photo-placeholder’);
const iframe = document.getElementById(‘photo-iframe’);
if (ph && iframe && !iframe.dataset.loaded) {
iframe.src = “https://photo-to-pdf-converter-efhy6yri2rkf4g5wnhbwqm.streamlit.app/?embed=true”;
iframe.style.display = “block”;
iframe.dataset.loaded = ‘true’;
ph.style.display = “none”;
}
}

function loadPdfCompressor() {
const ph = document.getElementById(‘pdf-placeholder’);
const iframe = document.getElementById(‘pdf-iframe’);
if (ph && iframe && !iframe.dataset.loaded) {
fetch(‘https://pdf-compressor-web.onrender.com/wakeup’, { mode: ‘no-cors’ })
.catch(() => {});
iframe.src = “https://pdf-compressor-web.onrender.com”;
iframe.style.display = “block”;
iframe.dataset.loaded = ‘true’;
ph.style.display = “none”;
}
}