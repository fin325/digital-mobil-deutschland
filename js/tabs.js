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

        // После загрузки страницы — тихо догружаем все видео в фоне
        // Картинки уже видны, видео весят мало (100-150кб) — грузим всё
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            // Только мобильные — на ПК видео не нужны
            setTimeout(() => {
                document.querySelectorAll('.nav-btn-video').forEach(video => {
                    if (video.preload !== 'auto') {
                        video.preload = 'auto';
                        video.load();
                    }
                });
            }, 1000); // задержка 1 сек — даём странице полностью отрисоваться
        }
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
    let startY = 0;
    link.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        this.classList.add('is-active');
    }, { passive: true });
    link.addEventListener('touchmove', function(e) {
        if (Math.abs(e.touches[0].clientY - startY) > 8) {
            this.classList.remove('is-active');
        }
    }, { passive: true });
    link.addEventListener('touchend', function() {
        setTimeout(() => this.classList.remove('is-active'), 150);
    }, { passive: true });
});

// ===== Telegram =====
if (/Telegram/i.test(navigator.userAgent)) {
    document.documentElement.classList.add("tg-browser");
}
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
document.querySelector('main.container')?.addEventListener('scroll', handleScroll, { passive: true });

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

// ====================== DRAG-TO-SCROLL ======================

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
// УНИВЕРСАЛЬНАЯ СИСТЕМА ВИДЕО-КНОПОК НАВБАРА
// ============================================

const VIDEO_BUTTONS = {
  'nav-btn--startseite':  { tabId: 'home'          },
  'nav-btn--pdf':         { tabId: 'pdf'            },
  'nav-btn--arzten':      { tabId: 'health'         },
  'nav-btn--auto':        { tabId: 'auto'           },
  'nav-btn--maps':        { tabId: 'maps'           },
  'nav-btn--translate':   { tabId: 'translate'      },
  'nav-btn--kontakt':     { tabId: 'contacts'       },
  'nav-btn--hattingen':   { tabId: 'news-hattingen' },
  'nav-btn--nachrichten': { tabId: 'news'           },
  'nav-btn--arbeit':      { tabId: 'jobs'           },
  'nav-btn--meinung':     { tabId: 'meinung'        },
  'nav-btn--housing':     { tabId: 'housing'        },
  'nav-btn--laws':        { tabId: 'laws'           },
  'nav-btn--db':          { tabId: 'mobile'         },
  'nav-btn--projekt':     { tabId: 'project'        },
};

// ====================== АВТОЗАПУСК АКТИВНОЙ КНОПКИ ======================

function autoPlayActiveButton() {
  const activeBtn = document.querySelector('.nav-btn.active.nav-btn--media');
  if (!activeBtn) return;

  const video = activeBtn.querySelector('.nav-btn-video');
  if (!video) return;

  // Сбрасываем другие кнопки
  resetAllOtherVideos(activeBtn);

  video._isPlaying = true;
  video._hasPlayed = true;
  video.currentTime = 0;

  const playVideo = () => {
    activeBtn.classList.add('is-playing');
    video.play().catch(err => {
      console.warn('Autoplay failed:', err);
      activeBtn.classList.remove('is-playing');
    });
  };

  if (video.readyState >= 2) {
    playVideo();
  } else {
    video.addEventListener('loadeddata', playVideo, { once: true });
    video.addEventListener('canplay', playVideo, { once: true });
    
    // Страховка
    setTimeout(playVideo, 600);
  }
}

// Сброс всех остальных видео
function resetAllOtherVideos(exceptBtn) {
  Object.keys(VIDEO_BUTTONS).forEach(cls => {
    const btn = document.querySelector('.' + cls);
    if (!btn || btn === exceptBtn) return;

    const v = btn.querySelector('.nav-btn-video');
    if (v) {
      v.pause();
      v.currentTime = 0;
      v._isPlaying = false;
      v._hasPlayed = false;
    }
    btn.classList.remove('is-playing');
  });
}

// ====================== ОСНОВНАЯ ФУНКЦИЯ КЛИКА ======================

window.playVideoButton = function(event) {   // ← можешь оставить playMediaButton, если хочешь
  const button = event.currentTarget;

  let config = null;
  for (const cls in VIDEO_BUTTONS) {
    if (button.classList.contains(cls)) {
      config = VIDEO_BUTTONS[cls];
      break;
    }
  }
  if (!config) return;

  const video = button.querySelector('.nav-btn-video');
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (!isDesktop && video) {
    resetAllOtherVideos(button);

    video._isPlaying = true;
    video._hasPlayed = true;
    video.currentTime = 0;

    button.classList.add('is-playing');

    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(err => {
        console.warn('Play failed:', err);
        button.classList.remove('is-playing');
      });
    }
  }

  // Переключаем таб
  if (typeof showTab === 'function') {
    showTab(config.tabId, event);
  }
};

// ====================== ИНИЦИАЛИЗАЦИЯ ======================

(function() {
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isDesktop) return; // на ПК видео не используем

  Object.keys(VIDEO_BUTTONS).forEach(buttonClass => {
    const button = document.querySelector('.' + buttonClass);
    if (!button) return;

    const video = button.querySelector('.nav-btn-video');
    if (!video) return;

    video._isPlaying = false;
    video._hasPlayed = false;

    // Предзагрузка первого кадра
    function preloadFirstFrame() {
      if (video.readyState >= 2) {
        video.currentTime = 0.05;
      }
    }

    video.load();
    preloadFirstFrame();
    setTimeout(preloadFirstFrame, 400);
    setTimeout(preloadFirstFrame, 1200);

    video.addEventListener('ended', () => {
      video._isPlaying = false;
      // .is-playing оставляем — видео остаётся на последнем кадре
    });
  });
})();

// ====================== ИНТЕГРАЦИЯ С ТАБАМИ ======================

// Обновляем showTabSilent
function showTabSilent(tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.classList.add('active');

  // Находим кнопку
  let activeButton = null;
  Object.keys(VIDEO_BUTTONS).forEach(cls => {
    if (VIDEO_BUTTONS[cls].tabId === tabId) {
      activeButton = document.querySelector('.' + cls);
    }
  });

  if (activeButton) {
    activeButton.classList.add('active');
    
    // Автозапуск видео при возврате
    setTimeout(() => {
      autoPlayActiveButton();
    }, 100);
  }
}

// В DOMContentLoaded добавляем автозапуск
window.addEventListener('DOMContentLoaded', () => {
  // ... твой существующий код ...

  const hash = window.location.hash.replace('#', '');
  if (hash) showTabSilent(hash);

  // ... остальной твой код scrollAllToTop и т.д. ...

  window.addEventListener('load', () => {
    // Автозапуск активной кнопки после полной загрузки
    setTimeout(autoPlayActiveButton, 150);
  });
});
