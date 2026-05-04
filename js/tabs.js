// Отключаем авто-восстановление позиции скролла браузером при перезагрузке
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

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
        viewport.scrollTo({
            left: direction === 1 ? viewport.scrollWidth : 0,
            behavior: 'smooth'
        });
    }
}

function showTab(tabId, event) {
    hideSwipeHint();

    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById(tabId);

    if (targetTab) {
        targetTab.style.animation = 'none';
        void targetTab.offsetHeight;
        targetTab.style.animation = '';

        targetTab.classList.add('active');
        window.dispatchEvent(new Event('resize'));

        targetTab.querySelectorAll('iframe').forEach(iframe => {
            const src = iframe.src;

            if (src && iframe.dataset.loaded && !targetTab.dataset.iframeReloaded) {
                iframe.style.visibility = 'hidden';
                iframe.src = 'about:blank';

                setTimeout(() => {
                    iframe.src = src;
                    iframe.style.visibility = '';
                }, 50);
            }
        });

        targetTab.dataset.iframeReloaded = 'true';
    }

    if (event?.currentTarget) event.currentTarget.classList.add('active');

    history.pushState({ tab: tabId }, '', `#${tabId}`);

    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);
    document.querySelector('main.container')?.scrollTo(0, 0);
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
    showTabSilent(e.state?.tab || 'home');
});

window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) showTabSilent(hash);

    const scrollAllToTop = () => {
        document.documentElement.scrollTo(0, 0);
        document.body.scrollTo(0, 0);
        document.querySelector('main.container')?.scrollTo(0, 0);
        window.scrollTo(0, 0);
    };

    // Многократный сброс скролла, чтобы перебить попытки браузера прокрутить вниз
    scrollAllToTop();
    requestAnimationFrame(scrollAllToTop);
    setTimeout(scrollAllToTop, 0);
    setTimeout(scrollAllToTop, 100);
    setTimeout(scrollAllToTop, 300);

    // И ещё раз после полной загрузки (когда картинки догрузились)
    window.addEventListener('load', () => {
        scrollAllToTop();
        setTimeout(scrollAllToTop, 50);
    });

    const viewport = document.querySelector('.nav-scroll-viewport');
    if (viewport) {
        viewport.addEventListener('scroll', hideSwipeHint, { passive: true, once: true });
        viewport.addEventListener('touchstart', hideSwipeHint, { passive: true, once: true });
    }
});

// ====================== INNER TABS ======================

function showInnerTab(id, event) {
    const content = document.getElementById(id);
    const btn = event.currentTarget;
    const isActive = content.classList.contains('active');

    document.querySelectorAll('.inner-tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn[onclick*="showInnerTab"]').forEach(el => el.classList.remove('active'));

    if (!isActive) {
        content.classList.add('active');
        btn.classList.add('active');
    }
}

// ====================== TOUCH АНИМАЦИИ ======================

// Touch fix: анимация для button.btn-main
document.querySelectorAll('button.btn-main').forEach(btn => {
    btn.addEventListener('touchstart', function() {
        this.classList.add('is-active');
    }, { passive: true });

    btn.addEventListener('touchend', function() {
        setTimeout(() => this.classList.remove('is-active'), 180);
    }, { passive: true });
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

// ===== Telegram In-App Browser detect =====
if (/Telegram/i.test(navigator.userAgent)) {
    document.documentElement.classList.add("tg-browser");
}

// ===== Telegram WebApp init =====
(function () {
    if (!window.Telegram?.WebApp) return;

    document.documentElement.classList.add("telegram");

    const tg = window.Telegram.WebApp;

    tg.ready();
    tg.expand();
    tg.disableVerticalSwipes?.();

    tg.setHeaderColor("#1a3a5c");
    tg.setBackgroundColor("#1a3a5c");
})();

// ====================== КНОПКА "НАВЕРХ" ======================

const scrollTopBtn = document.querySelector('.scroll-top-btn');
let scrollTimer;

function getScrollTop() {
    return (
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        document.querySelector('main.container')?.scrollTop ||
        0
    );
}

function handleScroll() {
    const scrollY = getScrollTop();

    if (scrollY > 200) {
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
}

window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
document.addEventListener('scroll', handleScroll, { passive: true, capture: true });

const mainContainer = document.querySelector('main.container');
if (mainContainer) {
    mainContainer.addEventListener('scroll', handleScroll, { passive: true });
}

function scrollToTop() {
    const options = { top: 0, behavior: 'smooth' };
    document.documentElement.scrollTo(options);
    document.body.scrollTo(options);
    document.querySelector('main.container')?.scrollTo(options);
    window.scrollTo(options);
}

scrollTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToTop();
});

scrollTopBtn?.addEventListener('touchend', (e) => {
    e.preventDefault();
    scrollToTop();
}, { passive: false });

// ====================== DRAG-TO-SCROLL ДЛЯ МЕНЮ ======================

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

/* === Hattingen-кнопка с видео-анимацией === */
window.showTabHattingen = function(event) {
  // Стандартное поведение: открываем вкладку
  if (typeof showTab === 'function') {
    showTab('news-hattingen', event);
  }

  // Анимация видео внутри иконки
  const btn = event.currentTarget;
  if (!btn || !btn.classList.contains('nav-btn-hattingen')) return;

  const video = btn.querySelector('.hattingen-icon-video');
  const source = video && video.querySelector('source');
  if (!video || !source) return;

  // Если уже играет — не запускаем повторно
  if (btn.classList.contains('video-active')) return;

  // Lazy-load: подгружаем src только при первом клике
  if (!source.getAttribute('src')) {
    const realSrc = source.getAttribute('data-src');
    if (realSrc) {
      source.setAttribute('src', realSrc);
      video.load();
    }
  }

  // Запуск
  btn.classList.add('video-active');
  video.currentTime = 0;
  const playPromise = video.play();
  if (playPromise && playPromise.catch) {
    playPromise.catch(function(err) {
      console.warn('Hattingen video play failed:', err);
      btn.classList.remove('video-active');
    });
  }

  // Авто-возврат через 6 секунд
  clearTimeout(btn._hattingenTimer);
  btn._hattingenTimer = setTimeout(function() {
    btn.classList.remove('video-active');
    video.pause();
    video.currentTime = 0;
  }, 6000);
};

