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

        setTimeout(() => {
            const topBarHeight = document.querySelector('.top-bar')?.offsetHeight || 0;
            const scrollHintHeight = document.querySelector('scroll-hint')?.offsetHeight || 0;
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const offset = topBarHeight + scrollHintHeight + navbarHeight;

            const tabRect = targetTab.getBoundingClientRect();

            // Проверяем прилип ли navbar
            const navbarRect = document.querySelector('.navbar')?.getBoundingClientRect();
            const navbarIsSticky = navbarRect && navbarRect.top <= offset;

            if (!navbarIsSticky) {
                // Меню не прилипло — скроллим только если вкладка скрыта за панелями
                if (tabRect.top < offset) {
                    window.scrollTo({
                        top: targetTab.getBoundingClientRect().top + window.scrollY - offset - 10,
                        behavior: 'smooth'
                    });
                }
            }
            // Если navbar прилип — не двигаем страницу вообще
        }, 100);
    }

    // Делаем кнопку активной
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
}

// Слушаем скролл viewport
const menuScroll = document.querySelector('.nav-scroll-viewport');
if (menuScroll) {
    menuScroll.addEventListener('scroll', hideSwipeHint, { passive: true });
}
