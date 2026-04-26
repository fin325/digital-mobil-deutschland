// js/chat.js — Floating chat widget for Digital & Mobil in Deutschland

(function () {
  'use strict';

  const ENDPOINT = '/api/chat';
  const STORAGE_KEY = 'dmd_chat_history';
  const MAX_HISTORY = 20; // last N messages sent to API

  let messages = []; // {role: 'user'|'assistant', content: string}
  let isLoading = false;

  // === DOM elements (created on init) ===
  let fab, windowEl, messagesEl, inputEl, sendBtn, closeBtn;

  function createUI() {
    // Floating Action Button
    fab = document.createElement('button');
    fab.className = 'chat-fab pulse';
    fab.setAttribute('aria-label', 'Chat öffnen');
    fab.innerHTML = '💬';
    document.body.appendChild(fab);

    // Chat window
    windowEl = document.createElement('div');
    windowEl.className = 'chat-window';
    windowEl.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-title">
          <span>🤖</span>
          <span>DMD Assistent</span>
        </div>
        <button class="chat-close" aria-label="Chat schließen">×</button>
      </div>
      <div class="chat-messages" role="log" aria-live="polite"></div>
      <div class="chat-input-area">
        <textarea class="chat-input" rows="1" placeholder="Frage stellen..." aria-label="Nachricht eingeben"></textarea>
        <button class="chat-send" aria-label="Senden">➤</button>
      </div>
      <div class="chat-disclaimer">KI-Antworten können Fehler enthalten. Keine Rechts- oder Medizinberatung.</div>
    `;
    document.body.appendChild(windowEl);

    messagesEl = windowEl.querySelector('.chat-messages');
    inputEl = windowEl.querySelector('.chat-input');
    sendBtn = windowEl.querySelector('.chat-send');
    closeBtn = windowEl.querySelector('.chat-close');
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
  }

  function openChat() {
    fab.classList.add('hidden');
    fab.classList.remove('pulse');
    windowEl.classList.add('open');
    setTimeout(() => inputEl.focus(), 100);

    if (messages.length === 0) {
      addMessage('assistant', 'Hallo! 👋 Ich bin der Assistent der Website "Digital & Mobil in Deutschland". Wie kann ich helfen? Sie können auf Deutsch oder Russisch fragen.');
    }
  }

  function closeChat() {
    windowEl.classList.remove('open');
    fab.classList.remove('hidden');
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
    div.textContent = msg.content;
    messagesEl.appendChild(div);
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
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    inputEl.value = '';
    inputEl.style.height = 'auto';
    addMessage('user', text);

    setLoading(true);
    showTyping();

    try {
      // Send only last MAX_HISTORY messages to keep context small
      const recentMessages = messages.slice(-MAX_HISTORY);

      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: recentMessages }),
      });

      hideTyping();

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply = (data.reply || '').trim();

      if (!reply) {
        throw new Error('Leere Antwort vom Server');
      }

      addMessage('assistant', reply);
    } catch (err) {
      hideTyping();
      console.error('Chat error:', err);
      showError('Fehler: ' + err.message + '. Bitte später erneut versuchen.');
    } finally {
      setLoading(false);
      inputEl.focus();
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
    } catch (e) {
      // Storage full or disabled — ignore
    }
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
