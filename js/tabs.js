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

    // Делаем кнопку активной сразу
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    // Запоминаем позицию скролла ДО переключения вкладки
    const scrollBefore = window.scrollY;

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

        // Восстанавливаем позицию скролла сразу после показа вкладки
        window.scrollTo(0, scrollBefore);

        setTimeout(() => {
            const topBarHeight = document.querySelector('.top-bar')?.offsetHeight || 0;
            const scrollHintHeight = document.querySelector('scroll-hint')?.offsetHeight || 0;
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const offset = topBarHeight + scrollHintHeight + navbarHeight;

            // Navbar прилип если скролл больше чем позиция navbar на странице
            const navbar = document.querySelector('.navbar');
            const navbarOffsetTop = navbar?.offsetTop || 0;
            const navbarIsSticky = window.scrollY >= navbarOffsetTop - offset;

            if (navbarIsSticky) {
                // Меню прилипло — просто восстанавливаем скролл, не двигаем
                window.scrollTo(0, scrollBefore);
            } else {
                // Меню не прилипло — скроллим к началу вкладки если скрыта
                const tabRect = targetTab.getBoundingClientRect();
                if (tabRect.top < offset) {
                    window.scrollTo({
                        top: targetTab.getBoundingClientRect().top + window.scrollY - offset - 10,
                        behavior: 'smooth'
                    });
                }
            }
        }, 50);
    }
}

// Слушаем скролл viewport
const menuScroll = document.querySelector('.nav-scroll-viewport');
if (menuScroll) {
    menuScroll.addEventListener('scroll', hideSwipeHint, { passive: true });
}
