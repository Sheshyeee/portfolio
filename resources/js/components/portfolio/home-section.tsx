import { useEffect, useRef, useState } from 'react';

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
    const [visible, setVisible] = useState(false);

    // Own IntersectionObserver so this section's reveal replays every time
    // it re-enters view (not just the first time, like the rest of the page).
    useEffect(() => {
        const el = localRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.22 });

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const attachRefs = (el: HTMLElement | null) => {
        localRef.current = el;
        sectionRef(el);
    };

    return (
        <section id="home" ref={attachRefs} className={`section xp-section ${visible ? 'is-visible' : ''}`}>
            <style>{`
                .xp-section {
                    position: relative;
                    justify-content: center;
                    background: #0a0a0b;
                    overflow: hidden;
                    padding: 6.5rem 6vw calc(3rem + var(--dock-space-mobile, 6rem));
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
                }

                .xp-watermark {
                    position: absolute;
                    left: -1vw;
                    top: 52%;
                    transform: translateY(-50%);
                    margin: 0;
                    width: max-content;
                    font-size: clamp(3.5rem, 11vw, 8.5rem);
                    font-weight: 900;
                    letter-spacing: -0.03em;
                    line-height: 1;
                    text-transform: uppercase;
                    color: transparent;
                    -webkit-text-stroke: 1.5px rgba(255,255,255,0.12);
                    z-index: 0;
                    pointer-events: none;
                    user-select: none;
                    white-space: nowrap;
                    opacity: 0;
                    transition: opacity 1s cubic-bezier(.19,1,.22,1);
                }
                .xp-section.is-visible .xp-watermark { opacity: 1; }

                .xp-wrap {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 1080px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 2.75rem;
                }

                /* ---- top-left card: experience ---- */
                .xp-top {
                    align-self: flex-start;
                    width: min(660px, 68%);
                    background: linear-gradient(155deg, #18181b 0%, #101012 65%, #0a0a0b 100%);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 1.75rem;
                    padding: 2.25rem 2.25rem 2rem;
                    box-shadow: 0 30px 70px rgba(0,0,0,0.5);
                    opacity: 0;
                    transform: translateY(28px) scale(0.97);
                    transition: opacity .6s cubic-bezier(.19,1,.22,1), transform .6s cubic-bezier(.19,1,.22,1);
                }
                .xp-section.is-visible .xp-top {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    transition-delay: .05s;
                }

                /* ---- bottom-right card: education + certification ---- */
                .xp-bottom {
                    align-self: flex-end;
                    width: min(560px, 58%);
                    background: linear-gradient(155deg, #18181b 0%, #101012 65%, #0a0a0b 100%);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 1.75rem;
                    padding: 2.1rem 2.1rem 2rem;
                    box-shadow: 0 30px 70px rgba(0,0,0,0.5);
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
                    gap: 0.4rem;
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.42);
                    margin: 0 0 1.5rem;
                }

                .xp-current-role {
                    font-size: clamp(1.5rem, 2.8vw, 2.1rem);
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    color: #f8f8f8;
                    margin: 0;
                    line-height: 1.15;
                }
                .xp-current-meta {
                    font-size: 0.92rem;
                    color: rgba(255,255,255,0.48);
                    margin: 0.55rem 0 1.6rem;
                }

                .xp-list {
                    margin: 0;
                    padding: 1.4rem 0 0;
                    border-top: 1px solid rgba(255,255,255,0.08);
                    display: flex;
                    flex-direction: column;
                    gap: 1.15rem;
                }
                .xp-list-row {
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .xp-list-role {
                    font-size: 0.92rem;
                    font-weight: 700;
                    color: #e9e9e9;
                    margin: 0;
                }
                .xp-list-place {
                    font-size: 0.8rem;
                    color: rgba(255,255,255,0.4);
                    margin: 0.2rem 0 0;
                }
                .xp-list-dates {
                    font-size: 0.76rem;
                    color: rgba(255,255,255,0.35);
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .xp-block + .xp-block {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(255,255,255,0.08);
                }
                .xp-block-tag {
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.4);
                    margin: 0 0 0.9rem;
                }
                .xp-degree {
                    font-size: 1.1rem;
                    font-weight: 800;
                    letter-spacing: -0.01em;
                    color: #f8f8f8;
                    margin: 0;
                }
                .xp-school {
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.5);
                    margin: 0.35rem 0 0;
                }
                .xp-dates {
                    font-size: 0.8rem;
                    color: rgba(255,255,255,0.35);
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

                @media (max-width: 900px) {
                    .xp-top, .xp-bottom { width: 100%; }
                }
                @media (max-width: 820px) {
                    .xp-section { padding: 5.5rem 5.5vw calc(2.5rem + var(--dock-space-mobile, 6rem)); }
                    .xp-top, .xp-bottom { padding: 1.6rem 1.5rem 1.5rem; border-radius: 1.4rem; }
                    .xp-list-row { flex-direction: column; gap: 0.15rem; }
                    .xp-wrap { gap: 1.75rem; }
                }
            `}</style>

            <p className="xp-watermark" aria-hidden="true">
                DAVE CLAPIS
            </p>

            <div className="xp-wrap">
                {/* Top-left card: Experience */}
                <div className="xp-top">
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

                    <p className="xp-current-role">{EXPERIENCE[0].role}</p>
                    <p className="xp-current-meta">
                        {EXPERIENCE[0].place} · {EXPERIENCE[0].dates}
                    </p>

                    <div className="xp-list">
                        {EXPERIENCE.slice(1).map((item) => (
                            <div className="xp-list-row" key={item.role}>
                                <div>
                                    <p className="xp-list-role">{item.role}</p>
                                    <p className="xp-list-place">{item.place}</p>
                                </div>
                                {item.dates && <p className="xp-list-dates">{item.dates}</p>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom-right card: Education + Certification, merged */}
                <div className="xp-bottom">
                    <div className="xp-block">
                        <p className="xp-block-tag">Education</p>
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
                        <p className="xp-block-tag">Certification</p>
                        <p className="xp-degree">NC III Programming</p>
                        <p className="xp-dates">November 2024</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
