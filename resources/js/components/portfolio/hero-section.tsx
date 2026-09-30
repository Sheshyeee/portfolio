type HeroSectionProps = {
    sectionRef: (el: HTMLElement | null) => void;
};

export function HeroSection({ sectionRef }: HeroSectionProps) {
    return (
        <section id="hero" ref={sectionRef} className="section hero-section">
            <div className="hero-marquee-wrap" aria-hidden="true">
                <div className="hero-marquee-track">
                    <span className="hero-marquee-text">DAVE MICHAEL CLAPIS</span>
                    <span className="hero-marquee-text">DAVE MICHAEL CLAPIS</span>
                </div>
            </div>

            {/* NOTE: no `z-10` here — the photo must stay below the vignette (z-index 3) */}
            <img src="/dp2.png" className="hero-photo-img" alt="Dave Michael Clapis" />

            {/* The hero's only gradient layer: fades the photo into the page background */}
            <div className="hero-vignette" aria-hidden="true" />

            <div className="hero-caption">
                <p className="hero-role">Fullstack Web Developer / App Developer</p>
                <p className="hero-scroll-hint">Scroll to explore ↓</p>
            </div>
        </section>
    );
}
