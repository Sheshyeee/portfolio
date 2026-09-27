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
    return (
        <section id="home" ref={sectionRef} className="section xp-section">
            <style>{`
                .xp-section {
                    position: relative;
                    justify-content: center;
                    background: #0c0c0d;
                    overflow: hidden;
                    padding: 6rem 6vw 5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    transform: scale(0.94);
                    opacity: 0;
                    transition: opacity .4s cubic-bezier(.19,1,.22,1), transform .4s cubic-bezier(.19,1,.22,1);
                }
                .xp-section.in-view {
                    opacity: 1;
                    transform: scale(1);
                }

                .xp-watermark {
                    position: absolute;
                    left: -1.5vw;
                    bottom: -3vh;
                    margin: 0;
                    width: max-content;
                    font-size: clamp(4rem, 13vw, 11rem);
                    font-weight: 900;
                    letter-spacing: -0.03em;
                    line-height: 1;
                    text-transform: uppercase;
                    color: transparent;
                    -webkit-text-stroke: 1.5px rgba(255,255,255,0.14);
                    z-index: 0;
                    pointer-events: none;
                    user-select: none;
                    white-space: nowrap;
                }

                .xp-wrap {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 900px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .xp-hero-card {
                    background: linear-gradient(155deg, #17171a 0%, #101012 65%, #0c0c0d 100%);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 1.75rem;
                    padding: 2.25rem 2.25rem 2rem;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.45);
                }
                .xp-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.72rem;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.45);
                    margin: 0 0 1.4rem;
                }
                .xp-current-role {
                    font-size: clamp(1.4rem, 3vw, 2rem);
                    font-weight: 700;
                    letter-spacing: -0.01em;
                    color: #f7f7f7;
                    margin: 0;
                    line-height: 1.2;
                }
                .xp-current-meta {
                    font-size: 0.95rem;
                    color: rgba(255,255,255,0.5);
                    margin: 0.5rem 0 1.6rem;
                }

                .xp-list {
                    list-style: none;
                    margin: 0;
                    padding: 1.4rem 0 0;
                    border-top: 1px solid rgba(255,255,255,0.08);
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .xp-list-item {
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .xp-list-role {
                    font-size: 0.92rem;
                    font-weight: 600;
                    color: #e7e7e7;
                    margin: 0;
                }
                .xp-list-place {
                    font-size: 0.82rem;
                    color: rgba(255,255,255,0.42);
                    margin: 0.2rem 0 0;
                }
                .xp-list-dates {
                    font-size: 0.78rem;
                    color: rgba(255,255,255,0.35);
                    white-space: nowrap;
                    flex-shrink: 0;
                }

                .xp-grid {
                    display: grid;
                    grid-template-columns: 1.1fr 1fr;
                    gap: 1.25rem;
                }

                .xp-card {
                    background: #131315;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 1.5rem;
                    padding: 1.75rem;
                    box-shadow: 0 20px 45px rgba(0,0,0,0.35);
                }
                .xp-card-tag {
                    font-size: 0.72rem;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.4);
                    margin: 0 0 1rem;
                }
                .xp-degree {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #f5f5f5;
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
                    margin-top: 1.1rem;
                    padding: 0.32rem 0.75rem;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.08);
                    color: #f0f0f0;
                    font-size: 0.72rem;
                    font-weight: 600;
                }

                .xp-cert-name {
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #f5f5f5;
                    margin: 0;
                }
                .xp-cert-date {
                    font-size: 0.85rem;
                    color: rgba(255,255,255,0.5);
                    margin: 0.35rem 0 0;
                }

                @media (max-width: 820px) {
                    .xp-section { padding: 5.5rem 5.5vw 3.5rem; }
                    .xp-hero-card { padding: 1.6rem 1.5rem 1.5rem; border-radius: 1.4rem; }
                    .xp-grid { grid-template-columns: 1fr; }
                    .xp-list-item { flex-direction: column; gap: 0.15rem; }
                }
            `}</style>

            {/* Static watermark — never animates, sits behind everything */}
            <p className="xp-watermark" aria-hidden="true">
                DAVE CLAPIS
            </p>

            <div className="xp-wrap">
                {/* Current role, styled as the headline card */}
                <div className="xp-hero-card">
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

                    <ul className="xp-list">
                        {EXPERIENCE.slice(1).map((item) => (
                            <li className="xp-list-item" key={item.role}>
                                <div>
                                    <p className="xp-list-role">{item.role}</p>
                                    <p className="xp-list-place">{item.place}</p>
                                </div>
                                {item.dates && <p className="xp-list-dates">{item.dates}</p>}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Education + certification row */}
                <div className="xp-grid">
                    <div className="xp-card">
                        <p className="xp-card-tag">Education</p>
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

                    <div className="xp-card">
                        <p className="xp-card-tag">Certification</p>
                        <p className="xp-cert-name">NC III Programming</p>
                        <p className="xp-cert-date">November 2024</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
