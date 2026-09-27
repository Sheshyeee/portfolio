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

    // Toggles a class directly on the DOM node on every intersection change,
    // so the reveal plays each time the section re-enters view — not just once.
    // No React state involved, so this can't trigger a render loop.
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
                .xp-section {
                    position: relative;
                    justify-content: center;
                    background: #17171a;
                    overflow: hidden;
                    padding: 4rem 0 calc(3rem + var(--dock-space-mobile, 6rem));
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
                }

                .xp-watermark {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    margin: 0;
                    width: max-content;
                    font-size: clamp(4.5rem, 12.5vw, 10.5rem);
                    font-weight: 900;
                    letter-spacing: -0.02em;
                    line-height: 1;
                    text-transform: uppercase;
                    color: transparent;
                    -webkit-text-stroke: 1.5px rgba(255,255,255,0.13);
                    z-index: 0;
                    pointer-events: none;
                    user-select: none;
                    white-space: nowrap;
                    opacity: 0;
                    transition: opacity 1s cubic-bezier(.19,1,.22,1);
                }
                .xp-section.is-visible .xp-watermark { opacity: 1; }

                /* This flex column only decides vertical order — the cards below
                   size themselves with vw units so they stay anchored to the true
                   viewport edges at any width down to the phone breakpoint,
                   instead of depending on the parent's box being a fixed size. */
                .xp-wrap {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                }

                .xp-card {
                    border: 1px solid rgba(255,255,255,0.10);
                    box-shadow: 0 30px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06);
                    padding: 2.1rem 2.4rem 2.2rem;
                }

                .xp-top {
                    align-self: flex-start;
                    margin-left: 0;
                    width: min(880px, 60vw);
                    background:
                        radial-gradient(120% 140% at 8% -20%, rgba(255,255,255,0.07), transparent 55%),
                        radial-gradient(120% 160% at 105% 120%, rgba(0,0,0,0.4), transparent 60%),
                        linear-gradient(160deg, #232326 0%, #1b1b1e 55%, #161618 100%);
                    border-radius: 0 1.75rem 1.75rem 1.75rem;
                    opacity: 0;
                    transform: translateY(28px) scale(0.97);
                    transition: opacity .6s cubic-bezier(.19,1,.22,1), transform .6s cubic-bezier(.19,1,.22,1);
                }
                .xp-section.is-visible .xp-top {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    transition-delay: .05s;
                }

                .xp-bottom {
                    align-self: flex-end;
                    margin-right: 0;
                    width: min(600px, 46vw);
                    background:
                        radial-gradient(120% 140% at 95% -20%, rgba(255,255,255,0.07), transparent 55%),
                        radial-gradient(120% 160% at -5% 120%, rgba(0,0,0,0.4), transparent 60%),
                        linear-gradient(160deg, #232326 0%, #1b1b1e 55%, #161618 100%);
                    border-radius: 1.75rem 0 1.75rem 1.75rem;
                    opacity: 0;
                    transform: translateY(28px) scale(0.97);
                    transition: opacity .6s cubic-bezier(.19,1,.22,1), transform .6s cubic-bezier(.19,1,.22,1);
                }
                .xp-section.is-visible .xp-bottom {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    transition-delay: .18s;
                }

                .xp-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.45rem;
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 0.09em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.45);
                    margin: 0 0 1.5rem;
                }

                /* Every experience entry — including the current one — shares
                   this exact styling. No entry is sized up as a headline. */
                .xp-list {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                }
                .xp-list-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.85rem;
                    padding: 1.1rem 0;
                }
                .xp-list-row + .xp-list-row {
                    border-top: 1px solid rgba(255,255,255,0.08);
                }
                .xp-dot {
                    flex-shrink: 0;
                    margin-top: 0.4rem;
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    border: 1.5px solid rgba(255,255,255,0.35);
                    background: transparent;
                }
                .xp-dot.is-current {
                    background: #f5f5f5;
                    border-color: #f5f5f5;
                    box-shadow: 0 0 0 3px rgba(245,245,245,0.12);
                }
                .xp-list-main {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .xp-list-role {
                    font-size: 0.94rem;
                    font-weight: 700;
                    letter-spacing: -0.005em;
                    color: #eaeaea;
                    margin: 0;
                }
                .xp-list-place {
                    font-size: 0.8rem;
                    color: rgba(255,255,255,0.42);
                    margin: 0.22rem 0 0;
                }
                .xp-list-dates {
                    font-size: 0.76rem;
                    color: rgba(255,255,255,0.38);
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .xp-block + .xp-block {
                    margin-top: 1.6rem;
                    padding-top: 1.6rem;
                    border-top: 1px solid rgba(255,255,255,0.08);
                }
                .xp-block-head {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 1rem;
                    margin-bottom: 1.1rem;
                }
                .xp-block-tag {
                    font-size: 0.72rem;
                    font-weight: 700;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.42);
                    margin: 0;
                }
                .xp-icon-badge {
                    flex-shrink: 0;
                    width: 2.3rem;
                    height: 2.3rem;
                    border-radius: 0.8rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.09);
                    color: rgba(255,255,255,0.6);
                }
                .xp-degree {
                    font-size: 1.12rem;
                    font-weight: 800;
                    letter-spacing: -0.01em;
                    color: #f8f8f8;
                    margin: 0;
                }
                .xp-school {
                    font-size: 0.86rem;
                    color: rgba(255,255,255,0.5);
                    margin: 0.35rem 0 0;
                }
                .xp-dates {
                    font-size: 0.8rem;
                    color: rgba(255,255,255,0.36);
                    margin: 0.35rem 0 0;
                }
                .xp-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    margin-top: 1rem;
                    padding: 0.32rem 0.75rem;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.08);
                    color: #f0f0f0;
                    font-size: 0.72rem;
                    font-weight: 700;
                }

                /* Only true phone widths fall back to a simple stacked card —
                   tablets and small laptops keep the edge-bleed layout. */
                @media (max-width: 640px) {
                    .xp-top, .xp-bottom { width: 100%; margin: 0; border-radius: 1.4rem; }
                }
                @media (max-width: 540px) {
                    .xp-section { padding: 3.5rem 5vw calc(2.5rem + var(--dock-space-mobile, 6rem)); }
                    .xp-card { padding: 1.6rem 1.5rem 1.6rem; }
                    .xp-list-main { flex-direction: column; gap: 0.15rem; }
                    .xp-wrap { gap: 1.5rem; }
                }
            `}</style>

            <p className="xp-watermark" aria-hidden="true">
                DAVE MICHAEL CLAPIS
            </p>

            <div className="xp-wrap">
                <div className="xp-top xp-card">
                    <p className="xp-eyebrow">
                        <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        Experience
                    </p>

                    <div className="xp-list">
                        {EXPERIENCE.map((item) => (
                            <div className="xp-list-row" key={item.role}>
                                <span className={`xp-dot ${item.current ? 'is-current' : ''}`} />
                                <div className="xp-list-main">
                                    <div>
                                        <p className="xp-list-role">{item.role}</p>
                                        <p className="xp-list-place">{item.place}</p>
                                    </div>
                                    <p className="xp-list-dates">{item.dates}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="xp-bottom xp-card">
                    <div className="xp-block">
                        <div className="xp-block-head">
                            <p className="xp-block-tag">Education</p>
                            <span className="xp-icon-badge" aria-hidden="true">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M22 10 12 5 2 10l10 5 10-5Z" />
                                    <path d="M6 12v5c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5" />
                                </svg>
                            </span>
                        </div>
                        <p className="xp-degree">BS Computer Science</p>
                        <p className="xp-school">Bicol University</p>
                        <p className="xp-dates">2022 – 2026</p>
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
                            >
                                <circle cx="12" cy="8" r="6" />
                                <path d="M9 14 7 22l5-3 5 3-2-8" />
                            </svg>
                            Cum Laude
                        </span>
                    </div>

                    <div className="xp-block">
                        <div className="xp-block-head">
                            <p className="xp-block-tag">Certification</p>
                            <span className="xp-icon-badge" aria-hidden="true">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="9" r="6" />
                                    <path d="M8.5 14.2 7 22l5-3 5 3-1.5-7.8" />
                                </svg>
                            </span>
                        </div>
                        <p className="xp-degree">NC III Programming</p>
                        <p className="xp-dates">November 2024</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
