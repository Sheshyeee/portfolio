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

export function HomeSection({ sectionRef }: HomeSectionProps) {
    const localRef = useRef<HTMLElement | null>(null);

    // Toggles a class on the DOM node whenever the section enters/leaves view,
    // so the reveal replays. No React state -> no render loop.
    useEffect(() => {
        const el = localRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                el.classList.toggle('is-visible', entry.isIntersecting);
            },
            { threshold: 0.2 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const attachRefs = (el: HTMLElement | null) => {
        localRef.current = el;
        sectionRef(el);
    };

    return (
        <section id="home" ref={attachRefs} className="section xp-section">
            <style>{`
                /* =====================================================
                   One "stage". Panels are placed with percentages and
                   every size is a multiple of --u, which follows BOTH the
                   stage width and height. So on any large screen the
                   panels stay glued to the edges AND the type grows with
                   them. Under 860px it switches to a stacked staircase.
                   ===================================================== */
                .xp-section {
                    --xp-line: #050505;
                    position: relative;
                    display: block;
                    min-height: 0;
                    padding: 0 !important;
                    background: #141414;
                    overflow: hidden;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
                }

                .xp-stage {
                    --u: max(6px, min(0.6cqw, 1.15cqh));
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    height: max(100svh, 52rem);
                    container-type: size;
                }

                /* ---------- Ghost watermark ---------- */
                .xp-watermark {
                    position: absolute;
                    left: -4cqw;
                    top: 36%;
                    margin: 0;
                    font-size: min(12.5cqw, 27cqh);
                    font-weight: 600;
                    letter-spacing: -0.03em;
                    line-height: 1;
                    white-space: nowrap;
                    color: rgba(255,255,255,0.05);
                    pointer-events: none;
                    user-select: none;
                    z-index: 0;
                    opacity: 0;
                    transition: opacity 1s cubic-bezier(.19,1,.22,1);
                }
                .xp-section.is-visible .xp-watermark { opacity: 1; }

                /* ---------- Shared panel look (black borders) ---------- */
                .xp-panel {
                    position: absolute;
                    z-index: 1;
                    border: 1px solid var(--xp-line);
                    background: #1a1a1a;
                }

                .xp-label {
                    margin: 0;
                    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
                    font-size: max(11px, calc(1.5 * var(--u)));
                    color: rgba(255,255,255,0.5);
                    letter-spacing: 0.02em;
                }

                /* ---------- TOP PANEL: bleeds off the top edge ---------- */
                .xp-top {
                    left: 6.5%;
                    top: -1px;
                    width: 69%;
                    height: 46%;
                    border-top: none;
                    border-radius: 0 0 calc(3.2 * var(--u)) calc(3.2 * var(--u));
                    padding: calc(3.4 * var(--u)) calc(9 * var(--u)) calc(2.4 * var(--u));
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    background:
                        radial-gradient(70% 80% at 28% 0%, rgba(255,255,255,0.06), transparent 65%),
                        radial-gradient(60% 70% at 95% 100%, rgba(0,0,0,0.3), transparent 70%),
                        #1a1a1a;
                    box-shadow: 0 30px 70px rgba(0,0,0,0.45);
                    opacity: 0;
                    transform: translateY(-3%);
                    transition: opacity .8s cubic-bezier(.19,1,.22,1), transform .8s cubic-bezier(.19,1,.22,1);
                }
                .xp-section.is-visible .xp-top { opacity: 1; transform: translateY(0); }

                .xp-list { margin: 0; padding: 0; display: flex; flex-direction: column; }
                .xp-row {
                    display: grid;
                    grid-template-columns: minmax(0, 1fr) auto;
                    column-gap: calc(2 * var(--u));
                    align-items: baseline;
                    padding: calc(1.2 * var(--u)) 0;
                }
                .xp-row + .xp-row { border-top: 1px solid var(--xp-line); }
                .xp-company {
                    grid-column: 1;
                    grid-row: 1;
                    margin: 0;
                    font-size: calc(3.3 * var(--u));
                    font-weight: 600;
                    line-height: 1.1;
                    letter-spacing: -0.025em;
                    color: #f6f6f6;
                }
                .xp-role {
                    grid-column: 1;
                    grid-row: 2;
                    margin: calc(0.6 * var(--u)) 0 0;
                    font-size: max(11.5px, calc(1.7 * var(--u)));
                    line-height: 1.4;
                    color: rgba(255,255,255,0.45);
                }
                .xp-dates {
                    grid-column: 2;
                    grid-row: 1;
                    margin: 0;
                    white-space: nowrap;
                    font-size: max(11px, calc(1.5 * var(--u)));
                    color: rgba(255,255,255,0.38);
                }

                /* ---------- BOTTOM PANEL: bleeds off the right + bottom edges ---------- */
                .xp-bottom {
                    left: 46%;
                    top: 54%;
                    right: -1px;
                    bottom: -1px;
                    border-right: none;
                    border-bottom: none;
                    border-radius: calc(3.2 * var(--u)) 0 0 0;
                    padding: calc(0.6 * var(--u)) 0 0 calc(0.6 * var(--u));
                    display: grid;
                    grid-template-columns: 39fr 61fr;
                    gap: calc(0.6 * var(--u));
                    background: #171717;
                    box-shadow: 0 -20px 60px rgba(0,0,0,0.4);
                    opacity: 0;
                    transform: translate(3%, 3%);
                    transition: opacity .8s cubic-bezier(.19,1,.22,1) .15s, transform .8s cubic-bezier(.19,1,.22,1) .15s;
                }
                .xp-section.is-visible .xp-bottom { opacity: 1; transform: translate(0, 0); }

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
                    background: #1b1b1b;
                }
                .xp-col-cert {
                    border-right: none;
                    border-radius: calc(0.8 * var(--u)) 0 0 0;
                    background:
                        radial-gradient(60% 55% at 62% 78%, rgba(255,255,255,0.09), transparent 70%),
                        #111;
                }

                .xp-title {
                    margin: calc(3.6 * var(--u)) 0 0;
                    font-size: calc(3.6 * var(--u));
                    font-weight: 500;
                    line-height: 1.08;
                    letter-spacing: -0.03em;
                    color: #f6f6f6;
                }
                .xp-col-cert .xp-title { max-width: 55%; }
                .xp-body {
                    margin: calc(1.6 * var(--u)) 0 0;
                    font-size: max(12px, calc(1.5 * var(--u)));
                    line-height: 1.6;
                    color: rgba(255,255,255,0.42);
                }
                .xp-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    margin-top: calc(2.2 * var(--u));
                    padding: calc(0.6 * var(--u)) calc(1.4 * var(--u));
                    border-radius: 999px;
                    background: rgba(255,255,255,0.08);
                    color: #f0f0f0;
                    font-size: max(11.5px, calc(1.4 * var(--u)));
                    font-weight: 600;
                }

                /* Medal art in the "media" column (plays the role of the can in the reference) */
                .xp-medal {
                    position: absolute;
                    right: 14%;
                    bottom: calc(5 * var(--u));
                    width: calc(18 * var(--u));
                    height: calc(18 * var(--u));
                    color: rgba(255,255,255,0.72);
                    filter: drop-shadow(0 18px 30px rgba(0,0,0,0.6));
                }
                .xp-medal svg { width: 100%; height: 100%; display: block; }

                /* =====================================================
                   Phones + small tablets: stacked staircase.
                   Top panel hangs off the top-left, bottom panel bleeds
                   off the bottom-right, watermark peeks out between them.
                   ===================================================== */
                @media (max-width: 860px) {
                    .xp-stage {
                        --u: clamp(0.36rem, 1.5vw, 0.55rem);
                        height: auto;
                        container-type: normal;
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
                        border-radius: 0 1.5rem 1.5rem 0;
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
                        border-radius: 1.5rem 0 0 0;
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
                        padding-bottom: calc(var(--dock-space-mobile, 6rem) + 1.5rem);
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

                @media (prefers-reduced-motion: reduce) {
                    .xp-top, .xp-bottom, .xp-watermark { transition: none; }
                }
            `}</style>

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
        </section>
    );
}
