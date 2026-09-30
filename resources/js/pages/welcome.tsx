import ChatWidget from '@/components/chat-widget';
import DarkModeToggle from '@/components/dark-mode-toggle';
import LoadingScreen from '@/components/loading-screen';
import { HeroSection } from '@/components/portfolio/hero-section';
import { HomeSection } from '@/components/portfolio/home-section';
import { LiquidDock } from '@/components/portfolio/liquid-dock';
import { ContactSection } from '@/components/portfolio/projects-section';
import { SkillsSection } from '@/components/portfolio/skills-section';
import { TechStackSection } from '@/components/portfolio/tech-stack-section';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Nav routing helpers                                                 */
/* ------------------------------------------------------------------ */

const SECTION_TO_NAV: Record<string, string> = {
    hero: 'home',
    home: 'about',
    stack: 'stack',
    about: 'skills',
    skills: 'skills',
    contact: 'skills',
    projects: 'projects',
};

const NAV_TARGET: Record<string, string> = {
    home: 'hero',
    about: 'home',
    stack: 'stack',
    skills: 'about',
    projects: 'projects',
};

export default function Welcome() {
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState('home');
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
    const suppressSpyUntil = useRef(0);

    useEffect(() => {
        const spy = new IntersectionObserver(
            (entries) => {
                if (Date.now() < suppressSpyUntil.current) return;
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
        setActive(id);
        suppressSpyUntil.current = Date.now() + 900;

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
                <link href="https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700,800" rel="stylesheet" />
            </Head>

            <style>{`
                /* =====================================================
                   THEME — two colours only.
                   --bg and --ink are defined in app.css:
                     light : night ink on paper (cream)
                     dark  : cream ink on night (near-black)
                   ===================================================== */
                :root {
                    --muted: color-mix(in srgb, var(--ink) 62%, var(--bg));
                    --hair: color-mix(in srgb, var(--ink) 20%, transparent);
                    --line: color-mix(in srgb, var(--ink) 34%, var(--bg));
                    --fill: color-mix(in srgb, var(--ink) 6%, transparent);
                    --dock-space-mobile: 6rem;

                    --accent-2: var(--ink);
                    --accent-3: var(--ink);
                    --glow-a: color-mix(in srgb, var(--ink) 22%, transparent);
                    --glow-b: color-mix(in srgb, var(--ink) 14%, transparent);
                }
                *, *::before, *::after { box-sizing: border-box; }
                html { overscroll-behavior-y: none; }
                .portfolio-root {
                    position: relative;
                    isolation: isolate;
                    background: var(--bg);
                    color: var(--ink);
                    min-height: 100vh;
                    width: 100%;
                    overflow-x: hidden;
                    overflow-x: clip;
                    font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
                    /* no background/color transition: the toggle crossfades the whole page in one go */
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

                .portfolio-main { margin-left: 0; min-width: 0; padding-bottom: 0; }
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

                /* ---------- Floating dark mode toggle (solid ink button) ---------- */
                .glass-toggle-dock { position: fixed; top: 1.375rem; right: 1.375rem; z-index: 60; }
                .glass-toggle-btn {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 3.25rem;
                    height: 3.25rem;
                    border-radius: 1.125rem;
                    background: var(--ink);
                    border: 1px solid var(--hair);
                    color: var(--bg);
                    cursor: pointer;
                    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .glass-toggle-btn:hover { transform: scale(1.06); }
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

                /* ---------- Chat widget: pinned to the true bottom edge ---------- */
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

                /* ---- Dock (bottom nav) ---- */
                .liquid-dock {
                    position: fixed;
                    z-index: 50;
                    left: 0;
                    right: 0;
                    top: auto;
                    bottom: calc(14px + env(safe-area-inset-bottom));
                    display: flex;
                    justify-content: center;
                    padding: 0 1rem;
                    pointer-events: none;
                }
                .liquid-dock-glass {
                    --mx: 50%; --my: 0%; --glow: 0;
                    pointer-events: auto;
                    position: relative; display: inline-flex; flex-direction: row; align-items: center;
                    width: fit-content; max-width: calc(100vw - 1.5rem); padding: 0.45rem 0.5rem; gap: 0.25rem;
                    border-radius: 32px;
                    background: color-mix(in srgb, var(--bg) 78%, transparent);
                    border: 1px solid var(--hair);
                    backdrop-filter: blur(22px) saturate(170%);
                    -webkit-backdrop-filter: blur(22px) saturate(170%);
                    box-shadow: 0 12px 32px rgba(0,0,0,0.18), inset 0 1px 0 color-mix(in srgb, var(--ink) 10%, transparent);
                    overflow: visible;
                    transition: none;
                }
                @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
                    .liquid-dock-glass { background: var(--bg); }
                }
                .dock-group { display: flex; flex-direction: row; align-items: center; gap: 0.2rem; }
                .dock-item {
                    position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center;
                    gap: 0.2rem; min-width: 3.3rem; padding: 0.5rem 0.55rem;
                    border-radius: 22px; background: transparent; border: none;
                    color: var(--muted); cursor: pointer;
                    -webkit-tap-highlight-color: transparent;
                    transition: transform .4s cubic-bezier(.34,1.56,.64,1), background-color .3s ease, color .3s ease;
                }
                .dock-item svg { width: 22px; height: 22px; color: inherit; }
                .dock-item:hover:not(.active) { color: var(--ink); }

                .dock-item.active { background: var(--ink); color: var(--bg); }
                .dock-item.active svg,
                .dock-item.active .dock-label { color: var(--bg); }

                .dock-item:active { transform: scale(0.94); }
                .dock-label {
                    display: block; font-size: 10.5px; font-weight: 500; line-height: 1; letter-spacing: 0.01em;
                    color: inherit; transition: color .25s ease, font-weight .25s ease;
                }
                .dock-item.active .dock-label { font-weight: 700; }
                .dock-tooltip { display: none; }

                @media (hover: none) {
                    .dock-item { transform: none !important; }
                    .dock-item:active { transform: scale(0.94) !important; }
                }
                @media (max-width: 820px) {
                    .liquid-dock-glass {
                        backdrop-filter: none;
                        -webkit-backdrop-filter: none;
                        background: color-mix(in srgb, var(--bg) 92%, transparent);
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .dock-item { transition: none; }
                    .dock-item:active { transform: none; }
                }
                @media (max-width: 380px) {
                    .liquid-dock { bottom: calc(0.75rem + env(safe-area-inset-bottom)); padding: 0 0.5rem; }
                    .liquid-dock-glass { padding: 0.4rem 0.4rem; gap: 0.1rem; border-radius: 28px; }
                    .dock-item { min-width: 2.9rem; padding: 0.45rem 0.4rem; border-radius: 20px; }
                }

                /* =====================================================
                   HERO
                   ===================================================== */
                .hero-section {
                    position: relative; overflow: hidden; padding: 0;
                    display: flex; align-items: center; justify-content: center;
                    min-height: 92vh; min-height: 92svh;
                }
                .hero-section::after {
                    content: ''; position: absolute; left: 50%; bottom: 8%; width: min(70vw, 720px); aspect-ratio: 1;
                    transform: translateX(-50%); border-radius: 50%; z-index: 0; pointer-events: none;
                    background: radial-gradient(circle, var(--glow-b), transparent 65%);
                }
                .hero-marquee-wrap { position: absolute; inset: 0; display: flex; align-items: center; overflow: hidden; pointer-events: none; z-index: 1; }
                .hero-marquee-track { display: flex; width: max-content; will-change: transform; animation: hero-marquee 18s linear infinite; animation-play-state: running !important; }
                .hero-marquee-text {
                    flex: 0 0 auto; font-size: clamp(4.5rem, 22vw, 18.5rem); font-weight: 900; text-transform: uppercase;
                    letter-spacing: -0.03em; white-space: nowrap; padding-right: 5vw; color: transparent;
                    -webkit-text-stroke: 2.5px color-mix(in srgb, var(--ink) 60%, transparent);
                    opacity: 0.85;
                    filter: drop-shadow(0 0 18px color-mix(in srgb, var(--ink) 50%, transparent));
                }
                :root.dark .hero-marquee-text {
                    -webkit-text-stroke: 2.5px color-mix(in srgb, var(--ink) 65%, transparent);
                    filter: drop-shadow(0 0 24px color-mix(in srgb, var(--ink) 60%, transparent));
                }
                @keyframes hero-marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
                .hero-photo-img {
                    position: relative; z-index: 2; width: clamp(300px, 60vw, 700px); max-height: min(90vh, 900px);
                    object-fit: contain; object-position: bottom center; display: block; margin: 0 auto;
                    margin-bottom: calc(var(--dock-space-mobile) + 0.5rem);
                    filter: drop-shadow(0 30px 50px var(--glow-a));
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
                .hero-scroll-hint { margin-top: .4rem; font-size: .75rem; color: var(--ink); opacity: .9; }
                @media (max-width: 820px) {
                    .hero-section { align-items: flex-end; min-height: 88vh; min-height: 88svh; }
                    .hero-caption { bottom: 1.75rem; }
                    .hero-marquee-text { font-size: clamp(5rem, 27vw, 12rem); -webkit-text-stroke: 3px color-mix(in srgb, var(--ink) 65%, transparent); filter: none; }
                    :root.dark .hero-marquee-text { -webkit-text-stroke: 3px color-mix(in srgb, var(--ink) 70%, transparent); filter: none; }
                }

                /* ---- Skills section (honor badges) ---- */
                .honor-badge {
                    display: inline-flex; align-items: center; gap: 4px; margin-top: 6px; padding: 3px 9px;
                    border-radius: 999px; background: var(--fill); color: var(--ink);
                    font-size: 13px; font-weight: 600; letter-spacing: .01em;
                }

                /* ---- Projects section (case-study sheet) ---- */
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
                    .sheet-drag-bar { width: 2.75rem; height: 0.3125rem; border-radius: 999px; background: var(--line); }
                }
                @media (max-width: 1024px) { body.sheet-open { overflow: hidden; } }
                body.sheet-open .liquid-dock,
                body.sheet-open .chat-widget-mobile-anchor,
                body.sheet-open .glass-toggle-dock { display: none; }
            `}</style>

            <div className="portfolio-root">
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
                    <TechStackSection sectionRef={setSectionRef('stack')} onSeeWork={() => scrollTo('projects')} />
                    <SkillsSection sectionRef={setSectionRef('about')} skillsRef={setSectionRef('skills')} contactRef={setSectionRef('contact')} />
                    <ContactSection sectionRef={setSectionRef('contact-us')} />
                </main>
            </div>
        </>
    );
}
