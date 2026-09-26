import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

const ArrowUpRightIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M8 7h9v9" />
    </svg>
);
const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);
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

/* ------------------------------------------------------------------ */
/*  Data                                                                */
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
        title: 'Nexus',
        desc: 'A real-time messaging platform with AI-powered Smart Reply feature that suggests context-aware responses before you even start typing.',
        tags: ['Laravel', 'Inertia.js', 'React', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
        images: ['/front4.png', '/left4.png'],
        caseStudy: {
            type: 'Personal Project',
            coverImage: '/front4.png',
            role: 'Full-Stack Developer',
            duration: 'Ongoing',
            team: 'Solo',
            overview:
                'Nexus is a full-stack messaging app built with Laravel and Inertia.js on the backend and React with TypeScript on the frontend. It supports one-on-one and group conversations, real-time delivery over WebSockets, and an AI-assisted Smart Reply feature that suggests responses based on conversation context.',
            problem:
                'Most chat tutorials stop at basic message sending. I wanted to build something closer to a production messaging product — with the social graph, media handling, and real-time UX polish that real apps like Messenger or WhatsApp actually need.',
            features: [
                'Friend requests with pending/accepted/declined states and a suggestions feed',
                'One-on-one and group conversations with custom group names and avatars',
                'Real-time message delivery, typing/read receipts, and online presence via broadcast channels',
                'File, image, video, and voice-message attachments stored on S3-compatible object storage (Cloudflare R2)',
                'Emoji reactions on messages with live-updating reaction counts',
                'AI-generated Smart Reply suggestions based on the latest message in a thread',
                'Fully responsive UI with dedicated mobile navigation and a dark, minimalist interface',
            ],
            myContributions: [
                'Designed and built the full relational schema (users, friend requests, conversations, messages, attachments, reactions) in Laravel migrations',
                'Implemented the friend request and conversation controllers, including group creation and per-user unread counts',
                'Built the real-time layer using broadcast events (MessageSent, MessagesRead, ReactionUpdated, ConversationUpdated) over private and presence channels',
                'Integrated Cloudflare R2 for avatar and attachment storage via a Laravel filesystem disk',
                'Built the entire React/TypeScript frontend, including the message thread, reaction picker, voice recorder, and conversation info panel',
                'Wired up the Smart Reply service to generate contextual reply suggestions from recent conversation history',
            ],
            outcome:
                'A working, deployed messaging app with the core mechanics of a real chat product: friend graphs, group chats, media attachments, presence, and live updates — plus an AI layer that sets it apart from a typical CRUD chat clone.',
        },
    },
    {
        title: 'Smart Pet Breed Identification System (Web & Mobile App)',
        desc: 'A self-trained deep learning system that identifies dog breeds from photos and improves via an admin-driven retraining loop.',
        tags: ['React', 'TypeScript', 'React Native (Expo)', 'Laravel', 'FastAPI', 'Python'],
        images: ['/left.png', '/right.png', '/front.png'],
        caseStudy: {
            type: 'Capstone Project',
            coverImage: '/coverimage.png',
            role: 'Fullstack Developer & ML Integration',
            duration: '3 weeks',
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
        title: 'Campus Asset Tracker',
        desc: 'A role-based asset and maintenance management system with three dedicated portals — IT Admin, Technician, and Faculty/Staff — for tracking equipment, rooms, and repair tickets across campus.',
        tags: ['Laravel', 'React', 'Inertia.js', 'TypeScript', 'Role-Based Access'],
        images: ['/right2.png', '/left2.png', '/front2.png'],
        caseStudy: {
            type: 'Freelance Project',
            coverImage: 'login.png',
            role: 'Fullstack Developer',
            duration: '2 weeks',
            team: 'Solo',
            overview:
                'Campus Asset Tracker is a centralized system for managing school equipment, rooms, and maintenance requests. It replaces manual spreadsheets and paper-based ticket logs with a single platform, giving each user type — administrators, technicians, and faculty/staff — its own portal with access limited to exactly what their role needs.',
            problem:
                'The school had no unified way to track equipment across departments, rooms, and labs. Assets went missing or unaccounted for, maintenance requests were scattered across emails and verbal reports, and there was no visibility into who was responsible for fixing what. Faculty had no way to report issues or check status without contacting IT directly.',
            features: [
                'Three role-based portals: IT Admin, Technician, and Faculty/Staff, each with a tailored sidebar and permission set',
                'Full asset lifecycle tracking — add, update, retire, and assign equipment to rooms and departments',
                'Maintenance ticket system with status tracking, technician assignment, and comment threads',
                'Real-time notifications for new tickets, asset updates, and status changes',
                'Department and room/lab management for organizing assets by physical location',
                'Reporting dashboard with asset and ticket analytics for admins',
            ],
            myContributions: [
                'Designed and built the entire Laravel backend, including role-based route gates and permission logic',
                'Built the React + Inertia.js frontend for all three portals with a shared, reusable component system',
                'Implemented the maintenance ticket workflow, from submission to technician assignment to resolution',
                'Set up the notification system to keep admins and faculty updated on ticket and asset changes',
            ],
            outcome:
                'The system gave the school a single source of truth for equipment and maintenance, cutting down on lost assets and untracked repair requests. Faculty can now report issues directly and see progress in real time, while IT admins get full visibility and reporting across every department and room.',
        },
    },
    {
        title: 'Dental Appointment System',
        desc: 'A full-stack booking platform for a dental clinic, with public appointment scheduling and role-based dashboards for staff and admins.',
        tags: ['Laravel', 'React', 'TypeScript', 'Sanctum Auth', 'TanStack Query'],
        images: ['left3.png', 'front3.png'],
        caseStudy: {
            type: 'Freelance Project',
            coverImage: 'front3.png',
            role: 'Fullstack Developer',
            duration: '2 weeks',
            team: 'Solo',
            overview:
                'A booking and clinic-management system for a dental practice, letting patients book appointments online without an account while giving staff and admins a dashboard to manage dentists, services, patients, and schedules.',
            problem:
                'The clinic relied on phone calls and walk-ins to schedule appointments, with no central system to track dentist availability, service types, or patient history. Staff had no easy way to manage appointments or onboard new team members, and there was no self-service option for patients to book on their own.',
            features: [
                'Public booking flow — patients can view available slots and book appointments with no account required',
                'Role-based access for Staff and Admin, each with permissions scoped to their responsibilities',
                'Dentist and service management, including specialties, ratings, and experience',
                'Patient records with staff-added notes for tracking history across visits',
                'Google OAuth sign-in for staff and admins — no separate password to manage',
                'Notification system to keep staff updated on new and changed appointments',
            ],
            myContributions: [
                'Built the Laravel API backend, including Sanctum authentication, role-based route middleware, and request validation',
                'Built the React frontend for both the public booking flow and the internal staff/admin dashboards',
                'Implemented Google OAuth login alongside standard email/password authentication',
                'Set up data fetching and caching with TanStack Query for a fast, low-friction admin experience',
            ],
            outcome:
                'The clinic moved from manual, phone-based scheduling to a self-service booking system, reducing front-desk workload while giving staff a single place to manage dentists, patients, and appointments.',
        },
    },
];

/* ------------------------------------------------------------------ */
/*  Project card                                                       */
/* ------------------------------------------------------------------ */

const IMAGE_OFFSETS = [
    { top: '4%', left: '2%', rotate: '-6deg', z: 1, w: '68%' },
    { top: '30%', left: '34%', rotate: '5deg', z: 2, w: '68%' },
    { top: '16%', left: '18%', rotate: '-1deg', z: 3, w: '68%' },
];

function ProjectCard({ project, onViewCaseStudy }: { project: Project; onViewCaseStudy: () => void }) {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--hair)] bg-white dark:bg-neutral-900">
            <div className="relative h-[260px] w-full overflow-hidden bg-[#F3EFE9] md:h-[320px] dark:bg-neutral-800">
                {project.images.map((src, i) => {
                    const pos = IMAGE_OFFSETS[i % IMAGE_OFFSETS.length];
                    return (
                        <img
                            key={src}
                            src={src}
                            alt=""
                            className="absolute rounded-xl border border-[var(--hair)] object-cover shadow-[0_18px_36px_rgba(0,0,0,0.14)]"
                            style={{ top: pos.top, left: pos.left, width: pos.w, transform: `rotate(${pos.rotate})`, zIndex: pos.z }}
                        />
                    );
                })}
            </div>

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

/* ------------------------------------------------------------------ */
/*  Case study dialog / mobile bottom sheet                            */
/* ------------------------------------------------------------------ */

function ProjectCaseStudyDialog({ project, open, onOpenChange }: { project: Project | null; open: boolean; onOpenChange: (v: boolean) => void }) {
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);

    useEffect(() => {
        document.body.classList.toggle('sheet-open', open);
        return () => document.body.classList.remove('sheet-open');
    }, [open]);

    if (!project) return null;
    const cs = project.caseStudy;

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (window.innerWidth > 1024) return;
        setIsDragging(true);
        dragStartY.current = e.clientY;
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const delta = e.clientY - dragStartY.current;
        if (delta > 0) setDragY(delta);
    };
    const handlePointerUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (dragY > 110) onOpenChange(false);
        setDragY(0);
    };

    const dragStyle = dragY || isDragging ? ({ '--sheet-drag-y': `${dragY}px`, transition: 'none' } as React.CSSProperties) : undefined;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="case-study-sheet max-h-[88vh] overflow-y-auto rounded-[24px] p-0 sm:max-w-[720px]" style={dragStyle}>
                <div
                    className="sheet-drag-handle"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    <span className="sheet-drag-bar" aria-hidden="true" />
                </div>
                <div className="relative h-[200px] w-full overflow-hidden bg-[#F3EFE9] sm:h-[240px] dark:bg-neutral-800">
                    <img src={cs.coverImage} alt="" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <span className="absolute top-4 left-6 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.1em] text-[#101010] uppercase backdrop-blur-sm dark:bg-neutral-900/85 dark:text-neutral-100">
                        {cs.type}
                    </span>
                </div>

                <div className="px-6 py-6 sm:px-8 sm:py-8">
                    <DialogHeader className="items-start text-left">
                        <DialogTitle className="text-[1.5rem] leading-tight font-semibold tracking-tight text-[#101010] sm:text-[1.75rem] dark:text-neutral-50">
                            {project.title}
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-[15px] leading-relaxed text-[#4b4b4b] dark:text-neutral-400">
                            {cs.overview}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-[var(--hair)] bg-[#FAF9F7] p-4 dark:bg-neutral-900">
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.12em] text-[#5c5a56] uppercase dark:text-neutral-400">Role</p>
                            <p className="mt-1 text-sm font-medium text-[#101010] dark:text-neutral-100">{cs.role}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.12em] text-[#5c5a56] uppercase dark:text-neutral-400">Duration</p>
                            <p className="mt-1 text-sm font-medium text-[#101010] dark:text-neutral-100">{cs.duration}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.12em] text-[#5c5a56] uppercase dark:text-neutral-400">Team</p>
                            <p className="mt-1 text-sm font-medium text-[#101010] dark:text-neutral-100">{cs.team}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="mb-2.5 text-[11px] font-semibold tracking-[0.16em] text-[#5c5a56] uppercase dark:text-neutral-400">
                            Tech Stack
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((t) => (
                                <span key={t} className="tag">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-[#5c5a56] uppercase dark:text-neutral-400">The Problem</p>
                        <p className="text-[14.5px] leading-relaxed text-[#4b4b4b] dark:text-neutral-400">{cs.problem}</p>
                    </div>

                    <div className="mt-6">
                        <p className="mb-2.5 text-[11px] font-semibold tracking-[0.16em] text-[#5c5a56] uppercase dark:text-neutral-400">
                            Key Features
                        </p>
                        <ul className="flex flex-col gap-2">
                            {cs.features.map((f) => (
                                <li key={f} className="flex items-start gap-2.5 text-[14.5px] text-[#101010] dark:text-neutral-100">
                                    <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[#101010] text-white dark:bg-neutral-100 dark:text-neutral-900">
                                        <CheckIcon />
                                    </span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6">
                        <p className="mb-2.5 text-[11px] font-semibold tracking-[0.16em] text-[#5c5a56] uppercase dark:text-neutral-400">
                            Responsibilities
                        </p>
                        <ul className="flex flex-col gap-2">
                            {cs.myContributions.map((c) => (
                                <li key={c} className="flex items-start gap-2.5 text-[14.5px] text-[#4b4b4b] dark:text-neutral-400">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#101010] dark:bg-neutral-100" />
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6 rounded-2xl bg-[#101010] p-5 text-white dark:bg-neutral-100 dark:text-neutral-900">
                        <p className="mb-1.5 text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase dark:text-neutral-900/60">Outcome</p>
                        <p className="text-[14.5px] leading-relaxed text-white/90 dark:text-neutral-900/90">{cs.outcome}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ------------------------------------------------------------------ */
/*  Carousel                                                            */
/* ------------------------------------------------------------------ */

function ProjectsCarousel() {
    const [index, setIndex] = useState(0);
    const [openProject, setOpenProject] = useState<Project | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const count = PROJECTS.length;

    const carouselRef = useRef<HTMLDivElement>(null);
    const hasAutoSpun = useRef(false);

    const goTo = (i: number) => setIndex((i + count) % count);
    const prev = () => {
        if (isSpinning) return;
        goTo(index - 1);
    };
    const next = () => {
        if (isSpinning) return;
        goTo(index + 1);
    };

    // Auto-spin once, right-to-left, all the way back around to the first
    // project, then stop and hand control back to the user.
    useEffect(() => {
        const el = carouselRef.current;
        if (!el || count <= 1) return;

        const SPIN_STEP_MS = 240;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting || hasAutoSpun.current) return;

                    hasAutoSpun.current = true;
                    setIsSpinning(true);

                    let ticks = 0;
                    const spinInterval = setInterval(() => {
                        ticks += 1;
                        setIndex((prevIndex) => (prevIndex + 1) % count);

                        if (ticks >= count) {
                            clearInterval(spinInterval);
                            setIsSpinning(false);
                        }
                    }, SPIN_STEP_MS);
                });
            },
            { threshold: 0.4 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [count]);

    return (
        <div ref={carouselRef} className="relative mt-8 select-none">
            <div className="relative mx-auto flex h-[560px] max-w-[1100px] items-center justify-center overflow-hidden px-[8vw] md:h-[600px] md:px-0">
                {PROJECTS.map((project, i) => {
                    let offset = i - index;
                    if (offset > count / 2) offset -= count;
                    if (offset < -count / 2) offset += count;

                    const isActive = offset === 0;
                    const isNeighbor = Math.abs(offset) === 1;

                    const translateX = offset * 92;
                    const scale = isActive ? 1 : 0.9;
                    const opacity = isActive ? 1 : isNeighbor ? 0.55 : 0;
                    const zIndex = isActive ? 10 : isNeighbor ? 5 : 1;

                    return (
                        <div
                            key={project.title}
                            className={`absolute w-[78%] md:w-[62%] ${
                                isSpinning ? 'transition-all duration-[320ms] ease-linear' : 'transition-all duration-500 ease-out'
                            }`}
                            onClick={!isActive && isNeighbor && !isSpinning ? () => goTo(i) : undefined}
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
                                {isNeighbor && (
                                    <div
                                        className={`pointer-events-none absolute inset-0 rounded-[24px] ${
                                            offset < 0 ? 'carousel-edge-fade-left' : 'carousel-edge-fade-right'
                                        }`}
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={prev}
                disabled={isSpinning}
                aria-label="Previous project"
                className="absolute top-1/2 left-2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--hair)] bg-white text-[#101010] shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#F3F1EE] disabled:pointer-events-none disabled:opacity-40 md:left-6 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
                <ChevronLeftIcon />
            </button>
            <button
                type="button"
                onClick={next}
                disabled={isSpinning}
                aria-label="Next project"
                className="absolute top-1/2 right-2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--hair)] bg-white text-[#101010] shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#F3F1EE] disabled:pointer-events-none disabled:opacity-40 md:right-6 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
                <ChevronRightIcon />
            </button>

            <div className="mt-6 flex items-center justify-center gap-2">
                {PROJECTS.map((project, i) => (
                    <button
                        key={project.title}
                        type="button"
                        aria-label={`Go to ${project.title}`}
                        onClick={() => !isSpinning && goTo(i)}
                        disabled={isSpinning}
                        className="h-2 rounded-full transition-all disabled:pointer-events-none"
                        style={{ width: i === index ? '22px' : '8px', backgroundColor: i === index ? 'var(--ink)' : 'var(--hair)' }}
                    />
                ))}
            </div>
            <ProjectCaseStudyDialog project={openProject} open={!!openProject} onOpenChange={(v) => !v && setOpenProject(null)} />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */

export function ProjectsSection({ sectionRef }: { sectionRef: (el: HTMLElement | null) => void }) {
    return (
        <section id="projects" ref={sectionRef} className="section" style={{ padding: '7rem 0 5rem' }}>
            <div style={{ padding: '0 6vw' }}>
                <p className="eyebrow">Projects</p>
                <h2 className="h2">Selected work.</h2>
                <p className="section-intro">
                    A handful of recent builds, taken from first commit to something real people use — spanning messaging, machine learning, and
                    role-based operations tools.
                </p>
            </div>
            <ProjectsCarousel />
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Styles this section needs                                          */
/* ------------------------------------------------------------------ */
/*
   .carousel-edge-fade-left {
       background: linear-gradient(to left, transparent 55%, var(--bg) 100%);
       opacity: 0.85;
   }
   .carousel-edge-fade-right {
       background: linear-gradient(to right, transparent 55%, var(--bg) 100%);
       opacity: 0.85;
   }

   @media (max-width: 1024px) {
       .case-study-sheet {
           position: fixed !important;
           left: 0 !important;
           right: 0 !important;
           top: max(28px, env(safe-area-inset-top)) !important;
           bottom: env(safe-area-inset-bottom, 0px) !important;
           width: 100% !important;
           max-width: none !important;
           max-height: none !important;
           margin: 0 !important;
           transform: translateY(var(--sheet-drag-y, 0)) !important;
           translate: none !important;
           scale: none !important;
           rotate: none !important;
           animation: none !important;
           overscroll-contain: contain;
           border-bottom-left-radius: 0 !important;
           border-bottom-right-radius: 0 !important;
           border-top-left-radius: 1.5rem !important;
           border-top-right-radius: 1.5rem !important;
           border-left: none !important;
           border-right: none !important;
           z-index: 300 !important;
           transition: transform 0.32s cubic-bezier(.32,.72,0,1);
       }
       .sheet-drag-handle { position: sticky !important; top: 0 !important; z-index: 10 !important; }
   }
   .sheet-drag-handle { display: none; }
   @media (max-width: 1024px) {
       .sheet-drag-handle {
           display: flex;
           justify-content: center;
           align-items: center;
           padding: 0.625rem 0 0.25rem;
           touch-action: none;
           cursor: grab;
       }
       .sheet-drag-bar {
           width: 2.75rem;
           height: 0.3125rem;
           border-radius: 999px;
           background: rgba(0,0,0,0.18);
       }
       :root.dark .sheet-drag-bar { background: rgba(255,255,255,0.25); }
   }
   @media (max-width: 1024px) {
       body.sheet-open { overflow: hidden; }
   }
   body.sheet-open .liquid-dock,
   body.sheet-open .chat-widget-mobile-anchor,
   body.sheet-open .glass-toggle-dock {
       display: none;
   }
*/