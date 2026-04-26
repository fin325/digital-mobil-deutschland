// js/chat.js — Floating chat widget for Digital & Mobil in Deutschland
// Bilingual (DE/RU), reads page language from <html lang="..."> attribute

(function () {
  'use strict';

  const ENDPOINT = '/api/chat';
  const STORAGE_KEY_PREFIX = 'dmd_chat_history_';
  const MAX_HISTORY = 20;

  const PAGE_LANG = (document.documentElement.lang || 'de').toLowerCase().startsWith('ru') ? 'ru' : 'de';
  const STORAGE_KEY = STORAGE_KEY_PREFIX + PAGE_LANG;

  const SITE_NAME = 'Digital & Mobil in Deutschland';

  const UI = {
    de: {
      fabAria:        'Chat öffnen',
      headerTitle:    'DMD Assistent',
      closeAria:      'Chat schließen',
      clearAria:      'Verlauf löschen',
      placeholder:    'Frage stellen...',
      sendAria:       'Senden',
      disclaimer:     'KI-Antworten können Fehler enthalten. Keine Rechts- oder Medizinberatung.',
      welcome:        `Hallo! 👋 Ich bin der Assistent der Website "${SITE_NAME}". Wie kann ich helfen?`,
      clearConfirm:   'Verlauf löschen?',
      cleared:        'Verlauf gelöscht. Wie kann ich helfen?',
      errorPrefix:    'Fehler: ',
      errorRetry:     '. Bitte später erneut versuchen.',
      emptyReply:     'Leere Antwort vom Server',
    },
    ru: {
      fabAria:        'Открыть чат',
      headerTitle:    'Ассистент DMD',
      closeAria:      'Закрыть чат',
      clearAria:      'Очистить историю',
      placeholder:    'Задайте вопрос...',
      sendAria:       'Отправить',
      disclaimer:     'Ответы ИИ могут содержать ошибки. Не является юридической или медицинской консультацией.',
      welcome:        `Здравствуйте! 👋 Я ассистент сайта "${SITE_NAME}". Чем могу помочь?`,
      clearConfirm:   'Очистить историю?',
      cleared:        'История очищена. Чем могу помочь?',
      errorPrefix:    'Ошибка: ',
      errorRetry:     '. Попробуйте позже.',
      emptyReply:     'Пустой ответ сервера',
    }
  };

  const SUGGESTIONS = {
    de: [
      { label: '📄 PDF 24 Tools',   q: 'Was kann ich mit PDF24 Tools machen? Ich möchte eine PDF für E-Mail vorbereiten.' },
      { label: '🏥 Arzt finden',    q: 'Wo finde ich einen Arzt in Hattingen?' },
      { label: '🏠 Wohnung suchen', q: 'Wo kann ich eine Wohnung in Hattingen mieten?' },
      { label: '💼 Arbeit finden',  q: 'Wo finde ich Jobangebote?' },
      { label: '📰 Tagesschau',     q: 'Wo finde ich aktuelle Text-Nachrichten von der Tagesschau?' },
      { label: '🎬 News-Videos',    q: 'Wo finde ich Video-Nachrichten der Tagesschau?' },
    ],
    ru: [
      { label: '📄 PDF 24 Tools',           q: 'Что я могу сделать с помощью PDF24 Tools? Мне нужно подготовить PDF для email.' },
      { label: '🏥 Найти врача',            q: 'Как найти русскоязычного врача в NRW?' },
      { label: '🏠 Найти квартиру',         q: 'Где можно снять квартиру в Хаттингене?' },
      { label: '💼 Найти работу',           q: 'Где найти вакансии?' },
      { label: '📰 Новости текстом',        q: 'Где почитать текстовые новости из Германии?' },
      { label: '🎬 Видео-новости — Миша Бур', q: 'Где посмотреть видео-новости Германии от Миши Бура?' },
    ]
  };

  const t = UI[PAGE_LANG];
  const suggestionList = SUGGESTIONS[PAGE_LANG];

  let messages = [];
  let isLoading = false;

  let fab, windowEl, messagesEl, inputEl, sendBtn, closeBtn, suggestionsEl;

  let savedScrollY = 0;
  let pageScrollLocked = false;

  function createUI() {
    fab = document.createElement('button');
    fab.className = 'chat-fab pulse';
    fab.setAttribute('aria-label', t.fabAria);
    fab.innerHTML = '💬';
    document.body.appendChild(fab);

    windowEl = document.createElement('div');
    windowEl.className = 'chat-window';
    windowEl.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-title">
          <span>🤖</span>
          <span>${escapeHtml(t.headerTitle)}</span>
        </div>
        <div class="chat-header-actions">
          <button class="chat-clear" aria-label="${escapeAttr(t.clearAria)}" title="${escapeAttr(t.clearAria)}">🗑</button>
          <button class="chat-close" aria-label="${escapeAttr(t.closeAria)}">×</button>
        </div>
      </div>
      <div class="chat-messages" role="log" aria-live="polite"></div>
      <div class="chat-suggestions-viewport">
        <div class="chat-suggestions-rows"></div>
      </div>
      <div class="chat-input-area">
        <textarea class="chat-input" rows="1" placeholder="${escapeAttr(t.placeholder)}" aria-label="${escapeAttr(t.placeholder)}"></textarea>
        <button class="chat-send" aria-label="${escapeAttr(t.sendAria)}">➤</button>
      </div>
      <div class="chat-disclaimer">${escapeHtml(t.disclaimer)}</div>
    `;
    document.body.appendChild(windowEl);

    messagesEl    = windowEl.querySelector('.chat-messages');
    inputEl       = windowEl.querySelector('.chat-input');
    sendBtn       = windowEl.querySelector('.chat-send');
    closeBtn      = windowEl.querySelector('.chat-close');
    suggestionsEl = windowEl.querySelector('.chat-suggestions-rows');

    windowEl.querySelector('.chat-clear').addEventListener('click', clearHistory);
    renderSuggestions();
  }

  function bindEvents() {
    fab.addEventListener('click', openChat);
    closeBtn.addEventListener('click', closeChat);
    sendBtn.addEventListener('click', sendMessage);

    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    inputEl.addEventListener('input', () => {
      inputEl.style.height = 'auto';
      inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
    });

    inputEl.addEventListener('focus', () => {
      // Пользователь тапнул в поле — сжимаем окно до 60vh
      windowEl.classList.add('compact');
      preventPageScrollOnFocus();
    });
    inputEl.addEventListener('blur', () => {
      // Клавиатура скрылась — окно снова большое
      windowEl.classList.remove('compact');
      restorePageScroll();
    });
  }

  function preventPageScrollOnFocus() {
    savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${savedScrollY}px`;
    document.body.style.left     = '0';
    document.body.style.right    = '0';
    document.body.style.width    = '100%';
    pageScrollLocked = true;
  }

  function restorePageScroll() {
    if (!pageScrollLocked) return;
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.left     = '';
    document.body.style.right    = '';
    document.body.style.width    = '';
    window.scrollTo(0, savedScrollY);
    pageScrollLocked = false;
  }

  // Надёжное скрытие клавиатуры (iOS + Android)
  function dismissKeyboard() {
    if (inputEl) inputEl.blur();
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
  }

  function openChat() {
    fab.classList.add('hidden');
    fab.classList.remove('pulse');
    windowEl.classList.add('open');
    // Клавиатура НЕ появляется автоматически — фокус НЕ выставляем

    if (messages.length === 0) {
      addMessage('assistant', t.welcome);
    }
  }

  function closeChat() {
    windowEl.classList.remove('open');
    windowEl.classList.remove('compact');
    fab.classList.remove('hidden');
    if (pageScrollLocked) restorePageScroll();
  }

  function clearHistory() {
    if (!confirm(t.clearConfirm)) return;
    messages = [];
    messagesEl.innerHTML = '';
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    addMessage('assistant', t.cleared);
  }

  function renderSuggestions() {
    suggestionsEl.innerHTML = '';
    const half = Math.ceil(suggestionList.length / 2);
    const rows = [suggestionList.slice(0, half), suggestionList.slice(half)];

    rows.forEach((rowItems) => {
      const row = document.createElement('div');
      row.className = 'chat-suggestion-row';
      rowItems.forEach((s) => {
        const btn = document.createElement('button');
        btn.className = 'chat-suggestion';
        btn.textContent = s.label;
        btn.addEventListener('click', () => {
          if (isLoading) return;
          inputEl.value = s.q;
          sendMessage();
        });
        row.appendChild(btn);
      });
      suggestionsEl.appendChild(row);
    });
  }

  function addMessage(role, content) {
    const msg = { role, content };
    messages.push(msg);
    renderMessage(msg);
    saveHistory();
    scrollToBottom();
  }

  function renderMessage(msg) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + msg.role;

    if (msg.role !== 'assistant') {
      div.textContent = msg.content;
      messagesEl.appendChild(div);
      return;
    }

    const text = msg.content;
    const regex = /\[(TAB|PAGE|URL):([^\]|]+)\|([^\]]+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        div.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }
      const kind   = match[1];
      const target = match[2].trim();
      const label  = match[3].trim();

      if (kind === 'TAB') {
        const btn = document.createElement('button');
        btn.className = 'chat-tab-link';
        btn.textContent = '👉 ' + label;
        btn.addEventListener('click', () => openTab(target));
        div.appendChild(btn);
      } else if (kind === 'PAGE') {
        const link = document.createElement('a');
        link.className = 'chat-page-link';
        link.href = '/' + target.replace(/^\/+/, '');
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = '🔗 ' + label;
        div.appendChild(link);
      } else if (kind === 'URL') {
        if (/^https?:\/\//i.test(target)) {
          const link = document.createElement('a');
          link.className = 'chat-url-link';
          link.href = target;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = '🌐 ' + label;
          div.appendChild(link);
        } else {
          div.appendChild(document.createTextNode(label));
        }
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      div.appendChild(document.createTextNode(text.slice(lastIndex)));
    }
    messagesEl.appendChild(div);
  }

  function openTab(tabId) {
    closeChat();
    if (typeof window.showTab === 'function') {
      window.showTab(tabId);
    } else {
      const btn = document.querySelector(`.nav-btn[onclick*="'${tabId}'"]`);
      if (btn) {
        btn.click();
      } else {
        console.warn('chat.js: showTab() not available and no matching nav button for', tabId);
        return;
      }
    }
    requestAnimationFrame(() => {
      const opts = { top: 0, behavior: 'smooth' };
      window.scrollTo(opts);
      document.documentElement.scrollTo(opts);
      document.body.scrollTo(opts);
      document.querySelector('main.container')?.scrollTo(opts);
    });
  }

  function showError(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg error';
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'chat-typing';
    div.id = 'chat-typing-indicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById('chat-typing-indicator');
    if (el) el.remove();
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
  }

  function setLoading(loading) {
    isLoading = loading;
    sendBtn.disabled = loading;
    inputEl.disabled = loading;
    windowEl.querySelectorAll('.chat-suggestion').forEach(b => b.disabled = loading);
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    inputEl.value = '';
    inputEl.style.height = 'auto';
    addMessage('user', text);

    // Скрываем клавиатуру + расширяем окно (compact снимется через blur-listener)
    dismissKeyboard();

    setLoading(true);
    showTyping();

    try {
      const recentMessages = messages.slice(-MAX_HISTORY);
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: recentMessages, lang: PAGE_LANG }),
      });

      hideTyping();

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = (data.reply || '').trim();
      if (!reply) throw new Error(t.emptyReply);

      addMessage('assistant', reply);
    } catch (err) {
      hideTyping();
      console.error('Chat error:', err);
      showError(t.errorPrefix + err.message + t.errorRetry);
    } finally {
      setLoading(false);
      // Финальная подстраховка после снятия disabled
      dismissKeyboard();
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
    } catch (e) {}
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          messages = parsed;
          messages.forEach(renderMessage);
          scrollToBottom();
        }
      }
    } catch (e) {
      messages = [];
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function escapeAttr(s) { return escapeHtml(s); }

  function init() {
    createUI();
    bindEvents();
    loadHistory();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
