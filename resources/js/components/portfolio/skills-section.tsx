import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

const ArrowUpRightIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M8 7h9v9" />
    </svg>
);
const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

type Work = {
    title: string;
    desc: string;
    type: string; // kept in data, no longer rendered as a badge
    tags: string[];
    thumbnail: string; // path inside /public (also used as the case study cover)
    role: string;
    duration: string;
    team: string;
    overview: string;
    problem: string;
    features: string[];
    myContributions: string[];
    outcome: string;
};

// Order matters: 4 paired cards, then DogLens alone (centered) on desktop.
const WORKS: Work[] = [
    {
        title: 'Gym Membership System',
        desc: 'Membership platform with plan payments, attendance check-ins, and member stats like workout streaks.',
        type: 'Freelance Project', // TODO: confirm
        tags: ['Laravel', 'React', 'Inertia.js', 'TypeScript', 'Role-Based Access'],
        thumbnail: '/gymrat.png', // TODO: point to your actual thumbnail filename
        role: 'Fullstack Developer', // TODO: confirm
        duration: '2 weeks', // TODO: confirm
        team: 'Solo', // TODO: confirm
        overview:
            'A membership management system for a gym, covering plan subscriptions, payments, and daily attendance. Members can follow their progress through stats like check-in streaks, while staff and admins manage plans, payments, and members from role-based dashboards.',
        problem:
            'Gym memberships are often tracked with paper logbooks and spreadsheets, which makes it hard to know who has paid, whose plan has expired, or how often members actually show up. Owners had no clear view of payments or attendance, and members had no way to check their own status.',
        features: [
            'Membership plans with payment tracking and status per member',
            'Attendance logging for every gym visit',
            'Member stats including attendance history and check-in streaks',
            'Role-based access with dashboards scoped to each user type',
        ],
        myContributions: [
            'Designed and built the Laravel backend, including role-based route gates and permission logic',
            'Built the React + Inertia.js frontend with a shared, reusable component system',
            'Implemented plan, payment, and membership status logic',
            'Built the attendance tracking and streak calculations behind the member stats',
        ],
        outcome:
            'The gym moved from manual logbooks to a single system where plans, payments, and attendance are tracked in one place, giving owners clear visibility and members a reason to keep showing up.',
    },
    {
        title: 'Nexus - Real-Time Messaging Platform',
        desc: 'Real-time messaging with AI-powered Smart Reply that suggests context-aware responses before you start typing.',
        type: 'Personal Project',
        tags: ['Laravel', 'Inertia.js', 'React', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
        thumbnail: '/nexus.png',
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
    {
        title: 'Campus Asset Tracker',
        desc: 'Asset and maintenance management with three role-based portals: IT Admin, Technician, and Faculty/Staff.',
        type: 'Freelance Project',
        tags: ['Laravel', 'React', 'Inertia.js', 'TypeScript', 'Role-Based Access'],
        thumbnail: '/campusassets.png',
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
    {
        title: 'Dental Appointment System',
        desc: 'Booking platform for a dental clinic, with public scheduling and role-based dashboards for staff and admins.',
        type: 'Freelance Project',
        tags: ['Laravel', 'React', 'TypeScript', 'Sanctum Auth', 'TanStack Query'],
        thumbnail: '/brightsmile.png',
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
    {
        title: 'DogLens - Smart Pet Breed Identification',
        desc: 'Self-trained deep learning system that identifies dog breeds from photos and improves through an admin-driven retraining loop.',
        type: 'Capstone Project',
        tags: ['React', 'TypeScript', 'React Native (Expo)', 'Laravel', 'FastAPI', 'Python'],
        thumbnail: '/doglens.png',
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
];

/* ------------------------------------------------------------------ */
/*  Card                                                                */
/* ------------------------------------------------------------------ */

function WorkCard({ work, centerLast, onOpen }: { work: Work; centerLast: boolean; onOpen: () => void }) {
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            aria-label={`View case study: ${work.title}`}
            onClick={onOpen}
            onKeyDown={handleKeyDown}
            className={[
                'group cursor-pointer overflow-hidden rounded-md border border-[var(--hair)] bg-[#F7F7F7] transition-shadow duration-300 outline-none hover:shadow-[0_14px_32px_rgba(0,0,0,0.08)] focus-visible:ring-2 focus-visible:ring-[#101010] dark:bg-neutral-900 dark:focus-visible:ring-neutral-100',
                // lone last card: span both columns but keep the width of a single column
                centerLast ? 'md:col-span-2 md:mx-auto md:w-[calc(50%-0.75rem)]' : '',
            ].join(' ')}
        >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#ECECEC] dark:bg-neutral-800">
                <img
                    src={work.thumbnail}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <span className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full bg-white text-[#101010] opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                    <ArrowUpRightIcon />
                </span>
            </div>

            <div className="flex flex-col gap-3 p-4 sm:p-6">
                <h3 className="text-[17px] leading-snug font-medium text-[#101010] sm:text-[20px] dark:text-neutral-50">{work.title}</h3>
                <p className="line-clamp-2 text-[14px] leading-relaxed text-[#5c5a56] sm:text-[14.5px] dark:text-neutral-400">{work.desc}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                    {work.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full border border-[var(--hair)] bg-white px-3 py-1 text-[12px] font-medium text-[#101010] sm:px-3.5 sm:py-1.5 sm:text-[13px] dark:bg-neutral-800 dark:text-neutral-100"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Case study dialog / mobile bottom sheet                            */
/* ------------------------------------------------------------------ */

function CaseStudyDialog({ work, open, onOpenChange }: { work: Work | null; open: boolean; onOpenChange: (v: boolean) => void }) {
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);

    useEffect(() => {
        document.body.classList.toggle('sheet-open', open);
        return () => document.body.classList.remove('sheet-open');
    }, [open]);

    if (!work) return null;

    const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
        if (window.innerWidth > 1024) return;
        setIsDragging(true);
        dragStartY.current = e.clientY;
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
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

    const dragStyle = dragY || isDragging ? ({ '--sheet-drag-y': `${dragY}px`, transition: 'none' } as CSSProperties) : undefined;

    const label = 'text-[11px] font-semibold tracking-[0.16em] text-[#5c5a56] uppercase dark:text-neutral-400';

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
                    <img src={work.thumbnail} alt="" className="h-full w-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                </div>

                <div className="px-6 py-6 sm:px-8 sm:py-8">
                    <DialogHeader className="items-start text-left">
                        <DialogTitle className="text-[1.5rem] leading-tight font-semibold tracking-tight text-[#101010] sm:text-[1.75rem] dark:text-neutral-50">
                            {work.title}
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-[15px] leading-relaxed text-[#4b4b4b] dark:text-neutral-400">
                            {work.overview}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-[var(--hair)] bg-[#FAF9F7] p-4 dark:bg-neutral-900">
                        {[
                            ['Role', work.role],
                            ['Duration', work.duration],
                            ['Team', work.team],
                        ].map(([k, v]) => (
                            <div key={k}>
                                <p className="text-[10px] font-semibold tracking-[0.12em] text-[#5c5a56] uppercase dark:text-neutral-400">{k}</p>
                                <p className="mt-1 text-sm font-medium text-[#101010] dark:text-neutral-100">{v}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <p className={`mb-2.5 ${label}`}>Tech Stack</p>
                        <div className="flex flex-wrap gap-2">
                            {work.tags.map((t) => (
                                <span key={t} className="tag">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className={`mb-2 ${label}`}>The Problem</p>
                        <p className="text-[14.5px] leading-relaxed text-[#4b4b4b] dark:text-neutral-400">{work.problem}</p>
                    </div>

                    <div className="mt-6">
                        <p className={`mb-2.5 ${label}`}>Key Features</p>
                        <ul className="flex flex-col gap-2">
                            {work.features.map((f) => (
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
                        <p className={`mb-2.5 ${label}`}>Responsibilities</p>
                        <ul className="flex flex-col gap-2">
                            {work.myContributions.map((c) => (
                                <li key={c} className="flex items-start gap-2.5 text-[14.5px] text-[#4b4b4b] dark:text-neutral-400">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#101010] dark:bg-neutral-100" />
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-6 rounded-2xl bg-[#101010] p-5 text-white dark:bg-neutral-100 dark:text-neutral-900">
                        <p className="mb-1.5 text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase dark:text-neutral-900/60">Outcome</p>
                        <p className="text-[14.5px] leading-relaxed text-white/90 dark:text-neutral-900/90">{work.outcome}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */

// Same name and props as the old skills section so the parent page keeps working.
// skillsRef and contactRef are still accepted but unused (those cards were removed).
type SkillsSectionProps = {
    sectionRef: (el: HTMLElement | null) => void; // outer section (nav target)
    skillsRef?: (el: HTMLElement | null) => void; // unused
    contactRef?: (el: HTMLElement | null) => void; // unused
};

// Header height — kept smaller than before. The holder reserves this exact
// space in the flow while the header itself is pinned (position: fixed).
const HEADER_H = 'h-[76px] sm:h-[104px] lg:h-[120px]';
// Same values as plain numbers, used by the scroll listener and by the
// scroll-margin-top classes below so nav-click landing always clears the
// pinned header instead of tucking the first card row underneath it.
const HEADER_H_PX = { base: 76, sm: 104, lg: 120 };
// Extra breathing room added on top of the header height for scroll-margin,
// so a fast fling/overscroll still stops with clear air above the first
// row of cards instead of landing them flush against the header edge.
const SCROLL_BUFFER_PX = 32;

export function SkillsSection({ sectionRef }: SkillsSectionProps) {
    const [openWork, setOpenWork] = useState<Work | null>(null);
    const lastIsAlone = WORKS.length % 2 === 1;

    const innerRef = useRef<HTMLElement | null>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    /*
     * Pin the header while this section is on screen.
     * `position: sticky` silently fails when any ancestor has overflow hidden/auto, so this
     * uses `position: fixed` driven by scroll position instead. It only pins while the section
     * covers the top of the viewport, and slides out as the section's bottom edge arrives.
     * The scroll listener uses capture so it also works if the page scrolls inside a container.
     */
    useLayoutEffect(() => {
        let raf = 0;

        const update = () => {
            raf = 0;
            const section = innerRef.current;
            const holder = holderRef.current;
            const header = headerRef.current;
            if (!section || !holder || !header) return;

            const h = holder.offsetHeight;
            const rect = section.getBoundingClientRect();
            const w = window.innerWidth;
            const inset = w >= 1024 ? '40px' : w >= 640 ? '32px' : '16px';

            if (rect.top <= 0 && rect.bottom > 0) {
                header.style.position = 'fixed';
                header.style.left = inset;
                header.style.right = inset;
                header.style.height = `${h}px`;
                header.style.top = `${Math.min(0, rect.bottom - h)}px`;
            } else {
                header.style.position = 'absolute';
                header.style.left = '';
                header.style.right = '';
                header.style.height = '';
                header.style.top = '0px';
            }
        };
        const schedule = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', schedule, { passive: true, capture: true });
        window.addEventListener('resize', schedule);
        return () => {
            window.removeEventListener('scroll', schedule, true);
            window.removeEventListener('resize', schedule);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        // id="about" is kept from the old skills section so existing nav links still land here.
        // scroll-mt-* matches the pinned header height so scrollIntoView({block:'start'}) always
        // stops with the header flush at the top and the first card row fully visible below it —
        // instead of landing a few pixels off and making the top row feel like it flashes by.
        <section
            id="about"
            ref={(el) => {
                innerRef.current = el;
                sectionRef(el);
            }}
            className={`relative scroll-mt-[${HEADER_H_PX.base + SCROLL_BUFFER_PX}px] sm:scroll-mt-[${HEADER_H_PX.sm + SCROLL_BUFFER_PX}px] lg:scroll-mt-[${HEADER_H_PX.lg + SCROLL_BUFFER_PX}px]`}
            style={{ scrollMarginTop: HEADER_H_PX.base + SCROLL_BUFFER_PX }}
        >
            {/* Placeholder that keeps the header's space in the layout */}
            <div ref={holderRef} className={`relative w-full ${HEADER_H}`}>
                <div
                    ref={headerRef}
                    className="absolute top-0 right-4 left-4 z-30 h-full bg-[var(--bg)] text-[#101010] sm:right-8 sm:left-8 lg:right-10 lg:left-10 dark:text-neutral-50"
                >
                    <div className="relative flex h-full items-center justify-center overflow-hidden px-4">
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center leading-none font-semibold tracking-tight whitespace-nowrap select-none"
                            style={{
                                fontSize: 'clamp(2.25rem, 11vw, 7.5rem)',
                                // 6% of the current text color, so it adapts to light and dark mode
                                color: 'color-mix(in srgb, currentColor 6%, transparent)',
                            }}
                        >
                            PORTFOLIO
                        </span>
                        <h2 className="relative text-[clamp(1.15rem,3.6vw,2.1rem)] leading-none font-semibold tracking-tight uppercase">
                            Selected Work
                        </h2>
                    </div>
                    {/* soft fade so cards dissolve under the header instead of being cut off */}
                    <div className="pointer-events-none absolute inset-x-0 top-full h-6 bg-gradient-to-b from-[var(--bg)] to-transparent" />
                </div>
            </div>

            <div className="relative z-0 mx-auto max-w-[1100px] px-4 pt-14 pb-24 sm:px-6 sm:pt-16 md:px-8 lg:pt-20">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {WORKS.map((work, i) => (
                        <WorkCard key={work.title} work={work} centerLast={lastIsAlone && i === WORKS.length - 1} onOpen={() => setOpenWork(work)} />
                    ))}
                </div>
            </div>

            <CaseStudyDialog work={openWork} open={!!openWork} onOpenChange={(v) => !v && setOpenWork(null)} />
        </section>
    );
}

/* ------------------------------------------------------------------ */
/*  Styles this section needs                                          */
/* ------------------------------------------------------------------ */
/*
   The case study sheet uses the same CSS as your old Projects section:
   .case-study-sheet, .sheet-drag-handle, .sheet-drag-bar, body.sheet-open, and .tag.
   Keep those rules in your global stylesheet. If you delete the old ProjectsSection file,
   do NOT delete that CSS (it lives in your stylesheet, not in the component).
*/
