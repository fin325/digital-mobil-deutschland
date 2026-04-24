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

        // iframe reload только если уже загружен
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
    showTabSilent(e.state?.tab || 'home');
});

window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) showTabSilent(hash);

    // Скрываем подсказку при скролле меню
    const viewport = document.querySelector('.nav-scroll-viewport');
    if (viewport) {
        viewport.addEventListener('scroll', hideSwipeHint, { passive: true, once: true });
        // Скрываем подсказку при касании меню на мобильном
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

// Touch fix: анимация для button.btn-main
document.querySelectorAll('button.btn-main').forEach(btn => {
    btn.addEventListener('touchstart', function() {
        this.classList.add('is-active');
    }, { passive: true });

    btn.addEventListener('touchend', function() {
        setTimeout(() => this.classList.remove('is-active'), 180);
    }, { passive: true });
});


// ===== Telegram In-App Browser detect (для обычных ссылок) =====
if (/Telegram/i.test(navigator.userAgent)) {
  document.documentElement.classList.add("tg-browser");
}

// ===== Telegram WebApp init (только для Mini App через бота) =====
(function () {
  if (!window.Telegram?.WebApp) return;

  // Помечаем html классом — для CSS-правил только в Telegram Mini App
  document.documentElement.classList.add("telegram");

  const tg = window.Telegram.WebApp;

  tg.ready();
  tg.expand();
  tg.disableVerticalSwipes?.();

  // Цвет совпадает с meta theme-color в head — #1a3a5c
  tg.setHeaderColor("#1a3a5c");
  tg.setBackgroundColor("#1a3a5c");
})();

const scrollTopBtn = document.querySelector('.scroll-top-btn');
let scrollTimer;

// Определяем реальный скролл-контейнер (html или body)
function getScrollTop() {
  return document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function getScrollContainer() {
  // В большинстве случаев это scrollingElement
  return document.scrollingElement || document.documentElement;
}

// Слушаем скролл на документе
document.addEventListener('scroll', () => {
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
}, { passive: true });

// Прокрутка наверх
scrollTopBtn?.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  const container = getScrollContainer();
  container.scrollTo({ top: 0, behavior: 'smooth' });
});
