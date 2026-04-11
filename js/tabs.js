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
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.style.animation = 'none';
        targetTab.style.webkitAnimation = 'none';
        void targetTab.offsetHeight;
        targetTab.style.animation = '';
        targetTab.style.webkitAnimation = '';
        targetTab.classList.add('active');

        setTimeout(() => {
            const topBarHeight = document.querySelector('.top-bar')?.offsetHeight || 0;
            const scrollHintHeight = document.querySelector('scroll-hint')?.offsetHeight || 0;
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const offset = topBarHeight + scrollHintHeight + navbarHeight;

            // Скроллим к началу вкладки всегда
            const tabTop = targetTab.getBoundingClientRect().top + window.scrollY - offset - 10;
            window.scrollTo({
                top: tabTop,
                behavior: 'smooth'
            });
        }, 50);
    }

    if (event && event.currentTarget) event.currentTarget.classList.add('active');
}

// Слушаем скролл viewport
const menuScroll = document.querySelector('.nav-scroll-viewport');
if (menuScroll) {
    menuScroll.addEventListener('scroll', hideSwipeHint, { passive: true });
}
