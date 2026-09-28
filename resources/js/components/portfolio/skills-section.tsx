/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

type Work = {
    title: string;
    desc: string;
    type: string; // badge shown on the thumbnail
    tags: string[];
    thumbnail: string; // path inside /public
    href?: string; // optional: makes the card a link
};

// Order matters: 4 paired cards, then DogLens alone (centered) on desktop.
const WORKS: Work[] = [
    {
        title: 'Gym Membership System',
        desc: 'Membership platform with plan payments, attendance check-ins, and member stats like workout streaks.',
        type: 'Freelance Project', // TODO: change if this isn't a freelance project
        tags: ['Laravel', 'React', 'Inertia.js', 'TypeScript', 'Role-Based Access'],
        thumbnail: '/gym.png', // TODO: point to your actual thumbnail filename
    },
    {
        title: 'Nexus - Real-Time Messaging Platform',
        desc: 'Real-time messaging with AI-powered Smart Reply that suggests context-aware responses before you start typing.',
        type: 'Personal Project',
        tags: ['Laravel', 'Inertia.js', 'React', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
        thumbnail: '/front4.png',
    },
    {
        title: 'Campus Asset Tracker',
        desc: 'Asset and maintenance management with three role-based portals: IT Admin, Technician, and Faculty/Staff.',
        type: 'Freelance Project',
        tags: ['Laravel', 'React', 'Inertia.js', 'TypeScript', 'Role-Based Access'],
        thumbnail: '/login.png',
    },
    {
        title: 'Dental Appointment System',
        desc: 'Booking platform for a dental clinic, with public scheduling and role-based dashboards for staff and admins.',
        type: 'Freelance Project',
        tags: ['Laravel', 'React', 'TypeScript', 'Sanctum Auth', 'TanStack Query'],
        thumbnail: '/front3.png',
    },
    {
        title: 'DogLens - Smart Pet Breed Identification',
        desc: 'Self-trained deep learning system that identifies dog breeds from photos and improves through an admin-driven retraining loop.',
        type: 'Capstone Project',
        tags: ['React', 'TypeScript', 'React Native (Expo)', 'Laravel', 'FastAPI', 'Python'],
        thumbnail: '/coverimage.png',
    },
];

/* ------------------------------------------------------------------ */
/*  Card                                                                */
/* ------------------------------------------------------------------ */

const ArrowUpRightIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M8 7h9v9" />
    </svg>
);

function WorkCard({ work, centerLast }: { work: Work; centerLast: boolean }) {
    const className = [
        'group block overflow-hidden rounded-md border border-[var(--hair)] bg-[#F7F7F7] dark:bg-neutral-900',
        // lone last card: span both columns, but keep the width of a single column
        centerLast ? 'md:col-span-2 md:mx-auto md:w-[calc(50%-0.75rem)]' : '',
    ].join(' ');

    const body = (
        <>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECECEC] dark:bg-neutral-800">
                <img
                    src={work.thumbnail}
                    alt={`${work.title} thumbnail`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold tracking-wide text-[#101010] uppercase shadow-sm dark:bg-neutral-900 dark:text-neutral-100">
                    {work.type}
                </span>
                {work.href && (
                    <span className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full bg-white text-[#101010] opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                        <ArrowUpRightIcon />
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-3 p-5 sm:p-6">
                <h3 className="text-[19px] leading-snug font-medium text-[#101010] sm:text-[21px] dark:text-neutral-50">{work.title}</h3>
                <p className="line-clamp-2 text-[14.5px] leading-relaxed text-[#5c5a56] dark:text-neutral-400">{work.desc}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                    {work.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full border border-[var(--hair)] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[#101010] dark:bg-neutral-800 dark:text-neutral-100"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </>
    );

    return work.href ? (
        <a href={work.href} target="_blank" rel="noreferrer" className={className}>
            {body}
        </a>
    ) : (
        <article className={className}>{body}</article>
    );
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */

// Same name and props as the old skills section so the parent page keeps working.
// skillsRef and contactRef are still accepted (so nothing breaks) but no longer used,
// because the Tech Stack and Get in Touch cards were removed.
type SkillsSectionProps = {
    sectionRef: (el: HTMLElement | null) => void; // outer section (nav target)
    skillsRef?: (el: HTMLElement | null) => void; // unused
    contactRef?: (el: HTMLElement | null) => void; // unused
};

export function SkillsSection({ sectionRef }: SkillsSectionProps) {
    const lastIsAlone = WORKS.length % 2 === 1;

    return (
        // NOTE: no overflow-hidden on this element, it would break `position: sticky` on the header.
        // id="about" is kept from the old skills section so existing nav links still land here.
        <section id="about" ref={sectionRef} className="relative">
            {/* Sticky header: it sticks only while this section is on screen,
                because sticky elements are confined to their parent. */}
            <div className="sticky top-0 z-20 bg-[var(--bg)]">
                <div className="relative flex h-[132px] items-center justify-center overflow-hidden sm:h-[168px]">
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center leading-none font-semibold tracking-tight whitespace-nowrap text-[#101010]/[0.05] select-none dark:text-white/[0.06]"
                        style={{ fontSize: 'clamp(3.5rem, 13vw, 9.5rem)' }}
                    >
                        PORTFOLIO
                    </span>
                    <h2 className="relative text-[clamp(1.6rem,4vw,2.6rem)] leading-none font-semibold tracking-tight text-[#101010] uppercase dark:text-neutral-50">
                        Selected Work
                    </h2>
                </div>
                {/* soft fade so cards dissolve under the header instead of being cut off */}
                <div className="pointer-events-none absolute inset-x-0 top-full h-6 bg-gradient-to-b from-[var(--bg)] to-transparent" />
            </div>

            <div className="mx-auto max-w-[1100px] px-[6vw] pt-6 pb-24 md:px-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {WORKS.map((work, i) => (
                        <WorkCard key={work.title} work={work} centerLast={lastIsAlone && i === WORKS.length - 1} />
                    ))}
                </div>
            </div>
        </section>
    );
}
