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

const LayersIcon = () => (
    <svg {...iconProps}>
        <path d="M12 3 21 8l-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
    </svg>
);

export const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'about', label: 'About', icon: UserIcon },
    { id: 'stack', label: 'Stack', icon: LayersIcon },
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
