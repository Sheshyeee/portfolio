import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Code2, Grid2x2, Home, Mail, User } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/*  Nav config                                                         */
/* ------------------------------------------------------------------ */

type NavItem = {
    id: string;
    label: string;
    icon: ReactNode;
};

const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Home className="size-[18px]" strokeWidth={1.6} /> },
    { id: 'about', label: 'About', icon: <User className="size-[18px]" strokeWidth={1.6} /> },
    { id: 'projects', label: 'Projects', icon: <Grid2x2 className="size-[18px]" strokeWidth={1.6} /> },
    { id: 'skills', label: 'Skills', icon: <Code2 className="size-[18px]" strokeWidth={1.6} /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="size-[18px]" strokeWidth={1.6} /> },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
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
        <TooltipProvider delayDuration={150}>
            <nav
                aria-label="Section navigation"
                className={cn(
                    'fixed z-50',
                    // desktop: vertical rail, left-centered
                    'top-1/2 left-5 -translate-y-1/2',
                    // mobile: horizontal bar pinned to bottom
                    'max-md:top-auto max-md:right-0 max-md:bottom-4 max-md:left-0 max-md:flex max-md:translate-y-0 max-md:justify-center max-md:px-4',
                )}
            >
                <div
                    ref={glassRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ ['--mx' as string]: '50%', ['--my' as string]: '0%', ['--glow' as string]: 0 }}
                    className={cn(
                        'relative flex flex-col items-center gap-2.5 rounded-[26px] py-2.5',
                        'border border-white/50 bg-white/[0.28]',
                        'dark:border-white/[0.18] dark:bg-white/10',
                        'shadow-[0_22px_50px_rgba(0,0,0,0.14),0_4px_14px_rgba(0,0,0,0.07),inset_0_1px_0_rgba(255,255,255,0.8)]',
                        'dark:shadow-[0_22px_50px_rgba(0,0,0,0.5),0_4px_14px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.22)]',
                        'backdrop-blur-[28px] backdrop-saturate-[1.8]',
                        'max-md:w-auto max-md:flex-row max-md:gap-1.5 max-md:px-3 max-md:py-2',
                    )}
                >
                    {/* mouse-follow sheen */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-[22px] opacity-[var(--glow)] transition-opacity duration-300"
                        style={{
                            background: 'radial-gradient(90px 90px at var(--mx) var(--my), rgba(52,87,213,0.07), transparent 65%)',
                        }}
                    />

                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-[10%] top-0 h-px bg-gradient-to-r from-transparent via-white/95 to-transparent dark:via-white/35"
                    />

                    <div className="flex flex-col items-center gap-2.5 max-md:flex-row max-md:gap-1.5">
                        {NAV_ITEMS.map((item, i) => {
                            const isActive = active === item.id;
                            const distance = hovered === null ? 99 : Math.abs(hovered - i);
                            const scale = distance === 0 ? 1.14 : distance === 1 ? 1.05 : 1;

                            return (
                                <Tooltip key={item.id}>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            aria-label={item.label}
                                            aria-current={isActive}
                                            onMouseEnter={() => setHovered(i)}
                                            onClick={() => onSelect(item.id)}
                                            style={{ transform: `scale(${scale})` }}
                                            className={cn(
                                                'relative flex size-11 items-center justify-center rounded-[14px] transition-[transform,background-color,color] duration-300',
                                                'ease-[cubic-bezier(.34,1.56,.64,1)]',
                                                isActive
                                                    ? 'bg-[#101114]/85 text-white shadow-[0_6px_14px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-md dark:bg-white/90 dark:text-[#101114]'
                                                    : 'text-neutral-500 hover:bg-white/35 hover:text-[#101114] hover:backdrop-blur-sm dark:hover:bg-white/12',
                                            )}
                                        >
                                            {item.icon}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-md:hidden">
                                        {item.label}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>

                    {/* base spacer — gives the rail height/presence beyond the last icon */}
                    <div className="mt-1.5 h-[120px] w-1 shrink-0 rounded-full max-md:hidden" aria-hidden />
                </div>
            </nav>
        </TooltipProvider>
    );
}
