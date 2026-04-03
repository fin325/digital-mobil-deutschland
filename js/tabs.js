/* === tabs.js — Переключение вкладок === */

function showTab(tabId, event) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    window.scrollTo(0, 0);
}

function scrollTabs(direction) {
    // Находим наш контейнер со скроллом
    const scrollContainer = document.querySelector('.scrollable-grid');
    
    if (scrollContainer) {
        // Если нажали "влево" (-1), крутим к 0. Если "вправо" (1), крутим на всю ширину (scrollWidth)
        const targetScroll = direction === -1 ? 0 : scrollContainer.scrollWidth;
        
        // Прокручиваем контейнер
        scrollContainer.scrollTo({
            left: targetScroll, 
            behavior: 'smooth' // Плавная анимация прокрутки
        });
    }
}
