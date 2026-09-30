/**
 * The motion language, in one place.
 *   ease   : expo-out for entrances and hovers, in-out only for clip reveals
 *   time   : micro 0.25–0.35s · hover 0.5–0.8s · reveal 0.8–1.2s
 *   stagger: 70ms, capped at 5 steps
 * Everything that hides content is gated behind html.motion-ready.
 */
export const MOTION_CSS = `
:root {
    --m-ease: cubic-bezier(.16, 1, .3, 1);
    --m-ease-io: cubic-bezier(.65, 0, .35, 1);
    --m-stagger: 70ms;
}

/* ---------- Scroll reveals (JS tags elements, adds data-in when they enter) ---------- */
.motion-ready [data-reveal]:not([data-done]) {
    transition:
        opacity .8s var(--m-ease) calc(var(--i, 0) * var(--m-stagger)),
        transform .9s var(--m-ease) calc(var(--i, 0) * var(--m-stagger)),
        clip-path 1s var(--m-ease-io) calc(var(--i, 0) * var(--m-stagger) + 80ms);
}
.motion-ready [data-reveal]:not([data-in]) { opacity: 0; transform: translate3d(0, 28px, 0); }
.motion-ready [data-reveal='fade']:not([data-in]) { transform: none; }

.motion-ready [data-reveal='mask']:not([data-in]) { opacity: 1; transform: translate3d(0, 28%, 0); clip-path: inset(0 0 100% 0); }
.motion-ready [data-reveal='mask'][data-in] { clip-path: inset(-15% -6% -15% -6%); }

.motion-ready [data-reveal='clip']:not([data-in]) { opacity: 1; transform: none; clip-path: inset(0 0 100% 0); }
.motion-ready [data-reveal='clip'][data-in] { clip-path: inset(0 0 0 0); }

/* ---------- Scroll progress ---------- */
.scroll-progress {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 2px;
    z-index: 40;
    background: var(--ink);
    transform-origin: 0 50%;
    transform: scaleX(var(--sp, 0));
    opacity: 0;
    pointer-events: none;
    transition: opacity .8s ease;
}
.portfolio-root.is-ready .scroll-progress { opacity: .85; }

/* ---------- Hero load sequence (waits for the intro via .is-ready) ---------- */
.hero-marquee-wrap { opacity: 0; transition: opacity 1.1s var(--m-ease); }
.hero-photo-wrap { position: relative; z-index: 2; display: block; transform: translate3d(0, var(--py, 0px), 0); }
.hero-photo-img {
    opacity: 0;
    transform: translate3d(0, 32px, 0) scale(.985);
    transition: opacity 1s var(--m-ease) .2s, transform 1.2s var(--m-ease) .2s;
}
.hero-role,
.hero-scroll-hint { opacity: 0; transform: translate3d(0, 14px, 0); }
.hero-role { transition: opacity .9s var(--m-ease) .6s, transform .9s var(--m-ease) .6s; }
.hero-scroll-hint { transition: opacity .9s var(--m-ease) .78s, transform .9s var(--m-ease) .78s; }

.portfolio-root.is-ready .hero-section.in-view .hero-marquee-wrap { opacity: 1; }
.portfolio-root.is-ready .hero-section.in-view .hero-photo-img { opacity: 1; transform: none; }
.portfolio-root.is-ready .hero-section.in-view .hero-role { opacity: 1; transform: none; }
.portfolio-root.is-ready .hero-section.in-view .hero-scroll-hint { opacity: .9; transform: none; }

/* ---------- Watermark drift (variables are 0 when parallax is off) ---------- */
.xp-watermark { transform: translate3d(var(--px, 0px), 0, 0); }
.ts-section .ts-watermark { transform: translateY(calc(-50% + var(--py, 0px))); }

/* ---------- Experience rows settle one after another once the panel arrives ---------- */
.motion-ready .xp-row {
    opacity: 0;
    transform: translate3d(0, 14px, 0);
    transition: opacity .8s var(--m-ease) calc(.3s + var(--r, 0) * 90ms), transform .8s var(--m-ease) calc(.3s + var(--r, 0) * 90ms);
}
.motion-ready .xp-section.is-visible .xp-row { opacity: 1; transform: none; }
.xp-row:nth-child(2) { --r: 1; }
.xp-row:nth-child(3) { --r: 2; }

/* ---------- Project cards ---------- */
.wc-card {
    cursor: pointer;
    overflow: hidden;
    border-radius: 6px;
    border: 1px solid var(--hair);
    background: var(--bg);
    color: var(--ink);
    outline: none;
    transition: border-color .3s var(--m-ease);
}
.wc-card:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
.wc-media { position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: var(--fill); }
.wc-img {
    position: absolute;
    left: 0; top: -9%;
    width: 100%; height: 118%;
    display: block;
    object-fit: cover;
    object-position: top;
    transform: translate3d(0, var(--py, 0px), 0);
    transition: scale .8s var(--m-ease);
    will-change: transform;
}
.motion-ready .wc-media[data-reveal]:not([data-in]) .wc-img { scale: 1.16; }
.wc-shade {
    position: absolute; inset: 0;
    background: rgba(0, 0, 0, .28);
    opacity: 0;
    transition: opacity .4s var(--m-ease);
    pointer-events: none;
}
.wc-arrow {
    position: absolute;
    top: 50%; left: 50%;
    width: 3rem; height: 3rem;
    margin: -1.5rem 0 0 -1.5rem;
    display: flex; align-items: center; justify-content: center;
    border-radius: 999px;
    background: var(--ink);
    color: var(--bg);
    opacity: 0;
    scale: .85;
    transition: opacity .35s var(--m-ease), scale .5s var(--m-ease);
    pointer-events: none;
}
.wc-arrow svg { transform: translate(-3px, 3px); transition: transform .5s var(--m-ease); }
.wc-title { transition: transform .5s var(--m-ease); }

.wc-card:focus-visible .wc-shade { opacity: 1; }
.wc-card:focus-visible .wc-arrow { opacity: 1; scale: 1; }
.wc-card:focus-visible .wc-arrow svg { transform: none; }

@media (hover: hover) and (pointer: fine) {
    .wc-card:hover { border-color: var(--ink); }
    .wc-card:hover .wc-img { scale: 1.04; }
    .wc-card:hover .wc-shade { opacity: 1; }
    .wc-card:hover .wc-arrow { opacity: 1; scale: 1; }
    .wc-card:hover .wc-arrow svg { transform: none; }
    .wc-card:hover .wc-title { transform: translate3d(4px, 0, 0); }

    .ts-section .ts-btn { transition: background-color .25s ease, color .25s ease, transform .35s var(--m-ease); }
    .ts-section .ts-btn:hover { transform: translate3d(0, -2px, 0); }
}

/* ---------- Button press feedback ---------- */
.ts-section .ts-btn:active { transform: scale(.98); }
.contact-section button.contact-cta:active:not(:disabled) { transform: scale(.98); }

/* ---------- Dock: one indicator that slides between tabs ---------- */
.dock-group .dock-item { z-index: 1; }
.dock-indicator {
    position: absolute;
    left: 0; top: 0;
    z-index: 0;
    border-radius: 22px;
    background: var(--ink);
    opacity: 0;
    pointer-events: none;
    transform: translate3d(var(--ix, 0px), calc(var(--iy, 0px) + var(--il, 0px)), 0) scale(var(--is, 1));
    transition: transform .45s var(--m-ease), width .45s var(--m-ease), height .45s var(--m-ease), opacity .25s ease;
}
.dock-group[data-indicator='on'] .dock-indicator { opacity: 1; }
.dock-group[data-indicator='on'] .dock-item.active { background: transparent; }
.dock-group[data-instant] .dock-indicator { transition: none; }
@media (hover: none) {
    .dock-indicator { transform: translate3d(var(--ix, 0px), var(--iy, 0px), 0); }
}

/* ---------- Reduced motion: everything visible, nothing travels ---------- */
@media (prefers-reduced-motion: reduce) {
    [data-reveal] { opacity: 1 !important; transform: none !important; clip-path: none !important; transition: none !important; }
    .hero-marquee-wrap, .hero-photo-img, .hero-role, .hero-scroll-hint { transition-duration: .01ms !important; transition-delay: 0s !important; }
    .hero-photo-img, .hero-role, .hero-scroll-hint { transform: none !important; }
    .hero-photo-wrap, .xp-watermark { transform: none !important; }
    .hero-marquee-track { animation: none !important; }
    .xp-row { transition: none !important; }
    .wc-img, .wc-shade, .wc-arrow, .wc-arrow svg, .wc-title, .dock-indicator { transition: none !important; }
    .wc-card:hover .wc-img, .wc-card:hover .wc-title { scale: 1; transform: none; }
}
`;
