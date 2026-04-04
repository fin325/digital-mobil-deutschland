/**
 * Улучшенная функция для "умных" всплывающих подсказок
 */
function toggleLabel(element) {
    if (!element) return;

    const isShown = element.classList.contains('show-text');

    // 1. Закрываем все открытые подсказки и удаляем классы позиций
    document.querySelectorAll('.w-item').forEach(item => {
        item.classList.remove('show-text', 'tip-left', 'tip-right', 'tip-center');
    });

    // 2. Если подсказка была закрыта — открываем её
    if (!isShown) {
        // Вычисляем, где находится иконка относительно экрана
        const rect = element.getBoundingClientRect();
        const windowWidth = window.innerWidth;

        // Определяем направление открытия
        if (rect.left < 100) {
            element.classList.add('tip-left');   // Близко к левому краю
        } else if (rect.right > windowWidth - 100) {
            element.classList.add('tip-right');  // Близко к правому краю
        } else {
            element.classList.add('tip-center'); // Где-то посередине
        }

        element.classList.add('show-text');

        // 3. Автоматически скрываем через 3 секунды
        setTimeout(() => {
            if (element.classList.contains('show-text')) {
                element.classList.remove('show-text', 'tip-left', 'tip-right', 'tip-center');
            }
        }, 3000);
    }
}
