import type { ReactElement } from 'react';

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

const iconProps = {
    width: 22,
    height: 22,
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

const LayersIcon = () => (
    <svg {...iconProps}>
        <path d="M12 3 21 8l-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
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
    { id: 'stack', label: 'Stack', icon: LayersIcon },
    { id: 'skills', label: 'Skills', icon: CodeIcon },
    { id: 'projects', label: 'Projects', icon: GridIcon },
];

/* ------------------------------------------------------------------ */
/*  Dock (App Store style: only icon + label change colour)            */
/* ------------------------------------------------------------------ */

export function LiquidDock({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
    return (
        <nav className="liquid-dock" aria-label="Section navigation">
            <style>{`
                /* Higher specificity than the older dock rules in welcome.tsx / motion-styles.ts */
                .liquid-dock .dock-indicator { display: none; }

                .liquid-dock .dock-item,
                .liquid-dock .dock-item.active,
                .liquid-dock .dock-item:hover,
                .liquid-dock .dock-item.active:hover {
                    background: transparent;
                    transform: none;
                }
                .liquid-dock .dock-item {
                    color: var(--muted);
                    transition: color .25s ease, transform .3s var(--m-ease, ease);
                }
                .liquid-dock .dock-item:hover:not(.active) { color: color-mix(in srgb, var(--ink) 82%, var(--bg)); }

                /* Active: icon + label take the full ink colour, nothing is filled */
                .liquid-dock .dock-item.active,
                .liquid-dock .dock-item.active svg,
                .liquid-dock .dock-item.active .dock-label { color: var(--ink); }
                .liquid-dock .dock-item.active svg { stroke-width: 2.2; }
                .liquid-dock .dock-item.active .dock-label { font-weight: 700; }

                .liquid-dock .dock-item svg { transition: stroke-width .2s ease; }
                .liquid-dock .dock-item:active { transform: scale(.92); }
                .liquid-dock .dock-item:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
            `}</style>

            <div className="liquid-dock-glass">
                <div className="dock-group">
                    {NAV_ITEMS.map((item) => {
                        const isActive = active === item.id;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                className={`dock-item ${isActive ? 'active' : ''}`}
                                onClick={() => onSelect(item.id)}
                                aria-label={item.label}
                                aria-current={isActive ? 'page' : undefined}
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

                <div className="dock-spacer" aria-hidden="true" />
            </div>
        </nav>
    );
}
