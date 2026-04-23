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
    hideSwipeHint();

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
        window.dispatchEvent(new Event('resize'));

        // перезапуск только незагруженных iframe
        targetTab.querySelectorAll('iframe').forEach(iframe => {
    const src = iframe.src;
    if (src && src !== 'about:blank' && src !== '' && iframe.style.display !== 'none' && !iframe.dataset.loaded) {
        iframe.style.visibility = 'hidden';
        iframe.src = 'about:blank';
        iframe.dataset.loaded = 'true'; // ставим флаг сразу
        setTimeout(() => {
            iframe.src = src;
            iframe.style.visibility = '';
        }, 50);
       }
     });

    }

    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    history.pushState({ tab: tabId }, '', `#${tabId}`);

    window.scrollTo(0, 0);
}

function showTabSilent(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    const btn = document.querySelector(`[onclick="showTab('${tabId}', event)"]`);
    if (btn) btn.classList.add('active');
}

window.addEventListener('popstate', (e) => {
    const tabId = e.state?.tab || 'home';
    showTabSilent(tabId);
});

window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) showTabSilent(hash);
});

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

// Touch fix: анимация + навигация для a.btn-main
document.querySelectorAll('a.btn-main').forEach(link => {
    let startY = 0;
    let moved = false;

    link.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        moved = false;
        this.classList.add('is-active');
    }, { passive: true });

    link.addEventListener('touchmove', function() {
        moved = true;
        this.classList.remove('is-active');
    }, { passive: true });

    link.addEventListener('touchend', function(e) {
        if (moved) {
            this.classList.remove('is-active');
            return;
        }
        e.preventDefault();
        const href = this.getAttribute('href');
        const el = this;
        setTimeout(() => {
            el.classList.remove('is-active');
            if (href) window.location.href = href;
        }, 180);
    }, { passive: false });
});

// Touch fix: анимация для btn-link, text-link, lang-btn
document.querySelectorAll('a.btn-link, a.text-link, a.lang-btn').forEach(link => {
    let moved = false;
    let startY = 0;

    link.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        moved = false;
        this.classList.add('is-active');
    }, { passive: true });

    link.addEventListener('touchmove', function(e) {
        if (Math.abs(e.touches[0].clientY - startY) > 8) {
            moved = true;
            this.classList.remove('is-active');
        }
    }, { passive: true });

    link.addEventListener('touchend', function() {
        setTimeout(() => this.classList.remove('is-active'), 150);
    }, { passive: true });
});

function showInnerTab(id, event) {
  const content = document.getElementById(id);
  const btn = event.currentTarget;
  const isActive = content.classList.contains('active');

  document.querySelectorAll('.inner-tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn[onclick*="showInnerTab"]').forEach(el => el.classList.remove('active'));

  if (!isActive) {
    content.classList.add('active');
    btn.classList.add('active');
    if (id === 'pdf-kompressor' && !content.dataset.loaded) {
      loadPdfCompressor();
      content.dataset.loaded = 'true';
    }
    if (id === 'pdf-foto' && !content.dataset.loaded) {
      loadPhotoToPdf();
      content.dataset.loaded = 'true';
    }
  }
}
