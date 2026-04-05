let swipeHintDone = false;

function hideSwipeHint() {
    if (!swipeHintDone) {
        swipeHintDone = true;
        const hint = document.querySelector('.scroll-hint-left');
        if (hint) hint.classList.add('hidden');
    }
}

function scrollTabs(direction) {
    hideSwipeHint(); // ← скрываем подсказку при нажатии стрелок
    
    const viewport = document.querySelector('.nav-scroll-viewport');
    
    if (viewport) {
        if (direction === 1) {
            // Крутим в самый конец (до Инфо и Datenschutz одновременно)
            viewport.scrollTo({
                left: viewport.scrollWidth,
                behavior: 'smooth'
            });
        } else {
            // Крутим в начало
            viewport.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        }
    }
}

function showTab(tabId, event) {
    // Скрываем весь контент
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    // Снимаем активность со всех кнопок
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    // Показываем нужную вкладку
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    // Делаем кнопку активной
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    // Скролл страницы вверх при переключении
    window.scrollTo(0, 0);
}

// Слушаем скролл viewport (правильный селектор)
const menuScroll = document.querySelector('.nav-scroll-viewport');
if (menuScroll) {
    menuScroll.addEventListener('scroll', hideSwipeHint, { passive: true });
}
