let swipeHintDone = false;

function hideSwipeHint() {
    if (!swipeHintDone) {
        swipeHintDone = true;
        const hint = document.querySelector('.scroll-hint-left');
        if (hint) hint.classList.add('hidden');
    }
}

function scrollTabs(direction) {
    hideSwipeHint();
    
    const viewport = document.querySelector('.nav-scroll-viewport');
    
    if (viewport) {
        if (direction === 1) {
            viewport.scrollTo({
                left: viewport.scrollWidth,
                behavior: 'smooth'
            });
        } else {
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
    if (targetTab) {
        // Сбрасываем анимацию перед показом
        targetTab.style.animation = 'none';
        targetTab.style.webkitAnimation = 'none';

        // Принудительный reflow
        void targetTab.offsetHeight;

        targetTab.style.animation = '';
        targetTab.style.webkitAnimation = '';

        targetTab.classList.add('active');
    }

    // Делаем кнопку активной
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    // Всегда скроллим в начало страницы
    window.scrollTo(0, 0);
}

// Слушаем скролл viewport
const menuScroll = document.querySelector('.nav-scroll-viewport');
if (menuScroll) {
    menuScroll.addEventListener('scroll', hideSwipeHint, { passive: true });
}

// Кнопка наверх
const scrollTopBtn = document.querySelector('.scroll-top-btn');

// Мгновенное срабатывание через pointerdown
scrollTopBtn?.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Показываем кнопку только когда проскроллили вниз
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        scrollTopBtn?.classList.add('visible');
    } else {
        scrollTopBtn?.classList.remove('visible');
    }
}, { passive: true });
