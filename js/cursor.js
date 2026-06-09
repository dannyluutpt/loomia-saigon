(function initCursor() {
    if (window.matchMedia('(hover: none)').matches) return;

    /* ── DOM elements ── */
    const dot  = document.createElement('div');
    const ring = document.createElement('div');

    const base = `
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-50%, -50%);
        will-change: left, top;
    `;

    dot.style.cssText = base + `
        width: 10px;
        height: 10px;
        background: #e5c158;
        box-shadow: 0 0 8px 2px rgba(229,193,88,0.7);
        transition: transform 0.1s ease;
    `;

    ring.style.cssText = base + `
        width: 38px;
        height: 38px;
        border: 1.5px solid rgba(229,193,88,0.75);
        background: transparent;
        transition: transform 0.15s ease;
    `;

    document.body.appendChild(ring);
    document.body.appendChild(dot);

    /* ── Positions ── */
    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Dot snaps instantly
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });

    /* Ring follows with lerp lag */
    const LERP = 0.12;
    function tick() {
        ringX += (mouseX - ringX) * LERP;
        ringY += (mouseY - ringY) * LERP;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(tick);
    }
    tick();

    /* Shrink ring on click */
    document.addEventListener('mousedown', () => {
        ring.style.transform  = 'translate(-50%, -50%) scale(0.7)';
        dot.style.transform   = 'translate(-50%, -50%) scale(0.8)';
    });
    document.addEventListener('mouseup', () => {
        ring.style.transform  = 'translate(-50%, -50%) scale(1)';
        dot.style.transform   = 'translate(-50%, -50%) scale(1)';
    });

    /* Hide default cursor */
    const style = document.createElement('style');
    style.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(style);
})();
