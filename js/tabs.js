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
    const scrollContainer = document.querySelector('.scrollable-grid');
    
    if (scrollContainer) {
        if (direction === -1) {
            // Влево (в самое начало)
            scrollContainer.scrollLeft = 0; 
        } else {
            // Вправо (в самый конец)
            // Берем всю ширину контента и крутим туда
            scrollContainer.scrollLeft = scrollContainer.scrollWidth; 
        }
    }
}

