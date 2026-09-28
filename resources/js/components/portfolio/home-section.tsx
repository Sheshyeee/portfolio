import { useEffect, useRef } from 'react';

type HomeSectionProps = {
    sectionRef: (el: HTMLElement | null) => void;
};

type ExperienceItem = {
    role: string;
    place: string;
    dates: string;
    current?: boolean;
};

const EXPERIENCE: ExperienceItem[] = [
    { role: 'Web Developer / Fullstack Developer', place: 'Freelance', dates: '2025 — Present', current: true },
    { role: 'Web Developer Intern', place: 'DOST – Technology Application and Promotion Institute', dates: '2025' },
    { role: 'Developer / UI Designer Intern', place: 'Ollopa Corporation', dates: '2024' },
    { role: 'Lead Developer', place: 'Capstone & school software projects', dates: '' },
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
                   Layout is a single "stage" whose panels are placed with
                   percentages, and all type/spacing is sized in --u
                   (1cqmin), so the composition is the same picture at any
                   large screen size — it only scales.
                   ===================================================== */
                .xp-section {
                    position: relative;
                    display: block;
                    min-height: 0;
                    padding: 0 !important;
                    background: #131313;
                    overflow: hidden;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
                }

                .xp-stage {
                    --u: 1cqmin;
                    position: relative;
                    width: 100%;
                    height: 100vh;
                    height: max(100svh, 52rem);
                    container-type: size;
                }

                /* ---------- Ghost watermark: starts at the left edge, cropped by the right edge ---------- */
                .xp-watermark {
                    position: absolute;
                    left: 0;
                    top: 36%;
                    margin: 0;
                    font-size: 12.5cqw;
                    font-weight: 600;
                    letter-spacing: -0.03em;
                    line-height: 1;
                    white-space: nowrap;
                    color: rgba(255,255,255,0.045);
                    pointer-events: none;
                    user-select: none;
                    z-index: 0;
                    opacity: 0;
                    transition: opacity 1s cubic-bezier(.19,1,.22,1);
                }
                .xp-section.is-visible .xp-watermark { opacity: 1; }

                /* ---------- Shared panel look ---------- */
                .xp-panel {
                    position: absolute;
                    z-index: 1;
                    border: 1px solid rgba(255,255,255,0.10);
                    background: #161616;
                }

                .xp-label {
                    margin: 0;
                    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
                    font-size: calc(1.45 * var(--u));
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
                    padding: calc(4.2 * var(--u)) calc(5 * var(--u)) calc(3 * var(--u));
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    background:
                        radial-gradient(70% 80% at 28% 0%, rgba(255,255,255,0.065), transparent 65%),
                        radial-gradient(60% 70% at 95% 100%, rgba(0,0,0,0.35), transparent 70%),
                        #171717;
                    box-shadow: 0 30px 70px rgba(0,0,0,0.45);
                    opacity: 0;
                    transform: translateY(-3%);
                    transition: opacity .8s cubic-bezier(.19,1,.22,1), transform .8s cubic-bezier(.19,1,.22,1);
                }
                .xp-section.is-visible .xp-top { opacity: 1; transform: translateY(0); }

                .xp-top-head { margin-bottom: auto; }

                .xp-list { margin: 0; padding: 0; display: flex; flex-direction: column; }
                .xp-row {
                    display: flex;
                    align-items: flex-start;
                    gap: calc(1.6 * var(--u));
                    padding: calc(1.35 * var(--u)) 0;
                }
                .xp-row + .xp-row { border-top: 1px solid rgba(255,255,255,0.08); }
                .xp-dot {
                    flex-shrink: 0;
                    margin-top: calc(0.85 * var(--u));
                    width: calc(0.9 * var(--u));
                    height: calc(0.9 * var(--u));
                    min-width: 6px;
                    min-height: 6px;
                    border-radius: 50%;
                    border: 1.5px solid rgba(255,255,255,0.35);
                }
                .xp-dot.is-current {
                    background: #f5f5f5;
                    border-color: #f5f5f5;
                    box-shadow: 0 0 0 3px rgba(245,245,245,0.12);
                }
                .xp-row-main {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    gap: calc(2 * var(--u));
                }
                .xp-role {
                    margin: 0;
                    font-size: calc(2.5 * var(--u));
                    font-weight: 600;
                    line-height: 1.15;
                    letter-spacing: -0.02em;
                    color: #f4f4f4;
                }
                .xp-place {
                    margin: calc(0.5 * var(--u)) 0 0;
                    font-size: calc(1.5 * var(--u));
                    line-height: 1.4;
                    color: rgba(255,255,255,0.42);
                }
                .xp-dates {
                    margin: 0;
                    flex-shrink: 0;
                    white-space: nowrap;
                    font-size: calc(1.4 * var(--u));
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
                    background: #141414;
                    box-shadow: 0 -20px 60px rgba(0,0,0,0.4);
                    opacity: 0;
                    transform: translate(3%, 3%);
                    transition: opacity .8s cubic-bezier(.19,1,.22,1) .15s, transform .8s cubic-bezier(.19,1,.22,1) .15s;
                }
                .xp-section.is-visible .xp-bottom { opacity: 1; transform: translate(0, 0); }

                .xp-col {
                    position: relative;
                    min-width: 0;
                    border: 1px solid rgba(255,255,255,0.09);
                    border-bottom: none;
                    padding: calc(2.6 * var(--u)) calc(2.6 * var(--u)) calc(7 * var(--u));
                    overflow: hidden;
                }
                .xp-col-edu {
                    border-radius: calc(2.6 * var(--u)) calc(0.8 * var(--u)) 0 0;
                    background: #191919;
                }
                .xp-col-cert {
                    border-right: none;
                    border-radius: calc(0.8 * var(--u)) 0 0 0;
                    background:
                        radial-gradient(60% 55% at 62% 78%, rgba(255,255,255,0.09), transparent 70%),
                        #101010;
                }

                .xp-title {
                    margin: calc(4.2 * var(--u)) 0 0;
                    font-size: calc(3.6 * var(--u));
                    font-weight: 500;
                    line-height: 1.08;
                    letter-spacing: -0.03em;
                    color: #f6f6f6;
                }
                .xp-col-cert .xp-title { max-width: 60%; }
                .xp-body {
                    margin: calc(1.6 * var(--u)) 0 0;
                    font-size: calc(1.5 * var(--u));
                    line-height: 1.6;
                    color: rgba(255,255,255,0.4);
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
                    font-size: calc(1.4 * var(--u));
                    font-weight: 600;
                }

                /* Medal art in the "media" column (plays the role of the can in the reference) */
                .xp-medal {
                    position: absolute;
                    right: 16%;
                    bottom: calc(7 * var(--u));
                    width: calc(20 * var(--u));
                    height: calc(20 * var(--u));
                    color: rgba(255,255,255,0.72);
                    filter: drop-shadow(0 18px 30px rgba(0,0,0,0.6));
                }
                .xp-medal svg { width: 100%; height: 100%; display: block; }

                /* ---------- Phones only: stack the panels ---------- */
                @media (max-width: 640px) {
                    .xp-stage {
                        --u: 0.5rem;
                        height: auto;
                        container-type: normal;
                        padding: 0 0 calc(var(--dock-space-mobile, 6rem) + 1rem);
                    }
                    .xp-watermark { display: none; }
                    .xp-panel { position: relative; left: auto; right: auto; top: auto; bottom: auto; width: auto; height: auto; }
                    .xp-top {
                        margin: 0 5vw 1.25rem;
                        border-top: 1px solid rgba(255,255,255,0.10);
                        border-radius: 0 0 1.4rem 1.4rem;
                        justify-content: flex-start;
                        padding-top: 2.5rem;
                    }
                    .xp-top-head { margin-bottom: 1rem; }
                    .xp-row-main { flex-direction: column; gap: 0.2rem; }
                    .xp-bottom {
                        margin-left: 5vw;
                        grid-template-columns: 1fr;
                        border-bottom: none;
                        padding-right: 0;
                    }
                    .xp-col { padding-bottom: 2.5rem; }
                    .xp-col-cert { min-height: 16rem; }
                    .xp-col-cert .xp-title { max-width: 100%; }
                    .xp-medal { right: 8%; bottom: 1.25rem; width: 8rem; height: 8rem; }
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
                    <div className="xp-top-head">
                        <p className="xp-label">{'{Experience}'}</p>
                    </div>

                    <div className="xp-list">
                        {EXPERIENCE.map((item) => (
                            <div className="xp-row" key={item.role}>
                                <span className={`xp-dot ${item.current ? 'is-current' : ''}`} />
                                <div className="xp-row-main">
                                    <div>
                                        <p className="xp-role">{item.role}</p>
                                        <p className="xp-place">{item.place}</p>
                                    </div>
                                    {item.dates && <p className="xp-dates">{item.dates}</p>}
                                </div>
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
