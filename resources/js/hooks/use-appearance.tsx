import { useEffect, useState } from 'react';

export type Appearance = 'light' | 'dark' | 'system';

/** What new visitors (no saved choice) get. */
const DEFAULT_APPEARANCE: Appearance = 'dark';

const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

const applyTheme = (appearance: Appearance) => {
    const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark());

    document.documentElement.classList.toggle('dark', isDark);
};

/**
 * Reads the saved choice. Anything missing or invalid falls back to dark.
 * A legacy saved value of 'system' (written by the old default on first visit)
 * is also treated as dark, so returning visitors who never touched the toggle
 * get dark too. Only an explicit 'light' or 'dark' choice is kept.
 */
const getSavedAppearance = (): Appearance => {
    const saved = localStorage.getItem('appearance');
    return saved === 'light' || saved === 'dark' ? saved : DEFAULT_APPEARANCE;
};

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const handleSystemThemeChange = () => {
    applyTheme(getSavedAppearance());
};

export function initializeTheme() {
    applyTheme(getSavedAppearance());

    // Add the event listener for system theme changes...
    mediaQuery.addEventListener('change', handleSystemThemeChange);
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>(DEFAULT_APPEARANCE);

    const updateAppearance = (mode: Appearance) => {
        setAppearance(mode);
        localStorage.setItem('appearance', mode);
        applyTheme(mode);
    };

    useEffect(() => {
        updateAppearance(getSavedAppearance());

        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, []);

    return { appearance, updateAppearance };
}
