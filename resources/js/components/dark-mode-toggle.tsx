import { Toggle } from '@/components/ui/toggle';
import { useAppearance } from '@/hooks/use-appearance';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

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

/** Source of truth = the actual .dark class on <html>. */
function useIsDark() {
    const [isDark, setIsDark] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

    useEffect(() => {
        const root = document.documentElement;
        const sync = () => setIsDark(root.classList.contains('dark'));
        sync();
        const observer = new MutationObserver(sync);
        observer.observe(root, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return isDark;
}

type ViewTransitionDoc = Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<unknown> };
};

export default function DarkModeToggle() {
    const { updateAppearance } = useAppearance();
    const isDark = useIsDark();

    const handleChange = (pressed: boolean) => {
        const next = pressed ? 'dark' : 'light';
        const apply = () => flushSync(() => updateAppearance(next));

        const root = document.documentElement;
        const doc = document as ViewTransitionDoc;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Freeze every element transition while the theme flips, in both paths,
        // so nothing animates at a different speed than the rest of the page.
        root.classList.add('theme-switching');
        const done = () => root.classList.remove('theme-switching');

        if (doc.startViewTransition && !reduce) {
            const t = doc.startViewTransition(apply);
            t.finished.finally(done);
            return;
        }

        apply();
        requestAnimationFrame(() => requestAnimationFrame(done));
    };

    return (
        <div className="glass-toggle-dock">
            <style>{`
                .glass-toggle-btn,
                .glass-toggle-btn[data-state='on'],
                .glass-toggle-btn[data-state='off'],
                .glass-toggle-btn:hover {
                    background: var(--ink);
                    color: var(--bg);
                }
                .glass-toggle-btn:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

                ::view-transition-old(root),
                ::view-transition-new(root) {
                    animation-duration: .45s;
                    animation-timing-function: cubic-bezier(.22, 1, .36, 1);
                }
                html.theme-switching *,
                html.theme-switching *::before,
                html.theme-switching *::after { transition: none !important; }
            `}</style>

            <Toggle pressed={isDark} onPressedChange={handleChange} aria-label="Toggle dark mode" className="glass-toggle-btn">
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
