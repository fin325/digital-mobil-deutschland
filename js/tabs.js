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
    hideSwipeHint(); // ← добавлено

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
    }

    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    window.scrollTo(0, 0);
}

const menuScroll = document.querySelector('.nav-scroll-viewport');
if (menuScroll) {
    menuScroll.addEventListener('scroll', hideSwipeHint, { passive: true });
}

const scrollTopBtn = document.querySelector('.scroll-top-btn');
let scrollTimer;

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        scrollTopBtn?.classList.add('visible');
        scrollTopBtn?.classList.add('scrolling');
    } else {
        scrollTopBtn?.classList.remove('visible');
        scrollTopBtn?.classList.remove('scrolling');
    }

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        scrollTopBtn?.classList.remove('scrolling');
    }, 150);
}, { passive: true });

scrollTopBtn?.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

(function () {
    const vp = document.querySelector('.nav-scroll-viewport');
    if (!vp) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasDragged = false;

    vp.addEventListener('mousedown', (e) => {
        isDown = true;
        hasDragged = false;
        startX = e.pageX - vp.offsetLeft;
        scrollLeft = vp.scrollLeft;
        vp.style.cursor = 'grabbing';
        vp.style.userSelect = 'none';
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const x = e.pageX - vp.offsetLeft;
        const walk = x - startX;
        if (Math.abs(walk) > 4) hasDragged = true;
        vp.scrollLeft = scrollLeft - walk;
    });

    window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        vp.style.cursor = '';
        vp.style.userSelect = '';
    });

    vp.addEventListener('click', (e) => {
        if (hasDragged) e.stopPropagation();
    }, true);
})();

// iOS fix: первый тап после скролла
document.querySelectorAll('a.btn-main').forEach(link => {
    link.addEventListener('touchend', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href) setTimeout(() => window.location.href = href, 150);
    }, { passive: false });
});


