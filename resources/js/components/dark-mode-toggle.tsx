import { Toggle } from '@/components/ui/toggle';
import { useAppearance } from '@/hooks/use-appearance';

const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8 6 18M18 6l1.8-1.8" />
    </svg>
);

const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
);

export default function DarkModeToggle() {
    const { appearance, updateAppearance } = useAppearance();
    const isDark = appearance === 'dark';

    return (
        <div className="glass-toggle-dock">
            <Toggle
                pressed={isDark}
                onPressedChange={(pressed) => updateAppearance(pressed ? 'dark' : 'light')}
                aria-label="Toggle dark mode"
                className="glass-toggle-btn"
            >
                <span className="glass-toggle-icon" data-active={!isDark}>
                    <SunIcon />
                </span>
                <span className="glass-toggle-icon" data-active={isDark}>
                    <MoonIcon />
                </span>
            </Toggle>
        </div>
    );
}
