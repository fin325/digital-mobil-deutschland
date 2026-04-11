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
            viewport.scrollTo({ left: viewport.scrollWidth, behavior: 'smooth' });
        } else {
            viewport.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }
}

function showTab(tabId, event) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    // Сохраняем скролл и замораживаем body
    const savedScroll = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScroll}px`;
    document.body.style.width = '100%';

    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.style.animation = 'none';
        targetTab.style.webkitAnimation = 'none';
        void targetTab.offsetHeight;
        targetTab.style.animation = '';
        targetTab.style.webkitAnimation = '';
        targetTab.classList.add('active');
    }

    // Размораживаем и восстанавливаем позицию
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body​​​​​​​​​​​​​​​​
