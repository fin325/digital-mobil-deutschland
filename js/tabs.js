// Отключаем авто-восстановление позиции скролла браузером
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

    const btn = document.querySelector(`[onclick*="'${tabId}'"]`);
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

    scrollAllToTop();
    requestAnimationFrame(scrollAllToTop);
    setTimeout(scrollAllToTop, 0);
    setTimeout(scrollAllToTop, 100);
    setTimeout(scrollAllToTop, 300);

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

document.querySelectorAll('button.btn-main').forEach(btn => {
    btn.addEventListener('touchstart', function() {
        this.classList.add('is-active');
    }, { passive: true });

    btn.addEventListener('touchend', function() {
        setTimeout(() => this.classList.remove('is-active'), 180);
    }, { passive: true });
});

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

// ============================================
// УНИВЕРСАЛЬНАЯ СИСТЕМА медиа-кнопок навбара
// Мобильные: MP4 видео в .nav-btn-video (играет один раз, замирает на последнем кадре)
// ПК:        Анимированный WebP в .nav-btn-anim (loop=1, замирает на последнем кадре)
// При клике на ДРУГУЮ кнопку — текущее медиа сбрасывается до статичной картинки
// ============================================

const VIDEO_BUTTONS = {
  'nav-btn--startseite':  { tabId: 'home'    },
  'nav-btn--pdf':         { tabId: 'pdf'     },
  'nav-btn--arzten':      { tabId: 'health'  },
  'nav-btn--auto':        { tabId: 'auto'    },
  'nav-btn--maps':        { tabId: 'maps'    },
  'nav-btn--translate':   { tabId: 'translate' },
  'nav-btn--kontakt':     { tabId: 'contacts' },
  'nav-btn--hattingen':   { tabId: 'news-hattingen' },
  'nav-btn--nachrichten': { tabId: 'news'    },
  'nav-btn--arbeit':      { tabId: 'jobs'    },
  'nav-btn--meinung':     { tabId: 'meinung' },
  'nav-btn--housing':     { tabId: 'housing' },
  'nav-btn--laws':        { tabId: 'laws'    },
  'nav-btn--db':          { tabId: 'mobile'  },
  'nav-btn--projekt':     { tabId: 'project' },
};

window.playMediaButton = function(event) {
  const button = event.currentTarget;
  
  let config = null;
  let buttonClass = null;
  for (const className in VIDEO_BUTTONS) {
    if (button.classList.contains(className)) {
      config = VIDEO_BUTTONS[className];
      buttonClass = className;
      break;
    }
  }
  if (!config) return;

  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  
  if (isDesktop) {
    // === ПК: запускаем анимированный WebP ===
    const anim = button.querySelector('.nav-btn-anim');
    if (anim && !button.classList.contains('is-animating')) {
      const realSrc = anim.dataset.src;
      if (realSrc) {
        button.classList.add('is-animating');
        anim.removeAttribute('src');
        // requestAnimationFrame — гарантирует, что браузер обработает сброс перед новым src
        requestAnimationFrame(() => {
          anim.src = realSrc;
        });
      }
    }
  } else {
    // === Мобильные: запускаем MP4 ===
    const v = button.querySelector('.nav-btn-video');
    if (v && !v._isPlaying) {
      // Lazy-load: подгружаем src при первом клике
      const source = v.querySelector('source');
      if (source && !source.getAttribute('src')) {
        const realSrc = source.dataset.src;
        if (realSrc) {
          source.setAttribute('src', realSrc);
          v.load();
        }
      }
      
      v._isPlaying = true;
      v._hasPlayed = true;
      v.currentTime = 0;
      
      button.classList.add('is-playing');
      
      const playPromise = v.play();
      if (playPromise && playPromise.then) {
        playPromise.catch(err => {
          console.warn(buttonClass + ' play failed:', err);
          v._isPlaying = false;
          button.classList.remove('is-playing');
        });
      }
    }
  }
  
  if (typeof showTab === 'function') {
    showTab(config.tabId, event);
  }
};

// === Инициализация и сброс ===
(function() {
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  
  // Подготовка обработчиков для мобильных видео
  if (!isDesktop) {
    Object.keys(VIDEO_BUTTONS).forEach(buttonClass => {
      const button = document.querySelector('.' + buttonClass);
      if (!button) return;
      
      const video = button.querySelector('.nav-btn-video');
      if (!video) return;

      video._isPlaying = false;
      video._hasPlayed = false;
      video._buttonClass = buttonClass;

      // Видео доиграло — остаётся на последнем кадре (CSS-класс is-playing не снимаем)
      video.addEventListener('ended', function() {
        video._isPlaying = false;
      });
    });
  }

  // === Общий обработчик: сброс чужого медиа при переключении ===
  document.addEventListener('click', function(e) {
    const clickedBtn = e.target.closest('.nav-btn');
    if (!clickedBtn) return;

    Object.keys(VIDEO_BUTTONS).forEach(buttonClass => {
      const button = document.querySelector('.' + buttonClass);
      if (!button) return;
      
      // Если кликнули НЕ на эту кнопку — сбрасываем её медиа
      if (!clickedBtn.classList.contains(buttonClass)) {
        // Сброс видео (мобильные)
        const video = button.querySelector('.nav-btn-video');
        if (video) {
          video.pause();
          video.currentTime = 0;
          video._isPlaying = false;
          video._hasPlayed = false;
          button.classList.remove('is-playing');
        }
        
        // Сброс анимированного WebP (ПК)
        const anim = button.querySelector('.nav-btn-anim');
        if (anim) {
          anim.removeAttribute('src');
          button.classList.remove('is-animating');
        }
      }
    });
  });
})();
