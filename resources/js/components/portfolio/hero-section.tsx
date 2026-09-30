type HeroSectionProps = {
    sectionRef: (el: HTMLElement | null) => void;
};

export function HeroSection({ sectionRef }: HeroSectionProps) {
    return (
        <section id="hero" ref={sectionRef} className="section hero-section">
            <style>{`
                /* Light = paper bg / night ink. Dark = night bg / cream ink.
                   No background or color transition, so it flips in sync with the rest of the page. */
                .section.hero-section {
                    background: var(--bg);
                    color: var(--ink);
                    border-bottom-color: var(--hair);
                    transition: opacity .7s ease, transform .7s ease;
                }
                .hero-marquee-text {
                    -webkit-text-stroke-color: color-mix(in srgb, var(--ink) 60%, transparent);
                }
                .hero-role { color: var(--muted); }
                .hero-scroll-hint { color: var(--ink); }
            `}</style>

            <div className="hero-marquee-wrap" aria-hidden="true">
                <div className="hero-marquee-track">
                    <span className="hero-marquee-text">DAVE MICHAEL CLAPIS</span>
                    <span className="hero-marquee-text">DAVE MICHAEL CLAPIS</span>
                </div>
            </div>

            <img src="/dp2.png" className="hero-photo-img z-10" alt="Dave Michael Clapis" />

            <div className="hero-caption">
                <p className="hero-role">Fullstack Web Developer / App Developer</p>
                <p className="hero-scroll-hint">Scroll to explore ↓</p>
            </div>
        </section>
    );
}
