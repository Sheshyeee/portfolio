import type { RefObject } from 'react';
import { useEffect, useLayoutEffect } from 'react';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

type RevealVariant = 'up' | 'fade' | 'mask' | 'clip';

type MapEntry = {
    selector: string;
    reveal?: RevealVariant;
    parallax?: { factor: number; axis?: 'x' | 'y'; max?: number };
    filter?: (el: HTMLElement) => boolean;
};

/**
 * The motion map: the single place that decides which existing elements animate.
 * Sections don't need editing. Anything not listed here stays static.
 */
const MOTION_MAP: MapEntry[] = [
    // Tech stack
    { selector: '.ts-topbar', reveal: 'fade' },
    { selector: '.ts-heading', reveal: 'up' },
    { selector: '.ts-side', reveal: 'up' },
    { selector: '.ts-watermark', parallax: { factor: 0.1, axis: 'y', max: 90 } },

    // Home / experience
    { selector: '.xp-watermark', parallax: { factor: 0.12, axis: 'x', max: 90 } },

    // Selected Work header
    { selector: '#about h2', reveal: 'up' },

    // Contact: every row except the title row, then the title on its own with a mask
    { selector: '.contact-row', reveal: 'up', filter: (el) => !el.querySelector('.contact-title') },
    { selector: '.contact-title', reveal: 'mask' },
];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function tagElements(root: HTMLElement) {
    MOTION_MAP.forEach(({ selector, reveal, parallax, filter }) => {
        let nodes: HTMLElement[] = [];
        try {
            nodes = Array.from(root.querySelectorAll<HTMLElement>(selector));
        } catch {
            return;
        }
        if (filter) nodes = nodes.filter(filter);
        nodes.forEach((el) => {
            if (reveal && !el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', reveal);
            if (parallax && !el.hasAttribute('data-parallax')) {
                el.setAttribute('data-parallax', String(parallax.factor));
                if (parallax.axis) el.setAttribute('data-parallax-axis', parallax.axis);
                if (parallax.max) el.setAttribute('data-parallax-max', String(parallax.max));
            }
        });
    });
}

/** One observer for every reveal. Elements entering together are staggered by DOM order. */
function startReveal(root: HTMLElement, timers: Set<number>): () => void {
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]:not([data-in])'));

    if (!('IntersectionObserver' in window)) {
        targets.forEach((el) => el.setAttribute('data-in', ''));
        return () => {};
    }

    const io = new IntersectionObserver(
        (entries) => {
            const hits = entries
                .filter((e) => e.isIntersecting)
                .map((e) => e.target as HTMLElement)
                .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

            hits.forEach((el, k) => {
                el.style.setProperty('--i', String(Math.min(k, 5)));
                el.setAttribute('data-in', '');
                io.unobserve(el);
                // once settled, drop the transition so stagger delays never leak into later states
                timers.add(window.setTimeout(() => el.setAttribute('data-done', ''), 2400));
            });
        },
        { rootMargin: '0px 0px -40px 0px', threshold: 0 },
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
}

/** One scroll handler: parallax for visible tagged elements + the top progress bar. */
function startScroll(root: HTMLElement, progressEl: HTMLElement | null, parallaxOn: boolean): () => void {
    const els = parallaxOn ? Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]')) : [];
    const visible = new Set<HTMLElement>();
    let raf = 0;

    const update = () => {
        raf = 0;
        const vh = window.innerHeight;
        const mid = vh / 2;

        // reads first...
        const jobs: Array<[HTMLElement, string, number]> = [];
        visible.forEach((el) => {
            const parent = el.parentElement; // the parent is never transformed, so no feedback loop
            if (!parent) return;
            const r = parent.getBoundingClientRect();
            const factor = parseFloat(el.dataset.parallax ?? '') || 0;
            const maxAttr = parseFloat(el.dataset.parallaxMax ?? '');
            const max = Number.isFinite(maxAttr) ? maxAttr : r.height * 0.08;
            const value = clamp(-(r.top + r.height / 2 - mid) * factor, -max, max);
            jobs.push([el, el.dataset.parallaxAxis === 'x' ? '--px' : '--py', value]);
        });

        let progress = 0;
        if (progressEl) {
            const scrollable = document.documentElement.scrollHeight - vh;
            progress = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;
        }

        // ...then writes
        jobs.forEach(([el, prop, v]) => el.style.setProperty(prop, `${v.toFixed(1)}px`));
        progressEl?.style.setProperty('--sp', progress.toFixed(4));
    };

    const schedule = () => {
        if (!raf) raf = requestAnimationFrame(update);
    };

    let io: IntersectionObserver | null = null;
    if (els.length) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((e) => {
                        const t = e.target as HTMLElement;
                        if (e.isIntersecting) visible.add(t);
                        else visible.delete(t);
                    });
                    schedule();
                },
                { rootMargin: '20% 0px 20% 0px' },
            );
            els.forEach((el) => observer.observe(el));
            io = observer;
        } else {
            els.forEach((el) => visible.add(el));
        }
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    schedule();

    return () => {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        window.removeEventListener('load', schedule);
        if (raf) cancelAnimationFrame(raf);
        io?.disconnect();
        els.forEach((el) => {
            el.style.removeProperty('--px');
            el.style.removeProperty('--py');
        });
    };
}

export function useMotion(rootRef: RefObject<HTMLElement | null>, progressRef: RefObject<HTMLElement | null>) {
    useIsoLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const html = document.documentElement;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
        const narrow = window.matchMedia('(max-width: 820px)');
        const timers = new Set<number>();
        let stops: Array<() => void> = [];

        tagElements(root);

        const run = () => {
            stops.forEach((fn) => fn());
            stops = [];
            const animate = !reduce.matches;
            html.classList.toggle('motion-ready', animate);
            if (animate) stops.push(startReveal(root, timers));
            // parallax: desktop/tablet only, and never with reduced motion
            stops.push(startScroll(root, progressRef.current, animate && !narrow.matches));
        };

        run();
        reduce.addEventListener('change', run);
        narrow.addEventListener('change', run);

        return () => {
            reduce.removeEventListener('change', run);
            narrow.removeEventListener('change', run);
            stops.forEach((fn) => fn());
            timers.forEach((t) => window.clearTimeout(t));
            html.classList.remove('motion-ready');
        };
    }, []);
}
