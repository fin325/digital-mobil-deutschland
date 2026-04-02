/* === tabs.js — Переключение вкладок === */

function showTab(tabId, event) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');

    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    window.scrollTo(0, 0);
}
