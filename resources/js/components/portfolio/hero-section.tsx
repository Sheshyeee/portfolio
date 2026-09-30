type HeroSectionProps = {
    sectionRef: (el: HTMLElement | null) => void;
};

export function HeroSection({ sectionRef }: HeroSectionProps) {
    return (
        <section id="hero" ref={sectionRef} className="section hero-section">
            <style>{`
                /* Light = paper bg / night ink. Dark = night bg / cream ink. */
                .section.hero-section {
                    background: var(--bg);
                    color: var(--ink);
                    /* no line between the hero and the next section */
                    border-bottom: 0;
                    padding: 0;
                    /* Always exactly one full screen: laptop, big monitor, phone.
                       100vh first as a fallback, svh so mobile browser bars don't cut it. */
                    height: 100vh;
                    height: 100svh;
                    min-height: 100vh;
                    min-height: 100svh;
                }
                .hero-marquee-text {
                    -webkit-text-stroke-color: color-mix(in srgb, var(--ink) 60%, transparent);
                }
                .hero-role { color: var(--muted); }
                .hero-scroll-hint { color: var(--ink); }

                /* ---------- Photo: always centred ---------- */
                /* Nudge the photo if the subject sits off-centre inside dp2.png (e.g. -2% or 3%) */
                .section.hero-section { --hero-shift: 0%; }

                .section.hero-section .hero-photo-wrap {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    justify-content: center;
                    align-items: flex-end;
                    width: 100%;
                    margin: 0 auto;
                    padding: 0;
                }
                .section.hero-section .hero-photo-img {
                    display: block;
                    flex: 0 0 auto;
                    width: clamp(300px, 60vw, 700px);
                    height: auto;
                    max-width: 100%;
                    max-height: min(90vh, 900px);
                    max-height: min(90svh, 900px);
                    margin: 0 auto calc(var(--dock-space-mobile) + 0.5rem);
                    object-fit: contain;
                    object-position: bottom center;
                    translate: var(--hero-shift) 0;
                }

                /* ---------- Phones / small tablets ---------- */
                @media (max-width: 820px) {
                    .section.hero-section .hero-photo-img {
                        width: clamp(220px, 78vw, 360px);
                        max-height: 66vh;
                        max-height: 66svh;
                        margin-bottom: calc(var(--dock-space-mobile) + 0.25rem);
                    }
                }
                @media (max-width: 380px) {
                    .section.hero-section .hero-photo-img {
                        width: clamp(200px, 82vw, 300px);
                        max-height: 60svh;
                    }
                }

                /* ---------- Large desktops ---------- */
                @media (min-width: 1600px) {
                    .section.hero-section .hero-photo-img {
                        width: clamp(640px, 44vw, 860px);
                        max-height: min(88svh, 1000px);
                    }
                    .hero-marquee-text { font-size: clamp(18rem, 19vw, 26rem); }
                }
                @media (min-width: 2200px) {
                    .section.hero-section .hero-photo-img {
                        width: clamp(820px, 38vw, 1050px);
                        max-height: min(86svh, 1200px);
                    }
                    .hero-marquee-text { font-size: clamp(24rem, 17vw, 34rem); }
                    .hero-role { font-size: 1rem; }
                    .hero-scroll-hint { font-size: .9rem; }
                }

                /* Short but wide screens (laptops with small height): keep the photo inside the viewport */
                @media (min-width: 821px) and (max-height: 760px) {
                    .section.hero-section .hero-photo-img { max-height: 78svh; }
                }
            `}</style>

            <div className="hero-marquee-wrap" aria-hidden="true">
                <div className="hero-marquee-track">
                    <span className="hero-marquee-text">DAVE MICHAEL CLAPIS</span>
                    <span className="hero-marquee-text">DAVE MICHAEL CLAPIS</span>
                </div>
            </div>

            <div className="hero-photo-wrap" data-parallax="0.08">
                <img src="/dp2.png" className="hero-photo-img z-10" alt="Dave Michael Clapis" />
            </div>

            <div className="hero-caption">
                <p className="hero-role">Fullstack Web Developer / App Developer</p>
                <p className="hero-scroll-hint">Scroll to explore ↓</p>
            </div>
        </section>
    );
}
