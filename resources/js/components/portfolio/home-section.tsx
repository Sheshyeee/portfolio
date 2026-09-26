import { Button } from '@/components/ui/button';

type HomeSectionProps = {
    sectionRef: (el: HTMLElement | null) => void;
};

export function HomeSection({ sectionRef }: HomeSectionProps) {
    return (
        <section id="home" ref={sectionRef} className="section home-section">
            <p className="eyebrow px-3 sm:px-5 md:px-0">About</p>

            {/* Cover + avatar wrapper — avatar is absolutely positioned INSIDE this, so it always sits on top */}
            <div className="relative w-full">
                <div className="home-cover">
                    <img src="/cover.png" alt="" className="h-full w-full object-cover" />
                </div>
            </div>

            {/* Avatar + name row — side by side at EVERY breakpoint, avatar overlapping
                the cover bottom-left, name/role/location bottom-aligned next to it.
                Facebook-profile layout: avatar and text share one flex row at every
                breakpoint rather than stacking on mobile. */}
            <div className="z-10 flex items-end gap-3 px-3 sm:gap-5 sm:px-5 md:gap-8">
                <div className="-mt-12 shrink-0 sm:-mt-16 md:-mt-20">
                    <div className="h-[84px] w-[84px] overflow-hidden rounded-2xl border-[3px] border-white bg-[#EFEAE3] shadow-[0_10px_26px_rgba(0,0,0,0.18)] sm:h-[150px] sm:w-[150px] sm:border-4 md:h-[200px] md:w-[200px] dark:border-neutral-900 dark:bg-neutral-800">
                        <img src="/profile2.png" alt="Profile photo" className="h-full w-full object-cover object-top" />
                    </div>
                </div>

                <div className="mt-3 flex flex-col gap-0.5 pb-1 sm:gap-1 md:mt-0 md:pb-3">
                    <p className="text-xs font-medium text-[#5c5a56] sm:text-sm dark:text-neutral-400">Fullstack Web Developer / App Developer</p>
                    <h1 className="text-[17px] leading-[1.15] font-semibold tracking-tight text-[#101010] sm:text-[25px] dark:text-neutral-50">
                        Dave Michael Beltran Clapis
                    </h1>
                    <p className="flex items-center gap-1.5 text-xs font-medium text-[#5c5a56] sm:text-sm dark:text-neutral-400">
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        Albay, Philippines
                    </p>
                </div>
            </div>

            {/* Buttons — their own full-width row below the avatar/name row,
                matching the "Add to story / Edit profile" row in the reference. */}
            <div className="mt-4 flex flex-wrap gap-3 px-3 sm:px-5 md:mt-6 md:px-0">
                <Button>Download résumé</Button>
                <Button variant="outline" asChild>
                    <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=clapisdave8@gmail.com&su=Portfolio%20Inquiry"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Send email
                    </a>
                </Button>
            </div>

            {/* Bio */}
            <p className="mt-8 max-w-[1100px] px-2 text-[15px] leading-relaxed text-[#4b4b4b] sm:mt-10 md:mt-6 md:px-0 md:text-[16px] dark:text-neutral-400">
                I'm a fullstack developer who loves the moment scattered ideas click into a working product. I graduated with a BS in Computer
                Science, but most of what I know came from staying up late debugging something that "should have worked" until it did. I'm comfortable
                across the stack clean, responsive frontends, backed by the logic, databases, and APIs that make everything run. There's real
                satisfaction in owning a project end to end, from a blank file to something people actually use. I'm currently looking for
                opportunities to keep growing and work with people who care about doing good work.
            </p>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Styles this section needs                                          */
/* ------------------------------------------------------------------ */
/*
   .home-section {
       justify-content: flex-start;
       padding-top: 7rem;
   }
   @media (max-width: 820px) { .home-section { padding-top: 0; } }
   @media (max-width: 480px) { .home-section { padding-top: 0; } }

   .home-cover {
       width: 100%;
       height: 160px;
       overflow: hidden;
       background: #F3EFE9;
       border-radius: 28px;
   }
   :root.dark .home-cover { background: #262626; }
   @media (max-width: 820px) {
       .home-cover {
           margin-left: -5.5vw;
           margin-right: -5.5vw;
           width: calc(100% + 11vw);
           border-radius: 0;
           height: 190px;
       }
   }
   @media (max-width: 480px) {
       .home-cover {
           margin-left: -5vw;
           margin-right: -5vw;
           width: calc(100% + 10vw);
           height: 170px;
       }
   }
   @media (min-width: 821px) and (max-width: 1023px) { .home-cover { height: 220px; } }
   @media (min-width: 1024px) { .home-cover { height: 340px; border-radius: 2rem; } }
*/
