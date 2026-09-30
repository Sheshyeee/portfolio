import { useEffect, useRef, type CSSProperties, type ReactElement } from 'react';

/* ------------------------------------------------------------------ */
/*  Icons (same set as skills-section)                                  */
/* ------------------------------------------------------------------ */

const stackIconProps = {
    width: 15,
    height: 15,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
};

const CodeBracketsIcon = () => (
    <svg {...stackIconProps}>
        <path d="M8.5 8 4 12l4.5 4" />
        <path d="M15.5 8 20 12l-4.5 4" />
    </svg>
);
const MobileIcon = () => (
    <svg {...stackIconProps}>
        <rect x="7" y="3" width="10" height="18" rx="2" />
        <path d="M11 18h2" />
    </svg>
);
const AtomIcon = () => (
    <svg {...stackIconProps}>
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
    </svg>
);
const WindIcon = () => (
    <svg {...stackIconProps}>
        <path d="M3 8h11a3 3 0 1 0-2.5-4.6" />
        <path d="M3 12h15a3 3 0 1 1-2.5 4.6" />
        <path d="M3 16h8" />
    </svg>
);
const MonogramIcon = ({ letters }: { letters: string }) => (
    <svg {...stackIconProps}>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <text x="12" y="15.5" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="currentColor" stroke="none">
            {letters}
        </text>
    </svg>
);
const ElephantIcon = () => (
    <svg {...stackIconProps}>
        <path d="M4 15c0-5 3.5-9 8-9s8 3 8 6c0 2.5-2 4-4.5 4H12" />
        <path d="M8 15v4M12 15v4M16 16v3" />
        <circle cx="16" cy="8.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
);
const HexNodeIcon = () => (
    <svg {...stackIconProps}>
        <path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z" />
        <path d="M12 3v18M4.2 7.5 12 12l7.8-4.5M12 12v9" />
    </svg>
);
const CloudIcon = () => (
    <svg {...stackIconProps}>
        <path d="M7 18a4.5 4.5 0 0 1-.5-9 5.5 5.5 0 0 1 10.8-1.4A4 4 0 0 1 17.5 18H7Z" />
    </svg>
);
const BoxIcon = () => (
    <svg {...stackIconProps}>
        <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M4 7.5 12 12l8-4.5M12 12v9" />
    </svg>
);
const ContainerIcon = () => (
    <svg {...stackIconProps}>
        <rect x="3" y="9" width="18" height="9" rx="1.5" />
        <path d="M7 9V6.5A1.5 1.5 0 0 1 8.5 5h7A1.5 1.5 0 0 1 17 6.5V9" />
        <path d="M7 13h2M12 13h2M17 13h-.01" />
    </svg>
);
const BranchIcon = () => (
    <svg {...stackIconProps}>
        <circle cx="6" cy="6" r="2" />
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="9" r="2" />
        <path d="M6 8v8" />
        <path d="M6 8a6 6 0 0 0 6 6h4" />
    </svg>
);
const SendIcon = () => (
    <svg {...stackIconProps}>
        <path d="M4 11 20 4l-6.5 16-3-6.5L4 11Z" />
    </svg>
);
const BoardIcon = () => (
    <svg {...stackIconProps}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 8v8M14 8v5" />
    </svg>
);
const ChartIcon = () => (
    <svg {...stackIconProps}>
        <path d="M4 20V10M11 20V4M18 20v-7" />
        <path d="M4 20h14" />
    </svg>
);

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

// Colors that would vanish on the light theme use readable tones / theme vars.
type Tool = { name: string; icon: () => ReactElement; color: string };
type StackGroup = { label: string; tools: Tool[] };

const STACK_GROUPS: StackGroup[] = [
    {
        label: 'Frontend',
        tools: [
            { name: 'React', icon: AtomIcon, color: '#61DAFB' },
            { name: 'React Native', icon: MobileIcon, color: '#61DAFB' },
            { name: 'TypeScript', icon: () => <MonogramIcon letters="TS" />, color: '#4B9BF5' },
            { name: 'JavaScript', icon: () => <MonogramIcon letters="JS" />, color: '#D4B106' },
            { name: 'Tailwind CSS', icon: WindIcon, color: '#38BDF8' },
            { name: 'shadcn/ui', icon: CodeBracketsIcon, color: 'var(--ink)' },
        ],
    },
    {
        label: 'Backend',
        tools: [
            { name: 'Laravel', icon: () => <MonogramIcon letters="L" />, color: '#FF4B3E' },
            { name: 'PHP', icon: ElephantIcon, color: '#9A9EDB' },
            { name: 'Node.js', icon: HexNodeIcon, color: '#5FB85F' },
            { name: 'Python', icon: HexNodeIcon, color: '#E0A800' },
        ],
    },
    {
        label: 'Cloud & DevOps',
        tools: [
            { name: 'Laravel Cloud', icon: CloudIcon, color: '#FF4B3E' },
            { name: 'Google Cloud', icon: CloudIcon, color: '#5B9BFF' },
            { name: 'AWS', icon: BoxIcon, color: '#FF9900' },
            { name: 'Docker', icon: ContainerIcon, color: '#3BA9F0' },
        ],
    },
    {
        label: 'Tools & Analytics',
        tools: [
            { name: 'GitHub', icon: BranchIcon, color: 'var(--ink)' },
            { name: 'Postman', icon: SendIcon, color: '#FF6C37' },
            { name: 'Trello', icon: BoardIcon, color: '#4C8DFF' },
            { name: 'Google Analytics 4', icon: ChartIcon, color: '#F9AB00' },
        ],
    },
];

const ALL_TOOLS = STACK_GROUPS.flatMap((g) => g.tools.map((t) => t.name));
const MARQUEE_A = ALL_TOOLS.slice(0, Math.ceil(ALL_TOOLS.length / 2));
const MARQUEE_B = ALL_TOOLS.slice(Math.ceil(ALL_TOOLS.length / 2));

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */

type TechStackSectionProps = {
    sectionRef: (el: HTMLElement | null) => void;
    onSeeWork?: () => void;
};

export function TechStackSection({ sectionRef, onSeeWork }: TechStackSectionProps) {
    const localRef = useRef<HTMLElement | null>(null);

    // Replays the reveal each time the section enters view (same approach as HomeSection).
    useEffect(() => {
        const el = localRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => el.classList.toggle('is-visible', entry.isIntersecting), { threshold: 0.15 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const attachRefs = (el: HTMLElement | null) => {
        localRef.current = el;
        sectionRef(el);
    };

    let chipIndex = 0;

    return (
        <section id="stack" ref={attachRefs} className="section ts-section">
            <style>{`
                .ts-section {
                    /* Two-colour palette: everything is --bg / --ink or a mix of them. No gradients. */
                    --ts-bezel: clamp(7px, 0.95vw, 11px);
                    --ts-radius: clamp(24px, 3.4vw, 42px);
                    --ts-peek-h: clamp(8rem, 13vw, 12rem);
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: clamp(1.4rem, 3vw, 2.6rem);
                    min-height: 0;
                    padding: 0 !important;              /* peeks sit flush on the section edges */
                    border-bottom: 0 !important;
                    margin-top: -1px !important;        /* overlaps Home by 1px so no seam can open */
                    border-top: 0 !important;
                    opacity: 1 !important;
                    transform: none !important;
                    background: var(--bg);
                    color: var(--ink);
                    overflow: hidden;
                    font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
                }

                /* ---------- Vertical watermark: far right, cut off top + bottom ---------- */
                .ts-watermark {
                    position: absolute;
                    right: -2vw;
                    top: 50%;
                    transform: translateY(-50%);
                    writing-mode: vertical-rl;
                    margin: 0;
                    font-size: clamp(9rem, 22vw, 32rem);
                    font-weight: 700;
                    letter-spacing: -0.05em;
                    line-height: 1;
                    white-space: nowrap;
                    color: var(--fill);
                    pointer-events: none;
                    user-select: none;
                    z-index: 0;
                }

                .ts-wrap {
                    position: relative;
                    z-index: 1;
                    width: min(1120px, calc(100% - 2.5rem));
                    margin: 0 auto;
                }

                /* ---------- Device frame: thick bezel, rounded ---------- */
                .ts-frame {
                    position: relative;
                    background: var(--bg);
                    border: var(--ts-bezel) solid var(--line);
                    border-radius: var(--ts-radius);
                }

                /* =====================================================
                   TOP PEEK — bottom slice of the Home section.
                   Mirrors Home's bottom panel: starts at 46%, bleeds off
                   the right edge, Education | Certification columns.
                   ===================================================== */
                .ts-peek-top {
                    position: relative;
                    z-index: 1;
                    flex: 0 0 auto;
                    height: var(--ts-peek-h);
                    margin-top: -1px;
                    overflow: hidden;
                    container-type: inline-size;
                }
                .ts-hp {
                    --u: max(6px, min(0.6cqw, calc(1.15 * max(1svh, 0.52rem))));
                    position: absolute;
                    left: 46%;
                    right: -1px;
                    top: -6rem;
                    bottom: 0;
                    display: grid;
                    grid-template-columns: 39fr 61fr;
                    gap: calc(0.6 * var(--u));
                    padding: 0 0 calc(0.6 * var(--u)) calc(0.6 * var(--u));
                    border: var(--ts-bezel) solid var(--line);
                    border-top: none;
                    border-right: none;
                    border-radius: 0 0 0 var(--ts-radius);
                    background: var(--bg);
                }
                .ts-hp-col {
                    position: relative;
                    min-width: 0;
                    border: 1px solid var(--line);
                    border-top: none;
                    overflow: hidden;
                }
                .ts-hp-edu {
                    border-radius: 0 calc(0.8 * var(--u)) calc(0.8 * var(--u)) calc(2.6 * var(--u));
                    background: var(--bg);
                }
                .ts-hp-cert {
                    border-right: none;
                    border-radius: 0 0 0 calc(0.8 * var(--u));
                    background: var(--fill);
                }

                /* =====================================================
                   BOTTOM PEEK — top slice of the Selected Work section,
                   drawn live (no screenshots) so it always matches the theme.
                   ===================================================== */
                .ts-peek-bottom {
                    position: relative;
                    z-index: 1;
                    flex: 0 0 auto;
                    width: min(1120px, calc(100% - 2.5rem));
                    height: clamp(9rem, 16vw, 14rem);
                    margin: 0 auto;
                    overflow: hidden;
                    background: var(--bg);
                    border: var(--ts-bezel) solid var(--line);
                    border-bottom: none;
                    border-radius: var(--ts-radius) var(--ts-radius) 0 0;
                }
                .ts-pk {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: clamp(76px, 12vw, 120px);
                    overflow: hidden;
                    border-bottom: 1px solid var(--hair);
                }
                .ts-pk-mark {
                    position: absolute;
                    inset-inline: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    text-align: center;
                    line-height: 1;
                    font-weight: 700;
                    letter-spacing: -0.03em;
                    white-space: nowrap;
                    font-size: clamp(2.25rem, 11vw, 7.5rem);
                    color: var(--fill);
                    user-select: none;
                }
                .ts-pk-title {
                    position: relative;
                    font-size: clamp(1.15rem, 3.6vw, 2.1rem);
                    font-weight: 700;
                    letter-spacing: -0.02em;
                    line-height: 1;
                    text-transform: uppercase;
                }

                /* ---------- Main frame ---------- */
                .ts-main {
                    overflow: hidden;
                    padding: clamp(1.25rem, 2.6vw, 2.4rem) clamp(1.25rem, 3.4vw, 3.2rem) clamp(1.5rem, 3vw, 2.8rem);
                }
                .ts-notch { display: none; }

                .ts-topbar {
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    border-top: 1px solid var(--hair);
                    padding-top: 0.7rem;
                    font: 500 clamp(0.72rem, 1vw, 0.82rem) 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace;
                }
                .ts-tag { color: var(--ink); }
                .ts-total { color: var(--muted); }

                .ts-heading {
                    position: relative;
                    margin: clamp(1.6rem, 4vw, 3.4rem) 0 0;
                    font-size: clamp(1.75rem, 4.3vw, 3.75rem);
                    font-weight: 600;
                    line-height: 1.08;
                    letter-spacing: -0.04em;
                    text-indent: clamp(3rem, 15%, 11rem);
                    color: var(--ink);
                }
                .ts-heading em { font-style: normal; color: var(--muted); }

                .ts-side {
                    position: relative;
                    margin: clamp(1.4rem, 3vw, 2.6rem) 0 0 auto;
                    width: min(44%, 24rem);
                    text-align: left;
                }
                .ts-side p { margin: 0; font-size: clamp(0.72rem, 0.95vw, 0.82rem); line-height: 1.6; color: var(--muted); }
                .ts-btn {
                    margin-top: clamp(1rem, 2vw, 1.6rem);
                    padding: 0.7rem 1.6rem;
                    border-radius: 10px;
                    border: 1px solid var(--ink);
                    background: var(--ink);
                    color: var(--bg);
                    font: 600 0.78rem 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
                    cursor: pointer;
                    transition: background-color .25s ease, color .25s ease;
                }
                .ts-btn:hover { background: transparent; color: var(--ink); }
                .ts-btn:focus-visible, .ts-chip:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

                /* ---------- Stack groups ---------- */
                .ts-groups {
                    position: relative;
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: clamp(1rem, 2vw, 1.75rem);
                    margin-top: clamp(1.8rem, 4vw, 3.4rem);
                }
                .ts-group { border-top: 1px solid var(--hair); padding-top: 0.85rem; min-width: 0; }
                .ts-group-label {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    margin: 0 0 0.85rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: -0.01em;
                    color: var(--ink);
                }
                .ts-count { font: 500 0.68rem 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace; color: var(--muted); }
                .ts-chips { display: flex; flex-wrap: wrap; gap: 0.45rem; }
                .ts-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.36rem 0.75rem;
                    border-radius: 999px;
                    border: 1px solid var(--hair);
                    font-size: 0.74rem;
                    font-weight: 500;
                    color: var(--ink);
                    background: transparent;
                    opacity: 0;
                    transform: translateY(10px) scale(0.96);
                    transition:
                        opacity .5s cubic-bezier(.19,1,.22,1) calc(var(--d) * 40ms + 200ms),
                        transform .5s cubic-bezier(.19,1,.22,1) calc(var(--d) * 40ms + 200ms),
                        border-color .25s ease 0s,
                        background-color .25s ease 0s,
                        color .25s ease 0s;
                }
                .ts-chip-icon { display: inline-flex; }
                .ts-section.is-visible .ts-chip { opacity: 1; transform: none; }
                .ts-section.is-visible .ts-chip:hover {
                    transform: translateY(-2px);
                    border-color: var(--ink);
                    background: var(--ink);
                    color: var(--bg);
                    transition-delay: 0s;
                }

                /* ---------- Marquee (mobile only) ---------- */
                .ts-marquee { display: none; }

                @media (max-width: 1100px) {
                    .ts-groups { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }

                /* =====================================================
                   Mobile
                   ===================================================== */
                @media (max-width: 760px) {
                    .ts-section { --ts-bezel: 8px; --ts-radius: 30px; --ts-peek-h: 6rem; gap: 0.9rem; }
                    .ts-wrap, .ts-peek-bottom { width: calc(100% - 1.25rem); }
                    .ts-peek-bottom { height: 8.5rem; }
                    .ts-watermark { font-size: 34vw; right: -9vw; }

                    /* Top peek = bottom of Home's stacked Certification column */
                    .ts-hp {
                        --u: clamp(0.36rem, 1.5vw, 0.55rem);
                        left: 12%;
                        grid-template-columns: minmax(0, 1fr);
                        gap: 0.4rem;
                        padding: 0 0 0.4rem 0.4rem;
                    }
                    .ts-hp-edu { display: none; }
                    .ts-hp-cert { border-radius: 0 0 0 0.5rem; }

                    .ts-main { padding: 1.9rem 1.1rem 1.3rem; }
                    .ts-notch {
                        display: block;
                        position: absolute;
                        top: 0.55rem;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 4.2rem;
                        height: 0.32rem;
                        border-radius: 999px;
                        background: var(--line);
                    }
                    .ts-topbar { margin-top: 0.5rem; }
                    .ts-heading { text-indent: 0; font-size: clamp(1.55rem, 7.2vw, 2rem); line-height: 1.12; margin-top: 1.2rem; }
                    .ts-side { width: 100%; margin-top: 1rem; }
                    .ts-btn { width: 100%; padding: 0.85rem 1.2rem; }

                    .ts-marquee {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        gap: 0.5rem;
                        margin: 1.4rem -1.1rem 0;
                        overflow: hidden;
                    }
                    /* edge fade drawn with overlays (a CSS mask on moving content is costly on phones) */
                    .ts-marquee::before, .ts-marquee::after {
                        content: ''; position: absolute; top: 0; bottom: 0; width: 14%; z-index: 1; pointer-events: none;
                    }
                    .ts-marquee::before { left: 0; background: linear-gradient(to right, var(--bg), transparent); }
                    .ts-marquee::after { right: 0; background: linear-gradient(to left, var(--bg), transparent); }
                    .ts-marquee-track { display: flex; width: max-content; gap: 0.5rem; will-change: transform; animation: ts-scroll 26s linear infinite; }
                    .ts-marquee-track.rev { animation-direction: reverse; animation-duration: 32s; }
                    .ts-marquee-item {
                        flex: 0 0 auto;
                        padding: 0.4rem 0.95rem;
                        border-radius: 999px;
                        border: 1px solid var(--hair);
                        font-size: 0.74rem;
                        font-weight: 500;
                        color: var(--muted);
                    }
                    .ts-marquee-track.rev .ts-marquee-item { color: var(--ink); border-color: var(--line); }
                    @keyframes ts-scroll { to { transform: translateX(calc(-50% - 0.25rem)); } }

                    .ts-groups { grid-template-columns: 1fr; gap: 0.7rem; margin-top: 1.4rem; }
                    .ts-group {
                        border: 1px solid var(--hair);
                        border-radius: 20px;
                        padding: 0.95rem 0.95rem 1.05rem;
                        background: var(--fill);
                    }
                    .ts-group-label { font-size: 0.85rem; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .ts-marquee-track { animation: none; }
                    .ts-chip { transition: none; opacity: 1; transform: none; }
                }
            `}</style>

            {/* Vertical watermark, far right, clipped by the section's top and bottom */}
            <p className="ts-watermark" aria-hidden="true">
                Tech Stack
            </p>

            {/* TOP PEEK — bottom slice of Home (Education | Certification panel), glued to the top edge */}
            <div className="ts-peek-top" aria-hidden="true">
                <div className="ts-hp">
                    <div className="ts-hp-col ts-hp-edu" />
                    <div className="ts-hp-col ts-hp-cert" />
                </div>
            </div>

            {/* MAIN FRAME — Tech Stack */}
            <div className="ts-wrap">
                <div className="ts-frame ts-main">
                    <span className="ts-notch" aria-hidden="true" />

                    <div className="ts-topbar">
                        <span className="ts-tag">{'// Tech Stack'}</span>
                        <span className="ts-total">{ALL_TOOLS.length} tools</span>
                    </div>

                    <h2 className="ts-heading">
                        I’m a fullstack developer who <em>turns ideas into real products</em> with a stack built for clear interfaces, solid backends,
                        and fast execution.
                    </h2>

                    <div className="ts-side">
                        <p>From React on the front to Laravel on the back, and the cloud tools that ship it, here’s what I reach for every day.</p>
                        <button type="button" className="ts-btn" onClick={onSeeWork}>
                            See my Work
                        </button>
                    </div>

                    <div className="ts-marquee" aria-hidden="true">
                        <div className="ts-marquee-track">
                            {[...MARQUEE_A, ...MARQUEE_A].map((n, i) => (
                                <span className="ts-marquee-item" key={`a-${i}`}>
                                    {n}
                                </span>
                            ))}
                        </div>
                        <div className="ts-marquee-track rev">
                            {[...MARQUEE_B, ...MARQUEE_B].map((n, i) => (
                                <span className="ts-marquee-item" key={`b-${i}`}>
                                    {n}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="ts-groups">
                        {STACK_GROUPS.map((group) => (
                            <div className="ts-group" key={group.label}>
                                <p className="ts-group-label">
                                    {group.label}
                                    <span className="ts-count">{String(group.tools.length).padStart(2, '0')}</span>
                                </p>
                                <div className="ts-chips">
                                    {group.tools.map(({ name, icon: Icon, color }) => {
                                        const d = chipIndex++;
                                        return (
                                            <span key={name} className="ts-chip" tabIndex={0} style={{ '--d': d } as CSSProperties}>
                                                <span className="ts-chip-icon" style={{ color }}>
                                                    <Icon />
                                                </span>
                                                {name}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* BOTTOM PEEK — top slice of the Selected Work section, drawn live (no screenshots) */}
            <div className="ts-peek-bottom" aria-hidden="true">
                <div className="ts-pk">
                    <span className="ts-pk-mark">PORTFOLIO</span>
                    <span className="ts-pk-title">Selected Work</span>
                </div>
            </div>
        </section>
    );
}
