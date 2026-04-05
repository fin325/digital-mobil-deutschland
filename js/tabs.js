function showTab(tabId, event) {
    const allTabs = document.querySelectorAll('.tab-content');
    const targetTab = document.getElementById(tabId);
    
    if (!targetTab) return;

    // 1. Скрываем все вкладки
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // 2. Убираем активность с кнопок
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    // 3. Показываем новую вкладку с небольшой задержкой (убирает глюки)
    requestAnimationFrame(() => {
        if (event && event.currentTarget) {
            event.currentTarget.classList.add('active');
        }

        targetTab.classList.add('active');
        
        // Скролл страницы вверх
        window.scrollTo({ top: 0, behavior: 'instant' });
    });

    // Скрываем подсказку свайпа
    hideSwipeHint();
}