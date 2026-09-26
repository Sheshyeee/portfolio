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

            <img src="/dp2.png" className="hero-photo-img z-10" alt="Dave Michael Clapis" />

            <div className="hero-caption">
                <p className="hero-role">Fullstack Web Developer / App Developer</p>
                <p className="hero-scroll-hint">Scroll to explore ↓</p>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Styles this section needs                                          */
/* ------------------------------------------------------------------ */
/*
   .hero-section {
       position: relative;
       overflow: hidden;
       padding: 0;
       display: flex;
       align-items: center;
       justify-content: center;
       min-height: 92vh;
       min-height: 92svh;
   }
   .hero-marquee-wrap {
       position: absolute;
       inset: 0;
       display: flex;
       align-items: center;
       overflow: hidden;
       pointer-events: none;
       z-index: 1;
   }
   .hero-marquee-track {
       display: flex;
       width: max-content;
       will-change: transform;
       animation: hero-marquee 18s linear infinite;
       animation-play-state: running !important;
   }
   .hero-marquee-text {
       flex: 0 0 auto;
       font-size: clamp(4.5rem, 22vw, 18.5rem);
       font-weight: 900;
       text-transform: uppercase;
       letter-spacing: -0.03em;
       white-space: nowrap;
       padding-right: 5vw;
       color: transparent;
       -webkit-text-stroke: 2.5px rgba(16,16,16,0.6);
       opacity: 0.6;
   }
   :root.dark .hero-marquee-text {
       -webkit-text-stroke: 2.5px rgba(255,255,255,0.5);
       opacity: 0.65;
   }
   @keyframes hero-marquee {
       0%   { transform: translate3d(0, 0, 0); }
       100% { transform: translate3d(-50%, 0, 0); }
   }
   .hero-photo-img {
       position: relative;
       z-index: 2;
       width: clamp(300px, 60vw, 700px);
       max-height: min(90vh, 900px);
       object-fit: contain;
       object-position: bottom center;
       display: block;
       margin: 0 auto;
       margin-bottom: calc(var(--dock-space-mobile) + 0.5rem);
       opacity: 0;
       transform: translateY(28px);
       transition: opacity .8s cubic-bezier(.16,1,.3,1) .15s,
                   transform .8s cubic-bezier(.16,1,.3,1) .15s;
   }
   .hero-section.in-view .hero-photo-img {
       opacity: 1;
       transform: translateY(0);
   }
   @media (max-width: 820px) {
       .hero-photo-img {
           width: clamp(220px, 78vw, 360px);
           max-height: 66vh;
           margin-bottom: calc(var(--dock-space-mobile) + 0.25rem);
       }
   }
   @media (max-width: 380px) {
       .hero-photo-img {
           width: clamp(200px, 82vw, 300px);
           max-height: 60vh;
       }
   }
   .hero-caption {
       position: absolute;
       bottom: 2.5rem;
       left: 50%;
       transform: translateX(-50%);
       z-index: 3;
       text-align: center;
       opacity: 0;
       transition: opacity .8s ease .4s;
   }
   .hero-section.in-view .hero-caption { opacity: 1; }
   .hero-role {
       font-size: 0.8rem;
       font-weight: 600;
       letter-spacing: .1em;
       text-transform: uppercase;
       color: var(--muted);
   }
   .hero-scroll-hint {
       margin-top: .4rem;
       font-size: .75rem;
       color: var(--muted);
       opacity: .7;
   }
   @media (max-width: 820px) {
       .hero-section {
           align-items: flex-end;
           min-height: 88vh;
           min-height: 88svh;
       }
       .hero-caption { bottom: 1.75rem; }
       .hero-marquee-text {
           font-size: clamp(5rem, 27vw, 12rem);
           -webkit-text-stroke: 3px rgba(16,16,16,0.65);
       }
       :root.dark .hero-marquee-text {
           -webkit-text-stroke: 3px rgba(255,255,255,0.55);
       }
   }
*/
