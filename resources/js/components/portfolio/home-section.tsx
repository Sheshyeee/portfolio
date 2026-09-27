type HomeSectionProps = {
    sectionRef: (el: HTMLElement | null) => void;
};

type ExperienceItem = {
    role: string;
    place: string;
    dates: string;
    current?: boolean;
};

type CertificationItem = {
    name: string;
    date: string;
};

const EXPERIENCE: ExperienceItem[] = [
    { role: 'Web Developer / Fullstack Developer', place: 'Freelance', dates: '2025 — Present', current: true },
    { role: 'Web Developer Intern', place: 'DOST – Technology Application and Promotion Institute', dates: '2025' },
    { role: 'Developer / UI Designer Intern', place: 'Ollopa Corporation', dates: '2024' },
    { role: 'Lead Developer', place: 'Capstone & school software projects', dates: '' },
];

const CERTIFICATIONS: CertificationItem[] = [{ name: 'NC III Programming', date: 'November 2024' }];

export function HomeSection({ sectionRef }: HomeSectionProps) {
    return (
        <section id="home" ref={sectionRef} className="section home-section">
            {/* Static, non-moving name watermark — sits behind both cards and never animates */}
            <p className="home-watermark" aria-hidden="true">
                DAVE MICHAEL CLAPIS
            </p>

            <div className="home-cards">
                {/* ---------------- Experience ---------------- */}
                <div className="home-card">
                    <div className="home-card-head">
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
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                        <h2>Experience</h2>
                    </div>

                    <ul className="home-timeline">
                        {EXPERIENCE.map((item) => (
                            <li key={item.role} className="home-timeline-item">
                                <span className={`home-timeline-dot ${item.current ? 'is-current' : ''}`} />
                                <div className="home-timeline-body">
                                    <div className="home-timeline-row">
                                        <p className="home-timeline-role">{item.role}</p>
                                        {item.dates && <p className="home-timeline-dates">{item.dates}</p>}
                                    </div>
                                    <p className="home-timeline-place">{item.place}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ---------------- Education + Certifications ---------------- */}
                <div className="home-card">
                    <div className="home-card-head">
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
                        <h2>Education</h2>
                    </div>

                    <div className="home-edu-row">
                        <div>
                            <p className="home-edu-degree">BS Computer Science</p>
                            <p className="home-edu-school">Bicol University</p>
                            <p className="home-edu-dates">2022 – 2026</p>
                        </div>
                        <span className="home-honor-badge">
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

                    <div className="home-cert-divider" />

                    <p className="home-cert-label">Certifications</p>
                    {CERTIFICATIONS.map((cert) => (
                        <div className="home-edu-row" key={cert.name}>
                            <div>
                                <p className="home-edu-degree">{cert.name}</p>
                                <p className="home-edu-dates">{cert.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Styles this section needs — merge into the <style> block in        */
/*  Welcome.tsx, replacing the old ".home-section" / ".home-cover"     */
/*  rules with the block below.                                        */
/* ------------------------------------------------------------------ */
/*
   .home-section {
       position: relative;
       justify-content: center;
       align-items: center;
       background: #0a0a0a;
       overflow: hidden;
       border-bottom: 1px solid rgba(255,255,255,0.08);
   }

   // Faster, punchier "pop" reveal for this section only, overriding the
   // generic slow fade+slide every other .section uses.
   .home-section {
       transition: opacity .35s cubic-bezier(.19,1,.22,1), transform .35s cubic-bezier(.19,1,.22,1);
       transform: scale(0.96);
   }
   .home-section.in-view {
       opacity: 1;
       transform: scale(1);
   }

   .home-watermark {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       margin: 0;
       width: max-content;
       font-size: clamp(3.5rem, 12vw, 9rem);
       font-weight: 900;
       letter-spacing: -0.03em;
       text-transform: uppercase;
       white-space: nowrap;
       color: transparent;
       -webkit-text-stroke: 1.5px rgba(255,255,255,0.14);
       z-index: 0;
       pointer-events: none;
       user-select: none;
   }

   .home-cards {
       position: relative;
       z-index: 1;
       width: 100%;
       max-width: 760px;
       margin: 0 auto;
       display: flex;
       flex-direction: column;
       gap: 1.5rem;
   }

   .home-card {
       background: rgba(255,255,255,0.03);
       border: 1px solid rgba(255,255,255,0.09);
       border-radius: 1.5rem;
       padding: 1.75rem 1.75rem 2rem;
       backdrop-filter: blur(20px);
   }

   .home-card-head {
       display: flex;
       align-items: center;
       gap: 0.6rem;
       color: #f5f5f5;
       margin-bottom: 1.4rem;
   }
   .home-card-head h2 {
       font-size: 1.05rem;
       font-weight: 600;
       letter-spacing: -0.01em;
       margin: 0;
   }

   .home-timeline {
       list-style: none;
       margin: 0;
       padding: 0;
       display: flex;
       flex-direction: column;
       gap: 1.1rem;
   }
   .home-timeline-item {
       display: flex;
       gap: 0.75rem;
       align-items: flex-start;
   }
   .home-timeline-dot {
       margin-top: 0.4rem;
       width: 8px;
       height: 8px;
       border-radius: 50%;
       border: 1.5px solid rgba(255,255,255,0.4);
       background: transparent;
       flex-shrink: 0;
   }
   .home-timeline-dot.is-current {
       background: #f5f5f5;
       border-color: #f5f5f5;
   }
   .home-timeline-body { flex: 1; min-width: 0; }
   .home-timeline-row {
       display: flex;
       align-items: baseline;
       justify-content: space-between;
       gap: 1rem;
   }
   .home-timeline-role {
       font-size: 0.92rem;
       font-weight: 600;
       color: #f5f5f5;
       margin: 0;
   }
   .home-timeline-dates {
       font-size: 0.78rem;
       color: rgba(255,255,255,0.45);
       white-space: nowrap;
       margin: 0;
   }
   .home-timeline-place {
       font-size: 0.84rem;
       color: rgba(255,255,255,0.5);
       margin: 0.15rem 0 0;
   }

   .home-edu-row {
       display: flex;
       align-items: flex-start;
       justify-content: space-between;
       gap: 1rem;
   }
   .home-edu-degree {
       font-size: 0.95rem;
       font-weight: 600;
       color: #f5f5f5;
       margin: 0;
   }
   .home-edu-school {
       font-size: 0.84rem;
       color: rgba(255,255,255,0.55);
       margin: 0.2rem 0 0;
   }
   .home-edu-dates {
       font-size: 0.8rem;
       color: rgba(255,255,255,0.4);
       margin: 0.2rem 0 0;
   }
   .home-honor-badge {
       display: inline-flex;
       align-items: center;
       gap: 4px;
       padding: 0.3rem 0.7rem;
       border-radius: 999px;
       background: rgba(255,255,255,0.08);
       color: #f5f5f5;
       font-size: 0.72rem;
       font-weight: 600;
       white-space: nowrap;
   }

   .home-cert-divider {
       height: 1px;
       background: rgba(255,255,255,0.08);
       margin: 1.4rem 0 1.1rem;
   }
   .home-cert-label {
       font-size: 0.72rem;
       letter-spacing: 0.06em;
       text-transform: uppercase;
       color: rgba(255,255,255,0.35);
       margin: 0 0 0.8rem;
   }

   @media (max-width: 820px) {
       .home-section { padding: 6rem 5.5vw 3.5rem; }
       .home-card { padding: 1.4rem 1.3rem 1.6rem; border-radius: 1.25rem; }
       .home-timeline-row { flex-direction: column; gap: 0.15rem; }
   }
*/
