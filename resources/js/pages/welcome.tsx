import LoadingScreen from '@/components/loading-screen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState, type ReactElement } from 'react';

/* ------------------------------------------------------------------ */
/*  Icons — plain inline SVG, no external icon package required        */
/* ------------------------------------------------------------------ */

const iconProps = {
    width: 19,
    height: 19,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
};

const HomeIcon = () => (
    <svg {...iconProps}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 9.8V20h13V9.8" />
        <path d="M9.5 20v-6h5v6" />
    </svg>
);

const UserIcon = () => (
    <svg {...iconProps}>
        <circle cx="12" cy="8" r="3.4" />
        <path d="M5 20c1.2-3.8 4-5.6 7-5.6s5.8 1.8 7 5.6" />
    </svg>
);

const GridIcon = () => (
    <svg {...iconProps}>
        <rect x="4" y="4" width="7" height="7" rx="1.2" />
        <rect x="13" y="4" width="7" height="7" rx="1.2" />
        <rect x="4" y="13" width="7" height="7" rx="1.2" />
        <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </svg>
);

const CodeIcon = () => (
    <svg {...iconProps}>
        <path d="M8.5 8 4 12l4.5 4" />
        <path d="M15.5 8 20 12l-4.5 4" />
        <path d="M13.5 6 10.5 18" />
    </svg>
);

const MailIcon = () => (
    <svg {...iconProps}>
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" />
        <path d="M4 6.5l8 6.5 8-6.5" />
    </svg>
);

const ChatIcon = () => (
    <svg {...iconProps}>
        <path d="M4 5.5h16v10.5H9.5L5.5 19v-3H4V5.5Z" />
        <path d="M8 9.5h8M8 12.5h5" />
    </svg>
);

const ArrowUpRightIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M8 7h9v9" />
    </svg>
);

const cardIconProps = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
};

const InfoIcon = () => (
    <svg {...cardIconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5.5M12 8v.01" />
    </svg>
);

const BriefcaseIcon = () => (
    <svg {...cardIconProps}>
        <rect x="3" y="7.5" width="18" height="12" rx="1.8" />
        <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5M3 12.5h18" />
    </svg>
);

const GradCapIcon = () => (
    <svg {...cardIconProps}>
        <path d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z" />
        <path d="M6.5 11v4.5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3V11" />
    </svg>
);

const LayersIcon = () => (
    <svg {...cardIconProps}>
        <path d="M12 3 21 8l-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
    </svg>
);

const SendMessageIcon = () => (
    <svg {...cardIconProps}>
        <path d="M4 11 20 4l-6.5 16-3-6.5L4 11Z" />
    </svg>
);

const PhoneIcon = () => (
    <svg {...iconProps} width={18} height={18}>
        <path d="M6 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2 2C11.5 20 4 12.5 4 5.5a2 2 0 0 1 2-2Z" />
    </svg>
);

/* Small award/medal icon for honors badges */
const AwardIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="5.5" />
        <path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5" />
    </svg>
);

/* ------------------------------------------------------------------ */
/*  Liquid glass dock — the icon-only sidebar                          */
/* ------------------------------------------------------------------ */

type NavItem = {
    id: string;
    label: string;
    icon: () => ReactElement;
};

const NAV_ITEMS: NavItem[] = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'about', label: 'About', icon: UserIcon },
    { id: 'projects', label: 'Projects', icon: GridIcon },
    { id: 'skills', label: 'Skills', icon: CodeIcon },
    { id: 'contact', label: 'Contact', icon: MailIcon },
];

function LiquidDock({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
    const glassRef = useRef<HTMLDivElement | null>(null);
    const [hovered, setHovered] = useState<number | null>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        const el = glassRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mx', `${x}%`);
        el.style.setProperty('--my', `${y}%`);
        el.style.setProperty('--glow', '1');
    };

    const handleMouseLeave = () => {
        glassRef.current?.style.setProperty('--glow', '0');
        setHovered(null);
    };

    return (
        <nav className="liquid-dock" aria-label="Section navigation">
            <div ref={glassRef} className="liquid-dock-glass" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <div className="dock-group">
                    {NAV_ITEMS.map((item, i) => {
                        const isActive = active === item.id;
                        const distance = hovered === null ? 99 : Math.abs(hovered - i);
                        const scale = distance === 0 ? 1.14 : distance === 1 ? 1.05 : 1;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                type="button"
                                className={`dock-item ${isActive ? 'active' : ''}`}
                                style={{ transform: `scale(${scale})` }}
                                onMouseEnter={() => setHovered(i)}
                                onClick={() => onSelect(item.id)}
                                aria-label={item.label}
                                aria-current={isActive}
                            >
                                <Icon />
                                <span className="dock-tooltip">{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Bottom spacer — gives the pill height/presence beyond the last icon */}
                <div className="dock-spacer" aria-hidden="true" />
            </div>
        </nav>
    );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  Projects carousel — center card + peeking neighbors                */
/* ------------------------------------------------------------------ */

type Project = {
    title: string;
    desc: string;
    tags: string[];
    images: string[];
    caseStudy: {
        type: string; // e.g. "Capstone Project"
        role: string;
        duration: string;
        team: string;
        coverImage: string;
        overview: string;
        problem: string;
        features: string[];
        myContributions: string[];
        outcome: string;
    };
};

const PROJECTS: Project[] = [
    {
        title: 'Smart Pet Breed Identification System (Web & Mobile App)',
        desc: 'A deep learning system we trained ourselves to identify dog breeds from photos, giving instant breed insights. An admin portal supports continuous learning by correcting low-confidence scans, which are fed back into the dataset to retrain and improve the model.',
        tags: ['React', 'TypeScript', 'React Native (Expo)', 'Laravel', 'FastAPI', 'Python'],
        images: ['left.png', 'r.png', 'front.png'],
        caseStudy: {
            type: 'Capstone Project',
            coverImage: '/coverimage.png',
            role: 'Fullstack Developer & ML Integration',
            duration: '1 months',
            team: 'Solo Dev',
            overview:
                'A dog breed identification system built for both web and mobile, powered by a deep learning model we trained from scratch on a custom dataset. It classifies breeds from a single photo and returns instant insights — temperament, care needs, and common health notes.',
            problem:
                "Pet owners and shelters often struggle to accurately identify mixed or unfamiliar breeds, which affects care decisions, adoption matching, and breed-specific health monitoring. Off-the-shelf classification APIs weren't accurate or specific enough for local breed variations, so we needed to collect our own dataset and train a custom model — with a way for it to keep improving after launch.",
            features: [
                'Real-time breed identification from camera or uploaded photo',
                'Custom-trained deep learning model, built on our own labeled dataset',
                'Confidence score shown per prediction',
                'Breed insights: temperament, care needs, common health risks',
                'Admin portal for reviewing and correcting low-confidence scans',
                'Continuous learning pipeline — corrected scans are added to the dataset to retrain the model',
                'Scan history synced across web and mobile',
            ],
            myContributions: [
                'Collected and labeled the training dataset',
                'Trained and evaluated the deep learning model in Python',
                'Built the web app in React + TypeScript and Laravel',
                'Developed the mobile app using React Native (Expo)',
                'Designed and built the Laravel backend, auth, and admin portal',
                'Integrated the FastAPI/Python inference service with the main backend',
                'Implemented the dataset feedback loop for model retraining',
            ],
            outcome:
                'Delivered as a capstone project with a working end-to-end pipeline — from dataset collection to model training, prediction, and admin-reviewed retraining — demonstrating a self-trained, continuously-improving ML system rather than a wrapper around a third-party API.',
        },
    },
    {
        title: 'Project Two',
        desc: 'An internal analytics dashboard pulling live data from multiple APIs into one clean, glanceable view.',
        tags: ['TypeScript', 'REST API', 'Charts'],
        images: ['https://picsum.photos/seed/proj2a/640/420', 'https://picsum.photos/seed/proj2b/640/420'],
        caseStudy: {
            type: 'Freelance Project',
            coverImage: 'https://picsum.photos/seed/proj1-cover/1200/600',
            role: 'Fullstack Developer',
            duration: '2 months',
            team: 'Solo',
            overview: 'A short overview of Project Two goes here.',
            problem: 'A short description of the problem this project solved goes here.',
            features: ['Feature one', 'Feature two', 'Feature three'],
            myContributions: ['Built the frontend', 'Built the backend API'],
            outcome: 'A short outcome/result statement goes here.',
        },
    },
    {
        title: 'Project Three',
        desc: 'A design-system-driven storefront focused on speed and accessibility across devices.',
        tags: ['Design Systems', 'Next.js', 'Tailwind'],
        images: [
            'https://picsum.photos/seed/proj3a/640/420',
            'https://picsum.photos/seed/proj3b/640/420',
            'https://picsum.photos/seed/proj3c/640/420',
        ],
        caseStudy: {
            type: 'Freelance Project',
            coverImage: 'https://picsum.photos/seed/proj1-cover/1200/600',
            role: 'Frontend Developer',
            duration: '1.5 months',
            team: 'Solo',
            overview: 'A short overview of Project Three goes here.',
            problem: 'A short description of the problem this project solved goes here.',
            features: ['Feature one', 'Feature two', 'Feature three'],
            myContributions: ['Built the component library', 'Implemented the storefront UI'],
            outcome: 'A short outcome/result statement goes here.',
        },
    },
    {
        title: 'Project Four',
        desc: 'A cross-platform mobile app for field teams, with offline-first sync and a simplified UX for non-technical users.',
        tags: ['React Native', 'Mobile', 'UX'],
        images: ['https://picsum.photos/seed/proj4a/640/420', 'https://picsum.photos/seed/proj4b/640/420'],
        caseStudy: {
            type: 'Internship Project',
            coverImage: 'https://picsum.photos/seed/proj1-cover/1200/600',
            role: 'Mobile Developer',
            duration: '3 months',
            team: '4 members',
            overview: 'A short overview of Project Four goes here.',
            problem: 'A short description of the problem this project solved goes here.',
            features: ['Feature one', 'Feature two', 'Feature three'],
            myContributions: ['Built the offline sync logic', 'Designed the field-team UX'],
            outcome: 'A short outcome/result statement goes here.',
        },
    },
];

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

function ProjectCaseStudyDialog({ project, open, onOpenChange }: { project: Project | null; open: boolean; onOpenChange: (v: boolean) => void }) {
    if (!project) return null;
    const cs = project.caseStudy;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[88vh] overflow-y-auto rounded-[24px] p-0 sm:max-w-[720px]">
                {/* Header image strip */}
                <div className="relative h-[200px] w-full overflow-hidden bg-[#F3EFE9] sm:h-[240px]">
                    <img src={cs.coverImage} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <span className="absolute top-4 left-6 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.1em] text-[#101010] uppercase backdrop-blur-sm">
                        {cs.type}
                    </span>
                </div>

                <div className="px-6 py-6 sm:px-8 sm:py-8">
                    <DialogHeader className="items-start text-left">
                        <DialogTitle className="text-[1.5rem] leading-tight font-semibold tracking-tight text-[#101010] sm:text-[1.75rem]">
                            {project.title}
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-[15px] leading-relaxed text-[#4b4b4b]">{cs.overview}</DialogDescription>
                    </DialogHeader>

                    {/* Meta row */}
                    <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-[var(--hair)] bg-[#FAF9F7] p-4">
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.12em] text-[#5c5a56] uppercase">Role</p>
                            <p className="mt-1 text-sm font-medium text-[#101010]">{cs.role}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.12em] text-[#5c5a56] uppercase">Duration</p>
                            <p className="mt-1 text-sm font-medium text-[#101010]">{cs.duration}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.12em] text-[#5c5a56] uppercase">Team</p>
                            <p className="mt-1 text-sm font-medium text-[#101010]">{cs.team}</p>
                        </div>
                    </div>

                    {/* Tech stack */}
                    <div className="mt-6">
                        <p className="mb-2.5 text-[11px] font-semibold tracking-[0.16em] text-[#5c5a56] uppercase">Tech Stack</p>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((t) => (
                                <span key={t} className="tag">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Problem */}
                    <div className="mt-6">
                        <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-[#5c5a56] uppercase">The Problem</p>
                        <p className="text-[14.5px] leading-relaxed text-[#4b4b4b]">{cs.problem}</p>
                    </div>

                    {/* Features */}
                    <div className="mt-6">
                        <p className="mb-2.5 text-[11px] font-semibold tracking-[0.16em] text-[#5c5a56] uppercase">Key Features</p>
                        <ul className="flex flex-col gap-2">
                            {cs.features.map((f) => (
                                <li key={f} className="flex items-start gap-2.5 text-[14.5px] text-[#101010]">
                                    <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#101010] text-white">
                                        <CheckIcon />
                                    </span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contributions */}
                    <div className="mt-6">
                        <p className="mb-2.5 text-[11px] font-semibold tracking-[0.16em] text-[#5c5a56] uppercase">My Contributions</p>
                        <ul className="flex flex-col gap-2">
                            {cs.myContributions.map((c) => (
                                <li key={c} className="flex items-start gap-2.5 text-[14.5px] text-[#4b4b4b]">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#101010]" />
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Outcome */}
                    <div className="mt-6 rounded-2xl bg-[#101010] p-5 text-white">
                        <p className="mb-1.5 text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">Outcome</p>
                        <p className="text-[14.5px] leading-relaxed text-white/90">{cs.outcome}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

const ChevronLeftIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 18l-6-6 6-6" />
    </svg>
);
const ChevronRightIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
);

function ProjectCard({ project, onViewCaseStudy }: { project: Project; onViewCaseStudy: () => void }) {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--hair)] bg-white">
            {/* Stacked screenshot mockups */}
            <div className="relative h-[260px] w-full overflow-hidden bg-[#F3EFE9] md:h-[320px]">
                {project.images.map((src, i) => {
                    const offsets = [
                        { top: '4%', left: '2%', rotate: '-6deg', z: 1, w: '68%' },
                        { top: '30%', left: '34%', rotate: '5deg', z: 2, w: '68%' },
                        { top: '16%', left: '18%', rotate: '-1deg', z: 3, w: '68%' },
                    ];
                    const pos = offsets[i % offsets.length];
                    return (
                        <img
                            key={src}
                            src={src}
                            alt=""
                            className="absolute rounded-xl border border-[var(--hair)] object-cover shadow-[0_18px_36px_rgba(0,0,0,0.14)]"
                            style={{
                                top: pos.top,
                                left: pos.left,
                                width: pos.w,
                                transform: `rotate(${pos.rotate})`,
                                zIndex: pos.z,
                            }}
                        />
                    );
                })}
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="card-title">{project.title}</div>
                <div className="card-desc">{project.desc}</div>
                <div className="tag-row">
                    {project.tags.map((t) => (
                        <span className="tag" key={t}>
                            {t}
                        </span>
                    ))}
                </div>
                <div className="mt-auto pt-2">
                    <Button
                        variant="outline"
                        className="gap-1.5"
                        onClick={(e) => {
                            e.stopPropagation(); // don't trigger the neighbor-click goTo
                            onViewCaseStudy();
                        }}
                    >
                        View case study
                        <ArrowUpRightIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
}

function ProjectsCarousel() {
    const [index, setIndex] = useState(0);
    const [openProject, setOpenProject] = useState<Project | null>(null);
    const count = PROJECTS.length;

    const goTo = (i: number) => setIndex((i + count) % count);
    const prev = () => goTo(index - 1);
    const next = () => goTo(index + 1);

    return (
        <div className="relative mt-8 select-none">
            <div className="relative mx-auto flex h-[560px] max-w-[1100px] items-center justify-center overflow-hidden px-[8vw] md:h-[600px] md:px-0">
                {PROJECTS.map((project, i) => {
                    // position relative to active index: -1 = prev, 0 = active, 1 = next
                    let offset = i - index;
                    if (offset > count / 2) offset -= count;
                    if (offset < -count / 2) offset += count;

                    const isActive = offset === 0;
                    const isNeighbor = Math.abs(offset) === 1;

                    if (!isActive && !isNeighbor) return null; // only render active + immediate neighbors

                    const translateX = offset * 92; // % — controls how much of neighbor peeks in
                    const scale = isActive ? 1 : 0.9;
                    const opacity = isActive ? 1 : 0.55;
                    const zIndex = isActive ? 10 : 5;

                    return (
                        <div
                            key={project.title}
                            className="absolute w-[78%] transition-all duration-500 ease-out md:w-[62%]"
                            onClick={!isActive ? () => goTo(i) : undefined}
                            style={{
                                transform: `translateX(${translateX}%) scale(${scale})`,
                                opacity,
                                zIndex,
                                pointerEvents: isActive || isNeighbor ? 'auto' : 'none',
                                cursor: isActive ? 'default' : 'pointer',
                            }}
                        >
                            <div className="relative h-[500px] md:h-[540px]">
                                <ProjectCard project={project} onViewCaseStudy={() => setOpenProject(project)} />
                                {/* Edge overlay hinting more content ahead, only on neighbors */}
                                {isNeighbor && (
                                    <div
                                        className="pointer-events-none absolute inset-0 rounded-[24px]"
                                        style={{
                                            background:
                                                offset < 0
                                                    ? 'linear-gradient(to left, transparent 55%, rgba(255,255,255,0.85) 100%)'
                                                    : 'linear-gradient(to right, transparent 55%, rgba(255,255,255,0.85) 100%)',
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Nav arrows */}
            <button
                type="button"
                onClick={prev}
                aria-label="Previous project"
                className="absolute top-1/2 left-2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--hair)] bg-white text-[#101010] shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#F3F1EE] md:left-6"
            >
                <ChevronLeftIcon />
            </button>
            <button
                type="button"
                onClick={next}
                aria-label="Next project"
                className="absolute top-1/2 right-2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--hair)] bg-white text-[#101010] shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#F3F1EE] md:right-6"
            >
                <ChevronRightIcon />
            </button>

            {/* Dots */}
            <div className="mt-6 flex items-center justify-center gap-2">
                {PROJECTS.map((project, i) => (
                    <button
                        key={project.title}
                        type="button"
                        aria-label={`Go to ${project.title}`}
                        onClick={() => goTo(i)}
                        className="h-2 rounded-full transition-all"
                        style={{
                            width: i === index ? '22px' : '8px',
                            backgroundColor: i === index ? '#101010' : 'rgba(0,0,0,0.18)',
                        }}
                    />
                ))}
            </div>
            <ProjectCaseStudyDialog project={openProject} open={!!openProject} onOpenChange={(v) => !v && setOpenProject(null)} />
        </div>
    );
}

export default function Welcome() {
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState('home');
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        const spy = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: '-42% 0px -50% 0px', threshold: 0 },
        );

        const reveal = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add('in-view');
                });
            },
            { threshold: 0.12 },
        );

        Object.values(sectionRefs.current).forEach((el) => {
            if (!el) return;
            spy.observe(el);
            reveal.observe(el);
        });

        return () => {
            spy.disconnect();
            reveal.disconnect();
        };
    }, []);

    /* ------------------------------------------------------------------ */
    /*  Tech stack icons — same plain-SVG style as the nav icons above     */
    /* ------------------------------------------------------------------ */

    const stackIconProps = {
        width: 15,
        height: 15,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.7,
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    };

    const CodeBracketsIcon = () => (
        <svg {...stackIconProps}>
            <path d="M8.5 8 4 12l4.5 4" />
            <path d="M15.5 8 20 12l-4.5 4" />
        </svg>
    );
    const MobileIcon = () => (
        <svg {...stackIconProps}>
            <rect x="7" y="3" width="10" height="18" rx="2" />
            <path d="M11 18h2" />
        </svg>
    );
    const AtomIcon = () => (
        <svg {...stackIconProps}>
            <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
            <ellipse cx="12" cy="12" rx="9" ry="3.6" />
            <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
        </svg>
    );
    const WindIcon = () => (
        <svg {...stackIconProps}>
            <path d="M3 8h11a3 3 0 1 0-2.5-4.6" />
            <path d="M3 12h15a3 3 0 1 1-2.5 4.6" />
            <path d="M3 16h8" />
        </svg>
    );
    const MonogramIcon = ({ letters }: { letters: string }) => (
        <svg {...stackIconProps}>
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <text x="12" y="15.5" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="currentColor" stroke="none">
                {letters}
            </text>
        </svg>
    );
    const ElephantIcon = () => (
        <svg {...stackIconProps}>
            <path d="M4 15c0-5 3.5-9 8-9s8 3 8 6c0 2.5-2 4-4.5 4H12" />
            <path d="M8 15v4M12 15v4M16 16v3" />
            <circle cx="16" cy="8.5" r="0.6" fill="currentColor" stroke="none" />
        </svg>
    );
    const HexNodeIcon = () => (
        <svg {...stackIconProps}>
            <path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z" />
            <path d="M12 3v18M4.2 7.5 12 12l7.8-4.5M12 12v9" />
        </svg>
    );
    const CloudIcon = () => (
        <svg {...stackIconProps}>
            <path d="M7 18a4.5 4.5 0 0 1-.5-9 5.5 5.5 0 0 1 10.8-1.4A4 4 0 0 1 17.5 18H7Z" />
        </svg>
    );
    const BoxIcon = () => (
        <svg {...stackIconProps}>
            <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
            <path d="M4 7.5 12 12l8-4.5M12 12v9" />
        </svg>
    );
    const ContainerIcon = () => (
        <svg {...stackIconProps}>
            <rect x="3" y="9" width="18" height="9" rx="1.5" />
            <path d="M7 9V6.5A1.5 1.5 0 0 1 8.5 5h7A1.5 1.5 0 0 1 17 6.5V9" />
            <path d="M7 13h2M12 13h2M17 13h-.01" />
        </svg>
    );
    const BranchIcon = () => (
        <svg {...stackIconProps}>
            <circle cx="6" cy="6" r="2" />
            <circle cx="6" cy="18" r="2" />
            <circle cx="18" cy="9" r="2" />
            <path d="M6 8v8" />
            <path d="M6 8a6 6 0 0 0 6 6h4" />
        </svg>
    );
    const SendIcon = () => (
        <svg {...stackIconProps}>
            <path d="M4 11 20 4l-6.5 16-3-6.5L4 11Z" />
        </svg>
    );
    const BoardIcon = () => (
        <svg {...stackIconProps}>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M8 8v8M14 8v5" />
        </svg>
    );
    const ChartIcon = () => (
        <svg {...stackIconProps}>
            <path d="M4 20V10M11 20V4M18 20v-7" />
            <path d="M4 20h14" />
        </svg>
    );
    const TerminalIcon = () => (
        <svg {...stackIconProps}>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M7 9l3 3-3 3M12 15h5" />
        </svg>
    );

    type Tool = { name: string; icon: () => ReactElement; color: string };
    type StackGroup = { label: string; tools: Tool[] };

    const STACK_GROUPS: StackGroup[] = [
        {
            label: 'Frontend',
            tools: [
                { name: 'React', icon: AtomIcon, color: '#61DAFB' },
                { name: 'React Native', icon: MobileIcon, color: '#61DAFB' },
                { name: 'TypeScript', icon: () => <MonogramIcon letters="TS" />, color: '#3178C6' },
                { name: 'JavaScript', icon: () => <MonogramIcon letters="JS" />, color: '#F0DB4F' },
                { name: 'Tailwind CSS', icon: WindIcon, color: '#38BDF8' },
                { name: 'shadcn/ui', icon: CodeBracketsIcon, color: '#101010' },
            ],
        },
        {
            label: 'Backend',
            tools: [
                { name: 'Laravel', icon: () => <MonogramIcon letters="L" />, color: '#FF2D20' },
                { name: 'PHP', icon: ElephantIcon, color: '#777BB4' },
                { name: 'Node.js', icon: HexNodeIcon, color: '#339933' },
                { name: 'Python', icon: HexNodeIcon, color: '#339933' },
            ],
        },
        {
            label: 'Cloud & DevOps',
            tools: [
                { name: 'Laravel Cloud', icon: CloudIcon, color: '#FF2D20' },
                { name: 'Google Cloud', icon: CloudIcon, color: '#4285F4' },
                { name: 'AWS', icon: BoxIcon, color: '#FF9900' },
                { name: 'Docker', icon: ContainerIcon, color: '#2496ED' },
            ],
        },
        {
            label: 'Tools & Analytics',
            tools: [
                { name: 'GitHub', icon: BranchIcon, color: '#181717' },
                { name: 'Postman', icon: SendIcon, color: '#FF6C37' },
                { name: 'Trello', icon: BoardIcon, color: '#0052CC' },
                { name: 'Google Analytics 4', icon: ChartIcon, color: '#F9AB00' },
            ],
        },
    ];

    /* Contact points used by both the About card and the Contact section card */
    const CONTACT_POINTS = [
        {
            label: 'Email',
            value: 'dave.clapis@gmail.com',
            href: 'mailto:dave.clapis@gmail.com',
            icon: MailIcon,
        },
        {
            label: 'Chat on Messenger',
            value: 'm.me/dave.clapis',
            href: 'https://m.me/dave.clapis',
            icon: ChatIcon,
        },
        {
            label: "Let's talk",
            value: 'Schedule a quick call',
            href: 'tel:+639000000000',
            icon: PhoneIcon,
        },
    ];

    const scrollTo = (id: string) => {
        sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <>
            {loading && <LoadingScreen onComplete={() => setLoading(false)} />}

            <Head title="Portfolio">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700,800" rel="stylesheet" />
            </Head>

            <style>{`
                :root {
                    --bg: #ffffff;
                    --ink: #101010;
                    --muted: #5c5a56;
                    --hair: rgba(0,0,0,0.09);
                }
                .portfolio-root {
                    background: var(--bg);
                    color: var(--ink);
                    min-height: 100vh;
                    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
                }

                /* ---------- Liquid glass dock ---------- */
                .liquid-dock {
                    position: fixed;
                    z-index: 50;
                    left: 22px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .liquid-dock-glass {
                    --mx: 50%;
                    --my: 0%;
                    --glow: 0;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    width: 64px;
                    padding: 10px 0 12px;
                   
                    border-radius: 22px;
                    background: rgba(255,255,255,0.7);
                    border: 1px solid rgba(0,0,0,0.08);
                    backdrop-filter: blur(22px) saturate(140%);
                    -webkit-backdrop-filter: blur(22px) saturate(140%);
                    box-shadow: 0 18px 44px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
                    overflow: visible;
                }
                .liquid-dock-glass::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 22px;
                    pointer-events: none;
                    opacity: var(--glow);
                    transition: opacity .35s ease;
                    background: radial-gradient(90px 90px at var(--mx) var(--my), rgba(0,0,0,0.06), transparent 65%);
                }

                .dock-mark {
                    width: 42px;
                    height: 42px;
                    border-radius: 13
                    background: var(--ink);
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: .02em;
                    flex-shrink: 0;
                }

                .dock-divider {
                    width: 26px;
                    height: 1px;
                    background: var(--hair);
                    margin: 4px 0 2px;
                    flex-shrink: 0;
                }

                .dock-group {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }

                /* Empty block at the base of the pill — this is what makes the
                   capsule read as tall/deliberate rather than shrink-wrapped
                   to the last icon. Scales with the item count above it. */
                .dock-spacer {
                    width: 4px;
                    height: 154px;
                    border-radius: 999px;
                    margin-top: 6px;
                   
                    flex-shrink: 0;
                }

                .dock-item {
                    position: relative;
                    width: 44px;
                    height: 44px;
                    border-radius: 33%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: none;
                    color: #4b4b4b;
                    cursor: pointer;
                    transition: transform .4s cubic-bezier(.34,1.56,.64,1),
                                background-color .3s ease, color .3s ease;
                }
                .dock-item:hover { color: var(--ink); background: rgba(0,0,0,0.05); }
                .dock-item.active {
                    background: var(--ink);
                    color: #ffffff;
                }
                .dock-tooltip {
                    position: absolute;
                    left: 58px;
                    top: 50%;
                    transform: translateY(-50%) translateX(-6px);
                    background: #ffffff;
                    color: var(--ink);
                    border: 1px solid rgba(0,0,0,0.1);
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 500;
                    letter-spacing: .01em;
                    white-space: nowrap;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity .2s ease, transform .2s ease;
                }
                .dock-item:hover .dock-tooltip {
                    opacity: 1;
                    transform: translateY(-50%) translateX(0);
                }

                @media (max-width: 820px) {
                    .liquid-dock {
                        left: 0; right: 0; top: auto; bottom: 18px;
                        transform: none;
                        display: flex;
                        justify-content: center;
                        padding: 0 16px;
                    }
                    .liquid-dock-glass {
                        flex-direction: row;
                        width: auto;
                        padding: 9px 16px;
                    }
                    .dock-divider { width: 1px; height: 22px; margin: 0 4px; }
                    .dock-group { flex-direction: row; }
                    .dock-spacer { display: none; }
                    .dock-tooltip { display: none; }
                }

                /* ---------- Layout / sections ---------- */
                .portfolio-main {
                    margin-left: 108px;
                }
                @media (max-width: 820px) {
                    .portfolio-main { margin-left: 0; }
                }
                .section {
                    min-height: 100vh;
                    padding: 7rem 8vw 5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    border-bottom: 1px solid var(--hair);
                    opacity: 0;
                    transform: translateY(18px);
                    transition: opacity .7s ease, transform .7s ease;
                }
                .section.in-view { opacity: 1; transform: translateY(0); }
                .eyebrow {
                    font-size: 12px;
                    letter-spacing: .16em;
                    text-transform: uppercase;
                    color: var(--muted);
                    margin-bottom: 1.1rem;
                }
                .h1 {
                    font-size: clamp(2.4rem, 6vw, 5rem);
                    line-height: 1.02;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                }
                .h2 {
                    font-size: clamp(1.8rem, 3.4vw, 2.6rem);
                    font-weight: 600;
                    letter-spacing: -0.01em;
                    margin-bottom: 2.2rem;
                }
                .lead {
                    color: var(--muted);
                    font-size: clamp(1rem, 1.4vw, 1.15rem);
                    max-width: 42ch;
                    margin-top: 1.4rem;
                    line-height: 1.6;
                }
                .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--hair); }
                @media (max-width: 720px) { .grid-2 { grid-template-columns: 1fr; } }
                .card {
                    background: var(--bg);
                    padding: 2.4rem;
                    transition: background-color .35s ease;
                }
                .card:hover { background: rgba(0,0,0,0.02); }
                .card-title { font-size: 1.15rem; font-weight: 600; margin-bottom: .6rem; }
                .card-desc { color: var(--muted); font-size: .92rem; line-height: 1.55; }
                .tag-row { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.2rem; }
                .tag {
                    font-size: .75rem;
                    letter-spacing: .04em;
                    color: var(--muted);
                    border: 1px solid var(--hair);
                    border-radius: 999px;
                    padding: .3rem .7rem;
                }
                .skill-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    padding: 1.1rem 0;
                    border-bottom: 1px solid var(--hair);
                }
                .skill-name { font-size: 1.05rem; font-weight: 500; }
                .skill-note { color: var(--muted); font-size: .85rem; }
                .contact-link {
                    display: inline-flex;
                    align-items: center;
                    gap: .5rem;
                    color: var(--ink);
                    text-decoration: none;
                    font-size: 1.4rem;
                    border-bottom: 1px solid var(--hair);
                    padding-bottom: .4rem;
                    transition: opacity .25s ease;
                }
                .contact-link:hover { opacity: .6; }
                .foot {
                    color: var(--muted);
                    font-size: .8rem;
                    padding: 2rem 8vw;
                }

                /* Honors badges under education entries */
                .honor-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    margin-top: 6px;
                    padding: 3px 9px;
                    border-radius: 999px;
                    background: rgba(16,16,16,0.06);
                    color: #101010;
                    font-size: 13px;
                    font-weight: 600;
                    letter-spacing: .01em;
                }
            `}</style>

            <div className="portfolio-root">
                <LiquidDock active={active} onSelect={scrollTo} />

                <main className="portfolio-main">
                    {/* HOME */}
                    <section
                        id="home"
                        ref={(el) => {
                            sectionRefs.current.home = el;
                        }}
                        className="section"
                        style={{ justifyContent: 'flex-start', paddingTop: '7rem' }}
                    >
                        {/* Cover + avatar wrapper — avatar is absolutely positioned INSIDE this, so it always sits on top */}
                        <div className="relative w-full">
                            <div className="h-[220px] w-full overflow-hidden rounded-4xl bg-[#F3EFE9] md:h-[340px]">
                                <img src="/cover.png" alt="" className="h-full w-full object-cover" />
                            </div>
                        </div>

                        <div className="z-10 flex flex-col gap-6 px-5 md:flex-row md:items-end md:gap-8">
                            {/* Avatar carries its own negative margin — only it reaches up into the cover */}
                            <div className="-mt-16 shrink-0 rounded-4xl bg-gradient-to-br from-[#3c3c3c] via-[#636363] to-[#c1c1c1] p-[3px] shadow-[0_10px_28px_rgba(255,45,32,0.10)] md:-mt-20">
                                <div className="rounded-[calc(1.5rem+3px)] bg-white p-[3px]">
                                    <div className="h-[170px] w-[170px] overflow-hidden rounded-3xl bg-[#EFEAE3] md:h-[200px] md:w-[200px]">
                                        <img src="/profile2.png" alt="Profile photo" className="h-full w-full object-cover object-top" />
                                    </div>
                                </div>
                            </div>

                            {/* Zero margin — this can never enter the cover. items-end syncs its bottom to the avatar's bottom */}
                            <div className="flex flex-col gap-4 pt-3">
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium text-[#5c5a56]">Fullstack Web Developer / App Developer</p>
                                    <h1 className="text-[25px] leading-[1.05] font-semibold tracking-tight text-[#101010]">
                                        Dave Michael Beltran Clapis
                                    </h1>
                                    <p className="flex items-center gap-1.5 text-sm font-medium text-[#5c5a56]">
                                        <svg
                                            width="14"
                                            height="14"
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

                                <div className="flex flex-wrap gap-3">
                                    <Button>Download résumé</Button>
                                    <Button variant="outline">Send email</Button>
                                </div>
                            </div>
                        </div>

                        {/* Bio */}
                        <p className="mt-10 max-w-[1100px] px-2 text-[15px] leading-relaxed text-[#4b4b4b] md:mt-6 md:px-0 md:text-[16px]">
                            I'm a fullstack developer who loves the moment scattered ideas click into a working product. I graduated with a BS in
                            Computer Science, but most of what I know came from staying up late debugging something that "should have worked" until it
                            did. I'm comfortable across the stack clean, responsive frontends, backed by the logic, databases, and APIs that make
                            everything run. There's real satisfaction in owning a project end to end, from a blank file to something people actually
                            use. I'm currently looking for opportunities to keep growing and work with people who care about doing good work.
                        </p>
                    </section>

                    {/* ABOUT */}
                    <section
                        id="about"
                        ref={(el) => {
                            sectionRefs.current.about = el;
                        }}
                        className="section"
                    >
                        <p className="eyebrow">About</p>
                        <h2 className="h2">Stack, experience, education.</h2>

                        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
                            {/* ---------- Left column ---------- */}
                            <div className="flex flex-col gap-4">
                                {/* Tech Stack — a single card, all groups inside */}
                                <Card className="gap-4 rounded-[20px] border-[var(--hair)] py-6 shadow-none">
                                    <CardHeader className="px-6">
                                        <CardTitle className="flex items-center gap-2 text-[17px] font-semibold text-[#101010]">
                                            <LayersIcon />
                                            Tech Stack
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-5 px-6">
                                        {STACK_GROUPS.map((group) => (
                                            <div key={group.label}>
                                                <p className="mb-2.5 text-[11px] font-semibold tracking-[0.16em] text-[#5c5a56] uppercase">
                                                    {group.label}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {group.tools.map(({ name, icon: Icon }) => (
                                                        <span
                                                            key={name}
                                                            className="inline-flex items-center gap-1.5 rounded-full border border-[#101010] px-3 py-1 text-xs font-medium text-[#101010] transition-colors hover:bg-[#101010] hover:text-white"
                                                        >
                                                            <Icon />
                                                            {name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Get in Touch — single card, divided rows (also reused in Contact section) */}
                                <Card className="gap-4 rounded-[20px] border-[var(--hair)] py-6 shadow-none">
                                    <CardHeader className="px-6">
                                        <CardTitle className="flex items-center gap-2 text-[17px] font-semibold text-[#101010]">
                                            <SendMessageIcon />
                                            Get in Touch
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6">
                                        {/* Get in Touch */}
                                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                            <div>
                                                <p className="text-[15px] leading-relaxed text-[#4b4b4b]">
                                                    Available for UI/UX and WordPress freelance projects, with added support in SEO, Google Search
                                                    Console (GSC), Google My Business (GMB), and email campaigns.
                                                </p>
                                            </div>

                                            <div>
                                                <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-[#5c5a56] uppercase">
                                                    Get in touch
                                                </p>
                                                <div className="flex flex-col gap-3">
                                                    {CONTACT_POINTS.map((item) => (
                                                        <a
                                                            key={item.label}
                                                            href={item.href}
                                                            target={item.href.startsWith('http') ? '_blank' : undefined}
                                                            rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                                                            className="flex items-center gap-3 rounded-2xl border border-[var(--hair)] px-4 py-3.5 transition-colors hover:bg-[#F8F6F3]"
                                                        >
                                                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3F1EE] text-[#101010]">
                                                                <item.icon />
                                                            </span>
                                                            <div>
                                                                <p className="text-[11px] font-semibold tracking-[0.12em] text-[#5c5a56] uppercase">
                                                                    {item.label}
                                                                </p>
                                                                <p className="text-[15px] font-medium text-[#101010]">{item.value}</p>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* ---------- Right column ---------- */}
                            <div className="flex flex-col gap-4">
                                {/* Experience */}
                                <Card className="gap-4 rounded-[20px] border-[var(--hair)] py-6 shadow-none">
                                    <CardHeader className="px-6">
                                        <CardTitle className="flex items-center gap-2 text-[17px] font-semibold text-[#101010]">
                                            <BriefcaseIcon />
                                            Experience
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6">
                                        <div className="flex flex-col gap-4">
                                            {[
                                                {
                                                    role: 'Web Developer / Fullstack Developer',
                                                    org: 'Freelance',
                                                    period: '2025 – Present',
                                                    current: true,
                                                },
                                                {
                                                    role: 'Web Developer Intern',
                                                    org: 'DOST – Technology Application and Promotion Institute',
                                                    period: '2025',
                                                    current: false,
                                                },
                                                {
                                                    role: 'Developer / UI Designer Intern',
                                                    org: 'Ollopa Corporation',
                                                    period: '2024',
                                                    current: false,
                                                },
                                                {
                                                    role: 'Lead Developer',
                                                    org: 'Capstone & school software projects',

                                                    current: false,
                                                },
                                            ].map((exp) => (
                                                <div key={exp.role} className="flex items-start gap-3">
                                                    <span
                                                        className={
                                                            exp.current
                                                                ? 'mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#101010]'
                                                                : 'mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border border-[#101010] bg-white'
                                                        }
                                                    />
                                                    <div className="flex flex-1 items-start justify-between gap-4 border-b border-[var(--hair)] pb-4 last:border-b-0 last:pb-0">
                                                        <div>
                                                            <p className="text-[15px] font-semibold text-[#101010]">{exp.role}</p>
                                                            <p className="mt-0.5 text-sm text-[#5c5a56]">{exp.org}</p>
                                                        </div>
                                                        <span className="shrink-0 pt-0.5 text-sm text-[#5c5a56]">{exp.period}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Education */}
                                <Card className="gap-4 rounded-[20px] border-[var(--hair)] py-6 shadow-none">
                                    <CardHeader className="px-6">
                                        <CardTitle className="flex items-center gap-2 text-[17px] font-semibold text-[#101010]">
                                            <GradCapIcon />
                                            Education
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-6">
                                        <div className="flex flex-col">
                                            {[
                                                {
                                                    program: 'BS Computer Science',
                                                    school: 'Bicol University',
                                                    period: '2022 – 2026',
                                                    honor: 'Cum Laude',
                                                },
                                                {
                                                    program: 'Senior High School',
                                                    school: 'San Lorenzo Academy',
                                                    period: '2020 – 2022',
                                                    honor: 'With Honors',
                                                },
                                                {
                                                    program: 'NC III — Programming',
                                                    school: 'TESDA National Certification',
                                                    period: '2024',
                                                    honor: 'TESDA Certified',
                                                },
                                            ].map((edu) => (
                                                <div
                                                    key={edu.program}
                                                    className="border-b border-[var(--hair)] py-4 first:pt-0 last:border-b-0 last:pb-0"
                                                >
                                                    <div className="flex justify-between">
                                                        <p className="text-[15px] font-semibold text-[#101010]">{edu.program}</p>
                                                        <span className="honor-badge">
                                                            <AwardIcon />
                                                            {edu.honor}
                                                        </span>
                                                    </div>
                                                    <p className="mt-0.5 text-sm text-[#5c5a56]">{edu.school}</p>
                                                    <p className="mt-0.5 text-sm text-[#5c5a56]">{edu.period}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    {/* PROJECTS */}
                    <section
                        id="projects"
                        ref={(el) => {
                            sectionRefs.current.projects = el;
                        }}
                        className="section"
                        style={{ padding: '7rem 0 5rem' }}
                    >
                        <div style={{ padding: '0 8vw' }}>
                            <p className="eyebrow">Projects</p>
                            <h2 className="h2">Selected work.</h2>
                        </div>
                        <ProjectsCarousel />
                    </section>

                    {/* SKILLS */}
                    <section
                        id="skills"
                        ref={(el) => {
                            sectionRefs.current.skills = el;
                        }}
                        className="section"
                    >
                        <p className="eyebrow">Skills</p>
                        <h2 className="h2">Toolkit.</h2>
                        <div style={{ maxWidth: '48ch' }}>
                            {[
                                ['React & TypeScript', 'Interfaces'],
                                ['Laravel & PHP', 'Backend'],
                                ['PostgreSQL', 'Data'],
                                ['Design systems', 'Product'],
                            ].map(([name, note]) => (
                                <div className="skill-row" key={name}>
                                    <span className="skill-name">{name}</span>
                                    <span className="skill-note">{note}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CONTACT */}
                    <section
                        id="contact"
                        ref={(el) => {
                            sectionRefs.current.contact = el;
                        }}
                        className="section"
                        style={{ borderBottom: 'none' }}
                    >
                        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
                            {/* Left — headline + availability blurb */}
                            <div>
                                <p className="eyebrow">Contact</p>
                                <h2 className="text-[clamp(2rem,4.2vw,2.6rem)] leading-[1.05] font-semibold tracking-tight text-[#101010]">
                                    Let's work <span className="text-indigo-600">together.</span>
                                </h2>
                                <p className="lead mt-4" style={{ maxWidth: '46ch' }}>
                                    Available for fullstack web and mobile app projects, with added support in UI/UX design, API integrations, and
                                    cloud deployment.
                                </p>
                                <div className="tag-row" style={{ marginTop: '2rem' }}>
                                    <a className="tag" href="#" style={{ fontSize: '.85rem' }}>
                                        GitHub
                                    </a>
                                    <a className="tag" href="#" style={{ fontSize: '.85rem' }}>
                                        LinkedIn
                                    </a>
                                    <a className="tag" href="#" style={{ fontSize: '.85rem' }}>
                                        Twitter
                                    </a>
                                </div>
                            </div>

                            {/* Right — single "Get in Touch" card, matching the About section style */}
                            <div>
                                <p className="mb-4 text-[11px] font-semibold tracking-[0.18em] text-[#5c5a56] uppercase">Get in touch</p>
                                <Card className="gap-4 rounded-[20px] border-[var(--hair)] py-6 shadow-none">
                                    <CardContent className="px-6">
                                        <div className="flex flex-col">
                                            {CONTACT_POINTS.map((item) => (
                                                <a
                                                    key={item.label}
                                                    href={item.href}
                                                    target={item.href.startsWith('http') ? '_blank' : undefined}
                                                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                                                    className="group flex items-center justify-between gap-4 border-b border-[var(--hair)] py-4 first:pt-0 last:border-b-0 last:pb-0"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#101010] text-white">
                                                            <item.icon />
                                                        </span>
                                                        <div>
                                                            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#5c5a56] uppercase">
                                                                {item.label}
                                                            </p>
                                                            <p className="text-[15px] font-medium text-[#101010]">{item.value}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[#5c5a56] transition-colors group-hover:text-[#101010]">
                                                        <ArrowUpRightIcon />
                                                    </span>
                                                </a>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    <p className="foot">© 2026 — Built with Laravel & React.</p>
                </main>
            </div>
        </>
    );
}
