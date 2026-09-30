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

type Tool = { name: string; icon: () => ReactElement; color: string };
type StackGroup = { label: string; tools: Tool[] };

// Colors that would vanish on the light theme use readable tones / theme vars.
const STACK_GROUPS: StackGroup[] = [
    {
        label: 'Frontend',
        tools: [
            { name: 'React', icon: AtomIcon, color: '#61DAFB' },
            { name: 'React Native', icon: MobileIcon, color: '#61DAFB' },
            { name: 'TypeScript', icon: () => <MonogramIcon letters="TS" />, color: '#4B9BF5' },
            { name: 'JavaScript', icon: () => <MonogramIcon letters="JS" />, color: '#D4B106' },
            { name: 'Tailwind CSS', icon: WindIcon, color: '#38BDF8' },
            { name: 'shadcn/ui', icon: CodeBracketsIcon, color: 'var(--ts-ink)' },
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
            { name: 'GitHub', icon: BranchIcon, color: 'var(--ts-ink)' },
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
                    /* ---- palette: light = icy snow-blue with road-blue bezels; dark = night city (see :root.dark below) ---- */
                    --ts-accent: #f2582f;
                    --ts-bg: #e4ecf6;
                    --ts-ring: rgba(255,255,255,0.9);       /* hairline outside the bezel */
                    --ts-black: #7fa3cc;                    /* bezel = road blue */
                    --ts-frame: #f7faff;
                    --ts-ink: #14243a;
                    --ts-inv: #ffffff;                      /* text on an ink-coloured button */
                    --ts-mute: rgba(20,36,58,0.6);
                    --ts-soft: rgba(20,36,58,0.75);
                    --ts-dim: rgba(20,36,58,0.45);
                    --ts-hair-1: rgba(40,90,150,0.18);
                    --ts-hair-2: rgba(40,90,150,0.14);
                    --ts-hair-3: rgba(40,90,150,0.22);
                    --ts-hair-4: rgba(40,90,150,0.12);
                    --ts-hair-5: rgba(40,90,150,0.18);
                    --ts-fill: rgba(47,127,216,0.04);
                    --ts-fill-2: rgba(47,127,216,0.08);
                    --ts-fill-3: rgba(47,127,216,0.02);
                    --ts-water: rgba(47,127,216,0.08);
                    --ts-water-m: rgba(47,127,216,0.06);
                    --ts-hi: rgba(255,255,255,0.95);
                    --ts-shadow: rgba(40,80,130,0.20);
                    --ts-shadow-lg: rgba(40,80,130,0.28);
                    /* top peek: must match Home's bottom panel */
                    --ts-hp-bg: #eff4fa;
                    --ts-hp-edu: #ffffff;
                    --ts-hp-cert: #e6eef8;
                    --ts-hp-glow: rgba(242,88,47,0.20);
                    /* bottom peek: matches the Projects section behind it */
                    --ts-peek-bg: #eef3f9;
                    --ts-bezel: clamp(7px, 0.95vw, 11px);
                    --ts-radius: clamp(24px, 3.4vw, 42px);
                    --ts-peek-h: clamp(8rem, 13vw, 12rem);
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    gap: clamp(1.4rem, 3vw, 2.6rem);
                    min-height: 0;
                    padding: 0 !important;              /* peeks sit flush on the section edges */
                    border-bottom: 0 !important;        /* no line under the bottom peek */
                    margin-top: -1px !important;        /* overlaps Home by 1px so no seam can open */
                    border-top: 0 !important;
                    opacity: 1 !important;              /* no whole-section fade/slide, only inner chips animate */
                    transform: none !important;
                    background: var(--ts-bg);
                    color: var(--ts-ink);
                    overflow: hidden;
                    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
                }

                /* Dark mode: the night-city version — deep navy frames, cyan rim light, warm orange glow. */
                :root.dark .ts-section {
                    --ts-bg: #060b14;
                    --ts-black: #1b2c47;
                    --ts-ring: rgba(120,180,255,0.16);
                    --ts-frame: #0d1626;
                    --ts-ink: #eaf2ff;
                    --ts-inv: #060b14;
                    --ts-mute: rgba(200,222,255,0.55);
                    --ts-soft: rgba(200,222,255,0.75);
                    --ts-dim: rgba(200,222,255,0.38);
                    --ts-hair-1: rgba(140,190,255,0.16);
                    --ts-hair-2: rgba(140,190,255,0.12);
                    --ts-hair-3: rgba(140,190,255,0.18);
                    --ts-hair-4: rgba(140,190,255,0.09);
                    --ts-hair-5: rgba(140,190,255,0.14);
                    --ts-fill: rgba(140,190,255,0.03);
                    --ts-fill-2: rgba(140,190,255,0.06);
                    --ts-fill-3: rgba(140,190,255,0.02);
                    --ts-water: rgba(92,200,255,0.06);
                    --ts-water-m: rgba(92,200,255,0.045);
                    --ts-hi: rgba(92,200,255,0.10);
                    --ts-shadow: rgba(0,0,0,0.6);
                    --ts-shadow-lg: rgba(0,0,0,0.7);
                    --ts-hp-bg: #0b1322;
                    --ts-hp-edu: #101c30;
                    --ts-hp-cert: #0a1120;
                    --ts-hp-glow: rgba(255,110,64,0.26);
                    --ts-peek-bg: #060b14;
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
                    color: var(--ts-water);
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
                    background: var(--ts-frame);
                    border: var(--ts-bezel) solid var(--ts-black);
                    border-radius: var(--ts-radius);
                    box-shadow: 0 0 0 1px var(--ts-ring), 0 40px 90px var(--ts-shadow-lg);
                }

                /* =====================================================
                   TOP PEEK — bottom slice of the Home section.
                   Glued to the top edge of this section. Mirrors Home's
                   bottom panel: starts at 46%, bleeds off the right edge,
                   Education | Certification columns. Uses the same --u
                   formula as Home so gaps/radii line up at any size.
                   ===================================================== */
                .ts-peek-top {
                    position: relative;
                    z-index: 1;
                    flex: 0 0 auto;
                    height: var(--ts-peek-h);
                    margin-top: -1px;
                    overflow: hidden;
                    container-type: inline-size;        /* lets --u use the same cqw maths as Home */
                }
                .ts-hp {
                    --u: max(6px, min(0.6cqw, calc(1.15 * max(1svh, 0.52rem))));
                    position: absolute;
                    left: 46%;
                    right: -1px;
                    top: -6rem;                         /* runs past the top so the panel always touches it */
                    bottom: 0;
                    display: grid;
                    grid-template-columns: 39fr 61fr;
                    gap: calc(0.6 * var(--u));
                    padding: 0 0 calc(0.6 * var(--u)) calc(0.6 * var(--u));
                    border: var(--ts-bezel) solid var(--ts-black);
                    border-top: none;
                    border-right: none;
                    border-radius: 0 0 0 var(--ts-radius);
                    background: var(--ts-hp-bg);
                    box-shadow: 0 0 0 1px var(--ts-ring), 0 30px 70px var(--ts-shadow);
                }
                .ts-hp-col {
                    position: relative;
                    min-width: 0;
                    border: 1px solid var(--ts-black);
                    border-top: none;                   /* continues Home's columns, no new top edge */
                    overflow: hidden;
                }
                .ts-hp-edu {
                    border-radius: 0 calc(0.8 * var(--u)) calc(0.8 * var(--u)) calc(2.6 * var(--u));
                    background: var(--ts-hp-edu);
                }
                .ts-hp-cert {
                    border-right: none;
                    border-radius: 0 0 0 calc(0.8 * var(--u));
                    /* tail end of Home's glow so the gradient flows across the seam */
                    background:
                        radial-gradient(60% 13rem at 62% -5rem, var(--ts-hp-glow), transparent 70%),
                        var(--ts-hp-cert);
                }

                /* =====================================================
                   BOTTOM PEEK — top slice of the Skills section.
                   Matches the page background, with a bezel border,
                   glued to the bottom edge of this section.
                   ===================================================== */
                .ts-peek-bottom {
                    position: relative;
                    z-index: 1;
                    flex: 0 0 auto;
                    width: min(1120px, calc(100% - 2.5rem));
                    height: clamp(13rem, 22vw, 20rem);
                    margin: 0 auto;
                    overflow: hidden;
                    background: var(--ts-peek-bg);
                    border: var(--ts-bezel) solid var(--ts-black);
                    border-bottom: none;
                    border-radius: var(--ts-radius) var(--ts-radius) 0 0;
                }
                /* The screenshot is 1915px wide with the dark-mode button + scrollbar on the
                   right, so it is scaled up ~15.7% and shifted to crop 130px off each side. */
                .ts-sp-pic { display: block; }
                .ts-sp-pic.ts-sp-pic-dark { display: none; }
                :root.dark .ts-sp-pic.ts-sp-pic-dark { display: block; }
                :root.dark .ts-sp-pic.ts-sp-pic-light { display: none; }
                .ts-sp-shot {
                    display: block;
                    width: 115.7%;
                    max-width: none;
                    margin-left: -7.85%;
                    height: auto;
                    user-select: none;
                    pointer-events: none;
                }

                /* ---------- Main frame ---------- */
                .ts-main {
                    overflow: hidden;
                    padding: clamp(1.25rem, 2.6vw, 2.4rem) clamp(1.25rem, 3.4vw, 3.2rem) clamp(1.5rem, 3vw, 2.8rem);
                    background:
                        radial-gradient(70% 60% at 18% 0%, var(--ts-hi), transparent 65%),
                        var(--ts-frame);
                }
                .ts-notch { display: none; }
                .ts-glow {
                    position: absolute;
                    right: -12%;
                    top: -18%;
                    width: 55%;
                    aspect-ratio: 1;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(242,88,47,0.28), transparent 68%);
                    pointer-events: none;
                    animation: ts-drift 9s ease-in-out infinite alternate;
                }
                @keyframes ts-drift { from { transform: translate(0, 0) scale(1); } to { transform: translate(-8%, 10%) scale(1.15); } }

                .ts-topbar {
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    border-top: 1px solid var(--ts-hair-1);
                    padding-top: 0.7rem;
                    font: 500 clamp(0.72rem, 1vw, 0.82rem) 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace;
                }
                .ts-tag { color: var(--ts-accent); }
                .ts-total { color: var(--ts-dim); }

                .ts-heading {
                    position: relative;
                    margin: clamp(1.6rem, 4vw, 3.4rem) 0 0;
                    font-size: clamp(1.75rem, 4.3vw, 3.75rem);
                    font-weight: 600;
                    line-height: 1.08;
                    letter-spacing: -0.035em;
                    text-indent: clamp(3rem, 15%, 11rem);
                    color: var(--ts-ink);
                }
                .ts-heading em { font-style: normal; color: var(--ts-accent); }

                .ts-side {
                    position: relative;
                    margin: clamp(1.4rem, 3vw, 2.6rem) 0 0 auto;
                    width: min(44%, 24rem);
                    text-align: left;
                }
                .ts-side p { margin: 0; font-size: clamp(0.72rem, 0.95vw, 0.82rem); line-height: 1.6; color: var(--ts-mute); }
                .ts-btn {
                    margin-top: clamp(1rem, 2vw, 1.6rem);
                    padding: 0.7rem 1.6rem;
                    border-radius: 999px;
                    border: 1px solid var(--ts-hair-3);
                    background: var(--ts-fill);
                    color: var(--ts-ink);
                    font: 500 0.78rem 'Inter', ui-sans-serif, system-ui, sans-serif;
                    cursor: pointer;
                    transition: background-color .25s ease, border-color .25s ease, color .25s ease;
                }
                .ts-btn:hover { background: var(--ts-ink); border-color: var(--ts-ink); color: var(--ts-inv); }
                .ts-btn:focus-visible, .ts-chip:focus-visible { outline: 2px solid var(--ts-accent); outline-offset: 3px; }

                /* ---------- Stack groups ---------- */
                .ts-groups {
                    position: relative;
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: clamp(1rem, 2vw, 1.75rem);
                    margin-top: clamp(1.8rem, 4vw, 3.4rem);
                }
                .ts-group { border-top: 1px solid var(--ts-hair-2); padding-top: 0.85rem; min-width: 0; }
                .ts-group-label {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    margin: 0 0 0.85rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: -0.01em;
                    color: var(--ts-ink);
                }
                .ts-count { font: 500 0.68rem 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace; color: var(--ts-accent); }
                .ts-chips { display: flex; flex-wrap: wrap; gap: 0.45rem; }
                .ts-chip {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.36rem 0.75rem;
                    border-radius: 999px;
                    border: 1px solid var(--ts-hair-3);
                    font-size: 0.74rem;
                    font-weight: 500;
                    color: var(--ts-ink);
                    background: var(--ts-fill);
                    opacity: 0;
                    transform: translateY(10px) scale(0.96);
                    transition:
                        opacity .5s cubic-bezier(.19,1,.22,1) calc(var(--d) * 40ms + 200ms),
                        transform .5s cubic-bezier(.19,1,.22,1) calc(var(--d) * 40ms + 200ms),
                        border-color .25s ease 0s,
                        background-color .25s ease 0s;
                }
                .ts-chip-icon { display: inline-flex; }
                .ts-section.is-visible .ts-chip { opacity: 1; transform: none; }
                .ts-section.is-visible .ts-chip:hover {
                    transform: translateY(-2px);
                    border-color: var(--ts-accent);
                    background: rgba(242,88,47,0.1);
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
                    .ts-peek-bottom { height: 11.5rem; }
                    /* Mobile screenshots are ~358px wide with the theme button top-right,
                       so crop 55px off each side (keeps the heading, drops the button). */
                    .ts-sp-shot { width: 144.4%; margin-left: -22.2%; }
                    .ts-watermark { font-size: 34vw; right: -9vw; color: var(--ts-water-m); }

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
                        background: var(--ts-black);
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
                        -webkit-mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
                        mask-image: linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent);
                    }
                    .ts-marquee-track { display: flex; width: max-content; gap: 0.5rem; animation: ts-scroll 26s linear infinite; }
                    .ts-marquee-track.rev { animation-direction: reverse; animation-duration: 32s; }
                    .ts-marquee-item {
                        flex: 0 0 auto;
                        padding: 0.4rem 0.95rem;
                        border-radius: 999px;
                        border: 1px solid var(--ts-hair-5);
                        font-size: 0.74rem;
                        font-weight: 500;
                        color: var(--ts-soft);
                    }
                    .ts-marquee-track.rev .ts-marquee-item { color: var(--ts-accent); border-color: rgba(242,88,47,0.4); }
                    @keyframes ts-scroll { to { transform: translateX(calc(-50% - 0.25rem)); } }

                    .ts-groups { grid-template-columns: 1fr; gap: 0.7rem; margin-top: 1.4rem; }
                    .ts-group {
                        border: 1px solid var(--ts-hair-4);
                        border-radius: 20px;
                        padding: 0.95rem 0.95rem 1.05rem;
                        background: linear-gradient(160deg, var(--ts-fill-2), var(--ts-fill-3));
                    }
                    .ts-group-label { font-size: 0.85rem; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .ts-glow, .ts-marquee-track { animation: none; }
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
                    <span className="ts-glow" aria-hidden="true" />

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

            {/* BOTTOM PEEK — top slice of the Projects section (screenshot), glued to the bottom edge */}
            <div className="ts-peek-bottom" aria-hidden="true">
                <picture className="ts-sp-pic ts-sp-pic-light">
                    <source media="(max-width: 760px)" srcSet="/projects-peek-mobile.png" />
                    <img className="ts-sp-shot" src="/projects-peek.png" alt="" loading="lazy" draggable={false} />
                </picture>
                <picture className="ts-sp-pic ts-sp-pic-dark">
                    <source media="(max-width: 760px)" srcSet="/projects-peek-mobile-dark.png" />
                    <img className="ts-sp-shot" src="/projects-peek-dark.png" alt="" loading="lazy" draggable={false} />
                </picture>
            </div>
        </section>
    );
}
