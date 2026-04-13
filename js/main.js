// === Функции загрузки YouTube ===

function loadVideo(placeholderId, iframeId, videoId) {
    const placeholder = document.getElementById(placeholderId);
    const iframe = document.getElementById(iframeId);
    if (placeholder && iframe) {
        // Убрали autoplay=1. Плеер просто загрузится в режиме паузы.
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
        iframe.style.display = "block";
        placeholder.style.display = "none";
    }
}

function loadPlaylist(placeholderId, iframeId, listId) {
    const placeholder = document.getElementById(placeholderId);
    const iframe = document.getElementById(iframeId);
    if (placeholder && iframe) {
        // Убрали autoplay=1. Плейлист просто загрузится в режиме паузы.
        iframe.src = `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}&rel=0`;
        iframe.style.display = "block";
        placeholder.style.display = "none";
    }
}
