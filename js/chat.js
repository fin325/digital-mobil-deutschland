// js/chat.js — Floating chat widget for Digital & Mobil in Deutschland
// Bilingual (DE/RU), reads page language from <html lang="..."> attribute
// Streaming responses with smooth typing animation (humanlike pace)

(function () {
  'use strict';

  const ENDPOINT = '/api/chat';
  const STORAGE_KEY = 'dmd_chat_history';
  const MAX_HISTORY = 20;

  const PAGE_LANG = (document.documentElement.lang || 'de').toLowerCase().startsWith('ru') ? 'ru' : 'de';

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
      welcome:        `Hallo! <span class="icon-emoji icon-1f44b"></span> Ich bin der Assistent der Website "${SITE_NAME}". Ich kann Ihnen sagen, was es auf der Website gibt, und helfe Ihnen, das zu finden, was Sie brauchen <span class="icon-emoji icon-1f642"></span>`,
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
      welcome:        `Здравствуйте! <span class="icon-emoji icon-1f44b"></span> Я ассистент сайта "${SITE_NAME}". Я могу рассказать вам что есть на сайте и помогу с навигацией по контенту <span class="icon-emoji icon-1f642"></span>`,
      clearConfirm:   'Очистить историю?',
      cleared:        'История очищена. Чем могу помочь?',
      errorPrefix:    'Ошибка: ',
      errorRetry:     '. Попробуйте позже.',
      emptyReply:     'Пустой ответ сервера',
    }
  };

  const SUGGESTIONS = {
    de: [
      { label: '<span class="icon-emoji icon-1f4c4"></span> Alles für PDF',   q: 'Was kann ich mit PDF24 Tools machen? Ich möchte eine PDF für E-Mail vorbereiten.' },
      { label: '<span class="icon-emoji icon-1f3e5"></span> Arzt finden',    q: 'Wo finde ich einen Arzt aus Osteuropa in NRW?' },
      { label: '<span class="icon-emoji icon-1f3e0"></span> Wohnung suchen', q: 'Wo kann ich eine Wohnung in Hattingen mieten?' },
      { label: '<span class="icon-emoji icon-1f4bc"></span> Arbeit finden',  q: 'Wo finde ich Jobangebote?' },
      { label: '<span class="icon-emoji icon-1f4f0"></span> Tagesschau',     q: 'Wo finde ich aktuelle Text-Nachrichten von der Tagesschau?' },
      { label: '<span class="icon-emoji icon-1f3ac"></span> News-Videos',    q: 'Wo finde ich Video-Nachrichten der Tagesschau?' },
    ],
    ru: [
      { label: '<span class="icon-emoji icon-1f4c4"></span> Все для PDF',           q: 'Что я могу сделать с помощью PDF24 Tools? Мне нужно подготовить PDF для email.' },
      { label: '<span class="icon-emoji icon-1f3e5"></span> Найти врача',            q: 'Как найти русскоязычного врача в NRW?' },
      { label: '<span class="icon-emoji icon-1f3e0"></span> Найти квартиру',         q: 'Где можно снять квартиру в Хаттингене?' },
      { label: '<span class="icon-emoji icon-1f4bc"></span> Найти работу',           q: 'Где найти вакансии?' },
      { label: '<span class="icon-emoji icon-1f4f0"></span> Новости текстом',        q: 'Где почитать текстовые новости из Германии?' },
      { label: '<span class="icon-emoji icon-1f3ac"></span> Видео-новости — Миша Бур', q: 'Где посмотреть видео-новости Германии от Миши Бура?' },
    ]
  };

  const t = UI[PAGE_LANG];
  const suggestionList = SUGGESTIONS[PAGE_LANG];

  let messages = [];
  let isLoading = false;

  let fab, windowEl, messagesEl, inputEl, sendBtn, closeBtn, suggestionsEl;

  let savedScrollY = 0;
  let pageScrollLocked = false;

  // === Typing animation tuning ===
  // Lower TYPING_SPEED_MS = faster. Higher TYPING_BURST = more chars per tick.
  // Defaults (12ms / 2 chars) ≈ ~167 chars/sec — comfortable reading pace.
  const TYPING_SPEED_MS = 20;
  const TYPING_BURST = 1;

  function createUI() {
    fab = document.createElement('button');
    fab.className = 'chat-fab pulse';
    fab.setAttribute('aria-label', t.fabAria);
    fab.innerHTML = '<span class="icon-emoji icon-1f4ac"></span>';
    document.body.appendChild(fab);

    windowEl = document.createElement('div');
    windowEl.className = 'chat-window';
    windowEl.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-title">
          <span class="icon-emoji icon-1f6f8"></span>
          <span>${escapeHtml(t.headerTitle)}</span>
        </div>
        <div class="chat-header-actions">
          <button class="chat-clear" aria-label="${escapeAttr(t.clearAria)}" title="${escapeAttr(t.clearAria)}">
            <span class="icon-emoji icon-1f5d1"></span>
          </button>
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
      windowEl.classList.add('compact');
      preventPageScrollOnFocus();
    });
    inputEl.addEventListener('blur', () => {
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

  if (messages.length === 0) {
    addMessage('assistant', t.welcome);
  } else {
    // Always show the latest messages first when reopening chat.
    // Two frames to ensure the window is rendered (display: none → flex)
    // before we measure scrollHeight.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        messagesEl.scrollTop = messagesEl.scrollHeight;
      });
    });
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
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (e) {}
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
        btn.innerHTML = s.label;
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
    const div = renderMessage(msg);
    saveHistory();
    scrollToBottom();
    return div;
  }

  function renderMessage(msg) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + msg.role;

    if (msg.role !== 'assistant') {
      div.textContent = msg.content;
      messagesEl.appendChild(div);
      return div;
    }

    renderAssistantContent(div, msg.content);
    messagesEl.appendChild(div);
    return div;
  }

  // Renders/updates the assistant message content.
  // Supports markers: [TAB:id|text], [TAB:id#anchor|text], [PAGE:path|text], [URL:url|text].
  function renderAssistantContent(div, text) {
    div.innerHTML = '';

    const regex = /\[(TAB|PAGE|URL):([^\]|]+)\|([^\]]+)\]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textSpan = document.createElement('span');
        textSpan.innerHTML = text.slice(lastIndex, match.index);
        div.appendChild(textSpan);
      }
      const kind   = match[1];
      const target = match[2].trim();
      const label  = match[3].trim();

      if (kind === 'TAB') {
        const [tabId, anchorId] = target.split('#');
        const btn = document.createElement('button');
        btn.className = 'chat-tab-link';
        btn.innerHTML = `<span class="icon-emoji icon-1f449"></span> ${escapeHtml(label)}`;
        btn.addEventListener('click', () => openTab(tabId, anchorId));
        div.appendChild(btn);
      } else if (kind === 'PAGE') {
        const link = document.createElement('a');
        link.className = 'chat-page-link';
        link.href = '/' + target.replace(/^\/+/, '');
        // Открываем в той же вкладке — чтобы sessionStorage чата сохранился
        link.innerHTML = `<span class="icon-emoji icon-1f517"></span> ${escapeHtml(label)}`;
        div.appendChild(link);
      } else if (kind === 'URL') {
        if (/^https?:\/\//i.test(target)) {
          const link = document.createElement('a');
          link.className = 'chat-url-link';
          link.href = target;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.innerHTML = `<span class="icon-emoji icon-1f310"></span> ${escapeHtml(label)}`;
          div.appendChild(link);
        } else {
          div.appendChild(document.createTextNode(label));
        }
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      const textSpan = document.createElement('span');
      textSpan.innerHTML = text.slice(lastIndex);
      div.appendChild(textSpan);
    }
  }

  function openTab(tabId, anchorId) {
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

    if (anchorId) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const anchor = document.getElementById(anchorId);
          if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            console.warn('chat.js: anchor #' + anchorId + ' not found, scrolling to top');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      });
    } else {
      requestAnimationFrame(() => {
        const opts = { top: 0, behavior: 'smooth' };
        window.scrollTo(opts);
        document.documentElement.scrollTo(opts);
        document.body.scrollTo(opts);
        document.querySelector('main.container')?.scrollTo(opts);
      });
    }
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

  // === Streaming send with smoothed typing animation ===
  // Groq sends the full reply very fast. We render it slowly via a typing
  // loop so the user can read along comfortably (like ChatGPT/Claude UX).
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    inputEl.value = '';
    inputEl.style.height = 'auto';
    addMessage('user', text);

    dismissKeyboard();

    setLoading(true);
    showTyping();

    let assistantDiv = null;
    let assistantMsg = null;

    // Typing-animation queue
    let pendingText = '';   // full buffer received from API so far
    let visibleText = '';   // what is currently rendered on screen
    let typingTimer = null;
    let streamingDone = false;

    function startTypingLoop() {
      if (typingTimer) return;
      typingTimer = setInterval(() => {
        if (visibleText.length >= pendingText.length) {
          // Caught up. If stream is finished — stop the timer.
          if (streamingDone) {
            clearInterval(typingTimer);
            typingTimer = null;
          }
          return;
        }
        const nextLen = Math.min(visibleText.length + TYPING_BURST, pendingText.length);
        visibleText = pendingText.slice(0, nextLen);
        renderAssistantContent(assistantDiv, visibleText);
        scrollToBottom();
      }, TYPING_SPEED_MS);
    }

    function stopTypingLoop() {
      streamingDone = true;
      // Don't clear immediately — let the loop drain remaining buffered chars
    }

    function waitForTypingFinish() {
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (visibleText.length >= pendingText.length) {
            clearInterval(check);
            if (typingTimer) {
              clearInterval(typingTimer);
              typingTimer = null;
            }
            resolve();
          }
        }, 30);
      });
    }

    try {
      const recentMessages = messages.slice(-MAX_HISTORY);
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: recentMessages, lang: PAGE_LANG, stream: true }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || '';

      // === Non-streaming fallback (still animated for consistent UX) ===
      if (!contentType.includes('text/event-stream') || !response.body) {
        const data = await response.json();
        const reply = (data.reply || '').trim();
        hideTyping();
        if (!reply) throw new Error(t.emptyReply);

        assistantMsg = { role: 'assistant', content: '' };
        messages.push(assistantMsg);
        assistantDiv = document.createElement('div');
        assistantDiv.className = 'chat-msg assistant';
        messagesEl.appendChild(assistantDiv);

        pendingText = reply;
        startTypingLoop();
        stopTypingLoop();
        await waitForTypingFinish();

        assistantMsg.content = reply;
        saveHistory();
        return;
      }

      // === Streaming path ===
      hideTyping();
      assistantMsg = { role: 'assistant', content: '' };
      messages.push(assistantMsg);
      assistantDiv = document.createElement('div');
      assistantDiv.className = 'chat-msg assistant';
      messagesEl.appendChild(assistantDiv);

      // Start typing animation now — it consumes pendingText as it grows
      startTypingLoop();

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let sseBuffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split('\n');
        sseBuffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === '[DONE]') continue;
          try {
            const json = JSON.parse(payload);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              pendingText += delta;
              // Don't render directly — typing loop handles it
            }
          } catch (e) {
            // Partial JSON — ignore, will be processed next chunk
          }
        }
      }

      // Stream finished. Tell typing loop it can stop after draining.
      stopTypingLoop();
      await waitForTypingFinish();

      assistantMsg.content = pendingText.trim();
      if (!assistantMsg.content) {
        assistantDiv.remove();
        const idx = messages.indexOf(assistantMsg);
        if (idx !== -1) messages.splice(idx, 1);
        throw new Error(t.emptyReply);
      }
      saveHistory();
    } catch (err) {
      hideTyping();
      if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
      }
      if (assistantDiv && !pendingText) {
        assistantDiv.remove();
        if (assistantMsg) {
          const idx = messages.indexOf(assistantMsg);
          if (idx !== -1) messages.splice(idx, 1);
        }
      }
      console.error('Chat error:', err);
      showError(t.errorPrefix + err.message + t.errorRetry);
    } finally {
      setLoading(false);
      dismissKeyboard();
    }
  }

  function saveHistory() {
    // sessionStorage — технически необходимо для сохранения чата
    // при навигации между страницами в рамках одной сессии браузера.
    // Автоматически стирается при закрытии вкладки.
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
    } catch (e) {}
  }

  function loadHistory() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
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
