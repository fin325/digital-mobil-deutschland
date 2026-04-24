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



// ===== Telegram WebApp init =====
(function () {
  if (!window.Telegram?.WebApp) return;

  const tg = window.Telegram.WebApp;

  tg.ready();
  tg.expand();
  tg.disableVerticalSwipes?.();
  tg.setHeaderColor("#0b1d3a");
  tg.setBackgroundColor("#0b1d3a");
})();
