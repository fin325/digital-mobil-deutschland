class ScrollHint extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="scroll-hint-container">
                <div class="scroll-hint-left">
                    <div class="swipe-finger-wrapper">
                        <div class="swipe-finger">👇🏼</div>
                    </div>
                    <span class="scroll-hint-text">Свайп меню</span>
                </div>
                <div class="scroll-arrows">
                    <button class="arrow-btn" onclick="scrollTabs(-1)">←</button>
                    <button class="arrow-btn" onclick="scrollTabs(1)">→</button>
                </div>
            </div>
        `;
    }
}

// Регистрируем наш новый тег
customElements.define('scroll-hint', ScrollHint);
