import ChatWidget from '@/components/chat-widget';
import DarkModeToggle from '@/components/dark-mode-toggle';
import LoadingScreen from '@/components/loading-screen';
import { HeroSection } from '@/components/portfolio/hero-section';
import { HomeSection } from '@/components/portfolio/home-section';
import { LiquidDock } from '@/components/portfolio/liquid-dock';
import { ProjectsSection } from '@/components/portfolio/projects-section';
import { SkillsSection } from '@/components/portfolio/skills-section';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Nav routing helpers                                                 */
/* ------------------------------------------------------------------ */

/**
 * The DOM section ids don't map 1:1 onto the 4 nav buttons — this table is
 * the single source of truth for which nav button should light up for each
 * section:
 *   hero    (top marquee/photo intro)         → Home
 *   home    (avatar, name, bio — "about me")   → About
 *   about   (tech stack / experience / edu)    → Skills
 *   skills  (Tech Stack card, nested in About) → Skills
 *   contact (Get-in-touch card, nested there)  → Skills
 *   projects                                   → Projects
 */
const SECTION_TO_NAV: Record<string, string> = {
    hero: 'home',
    home: 'about',
    about: 'skills',
    skills: 'skills',
    contact: 'skills',
    projects: 'projects',
};

/** Where each nav button should actually scroll to. "home" is a special
 *  case handled separately (always the literal top of the page). */
const NAV_TARGET: Record<string, string> = {
    home: 'hero',
    about: 'home',
    skills: 'about',
    projects: 'projects',
};

export default function Welcome() {
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState('home');
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    // While a nav click is smooth-scrolling the page, sections it scrolls
    // *past* (e.g. About while heading to Projects) can also briefly cross
    // the spy's intersection band and hijack `active` mid-flight. This ref
    // marks a short window after a manual click during which the scroll-spy
    // defers to the click's own target instead of what's passing by.
    const suppressSpyUntil = useRef(0);

    useEffect(() => {
        const spy = new IntersectionObserver(
            (entries) => {
                if (Date.now() < suppressSpyUntil.current) return; // a manual nav click is still settling
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(SECTION_TO_NAV[entry.target.id] ?? entry.target.id);
                });
            },
            { rootMargin: '-42% 0px -50% 0px', threshold: 0 },
        );

        const reveal = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('in-view');
                });
            },
            { threshold: 0.12 },
        );

        Object.values(sectionRefs.current).forEach((el) => {
            if (!el) return;
            spy.observe(el);
            reveal.observe(el);
        });

        return () => {
            spy.disconnect();
            reveal.disconnect();
        };
    }, []);

    const scrollTo = (id: string) => {
        setActive(id); // instant feedback — don't wait on the scroll-spy to catch up
        suppressSpyUntil.current = Date.now() + 900; // clears once the smooth scroll has settled

        // "Home" always means the very top of the page — window.scrollTo(0)
        // is more reliable than scrolling to the hero ref, since it can't be
        // thrown off by fixed/sticky offsets above it.
        if (id === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetId = NAV_TARGET[id] ?? id;
        sectionRefs.current[targetId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const setSectionRef = (id: string) => (el: HTMLElement | null) => {
        sectionRefs.current[id] = el;
    };

    return (
        <>
            {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

            <Head title="Portfolio">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800" rel="stylesheet" />
            </Head>

            <style>{`
                :root {
                    --bg: #ffffff;
                    --ink: #101010;
                    --muted: #5c5a56;
                    --hair: rgba(0,0,0,0.09);
                    --dock-space-mobile: 6rem;
                }
                :root.dark {
                    --bg: #0a0a0a;
                    --ink: #f5f5f5;
                    --muted: #a1a1a1;
                    --hair: rgba(255,255,255,0.12);
                }
                *, *::before, *::after { box-sizing: border-box; }
                .portfolio-root {
                    background: var(--bg);
                    color: var(--ink);
                    min-height: 100vh;
                    width: 100%;
                    overflow-x: hidden;
                    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
                    transition: background-color .3s ease, color .3s ease;
                }

                .site-chrome > * {
                    transition: opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1);
                    transform: translateY(0);
                }
                .site-chrome.site-chrome-hidden { pointer-events: none; }
                .site-chrome.site-chrome-hidden > * { opacity: 0; transform: translateY(16px); }
                .chat-widget-mobile-anchor {
                    transition: opacity .6s cubic-bezier(.16,1,.3,1) .1s, transform .6s cubic-bezier(.16,1,.3,1) .1s;
                }
                .chat-widget-mobile-anchor.site-chrome-hidden { opacity: 0; transform: translateY(16px); pointer-events: none; }

                .portfolio-main { margin-left: 0; min-width: 0; padding-bottom: var(--dock-space-mobile); }
                .section {
                    min-height: 100vh;
                    padding: 7rem 6vw 5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    border-bottom: 1px solid var(--hair);
                    opacity: 0;
                    transform: translateY(18px);
                    transition: opacity .7s ease, transform .7s ease;
                }
                .section.in-view { opacity: 1; transform: translateY(0); }
                @media (max-width: 820px) { .section { padding: 5.5rem 5.5vw 3.5rem; min-height: auto; } }
                @media (max-width: 480px) { .section { padding: 4.5rem 5vw 3rem; } }

                .eyebrow {
                    font-size: 0.75rem;
                    letter-spacing: .16em;
                    text-transform: uppercase;
                    color: var(--muted);
                    margin-bottom: 1.1rem;
                }
                .h1 { font-size: clamp(2.2rem, 6vw, 5rem); line-height: 1.05; font-weight: 600; letter-spacing: -0.02em; }
                .h2 { font-size: clamp(1.6rem, 3.4vw, 2.6rem); font-weight: 600; letter-spacing: -0.01em; margin-bottom: 0.75rem; }
                .section-intro { color: var(--muted); font-size: clamp(0.9rem, 1.2vw, 1rem); max-width: 56ch; line-height: 1.6; margin-bottom: 1.75rem; }
                .lead { color: var(--muted); font-size: clamp(1rem, 1.4vw, 1.15rem); max-width: 42ch; margin-top: 1.4rem; line-height: 1.6; }

                .card-title { font-size: 1.15rem; font-weight: 600; margin-bottom: .6rem; color: var(--ink); }
                .card-desc { color: var(--muted); font-size: .92rem; line-height: 1.55; }
                .tag-row { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.2rem; }
                .tag {
                    font-size: .75rem;
                    letter-spacing: .04em;
                    color: var(--muted);
                    border: 1px solid var(--hair);
                    border-radius: 999px;
                    padding: .3rem .7rem;
                }

                .foot {
                    color: var(--muted);
                    font-size: .8rem;
                    padding: 2rem 6vw calc(2rem + var(--dock-space-mobile));
                    text-align: center;
                }

                /* ---------- Floating liquid glass dark mode toggle ---------- */
                .glass-toggle-dock { position: fixed; top: 1.375rem; right: 1.375rem; z-index: 60; }
                .glass-toggle-btn {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 3.25rem;
                    height: 3.25rem;
                    border-radius: 1.125rem;
                    background: #101010;
                    border: 1px solid rgba(16,16,16,0.1);
                    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.16), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    color: #ffffff;
                    cursor: pointer;
                    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease, color 0.3s ease;
                }
                .glass-toggle-btn:hover { transform: scale(1.06); background: #1a1a1a; }
                :root.dark .glass-toggle-btn,
                .glass-toggle-btn[data-state='on'] {
                    background: #ffffff;
                    border-color: rgba(16,16,16,0.1);
                    color: #101010;
                    box-shadow: 0 18px 44px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.9);
                }
                :root.dark .glass-toggle-btn:hover,
                .glass-toggle-btn[data-state='on']:hover { background: #f5f5f5; }
                .glass-toggle-icon {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transform: scale(0.5) rotate(-90deg);
                    transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .glass-toggle-icon[data-active='true'] { opacity: 1; transform: scale(1) rotate(0deg); }
                @media (max-width: 820px) {
                    .glass-toggle-dock { top: 1rem; right: 1rem; }
                    .glass-toggle-btn { width: 2.875rem; height: 2.875rem; border-radius: 1rem; }
                }

                /* ---------- Chat widget: pinned to the true bottom edge, stacked
                   above the dock/toggle so an open chat panel visually covers them. ---------- */
               .chat-widget-mobile-anchor {
    display: block;
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 999;
}
                @media (max-width: 820px) {
                    .chat-widget-mobile-anchor { z-index: 999; pointer-events: none; }
                    .chat-widget-mobile-anchor > .chat-widget-fab {
                        bottom: calc(var(--dock-space-mobile) + 0.25rem) !important;
                    }
                }
                .chat-widget-mobile-anchor > * { pointer-events: auto; }

                /* ---- Liquid dock (bottom nav) ---- */
                .liquid-dock {
                    position: fixed;
                    z-index: 50;
                    left: 0;
                    right: 0;
                    top: auto;
                    bottom: calc(16px + env(safe-area-inset-bottom));
                    display: flex;
                    justify-content: center;
                    padding: 0 1rem;
                }
                .liquid-dock-glass {
                    --mx: 50%; --my: 0%; --glow: 0;
                    position: relative; display: inline-flex; flex-direction: row; align-items: center;
                    width: fit-content; max-width: calc(100vw - 2rem); padding: 0.5rem 0.75rem; gap: 0.5rem;
                    border-radius: 999px;
                    background: rgba(255, 255, 255, 0.5);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    backdrop-filter: blur(24px) saturate(180%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%);
                    box-shadow:
                        0 20px 45px rgba(0, 0, 0, 0.16),
                        0 3px 12px rgba(0, 0, 0, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.7);
                    overflow: visible;
                    transition: background-color .3s ease, border-color .3s ease;
                }
                @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
                    .liquid-dock-glass { background: rgba(250,250,250,0.96); }
                    :root.dark .liquid-dock-glass { background: rgba(20,20,22,0.96); }
                }
                :root.dark .liquid-dock-glass {
                    background: rgba(30, 30, 32, 0.55);
                    border: 1px solid rgba(255, 255, 255, 0.14);
                    box-shadow:
                        0 20px 45px rgba(0, 0, 0, 0.55),
                        0 3px 12px rgba(0, 0, 0, 0.35),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                }
                .liquid-dock-glass::before {
                    content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
                    opacity: var(--glow); transition: opacity .35s ease;
                    background: radial-gradient(110px 110px at var(--mx) var(--my), rgba(255,255,255,0.35), transparent 65%);
                }
                :root.dark .liquid-dock-glass::before {
                    background: radial-gradient(110px 110px at var(--mx) var(--my), rgba(255,255,255,0.18), transparent 65%);
                }
                .liquid-dock-glass::after {
                    content: ''; position: absolute; top: 0; left: 12%; right: 12%; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
                    pointer-events: none;
                }
                :root.dark .liquid-dock-glass::after {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
                }
                .dock-group { display: flex; flex-direction: row; align-items: center; gap: 0.15rem; }
                .dock-item {
                    position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center;
                    gap: 0.2rem; min-width: 3.1rem; padding: 0.4rem 0.55rem;
                    border-radius: 1.125rem; background: transparent; border: none;
                    color: #6b6b6b; cursor: pointer;
                    transition: transform .4s cubic-bezier(.34,1.56,.64,1), background-color .3s ease, color .3s ease;
                }
                :root.dark .dock-item { color: #b0b0b0; }
                .dock-item svg { width: 21px; height: 21px; color: inherit; }
                .dock-item:hover:not(.active) svg { color: #101010; }
                :root.dark .dock-item:hover:not(.active) svg { color: #f0f0f0; }

                /* Solid-ish white/dark capsule for the active tab — deliberately MORE
                   opaque than the glass behind it, so it reads as a clear highlight
                   instead of blending into the same translucent fill */
                .dock-item.active {
                    background: rgba(255, 255, 255, 0.9);
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1);
                }
                .dock-item.active svg,
                .dock-item.active .dock-label { color: #0A84FF; }
                :root.dark .dock-item.active {
                    background: rgba(255, 255, 255, 0.2);
                    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12);
                }
                :root.dark .dock-item.active svg,
                :root.dark .dock-item.active .dock-label { color: #6cb3ff; }

                .dock-item:active { transform: scale(0.96); }
                .dock-label {
                    display: block; font-size: 10.5px; font-weight: 500; line-height: 1; letter-spacing: 0.01em;
                    color: inherit; transition: color .25s ease, font-weight .25s ease;
                }
                .dock-item.active .dock-label { font-weight: 600; }
                .dock-tooltip { display: none; }
                @media (prefers-reduced-motion: reduce) {
                    .dock-item { transition: none; }
                    .dock-item:active { transform: none; }
                }
                @media (max-width: 380px) {
                    .liquid-dock { bottom: 0.875rem; padding: 0 0.75rem; }
                    .liquid-dock-glass { padding: 0.4rem 0.6rem; gap: 0.35rem; }
                    .dock-item { min-width: 2.85rem; padding: 0.35rem 0.4rem; }
                }

                /* ---- Hero section ---- */
                .hero-section {
                    position: relative; overflow: hidden; padding: 0;
                    display: flex; align-items: center; justify-content: center;
                    min-height: 92vh; min-height: 92svh;
                }
                .hero-marquee-wrap { position: absolute; inset: 0; display: flex; align-items: center; overflow: hidden; pointer-events: none; z-index: 1; }
                .hero-marquee-track { display: flex; width: max-content; will-change: transform; animation: hero-marquee 18s linear infinite; animation-play-state: running !important; }
                .hero-marquee-text {
                    flex: 0 0 auto; font-size: clamp(4.5rem, 22vw, 18.5rem); font-weight: 900; text-transform: uppercase;
                    letter-spacing: -0.03em; white-space: nowrap; padding-right: 5vw; color: transparent;
                    -webkit-text-stroke: 2.5px rgba(16,16,16,0.6); opacity: 0.6;
                }
                :root.dark .hero-marquee-text { -webkit-text-stroke: 2.5px rgba(255,255,255,0.5); opacity: 0.65; }
                @keyframes hero-marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
                .hero-photo-img {
                    position: relative; z-index: 2; width: clamp(300px, 60vw, 700px); max-height: min(90vh, 900px);
                    object-fit: contain; object-position: bottom center; display: block; margin: 0 auto;
                    margin-bottom: calc(var(--dock-space-mobile) + 0.5rem);
                    opacity: 0; transform: translateY(28px);
                    transition: opacity .8s cubic-bezier(.16,1,.3,1) .15s, transform .8s cubic-bezier(.16,1,.3,1) .15s;
                }
                .hero-section.in-view .hero-photo-img { opacity: 1; transform: translateY(0); }
                @media (max-width: 820px) {
                    .hero-photo-img { width: clamp(220px, 78vw, 360px); max-height: 66vh; margin-bottom: calc(var(--dock-space-mobile) + 0.25rem); }
                }
                @media (max-width: 380px) {
                    .hero-photo-img { width: clamp(200px, 82vw, 300px); max-height: 60vh; }
                }
                .hero-caption {
                    position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%); z-index: 3;
                    text-align: center; opacity: 0; transition: opacity .8s ease .4s;
                }
                .hero-section.in-view .hero-caption { opacity: 1; }
                .hero-role { font-size: 0.8rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
                .hero-scroll-hint { margin-top: .4rem; font-size: .75rem; color: var(--muted); opacity: .7; }
                @media (max-width: 820px) {
                    .hero-section { align-items: flex-end; min-height: 88vh; min-height: 88svh; }
                    .hero-caption { bottom: 1.75rem; }
                    .hero-marquee-text { font-size: clamp(5rem, 27vw, 12rem); -webkit-text-stroke: 3px rgba(16,16,16,0.65); }
                    :root.dark .hero-marquee-text { -webkit-text-stroke: 3px rgba(255,255,255,0.55); }
                }

                /* ---- Home section (cover + avatar) ---- */
                .home-section { justify-content: flex-start; padding-top: 7rem; }
                @media (max-width: 820px) { .home-section { padding-top: 0; } }
                @media (max-width: 480px) { .home-section { padding-top: 0; } }
                .home-cover { width: 100%; height: 160px; overflow: hidden; background: #F3EFE9; border-radius: 28px; }
                :root.dark .home-cover { background: #262626; }
                @media (max-width: 820px) {
                    .home-cover { margin-left: -5.5vw; margin-right: -5.5vw; width: calc(100% + 11vw); border-radius: 0; height: 190px; }
                }
                @media (max-width: 480px) {
                    .home-cover { margin-left: -5vw; margin-right: -5vw; width: calc(100% + 10vw); height: 170px; }
                }
                @media (min-width: 821px) and (max-width: 1023px) { .home-cover { height: 220px; } }
                @media (min-width: 1024px) { .home-cover { height: 340px; border-radius: 2rem; } }

                /* ---- Skills section (honor badges) ---- */
                .honor-badge {
                    display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; padding: 3px 9px;
                    border-radius: 999px; background: rgba(16,16,16,0.06); color: var(--ink);
                    font-size: 13px; font-weight: 600; letter-spacing: .01em;
                }
                :root.dark .honor-badge { background: rgba(255,255,255,0.08); }

                /* ---- Projects section (carousel + case-study sheet) ---- */
                .carousel-edge-fade-left { background: linear-gradient(to left, transparent 55%, var(--bg) 100%); opacity: 0.85; }
                .carousel-edge-fade-right { background: linear-gradient(to right, transparent 55%, var(--bg) 100%); opacity: 0.85; }
                @media (max-width: 1024px) {
                    .case-study-sheet {
                        position: fixed !important; left: 0 !important; right: 0 !important;
                        top: max(28px, env(safe-area-inset-top)) !important; bottom: env(safe-area-inset-bottom, 0px) !important;
                        width: 100% !important; max-width: none !important; max-height: none !important; margin: 0 !important;
                        transform: translateY(var(--sheet-drag-y, 0)) !important;
                        translate: none !important; scale: none !important; rotate: none !important; animation: none !important;
                        overscroll-contain: contain;
                        border-bottom-left-radius: 0 !important; border-bottom-right-radius: 0 !important;
                        border-top-left-radius: 1.5rem !important; border-top-right-radius: 1.5rem !important;
                        border-left: none !important; border-right: none !important;
                        z-index: 300 !important;
                        transition: transform 0.32s cubic-bezier(.32,.72,0,1);
                    }
                    .sheet-drag-handle { position: sticky !important; top: 0 !important; z-index: 10 !important; }
                }
                .sheet-drag-handle { display: none; }
                @media (max-width: 1024px) {
                    .sheet-drag-handle { display: flex; justify-content: center; align-items: center; padding: 0.625rem 0 0.25rem; touch-action: none; cursor: grab; }
                    .sheet-drag-bar { width: 2.75rem; height: 0.3125rem; border-radius: 999px; background: rgba(0,0,0,0.18); }
                    :root.dark .sheet-drag-bar { background: rgba(255,255,255,0.25); }
                }
                @media (max-width: 1024px) { body.sheet-open { overflow: hidden; } }
                body.sheet-open .liquid-dock,
                body.sheet-open .chat-widget-mobile-anchor,
                body.sheet-open .glass-toggle-dock { display: none; }
            `}</style>

            <div className="portfolio-root">
                {/* Hidden only while the intro (LoadingScreen) animation is
                    playing — reveals with a smooth slide+fade the moment it
                    completes, regardless of scroll position afterward. */}
                <div className={`site-chrome ${loading ? 'site-chrome-hidden' : ''}`}>
                    <LiquidDock active={active} onSelect={scrollTo} />
                    <DarkModeToggle />
                </div>
                <div className={`chat-widget-mobile-anchor ${loading ? 'site-chrome-hidden' : ''}`}>
                    <ChatWidget />
                </div>

                <main className="portfolio-main">
                    <HeroSection sectionRef={setSectionRef('hero')} />
                    <HomeSection sectionRef={setSectionRef('home')} />
                    <SkillsSection sectionRef={setSectionRef('about')} skillsRef={setSectionRef('skills')} contactRef={setSectionRef('contact')} />
                    <ProjectsSection sectionRef={setSectionRef('projects')} />

                    <p className="foot">© 2026 — Built with Laravel &amp; React.</p>
                </main>
            </div>
        </>
    );
}
