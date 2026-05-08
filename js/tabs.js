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
  if (typeof showTab === 'function') {
    showTab('news-hattingen', event);
  }

  const btn = event.currentTarget;
  if (!btn) return;

  const video = btn.querySelector('.hattingen-video');
  const source = video && video.querySelector('source');
  if (!video || !source) return;

  if (btn.classList.contains('video-active')) return;

  // На ПК: если юзер уже запускал любой iframe — видео не воспроизводим
  // (после iframe видео всё равно не отображается до перезагрузки страницы)
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isDesktop && window._hattingenIframeUsed) {
    return; // Просто переключаемся на вкладку, без анимации
  }

  // Lazy-load: подгружаем src только при первом клике
  if (!source.getAttribute('src')) {
    const realSrc = source.getAttribute('data-src');
    if (realSrc) {
      source.setAttribute('src', realSrc);
      video.load();
    }
  }

  // Запускаем видео — но показываем только когда реально играет
  video.currentTime = 0;
  const playPromise = video.play();
  
  if (playPromise && playPromise.then) {
    playPromise.then(function() {
      btn.classList.add('video-active');
      
      clearTimeout(btn._hattingenTimer);
      btn._hattingenTimer = setTimeout(function() {
        btn.classList.remove('video-active');
        video.pause();
        video.currentTime = 0;
      }, 6000);
    }).catch(function(err) {
      console.warn('Video play failed:', err);
    });
  }
};

/* === Управление видео Hattingen === */
(function() {
    function stopHattingenVideo() {
        const btn = document.querySelector('.nav-btn--hattingen.video-active');
        if (!btn) return;

        const video = btn.querySelector('.hattingen-video');
        btn.classList.remove('video-active');
        clearTimeout(btn._hattingenTimer);

        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }

    // Останавливаем видео при клике на любую другую вкладку навбара (все устройства)
    document.addEventListener('click', function(e) {
        const clickedBtn = e.target.closest('.nav-btn');
        if (clickedBtn && !clickedBtn.classList.contains('nav-btn--hattingen')) {
            stopHattingenVideo();
        }
    });

    // Только для ПК: скролл-стоп + блокировка после iframe
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        // Стоп при скролле
        window.addEventListener('wheel', stopHattingenVideo, { passive: true });
        window.addEventListener('scroll', stopHattingenVideo, { passive: true });

        // Детектим взаимодействие с iframe — после этого видео в кнопке отключается
        function markIframeInteracted() {
            window._hattingenIframeUsed = true;
        }

        // Способ 1: клик по самому элементу iframe
        document.addEventListener('click', function(e) {
            const iframe = e.target.closest('iframe') ||
                           (e.target.tagName === 'IFRAME' ? e.target : null);
            if (iframe) {
                markIframeInteracted();
            }
        });

        // Способ 2: страховка — потеря фокуса с переходом на iframe
        window.addEventListener('blur', function() {
            if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
                markIframeInteracted();
            }
        });
    }
})();

// ============================================
// УНИВЕРСАЛЬНАЯ СИСТЕМА видео-кнопок навбара
// Работает для любой кнопки из конфига VIDEO_BUTTONS
// HTML-шаблон для кнопки:
//   <button class="nav-btn nav-btn--img nav-btn--video nav-btn--ИМЯ" 
//           onclick="playVideoButton(event)">
//     <img class="nav-btn-img" src="..." alt="...">
//     <video class="nav-btn-video" muted playsinline preload="auto" ...>
//       <source src="/videos/ИМЯ-video1.mp4" type="video/mp4">
//     </video>
//   </button>
// CSS:
//   По умолчанию: видна PNG, видео скрыто
//   .is-playing на кнопке → видео видно, PNG скрыта
// ============================================

// Конфигурация всех видео-кнопок: класс кнопки → ID вкладки
// Для добавления новой кнопки достаточно одной строки здесь
const VIDEO_BUTTONS = {
  'nav-btn--startseite':  { tabId: 'home'    },
  'nav-btn--pdf':         { tabId: 'pdf'     },
  'nav-btn--arzten':      { tabId: 'health'  },
  'nav-btn--auto':        { tabId: 'auto'    },
  'nav-btn--maps':        { tabId: 'maps'    },
  'nav-btn--translate':   { tabId: 'translate' },
  'nav-btn--kontakt':     { tabId: 'contacts' },
  'nav-btn--nachrichten': { tabId: 'news'    },
  'nav-btn--arbeit':      { tabId: 'jobs'    },
  'nav-btn--meinung':     { tabId: 'meinung' },
  'nav-btn--housing':     { tabId: 'housing' },
  'nav-btn--laws':        { tabId: 'laws'    },
  'nav-btn--db':          { tabId: 'mobile'  },
  'nav-btn--projekt':     { tabId: 'project' },
};

// Универсальный обработчик клика — работает на всех устройствах
window.playVideoButton = function(event) {
  const button = event.currentTarget;
  
  // Находим конфиг для этой кнопки по классу
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

  const v = button.querySelector('.nav-btn-video');
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  
  // Воспроизводим видео только на мобильных
  if (v && !v._isPlaying) {
    v._isPlaying = true;
    v._hasPlayed = true;
    v.currentTime = 0;
    
    // Включаем режим "видео играет" — CSS сам скроет PNG и покажет видео
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
  
  // Переключаем таб
  if (typeof showTab === 'function') {
    showTab(config.tabId, event);
  }
};

// Подготовка первых кадров и обработчики — только для мобильных
(function() {
  // const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  // if (isDesktop) return;

  // Инициализируем все видео из конфига
  Object.keys(VIDEO_BUTTONS).forEach(buttonClass => {
    const button = document.querySelector('.' + buttonClass);
    if (!button) return;
    
    const video = button.querySelector('.nav-btn-video');
    if (!video) return;

    video._isPlaying = false;
    video._hasPlayed = false;
    video._buttonClass = buttonClass;

    // Принудительная загрузка первого кадра как "превью"
    function showFirstFrame() {
      if (video._hasPlayed) return;
      video.pause();
      
      if (video.readyState >= 2) {
        video.currentTime = 0.1;
      } else {
        video.addEventListener('loadeddata', function onLoaded() {
          video.currentTime = 0.1;
          video.removeEventListener('loadeddata', onLoaded);
        });
      }
    }

    video.load();
    showFirstFrame();
    setTimeout(showFirstFrame, 500);
    setTimeout(showFirstFrame, 1500);

    // Видео доиграло — остаёмся на последнем кадре (НЕ возвращаем PNG здесь)
    video.addEventListener('ended', function() {
      video._isPlaying = false;
      // is-playing остаётся — видео остаётся на последнем кадре
    });
  });

  // Один общий обработчик клика — сбрасывает чужие видео при переключении
  document.addEventListener('click', function(e) {
    const clickedBtn = e.target.closest('.nav-btn');
    if (!clickedBtn) return;

    Object.keys(VIDEO_BUTTONS).forEach(buttonClass => {
      const button = document.querySelector('.' + buttonClass);
      if (!button) return;
      
      const video = button.querySelector('.nav-btn-video');
      if (!video) return;
      
      // Сбросить это видео, если кликнули НЕ на его кнопку
      if (!clickedBtn.classList.contains(buttonClass)) {
        video.pause();
        video.currentTime = 0;
        video._isPlaying = false;
        video._hasPlayed = false;
        // Снимаем класс is-playing — CSS вернёт PNG мгновенно
        button.classList.remove('is-playing');
      }
    });
  });
})();

// ============================================
// УНИВЕРСАЛЬНАЯ СИСТЕМА WEBP-кнопок навбара
// WebP с loop=1 — играет в фоне под PNG, останавливается на последнем кадре
// При тапе — синхронный перезапуск + скрытие PNG (без "двойной анимации")
// HTML-шаблон:
//   <button class="nav-btn nav-btn--img nav-btn--webp nav-btn--ИМЯ" 
//           onclick="playWebpButton(event)">
//     <img class="nav-btn-img" src="..." alt="...">
//     <img class="nav-btn-webp" data-src="/path/to/animation.webp" alt="...">
//   </button>
// ============================================

// Конфигурация всех WebP-кнопок: класс кнопки → ID вкладки
const WEBP_BUTTONS = {
  'nav-btn--nachrichten': { tabId: 'news' },
  // 'nav-btn--db': { tabId: 'mobile' },
};

// Универсальный обработчик клика для WebP-кнопок
window.playWebpButton = function(event) {
  const button = event.currentTarget;
  
  // Находим конфиг для этой кнопки по классу
  let config = null;
  for (const className in WEBP_BUTTONS) {
    if (button.classList.contains(className)) {
      config = WEBP_BUTTONS[className];
      break;
    }
  }
  if (!config) return;
  
  const webpImg = button.querySelector('.nav-btn-webp');
  
  if (webpImg) {
    const baseSrc = webpImg.dataset.src;
    if (baseSrc) {
      // СИНХРОННО: сначала меняем src, потом показываем
      // Браузер обновит изображение к моменту следующей отрисовки кадра
      webpImg.src = baseSrc + '?t=' + Date.now();
      
      // В следующем кадре — показываем анимацию (PNG исчезает)
      // requestAnimationFrame гарантирует что src уже применился
      requestAnimationFrame(() => {
        button.classList.add('is-playing');
      });
    }
  }
  
  // Переключаем таб
  if (typeof showTab === 'function') {
    showTab(config.tabId, event);
  }
};

// Предзагрузка WebP при загрузке страницы (играет в фоне под PNG)
(function() {
  Object.keys(WEBP_BUTTONS).forEach(buttonClass => {
    const button = document.querySelector('.' + buttonClass);
    if (!button) return;
    
    const webpImg = button.querySelector('.nav-btn-webp');
    if (!webpImg) return;
    
    const src = webpImg.dataset.src;
    if (!src) return;
    
    // WebP грузится сразу и проигрывается под PNG (не виден пользователю)
    // К моменту первого тапа анимация уже завершилась → loop=1 → стоп на последнем кадре
    webpImg.src = src;
  });

  // Обработчик клика по другим кнопкам — возвращаем PNG
  document.addEventListener('click', function(e) {
    const clickedBtn = e.target.closest('.nav-btn');
    if (!clickedBtn) return;

    Object.keys(WEBP_BUTTONS).forEach(buttonClass => {
      const button = document.querySelector('.' + buttonClass);
      if (!button) return;
      
      // Сбросить эту WebP-кнопку, если кликнули НЕ на неё
      if (!clickedBtn.classList.contains(buttonClass)) {
        button.classList.remove('is-playing');
      }
    });
  });
})();



