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
// Видео-кнопка Meinung: воспроизведение по клику
// Останавливается на последнем кадре, сброс при переключении вкладок
// ============================================

(function() {
  const video = document.querySelector('.meinung-video');
  if (!video) return;

  let isPlaying = false;
  let hasPlayed = false; // флаг: видео уже проигрывалось хотя бы раз

  // Принудительная загрузка первого кадра как "превью"
  function showFirstFrame() {
    if (hasPlayed) return; // не сбрасывать, если уже проигрывалось
    
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

  // Запуск загрузки видео
  video.load();
  showFirstFrame();
  
  // Многократные попытки для iOS
  setTimeout(showFirstFrame, 500);
  setTimeout(showFirstFrame, 1500);

  // Обработчик окончания видео — остаемся на последнем кадре
  video.addEventListener('ended', function() {
    isPlaying = false;
    // Видео автоматически останавливается на последнем кадре
    // Ничего не делаем — currentTime уже равен длительности
  });

  // Воспроизведение по клику на кнопку
  window.playMeinungVideo = function(event) {
    const button = event.currentTarget;
    const v = button.querySelector('.meinung-video');
    
    if (v && !isPlaying) {
      isPlaying = true;
      hasPlayed = true;
      v.currentTime = 0;
      
      const playPromise = v.play();
      if (playPromise && playPromise.then) {
        playPromise.catch(err => {
          console.warn('Meinung video play failed:', err);
          isPlaying = false;
        });
      }
    }
    
    // Переключаем таб
    if (typeof showTab === 'function') {
      showTab('meinung', event);
    }
  };

  // Сброс на первый кадр при клике на любую другую кнопку навбара
  document.addEventListener('click', function(e) {
    const clickedBtn = e.target.closest('.nav-btn');
    if (clickedBtn && !clickedBtn.classList.contains('nav-btn--meinung')) {
      video.pause();
      video.currentTime = 0.1; // возврат к первому кадру
      isPlaying = false;
      hasPlayed = false; // разрешаем повторный показ первого кадра
    }
  });
})();
