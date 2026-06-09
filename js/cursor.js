/* ==========================================
   GOLDEN COMET CURSOR EFFECT
   ========================================== */
(function initCometCursor() {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    /* ── Canvas overlay ── */
    const canvas = document.createElement('canvas');
    canvas.id = 'cometCursorCanvas';
    Object.assign(canvas.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '2147483647',
        mixBlendMode: 'screen'
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    /* ── State ── */
    const mouse    = { x: -300, y: -300 };
    const TRAIL_LEN = 35;
    const trail    = [];
    const sparkles = [];

    document.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        trail.push({ x: mouse.x, y: mouse.y });
        if (trail.length > TRAIL_LEN) trail.shift();

        // Spawn sparkle particles along the trail
        if (Math.random() < 0.4) {
            sparkles.push({
                x:    mouse.x + (Math.random() - 0.5) * 14,
                y:    mouse.y + (Math.random() - 0.5) * 14,
                vx:   (Math.random() - 0.5) * 1.8,
                vy:   (Math.random() - 0.5) * 1.8 - 0.8,
                life: 1,
                size: Math.random() * 2.5 + 0.8
            });
        }
    });

    /* ── Draw loop ── */
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* Comet tail ─ draw from oldest (dim, tiny) to newest (bright, large) */
        for (let i = 0; i < trail.length; i++) {
            const t        = trail[i];
            const progress = (i + 1) / trail.length; // 0→1 : tail→head
            const alpha    = progress * 0.75;
            const radius   = progress * 14 + 1;

            const g = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, radius);
            g.addColorStop(0,   `rgba(255, 240, 160, ${alpha})`);
            g.addColorStop(0.45,`rgba(229, 193,  88, ${alpha * 0.55})`);
            g.addColorStop(1,   `rgba(200, 140,  30, 0)`);

            ctx.beginPath();
            ctx.arc(t.x, t.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
        }

        /* Sparkles */
        for (let i = sparkles.length - 1; i >= 0; i--) {
            const s = sparkles[i];
            s.x    += s.vx;
            s.y    += s.vy;
            s.life -= 0.038;

            if (s.life <= 0.02) { sparkles.splice(i, 1); continue; }

            const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2.5);
            sg.addColorStop(0, `rgba(255, 252, 210, ${s.life})`);
            sg.addColorStop(1, `rgba(229, 193,  88, 0)`);

            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = sg;
            ctx.fill();
        }

        /* Main cursor glow head */
        if (mouse.x > -200) {
            // Wide soft aura
            const aura = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 32);
            aura.addColorStop(0,   'rgba(255, 235, 140, 0.85)');
            aura.addColorStop(0.35,'rgba(229, 193,  88, 0.45)');
            aura.addColorStop(1,   'rgba(200, 140,  30, 0)');
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 32, 0, Math.PI * 2);
            ctx.fillStyle = aura;
            ctx.fill();

            // Tight bright core
            const core = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 6);
            core.addColorStop(0,  'rgba(255, 255, 255, 1)');
            core.addColorStop(0.5,'rgba(255, 245, 180, 0.95)');
            core.addColorStop(1,  'rgba(229, 193,  88, 0)');
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = core;
            ctx.fill();
        }

        requestAnimationFrame(draw);
    }

    draw();

    /* ── Hide system cursor ── */
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after { cursor: none !important; }
    `;
    document.head.appendChild(style);
})();
