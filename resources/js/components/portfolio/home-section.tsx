import { useEffect, useRef } from 'react';

type HomeSectionProps = {
    sectionRef: (el: HTMLElement | null) => void;
};

type ExperienceItem = {
    company: string;
    role: string;
    dates: string;
};

const EXPERIENCE: ExperienceItem[] = [
    { company: 'DOST – Technology Application and Promotion Institute', role: 'Web Developer Intern', dates: '2025' },
    { company: 'Ollopa Corporation', role: 'Developer / UI Designer Intern', dates: '2024' },
    { company: 'Capstone & school software projects', role: 'Lead Developer', dates: '' },
];

const clamp = (n: number) => Math.min(1, Math.max(0, n));

export function HomeSection({ sectionRef }: HomeSectionProps) {
    const localRef = useRef<HTMLElement | null>(null);

    /*
     * Scroll-linked expansion that plays ONCE per page load.
     *
     * The section is a completely normal, full-screen block in the page flow: no pinning,
     * no extra scroll distance, and the page height / scroll position are never touched.
     * As it slides into view from the bottom of the screen, one number --p (0 -> 1) is written
     * straight to its style (no React state, no re-renders) and CSS turns it into the card's
     * size, corners and frame.
     *
     * When --p reaches 1 it is locked open and every listener is removed, so from then on this
     * section has zero scroll cost: scrolling to it again (up or down) is plain native scrolling.
     */
    useEffect(() => {
        const section = localRef.current;
        if (!section) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        const mobile = window.matchMedia('(max-width: 860px)');
        let raf = 0;

        const apply = (p: number) => {
            section.style.setProperty('--p', p.toFixed(4));
            section.classList.toggle('is-open', p >= 0.999);
        };

        const stop = () => {
            if (raf) cancelAnimationFrame(raf);
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            reduce.removeEventListener('change', schedule);
            mobile.removeEventListener('change', schedule);
        };

        const update = () => {
            raf = 0;

            if (reduce.matches) {
                apply(1);
                stop();
                return;
            }

            const vh = window.innerHeight;
            const top = section.getBoundingClientRect().top;
            // Starts on the first scroll from the hero (section top at the bottom of the screen).
            // Desktop: done just before the section fills the screen.
            // Phone: done when the card's top edge is a quarter of the way down the screen.
            const p = clamp((vh - top) / (vh * (mobile.matches ? 0.75 : 0.9)));

            apply(p);
            if (p >= 0.999) stop(); // played: locked open for the rest of this page load
        };

        function schedule() {
            if (!raf) raf = requestAnimationFrame(update);
        }

        update();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        reduce.addEventListener('change', schedule);
        mobile.addEventListener('change', schedule);

        return stop;
    }, []);

    const attachRefs = (el: HTMLElement | null) => {
        localRef.current = el;
        sectionRef(el);
    };

    return (
        <section id="home" ref={attachRefs} className="section xp-section">
            <style>{`
                /* =====================================================
                   Structure
                     section.xp-section   normal full-screen block in the page flow
                       .xp-card           ONE box: scales / rounds / rims as --p goes 0 -> 1
                         .xp-stage        the actual layout (never animated itself)
                   Colours: only --bg / --ink (and mixes of them). No gradients.
                   ===================================================== */
                .xp-section {
                    --p: 1; /* 0 = small card, 1 = full screen. Written by the scroll handler */
                    --xp-line: var(--line);
                    --xp-rule: var(--hair);
                    --xp-ink: var(--ink);
                    --xp-soft: var(--muted);
                    --xp-bezel: clamp(7px, 0.95vw, 11px);
                    --xp-radius: clamp(24px, 3.4vw, 42px);

                    /* how the card looks at p = 0 */
                    --xp-start-scale: 0.8;   /* size at p = 0 (80% of full) */
                    --xp-shift: calc((1 - var(--xp-start-scale)) * 100%);
                    --xp-card-radius: clamp(28px, 4vw, 52px);
                    --xp-rim: var(--xp-bezel); /* thickness of the frame around the small card */

                    --xp-stage-h: 100vh;

                    position: relative;
                    display: block;
                    min-height: 0;
                    padding: 0 !important;
                    background: var(--bg);
                    border-bottom: 0 !important;
                    opacity: 1 !important;
                    transform: none !important;
                    transition: none !important;
                    font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
                }
                @supports (height: 100svh) {
                    .xp-section { --xp-stage-h: 100svh; }
                }

                /* The card has NO fill of its own: it is the page colour, outlined by the same
                   thick bezel the panels use. The frame thins out to nothing as the card opens. */
                .xp-card::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: 5;
                    pointer-events: none;
                    box-sizing: border-box;
                    border: 0 solid var(--xp-line);
                    border-width:
                        calc((1 - var(--p)) * var(--xp-rim))
                        calc((1 - var(--p)) * var(--xp-rim))
                        0;
                    border-radius: inherit;
                }
                .xp-section.is-open .xp-card::after { display: none; }

                /* ---------- Desktop: expands while it scrolls into view (no pin) ---------- */
                @media (min-width: 861px) {
                    .xp-section {
                        height: var(--xp-stage-h);
                        overflow: clip;
                    }

                    /* One real box: name, panels and text all live in it and grow with it.
                       It hangs from the top edge of the section, so it is visible from the very
                       first scroll, then scales up and loses its rounded corners as --p -> 1. */
                    .xp-card {
                        position: relative;
                        height: 100%;
                        overflow: hidden;
                        background: var(--bg);
                        transform-origin: 50% 100%;
                        transform: translateY(calc((1 - var(--p)) * (var(--p) - 1) * var(--xp-shift)))
                                   scale(calc(var(--xp-start-scale) + (1 - var(--xp-start-scale)) * var(--p)));
                        border-radius: calc((1 - var(--p)) * var(--xp-card-radius)) calc((1 - var(--p)) * var(--xp-card-radius)) 0 0;
                        will-change: transform;
                    }
                    /* Fully open: plain layout again, no transform (crisp text, no compositing layer) */
                    .xp-section.is-open .xp-card { transform: none; border-radius: 0; will-change: auto; }

                    .xp-stage {
                        --u: max(6px, min(0.6cqw, 1.15cqh));
                        position: relative;
                        width: 100%;
                        height: 100%;
                        container-type: size;
                    }
                }

                /* ---------- Ghost watermark ---------- */
                .xp-watermark {
                    position: absolute;
                    left: -4cqw;
                    top: 36%;
                    margin: 0;
                    font-size: min(12.5cqw, 27cqh);
                    font-weight: 700;
                    letter-spacing: -0.04em;
                    line-height: 1;
                    white-space: nowrap;
                    color: var(--fill);
                    pointer-events: none;
                    user-select: none;
                    z-index: 0;
                    /* Completely static: never scrolls, rolls, fades or parallaxes.
                       (The hero name is a marquee; this one is deliberately not.) */
                    animation: none !important;
                    transition: none !important;
                    transform: none !important;
                    translate: none !important;
                    will-change: auto;
                }

                /* ---------- Shared panel look (thick bezel) ---------- */
                .xp-panel {
                    position: absolute;
                    z-index: 1;
                    border: var(--xp-bezel) solid var(--xp-line);
                    background: var(--bg);
                }

                .xp-label {
                    margin: 0;
                    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
                    font-size: max(11px, calc(1.5 * var(--u)));
                    color: var(--xp-soft);
                    letter-spacing: 0.02em;
                }

                /* ---------- TOP PANEL: bleeds off the top edge ---------- */
                .xp-top {
                    left: 6.5%;
                    top: -1px;
                    width: 69%;
                    height: 46%;
                    border-top: none;
                    border-radius: 0 0 var(--xp-radius) var(--xp-radius);
                    padding: calc(3.4 * var(--u)) calc(9 * var(--u)) calc(2.4 * var(--u));
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .xp-list { margin: 0; padding: 0; display: flex; flex-direction: column; }
                /* Experience text must always be visible, whatever the global reveal styles do */
                .xp-list, .xp-row, .xp-row > p {
                    opacity: 1 !important;
                    visibility: visible !important;
                    transform: none !important;
                    translate: none !important;
                    animation: none !important;
                }
                .xp-row {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) auto;
                    column-gap: calc(2 * var(--u));
                    align-items: baseline;
                    padding: calc(1.2 * var(--u)) 0;
                }
                .xp-row + .xp-row { border-top: 1px solid var(--xp-rule); }
                .xp-company {
                    grid-column: 1;
                    grid-row: 1;
                    margin: 0;
                    font-size: calc(3.3 * var(--u));
                    font-weight: 600;
                    line-height: 1.1;
                    letter-spacing: -0.03em;
                    color: var(--xp-ink);
                }
                .xp-role {
                    grid-column: 1;
                    grid-row: 2;
                    margin: calc(0.6 * var(--u)) 0 0;
                    font-size: max(11.5px, calc(1.7 * var(--u)));
                    line-height: 1.4;
                    color: var(--xp-soft);
                }
                .xp-dates {
                    grid-column: 2;
                    grid-row: 1;
                    margin: 0;
                    white-space: nowrap;
                    font-size: max(11px, calc(1.5 * var(--u)));
                    color: var(--xp-soft);
                }

                /* ---------- BOTTOM PANEL: bleeds off the right + bottom edges ---------- */
                .xp-bottom {
                    left: 46%;
                    top: 54%;
                    right: -1px;
                    bottom: -1px;
                    border-right: none;
                    border-bottom: none;
                    border-radius: var(--xp-radius) 0 0 0;
                    padding: calc(0.6 * var(--u)) 0 0 calc(0.6 * var(--u));
                    display: grid;
                    grid-template-columns: 39fr 61fr;
                    gap: calc(0.6 * var(--u));
                }

                .xp-col {
                    position: relative;
                    min-width: 0;
                    border: 1px solid var(--xp-line);
                    border-bottom: none;
                    padding: calc(2.6 * var(--u)) calc(2.6 * var(--u)) calc(7 * var(--u));
                    overflow: hidden;
                }
                .xp-col-edu {
                    border-radius: calc(2.6 * var(--u)) calc(0.8 * var(--u)) 0 0;
                    background: var(--bg);
                }
                .xp-col-cert {
                    border-right: none;
                    border-radius: calc(0.8 * var(--u)) 0 0 0;
                    background: var(--fill);
                }

                .xp-title {
                    margin: calc(3.6 * var(--u)) 0 0;
                    font-size: calc(3.6 * var(--u));
                    font-weight: 600;
                    line-height: 1.08;
                    letter-spacing: -0.035em;
                    color: var(--xp-ink);
                }
                .xp-col-cert .xp-title { max-width: 55%; }
                .xp-body {
                    margin: calc(1.6 * var(--u)) 0 0;
                    font-size: max(12px, calc(1.5 * var(--u)));
                    line-height: 1.6;
                    color: var(--xp-soft);
                }
                .xp-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    margin-top: calc(2.2 * var(--u));
                    padding: calc(0.6 * var(--u)) calc(1.4 * var(--u));
                    border-radius: 999px;
                    background: var(--xp-ink);
                    color: var(--bg);
                    font-size: max(11.5px, calc(1.4 * var(--u)));
                    font-weight: 600;
                }

                /* Medal art in the "media" column */
                .xp-medal {
                    position: absolute;
                    right: 14%;
                    bottom: calc(5 * var(--u));
                    width: calc(18 * var(--u));
                    height: calc(18 * var(--u));
                    color: var(--xp-ink);
                }
                .xp-medal svg { width: 100%; height: 100%; display: block; }

                /* =====================================================
                   Phones + small tablets: stacked staircase, no pin.

                   The card is a floating, framed, rounded card that sits inset from the
                   screen edges and a little lower than the page. As you scroll it rises up
                   to meet the page, its side margins close, its corners square off and its
                   frame thins out until it is a full-width section.

                   The stage inside keeps its full width the whole time (only the card's
                   window widens), so text never reflows or jitters and the panels look like
                   they are bleeding off the card's edges, exactly like the desktop design.
                   ===================================================== */
                @media (max-width: 860px) {
                    .xp-section {
                        --xp-bezel: 8px;
                        --xp-radius: 30px;
                        --xp-card-radius: 34px;
                        --xp-rim: 7px;
                        --xp-inset: 6vw;   /* side margin at p = 0 */
                        --xp-lift: 48px;   /* how far below its final spot the card starts */
                        --xp-m: calc((1 - var(--p)) * var(--xp-inset));
                        height: auto;
                        overflow: clip;
                    }

                    .xp-card {
                        position: relative;
                        overflow: hidden;
                        background: var(--bg);
                        margin: 0 var(--xp-m);
                        border-radius: calc((1 - var(--p)) * var(--xp-card-radius));
                        transform: translateY(calc((1 - var(--p)) * var(--xp-lift)));
                        will-change: transform;
                    }
                    .xp-section.is-open .xp-card { margin: 0; border-radius: 0; transform: none; will-change: auto; }

                    .xp-stage {
                        --u: clamp(0.36rem, 1.5vw, 0.55rem);
                        position: relative;
                        /* always exactly the screen width, whatever the card's window is doing */
                        width: calc(100% + 2 * var(--xp-m));
                        margin-left: calc(-1 * var(--xp-m));
                        height: auto;
                        display: flex;
                        flex-direction: column;
                    }
                    .xp-panel { position: relative; left: auto; right: auto; top: auto; bottom: auto; width: auto; height: auto; }

                    .xp-watermark {
                        position: relative;
                        order: 2;
                        left: auto;
                        top: auto;
                        width: 100%;
                        margin: -0.26em 0 -0.26em -6vw;
                        font-size: 19vw;
                    }

                    .xp-top {
                        order: 1;
                        margin-right: 12vw;
                        border-left: none;
                        border-radius: 0 var(--xp-radius) var(--xp-radius) 0;
                        padding: calc(4.5 * var(--u)) calc(6 * var(--u)) calc(2.4 * var(--u)) calc(8 * var(--u));
                        justify-content: flex-start;
                        gap: calc(2 * var(--u));
                    }
                    .xp-row { padding: calc(2.2 * var(--u)) 0; }
                    .xp-company { font-size: clamp(1.1rem, 4.6vw, 1.6rem); }
                    .xp-dates { grid-row: 2; grid-column: 2; }

                    .xp-bottom {
                        order: 3;
                        margin-left: 12vw;
                        grid-template-columns: minmax(0, 1fr);
                        border-radius: var(--xp-radius) 0 0 0;
                        padding: 0.4rem 0 0 0.4rem;
                        gap: 0.4rem;
                    }
                    .xp-col { padding: calc(3.4 * var(--u)); }
                    .xp-col-edu {
                        border-right: none;
                        border-bottom: 1px solid var(--xp-line);
                        border-radius: 1.2rem 0 0 0;
                    }
                    .xp-col-cert {
                        border-radius: 0.5rem 0 0 0;
                        padding-bottom: 2rem;
                        min-height: 11rem;
                    }
                    .xp-title { margin-top: calc(3 * var(--u)); font-size: clamp(1.7rem, 7.4vw, 2.6rem); }
                    .xp-col-cert .xp-title { max-width: 58%; }
                    .xp-medal {
                        right: 1.25rem;
                        top: 1.5rem;
                        bottom: auto;
                        width: clamp(5.5rem, 26vw, 9rem);
                        height: clamp(5.5rem, 26vw, 9rem);
                    }
                }

                /* Reduced motion: no expansion, just the finished layout */
                @media (prefers-reduced-motion: reduce) {
                    .xp-card { transform: none !important; border-radius: 0 !important; margin: 0 !important; }
                    .xp-stage { width: 100% !important; margin-left: 0 !important; }
                    .xp-card::after { display: none; }
                }
            `}</style>

            <div className="xp-card">
                <div className="xp-stage">
                    <p className="xp-watermark" aria-hidden="true">
                        Dave Michael Clapis
                    </p>

                    {/* TOP PANEL — Experience */}
                    <div className="xp-panel xp-top">
                        <p className="xp-label">{'{Experience}'}</p>

                        <div className="xp-list">
                            {EXPERIENCE.map((item) => (
                                <div className="xp-row" key={item.company}>
                                    <p className="xp-company">{item.company}</p>
                                    <p className="xp-role">{item.role}</p>
                                    {item.dates && <p className="xp-dates">{item.dates}</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BOTTOM PANEL — Education | Certification */}
                    <div className="xp-panel xp-bottom">
                        <div className="xp-col xp-col-edu">
                            <p className="xp-label">{'{2022 – 2026}'}</p>
                            <h3 className="xp-title">BS Computer Science</h3>
                            <p className="xp-body">Bicol University</p>
                            <span className="xp-badge">
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="8" r="6" />
                                    <path d="M9 14 7 22l5-3 5 3-2-8" />
                                </svg>
                                Cum Laude
                            </span>
                        </div>

                        <div className="xp-col xp-col-cert">
                            <p className="xp-label">{'{November 2024}'}</p>
                            <h3 className="xp-title">NC III Programming</h3>
                            <p className="xp-body">Certification</p>

                            <div className="xp-medal" aria-hidden="true">
                                <svg
                                    viewBox="0 0 120 120"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="60" cy="46" r="30" />
                                    <circle cx="60" cy="46" r="21" opacity="0.55" />
                                    <circle cx="60" cy="46" r="12" opacity="0.35" />
                                    <path d="M40 72 32 112l28-15 28 15-8-40" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
