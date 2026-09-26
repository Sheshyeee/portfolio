import { useRef, useState, type ReactElement } from 'react';

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

const iconProps = {
    width: 21,
    height: 21,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
};

const HomeIcon = () => (
    <svg {...iconProps}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 9.8V20h13V9.8" />
        <path d="M9.5 20v-6h5v6" />
    </svg>
);

const UserIcon = () => (
    <svg {...iconProps}>
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5 20c1.2-3.8 4-5.6 7-5.6s5.8 1.8 7 5.6" />
    </svg>
);

const CodeIcon = () => (
    <svg {...iconProps}>
        <path d="M8.5 8 4 12l4.5 4" />
        <path d="M15.5 8 20 12l-4.5 4" />
        <path d="M13.5 6 10.5 18" />
    </svg>
);

const GridIcon = () => (
    <svg {...iconProps}>
        <rect x="4" y="4" width="7" height="7" rx="1.2" />
        <rect x="13" y="4" width="7" height="7" rx="1.2" />
        <rect x="4" y="13" width="7" height="7" rx="1.2" />
        <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </svg>
);

/* ------------------------------------------------------------------ */
/*  Nav items                                                          */
/* ------------------------------------------------------------------ */

type NavItem = {
    id: string;
    label: string;
    icon: () => ReactElement;
};

export const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'about', label: 'About', icon: UserIcon },
    { id: 'skills', label: 'Skills', icon: CodeIcon },
    { id: 'projects', label: 'Projects', icon: GridIcon },
];

/* ------------------------------------------------------------------ */
/*  Dock                                                                */
/* ------------------------------------------------------------------ */

export function LiquidDock({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
    const glassRef = useRef<HTMLDivElement | null>(null);
    const [hovered, setHovered] = useState<number | null>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        const el = glassRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mx', `${x}%`);
        el.style.setProperty('--my', `${y}%`);
        el.style.setProperty('--glow', '1');
    };

    const handleMouseLeave = () => {
        glassRef.current?.style.setProperty('--glow', '0');
        setHovered(null);
    };

    return (
        <nav className="liquid-dock" aria-label="Section navigation">
            <div ref={glassRef} className="liquid-dock-glass" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div className="dock-group">
                    {NAV_ITEMS.map((item, i) => {
                        const isActive = active === item.id;
                        const distance = hovered === null ? 99 : Math.abs(hovered - i);
                        const scale = distance === 0 ? 1.22 : distance === 1 ? 1.08 : 1;
                        const lift = distance === 0 ? -8 : distance === 1 ? -3 : 0;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                className={`dock-item ${isActive ? 'active' : ''}`}
                                style={{ transform: `translateY(${lift}px) scale(${scale})` }}
                                onMouseEnter={() => setHovered(i)}
                                onClick={() => onSelect(item.id)}
                                aria-label={item.label}
                                aria-current={isActive}
                            >
                                <Icon />
                                <span className="dock-tooltip">{item.label}</span>
                                <span className="dock-label" aria-hidden="true">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Bottom spacer — gives the pill height/presence beyond the last icon */}
                <div className="dock-spacer" aria-hidden="true" />
            </div>
        </nav>
    );
}

/* ------------------------------------------------------------------ */
/*  Styles this component needs                                        */
/* ------------------------------------------------------------------ */
/*
   Add this block to your global/portfolio CSS (or a <style> tag on the
   page) — it's not injected here so this file stays plain TSX:

   .liquid-dock {
       position: fixed;
       z-index: 50;
       left: 0;
       right: 0;
       top: auto;
       bottom: calc(16px + env(safe-area-inset-bottom));
       display: flex;
       justify-content: center;
       padding: 0 1rem;
   }
   .liquid-dock-glass {
       --mx: 50%;
       --my: 0%;
       --glow: 0;
       position: relative;
       display: flex;
       flex-direction: row;
       align-items: center;
       width: auto;
       max-width: calc(100vw - 2rem);
       padding: 0.5rem 0.625rem;
       gap: 0;
       border-radius: 1.975rem;
       background: rgba(255,255,255,0.55);
       border: 1px solid rgba(255,255,255,0.6);
       backdrop-filter: blur(20px) saturate(160%);
       -webkit-backdrop-filter: blur(20px) saturate(160%);
       box-shadow:
           0 22px 50px rgba(0,0,0,0.14),
           0 4px 14px rgba(0,0,0,0.07),
           inset 0 1px 0 rgba(255,255,255,0.45);
       overflow: visible;
       transition: background-color .3s ease, border-color .3s ease;
   }
   @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
       .liquid-dock-glass { background: rgba(250,250,250,0.94); }
       :root.dark .liquid-dock-glass { background: rgba(24,24,24,0.94); }
   }
   :root.dark .liquid-dock-glass {
       background: rgba(22,22,24,0.6);
       border: 1px solid rgba(255,255,255,0.12);
       box-shadow:
           0 22px 50px rgba(0,0,0,0.5),
           0 4px 14px rgba(0,0,0,0.3),
           inset 0 1px 0 rgba(255,255,255,0.1);
   }
   .liquid-dock-glass::before {
       content: '';
       position: absolute;
       inset: 0;
       border-radius: 1.875rem;
       pointer-events: none;
       opacity: var(--glow);
       transition: opacity .35s ease;
       background: radial-gradient(110px 110px at var(--mx) var(--my), rgba(255,255,255,0.35), transparent 65%);
   }
   :root.dark .liquid-dock-glass::before {
       background: radial-gradient(110px 110px at var(--mx) var(--my), rgba(255,255,255,0.18), transparent 65%);
   }
   .liquid-dock-glass::after {
       content: '';
       position: absolute;
       top: 0;
       left: 10%;
       right: 10%;
       height: 1px;
       background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
       pointer-events: none;
   }
   :root.dark .liquid-dock-glass::after {
       background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
   }
   .dock-group { display: flex; flex-direction: row; align-items: flex-end; gap: 0.125rem; }
   .dock-item {
       position: relative;
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
       gap: 0.25rem;
       width: auto;
       height: auto;
       min-width: 3.5rem;
       padding: 0.375rem 0.625rem;
       border-radius: 1.125rem;
       background: transparent;
       border: none;
       margin-left: 1rem;
       color: #ffffff;
       cursor: pointer;
       transition: transform .4s cubic-bezier(.34,1.56,.64,1), background-color .3s ease, color .3s ease;
   }
   .dock-item:hover { background: transparent; }
   .dock-item:not(.active) svg { color: #4b4b4b; }
   :root.dark .dock-item:not(.active) svg { color: #d4d4d4; }
   .dock-item svg { width: 22px; height: 22px; }
   .dock-item.active {
       background: rgba(255, 255, 255, 0.55);
       color: #0A84FF;
       box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9);
   }
   :root.dark .dock-item.active {
       background: rgba(255, 255, 255, 0.16);
       color: #52aaff;
       box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
   }
   .dock-item:active { transform: scale(0.96); }
   .dock-label {
       display: block;
       font-size: 10.5px;
       font-weight: 500;
       line-height: 1;
       letter-spacing: 0.01em;
       color: #4b4b4b;
       transition: color .25s ease, font-weight .25s ease;
   }
   :root.dark .dock-label { color: #d4d4d4; }
   .dock-item.active .dock-label { color: inherit; font-weight: 600; }
   .dock-tooltip { display: none; }
   @media (prefers-reduced-motion: reduce) {
       .dock-item { transition: none; }
       .dock-item:active { transform: none; }
   }
   @media (max-width: 380px) {
       .liquid-dock { bottom: 0.875rem; padding: 0 0.75rem; }
       .liquid-dock-glass { padding: 0.5rem 0.75rem; gap: 0.25rem; }
       .dock-item { min-width: 3rem; padding: 0.375rem 0.4rem; }
   }
*/
