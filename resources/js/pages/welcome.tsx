import ChatWidget from '@/components/chat-widget';
import DarkModeToggle from '@/components/dark-mode-toggle';
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
    width: 21,
    height: 21,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor', // was 'white'
    strokeWidth: 1.8,
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

const LinkedInIcon = () => (
    <svg {...iconProps} width={18} height={18}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7.5 9.5v7M7.5 6.8v.01" />
        <path d="M11.5 16.5v-4.2c0-1.3 1-2.3 2.3-2.3s2.2 1 2.2 2.3v4.2" />
        <path d="M11.5 9.5v7" />
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
];

function LiquidDock({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
    const glassRef = useRef<HTMLDivElement | null>(null);
    const [hovered, setHovered] = useState<number | null>(null);
    const [onDark, setOnDark] = useState(false); // NEW

    // NEW — watches scroll position vs. any [data-nav-theme="dark"] section
    useEffect(() => {
        const zones = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-theme="dark"]'));
        if (zones.length === 0) return;

        const check = () => {
            const dockY = window.innerHeight - 56; // approx vertical center of the floating dock
            const isDark = zones.some((el) => {
                const r = el.getBoundingClientRect();
                return r.top <= dockY && r.bottom >= dockY;
            });
            setOnDark(isDark);
        };

        check();
        window.addEventListener('scroll', check, { passive: true });
        window.addEventListener('resize', check);
        return () => {
            window.removeEventListener('scroll', check);
            window.removeEventListener('resize', check);
        };
    }, []);

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
                                liquid-doc
                                aria-current={isActive}
                            >
                                <Icon />
                                <span className="dock-tooltip">{item.label}</span>
                                <span className="dock-label" aria-hidden="true">
                                    {item.label}
                                </span>
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
        desc: 'A deep learning system we trained ourselves to identify dog breeds from photos, giving instant breed insights. An admin portal supports continuous learning by correcting low-confidence scans, which are fed back into the dataset to retrain and improve the model.',
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

const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

function ProjectCaseStudyDialog({ project, open, onOpenChange }: { project: Project | null; open: boolean; onOpenChange: (v: boolean) => void }) {
    // Drag-to-dismiss state for the mobile bottom-sheet behavior. These hooks must
    // run on every render (including while `project` is null), so they're declared
    // before the early-return below.
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);

    // While the sheet is open on mobile, hide the floating dock/chat widget so
    // nothing overlaps the sheet — mirrors how a native bottom sheet takes over.
    useEffect(() => {
        document.body.classList.toggle('sheet-open', open);
        return () => document.body.classList.remove('sheet-open');
    }, [open]);

    if (!project) return null;
    const cs = project.caseStudy;

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (window.innerWidth > 1024) return; // only a bottom sheet on mobile
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
        if (dragY > 110) {
            onOpenChange(false); // dragged past the threshold — swipe to dismiss
        }
        setDragY(0);
    };

    // On mobile the sheet is pinned to the bottom via CSS (`.case-study-sheet`).
    // That CSS rule sets `transform: translateY(var(--sheet-drag-y, 0)) !important`
    // to clear Radix's centering transform AND consume the live drag offset via
    // the --sheet-drag-y CSS variable — which this inline style sets. When idle
    // we emit no inline style so the CSS default (translateY(0)) keeps the sheet pinned.
    const dragStyle = dragY || isDragging ? ({ '--sheet-drag-y': `${dragY}px`, transition: 'none' } as React.CSSProperties) : undefined;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="case-study-sheet max-h-[88vh] overflow-y-auto rounded-[24px] p-0 sm:max-w-[720px]" style={dragStyle}>
                {/* Drag handle — swipe down from here to close on mobile */}
                <div
                    className="sheet-drag-handle"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    <span className="sheet-drag-bar" aria-hidden="true" />
                </div>
                {/* Header image strip */}
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

                    {/* Meta row */}
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

                    {/* Tech stack */}
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

                    {/* Problem */}
                    <div className="mt-6">
                        <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-[#5c5a56] uppercase dark:text-neutral-400">The Problem</p>
                        <p className="text-[14.5px] leading-relaxed text-[#4b4b4b] dark:text-neutral-400">{cs.problem}</p>
                    </div>

                    {/* Features */}
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

                    {/* Contributions */}
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

                    {/* Outcome */}
                    <div className="mt-6 rounded-2xl bg-[#101010] p-5 text-white dark:bg-neutral-100 dark:text-neutral-900">
                        <p className="mb-1.5 text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase dark:text-neutral-900/60">Outcome</p>
                        <p className="text-[14.5px] leading-relaxed text-white/90 dark:text-neutral-900/90">{cs.outcome}</p>
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
        <div className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--hair)] bg-white dark:bg-neutral-900">
            {/* Stacked screenshot mockups */}
            <div className="relative h-[260px] w-full overflow-hidden bg-[#F3EFE9] md:h-[320px] dark:bg-neutral-800">
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

            {/* Nav arrows */}
            <button
                type="button"
                onClick={prev}
                aria-label="Previous project"
                className="absolute top-1/2 left-2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--hair)] bg-white text-[#101010] shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#F3F1EE] md:left-6 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
                <ChevronLeftIcon />
            </button>
            <button
                type="button"
                onClick={next}
                aria-label="Next project"
                className="absolute top-1/2 right-2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--hair)] bg-white text-[#101010] shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#F3F1EE] md:right-6 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
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
                            backgroundColor: i === index ? 'var(--ink)' : 'var(--hair)',
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

    const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

    const handleContactClick = async (e: React.MouseEvent, item: { label: string; href: string; value: string }) => {
        // Only intercept Email — let Messenger/Phone behave as normal links
        if (item.label !== 'Email') return;

        e.preventDefault();
        const email = item.value;

        try {
            await navigator.clipboard.writeText(email);
            setCopiedLabel(item.label);
            setTimeout(() => setCopiedLabel(null), 2000);
        } catch {
            // Clipboard blocked — fall back to mailto
            window.location.href = item.href;
        }
    };
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
            value: 'clapisdave8@gmail.com',
            href: 'https://mail.google.com/mail/?view=cm&fs=1&to=clapisdave8@gmail.com&su=Portfolio%20Inquiry',
            icon: MailIcon,
        },
        {
            label: 'Chat on Messenger',
            value: 'm.me/dave.clapis',
            href: 'https://web.facebook.com/dave.michael.beltran.clapis',
            icon: ChatIcon,
        },
        {
            label: 'LinkedIn',
            value: 'linkedin.com/in/dave-michael-clapis',
            href: 'https://www.linkedin.com/in/dave-michael-clapis-932444374/',
            icon: LinkedInIcon,
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
                    --dock-space-mobile: 6rem;/* space the fixed bottom dock reserves */
                }
                :root.dark {
                    --bg: #0a0a0a;
                    --ink: #f5f5f5;
                    --muted: #a1a1a1;
                    --hair: rgba(255,255,255,0.12);
                }
                *, *::before, *::after { box-sizing: border-box; }
                .portfolio-root {
                    background: var(--bg);
                    color: var(--ink);
                    min-height: 100vh;
                    width: 100%;
                    overflow-x: hidden;
                    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
                    transition: background-color .3s ease, color .3s ease;
                }

                /* ---------- Liquid glass dock — always bottom-center ---------- */
                .liquid-dock {
                    position: fixed;
                    z-index: 50;
                    left: 0;
                    right: 0;
                    top: auto;
                    bottom: calc(16px + env(safe-area-inset-bottom));
                    display: flex;
                    justify-content: center;
                    padding: 0 1rem;
                }
                .liquid-dock-glass {
                    --mx: 50%;
                    --my: 0%;
                    --glow: 0;
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    width: auto;
                    max-width: calc(100vw - 2rem);
                    padding: 0.5rem 0.625rem;
                    gap: 0;

                    border-radius: 1.875rem;
                    background: rgba(255,255,255,0.28);
                    border: 1px solid rgba(255,255,255,0.5);
                    backdrop-filter: blur(28px) saturate(180%);
                    -webkit-backdrop-filter: blur(28px) saturate(180%);
                    box-shadow:
                        0 22px 50px rgba(0,0,0,0.14),
                        0 4px 14px rgba(0,0,0,0.07),
                        inset 0 1px 0 rgba(255,255,255,0.8);
                    overflow: visible;
                    transition: background-color .3s ease, border-color .3s ease;
                }
                @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
                    .liquid-dock-glass {
                        background: rgba(250,250,250,0.92);
                    }
                    :root.dark .liquid-dock-glass {
                        background: rgba(30,30,30,0.92);
                    }
                }
                :root.dark .liquid-dock-glass {
                    background: rgba(255,255,255,0.10);
                    border: 1px solid rgba(255,255,255,0.18);
                    box-shadow:
                        0 22px 50px rgba(0,0,0,0.5),
                        0 4px 14px rgba(0,0,0,0.3),
                        inset 0 1px 0 rgba(255,255,255,0.22);
                }
                .liquid-dock-glass::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 1.875rem;
                    pointer-events: none;
                    opacity: var(--glow);
                    transition: opacity .35s ease;
                    background: radial-gradient(110px 110px at var(--mx) var(--my), rgba(255,255,255,0.35), transparent 65%);
                }
                :root.dark .liquid-dock-glass::before {
                    background: radial-gradient(110px 110px at var(--mx) var(--my), rgba(255,255,255,0.18), transparent 65%);
                }
                .liquid-dock-glass::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 10%;
                    right: 10%;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
                    pointer-events: none;
                }
                :root.dark .liquid-dock-glass::after {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                }
                .dock-group {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    gap: 0.125rem;
                }
                .dock-item {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.25rem;
                    width: auto;
                    height: auto;
                    min-width: 3.5rem;
                    padding: 0.375rem 0.625rem;
                    border-radius: 1.125rem;
                    background: transparent;
                    border: none;
                    margin-left: 1rem;
                    color: #4b4b4b;
                    cursor: pointer;
                    transition: transform .4s cubic-bezier(.34,1.56,.64,1),
                                background-color .3s ease, color .3s ease;
                }
                :root.dark .dock-item { color: #a1a1a1; }
                .dock-item:hover { background: transparent; }
                .dock-item svg {
                    width: 22px;
                    height: 22px;
                }
                /* line ~1099 */
.dock-item.active {
    background: rgba(255, 255, 255, 0.55);
    color: #0A84FF;
    box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
:root.dark .dock-item.active {
    background: rgba(255, 255, 255, 0.16);
    color: #52aaff;
    box-shadow:
        0 4px 16px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
                .dock-item:active {
                    transform: scale(0.96);
                }
                .dock-label {
                    display: block;
                    font-size: 10.5px;
                    font-weight: 500;
                    line-height: 1;
                    letter-spacing: 0.01em;
                    color: #6b6b6b;
                    transition: color .25s ease, font-weight .25s ease;
                }
                :root.dark .dock-label {
                    color: #FFFFFF;
                }
                .dock-item.active .dock-label {
                    color: inherit;
                    font-weight: 600;
                }

                @media (prefers-reduced-motion: reduce) {
                    .dock-item {
                        transition: none;
                    }
                    .dock-item:active {
                        transform: none;
                    }
                }

                @media (max-width: 380px) {
                    .liquid-dock { bottom: 0.875rem; padding: 0 0.75rem; }
                    .liquid-dock-glass { padding: 0.5rem 0.75rem; gap: 0.25rem; }
                    .dock-item { min-width: 3rem; padding: 0.375rem 0.4rem; }
                }

                .nav-on-dark .liquid-dock-glass {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.22);
}
.nav-on-dark .dock-item {
    color: rgba(255, 255, 255, 0.75);
}
.nav-on-dark .dock-label {
    color: rgba(255, 255, 255, 0.6);
}
.nav-on-dark .dock-item.active {
    color: #66b3ff;
    background: rgba(255, 255, 255, 0.22);
}

                /* ---------- Layout / sections ---------- */
                .portfolio-main {
                    margin-left: 0;
                    min-width: 0;
                    padding-bottom: var(--dock-space-mobile);
                }
                .section {
                    min-height: 100vh;
                    padding: 7rem 6vw 5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    border-bottom: 1px solid var(--hair);
                    opacity: 0;
                    transform: translateY(18px);
                    transition: opacity .7s ease, transform .7s ease;
                }
                .section.in-view { opacity: 1; transform: translateY(0); }
                @media (max-width: 820px) {
                    .section { padding: 5.5rem 5.5vw 3.5rem; min-height: auto; }
                }
                @media (max-width: 480px) {
                    .section { padding: 4.5rem 5vw 3rem; }
                }
                /* Home is the only section that should hug the very top of the
                   viewport — the dark-mode toggle floats over its cover image
                   as a pure overlay, so no reserved top padding is needed for it. */
                .home-section {
                    justify-content: flex-start;
                    padding-top: 7rem;
                }
                @media (max-width: 820px) {
                    .home-section { padding-top: 0; }
                }
                @media (max-width: 480px) {
                    .home-section { padding-top: 0; }
                }

                /* ---------- Home cover — Facebook-profile style on mobile ----------
                   Bleeds edge-to-edge (no side gutters, no rounded corners) by
                   cancelling out the section's own horizontal padding. On tablet/
                   desktop it stays a normal rounded, padded panel. */
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

                .dock-tooltip {
    display: none;
}
                @media (max-width: 480px) {
                    .home-cover {
                        margin-left: -5vw;
                        margin-right: -5vw;
                        width: calc(100% + 10vw);
                        height: 170px;
                    }
                }
                @media (min-width: 821px) and (max-width: 1023px) {
                    .home-cover { height: 220px; }
                }
                @media (min-width: 1024px) {
                    .home-cover { height: 340px; border-radius: 2rem; }
                }

                .eyebrow {
                    font-size: 0.75rem;
                    letter-spacing: .16em;
                    text-transform: uppercase;
                    color: var(--muted);
                    margin-bottom: 1.1rem;
                }
                .h1 {
                    font-size: clamp(2.2rem, 6vw, 5rem);
                    line-height: 1.05;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                }
                .h2 {
                    font-size: clamp(1.6rem, 3.4vw, 2.6rem);
                    font-weight: 600;
                    letter-spacing: -0.01em;
                    margin-bottom: 0.75rem;
                }
                .section-intro {
                    color: var(--muted);
                    font-size: clamp(0.9rem, 1.2vw, 1rem);
                    max-width: 56ch;
                    line-height: 1.6;
                    margin-bottom: 1.75rem;
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
                :root.dark .card:hover { background: rgba(255,255,255,0.03); }
                .card-title { font-size: 1.15rem; font-weight: 600; margin-bottom: .6rem; color: var(--ink); }
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
                .skill-name { font-size: 1.05rem; font-weight: 500; color: var(--ink); }
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
                    padding: 2rem 6vw calc(2rem + var(--dock-space-mobile));
                    text-align: center;
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
                    color: var(--ink);
                    font-size: 13px;
                    font-weight: 600;
                    letter-spacing: .01em;
                }
                :root.dark .honor-badge {
                    background: rgba(255,255,255,0.08);
                }

                /* Carousel neighbor edge fade, theme-aware */
                .carousel-edge-fade-left {
                    background: linear-gradient(to left, transparent 55%, var(--bg) 100%);
                    opacity: 0.85;
                }
                .carousel-edge-fade-right {
                    background: linear-gradient(to right, transparent 55%, var(--bg) 100%);
                    opacity: 0.85;
                }

                /* ---------- Floating liquid glass dark mode toggle ---------- */
                .glass-toggle-dock {
                    position: fixed;
                    top: 1.375rem;
                    right: 1.375rem;
                    z-index: 60;
                }

               .glass-toggle-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 1.125rem;

    /* Light mode: dark pill */
    background: #101010;
    border: 1px solid rgba(16,16,16,0.1);
    box-shadow:
        0 18px 44px rgba(0, 0, 0, 0.16),
        0 2px 8px rgba(0, 0, 0, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    color: #ffffff;
    cursor: pointer;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s ease, color 0.3s ease;
}

.glass-toggle-btn:hover {
    transform: scale(1.06);
    background: #1a1a1a;
}

/* Dark mode: white pill */
:root.dark .glass-toggle-btn,
.glass-toggle-btn[data-state='on'] {
    background: #ffffff;
    border-color: rgba(16,16,16,0.1);
    color: #101010;
    box-shadow:
        0 18px 44px rgba(0, 0, 0, 0.4),
        0 2px 8px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
}
:root.dark .glass-toggle-btn:hover,
.glass-toggle-btn[data-state='on']:hover {
    background: #f5f5f5;
}

                .glass-toggle-icon {
                    position: absolute;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transform: scale(0.5) rotate(-90deg);
                    transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .glass-toggle-icon[data-active='true'] {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                }

                @media (max-width: 820px) {
                    .glass-toggle-dock {
                        top: 1rem;
                        right: 1rem;
                    }
                    .glass-toggle-btn {
                        width: 2.875rem;
                        height: 2.875rem;
                        border-radius: 1rem;
                    }
                }

                                /* ---------- Case study dialog → mobile bottom sheet ----------
                   On screens <= 1024px the case study opens as a native-style
                   bottom sheet: a ~28px top gap (safe-area aware), small side
                   margins, rounded top corners, a flat bottom edge, and smooth
                   internal scrolling. The drag handle stays pinned to the top of
                   the sheet so swipe-down-to-dismiss stays usable while the
                   content scrolls. */

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
}

                    /* Keep the swipe-to-dismiss handle pinned to the top of the sheet
                       while the case-study content scrolls beneath it. */
                    .sheet-drag-handle {
                        position: sticky !important;
                        top: 0 !important;
                        z-index: 10 !important;
                    }
                }
                .sheet-drag-handle {
                    display: none;
                }
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

                /* While the sheet is open on mobile, lock the page behind it so only
                   the sheet's own content can scroll (desktop is left untouched). */
                @media (max-width: 1024px) {
                    body.sheet-open {
                        overflow: hidden;
                    }
                }

                /* While the sheet is open, nothing else should float over it — applies
                   at every breakpoint now since the dock/toggle are always fixed-position. */
                body.sheet-open .liquid-dock,
                body.sheet-open .chat-widget-mobile-anchor,
                body.sheet-open .glass-toggle-dock {
                    display: none;
                }

                /* ---------- Chat widget: pinned to the true bottom edge from the
                   start, and stacked ABOVE the dock/toggle so that whenever the
                   widget itself renders an open panel spanning the bottom of the
                   screen, the dock is visually covered rather than poking out
                   underneath it. Previously this reserved space above the dock
                   (leaving a gap the dock rendered into) and sat at a z-index
                   only just above the dock — both of which are why the nav was
                   visible "at the back" while the chat panel was open. Giving
                   this wrapper a transform makes it a new containing block for
                   any position:fixed elements ChatWidget renders internally, so
                   they're still constrained to (and painted within) this box. ---------- */
                .chat-widget-mobile-anchor {
                    display: block;
                    position: fixed;
                    inset: 0;
                    transform: translateZ(0);
                    pointer-events: none;
                    z-index: 999;
                }
                    @media (max-width: 820px) {
    .chat-widget-mobile-anchor {
        z-index: 999;
        pointer-events: none;
    }

    /*
     * Move the ChatWidget's floating button above the bottom dock.
     * Adjust 6.8rem if you want more/less space between them.
     */
    .chat-widget-mobile-anchor > .chat-widget-fab {
        bottom: calc(var(--dock-space-mobile) + 0.25rem) !important;
    }
}
                .chat-widget-mobile-anchor > * {
                    pointer-events: auto;
                }

                /* ---------- HERO — oversized sliding name behind photo ---------- */
                /* line ~1511 — base rule, add min-height */
/* line ~1511 */
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
               /* line ~1536 */
.hero-marquee-text {
    flex: 0 0 auto;
    font-size: clamp(4.5rem, 22vw, 18.5rem);
    font-weight: 900;                          /* was 800 */
    text-transform: uppercase;
    letter-spacing: -0.03em;
    white-space: nowrap;
    padding-right: 5vw;
    color: transparent;
    -webkit-text-stroke: 2.5px rgba(16,16,16,0.6);  /* was 1.5px / 0.55 */
    opacity: 0.6;
}
:root.dark .hero-marquee-text {
    -webkit-text-stroke: 2.5px rgba(255,255,255,0.5);  /* was 1.5px / 0.45 */
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

    /* keep clear of the bottom-center dock + its safe-area inset on every device */
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

/* line ~1581 */
@media (max-width: 820px) {
    .hero-photo-img {
        width: clamp(220px, 78vw, 360px);   /* was clamp(170px, 52vw, 300px) */
        max-height: 66vh;                    /* was 52vh */
        margin-bottom: calc(var(--dock-space-mobile) + 0.25rem);
    }
}

@media (max-width: 380px) {
    .hero-photo-img {
        width: clamp(200px, 82vw, 300px);   /* was clamp(150px, 60vw, 260px) */
        max-height: 60vh;                    /* was 46vh */
    }
}
                .hero-photo-wrap {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    justify-content: center;
                }
                .hero-photo {
                    width: clamp(210px, 32vw, 440px);
                    aspect-ratio: 3 / 4;
                    border-radius: 28px;
                    overflow: hidden;
                    background: #EFEAE3;
                    box-shadow: 0 30px 70px rgba(0,0,0,0.28), 0 6px 18px rgba(0,0,0,0.12);
                    opacity: 0;
                    transform: translateY(34px);
                    transition: opacity .8s cubic-bezier(.16,1,.3,1) .15s,
                                transform .8s cubic-bezier(.16,1,.3,1) .15s;
                }
                .hero-section.in-view .hero-photo {
                    opacity: 1;
                    transform: translateY(0);
                }
                .hero-photo img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: top;
                }
                :root.dark .hero-photo { background: #262626; }

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

                /* line ~1650 — inside the existing mobile media block, add hero-section override */
@media (max-width: 820px) {
    .hero-section {
    align-items: flex-end;
        min-height: 88vh;
        min-height: 88svh;
    }
    .hero-photo { width: clamp(180px, 58vw, 320px); }
    .hero-caption { bottom: 1.75rem; }

    .hero-marquee-text {
        font-size: clamp(5rem, 27vw, 12rem);
        -webkit-text-stroke: 3px rgba(16,16,16,0.65);
    }
    :root.dark .hero-marquee-text {
        -webkit-text-stroke: 3px rgba(255,255,255,0.55);
    }
}
            `}</style>

            <div className="portfolio-root">
                <LiquidDock active={active} onSelect={scrollTo} />
                <DarkModeToggle />
                <div className="chat-widget-mobile-anchor">
                    <ChatWidget />
                </div>

                <main className="portfolio-main">
                    {/* HOME */}
                    {/* HERO — oversized sliding name behind photo */}
                    <section
                        data-nav-theme="dark"
                        id="hero"
                        ref={(el) => {
                            sectionRefs.current.hero = el;
                        }}
                        className="section hero-section"
                    >
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
                    <section
                        data-nav-theme="dark"
                        id="home"
                        ref={(el) => {
                            sectionRefs.current.home = el;
                        }}
                        className="section home-section"
                    >
                        {/* Cover + avatar wrapper — avatar is absolutely positioned INSIDE this, so it always sits on top */}
                        <div className="relative w-full">
                            <div className="home-cover">
                                <img src="/cover.png" alt="" className="h-full w-full object-cover" />
                            </div>
                        </div>

                        {/* Avatar + name row — side by side at EVERY breakpoint, avatar overlapping
                            the cover bottom-left, name/role/location bottom-aligned next to it.
                            This is the Facebook-profile layout: it was previously flex-col on
                            mobile (avatar stacked above the text), which is why it didn't match. */}
                        <div className="z-10 flex items-end gap-3 px-3 sm:gap-5 sm:px-5 md:gap-8">
                            {/* A clean circular avatar with a simple ring — no nested boxy frames, so it
                                reads as a proper portrait photo rather than a squared-off card. Overlaps
                                the cover, Facebook-profile style, at every breakpoint. */}
                            <div className="-mt-12 shrink-0 sm:-mt-16 md:-mt-20">
                                <div className="h-[84px] w-[84px] overflow-hidden rounded-2xl border-[3px] border-white bg-[#EFEAE3] shadow-[0_10px_26px_rgba(0,0,0,0.18)] sm:h-[150px] sm:w-[150px] sm:border-4 md:h-[200px] md:w-[200px] dark:border-neutral-900 dark:bg-neutral-800">
                                    <img src="/profile2.png" alt="Profile photo" className="h-full w-full object-cover object-top" />
                                </div>
                            </div>

                            {/* Bottom-aligned with the avatar, exactly like the FB reference. */}
                            <div className="mt-3 flex flex-col gap-0.5 pb-1 sm:gap-1 md:mt-0 md:pb-3">
                                <p className="text-xs font-medium text-[#5c5a56] sm:text-sm dark:text-neutral-400">
                                    Fullstack Web Developer / App Developer
                                </p>
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
                            I'm a fullstack developer who loves the moment scattered ideas click into a working product. I graduated with a BS in
                            Computer Science, but most of what I know came from staying up late debugging something that "should have worked" until it
                            did. I'm comfortable across the stack clean, responsive frontends, backed by the logic, databases, and APIs that make
                            everything run. There's real satisfaction in owning a project end to end, from a blank file to something people actually
                            use. I'm currently looking for opportunities to keep growing and work with people who care about doing good work.
                        </p>
                    </section>

                    {/* ABOUT */}
                    <section
                        data-nav-theme="dark"
                        id="about"
                        ref={(el) => {
                            sectionRefs.current.about = el;
                        }}
                        className="section"
                    >
                        <p className="eyebrow">About</p>
                        <h2 className="h2">Stack, experience, education.</h2>
                        <p className="section-intro">
                            A quick look at how I work day to day: the tools I reach for, the roles I've held, where I studied, and the fastest way to
                            reach me if you'd like to talk.
                        </p>

                        {/* Single grid: order-* controls stacking on mobile (Tech Stack → Experience →
                            Education → Get in Touch) while lg:order-* restores the original two-column
                            layout on desktop. This keeps one consistent DOM/grid instead of two separate
                            columns, so ordering can differ per breakpoint without duplicating markup. */}
                        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
                            {/* Tech Stack — first on both mobile and desktop */}
                            <Card
                                id="skills"
                                ref={(el) => {
                                    sectionRefs.current.skills = el;
                                }}
                                className="order-1 gap-4 rounded-[20px] border-[var(--hair)] py-6 shadow-none lg:order-1"
                            >
                                <CardHeader className="px-6">
                                    <CardTitle className="flex items-center gap-2 text-[17px] font-semibold text-[#101010] dark:text-neutral-50">
                                        <LayersIcon />
                                        Tech Stack
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-5 px-6">
                                    {STACK_GROUPS.map((group) => (
                                        <div key={group.label}>
                                            <p className="mb-2.5 text-[11px] font-semibold tracking-[0.16em] text-[#5c5a56] uppercase dark:text-neutral-400">
                                                {group.label}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {group.tools.map(({ name, icon: Icon }) => (
                                                    <span
                                                        key={name}
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-[#101010] px-3 py-1 text-xs font-medium text-[#101010] transition-colors hover:bg-[#101010] hover:text-white dark:border-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-100 dark:hover:text-neutral-900"
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

                            {/* Experience — second on both mobile and desktop */}
                            <Card className="order-2 gap-4 rounded-[20px] border-[var(--hair)] py-6 shadow-none lg:order-2">
                                <CardHeader className="px-6">
                                    <CardTitle className="flex items-center gap-2 text-[17px] font-semibold text-[#101010] dark:text-neutral-50">
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
                                                            ? 'mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#101010] dark:bg-neutral-100'
                                                            : 'mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border border-[#101010] bg-white dark:border-neutral-100 dark:bg-neutral-900'
                                                    }
                                                />
                                                <div className="flex flex-1 items-start justify-between gap-4 border-b border-[var(--hair)] pb-4 last:border-b-0 last:pb-0">
                                                    <div>
                                                        <p className="text-[15px] font-semibold text-[#101010] dark:text-neutral-100">{exp.role}</p>
                                                        <p className="mt-0.5 text-sm text-[#5c5a56] dark:text-neutral-400">{exp.org}</p>
                                                    </div>
                                                    <span className="shrink-0 pt-0.5 text-sm text-[#5c5a56] dark:text-neutral-400">{exp.period}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Education — third on mobile, but bottom-right on desktop (lg:order-4) */}
                            <Card className="order-3 gap-4 rounded-[20px] border-[var(--hair)] py-6 shadow-none lg:order-4">
                                <CardHeader className="px-6">
                                    <CardTitle className="flex items-center gap-2 text-[17px] font-semibold text-[#101010] dark:text-neutral-50">
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
                                                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                                    <p className="text-[15px] font-semibold text-[#101010] dark:text-neutral-100">{edu.program}</p>
                                                    <span className="honor-badge">
                                                        <AwardIcon />
                                                        {edu.honor}
                                                    </span>
                                                </div>
                                                <p className="mt-0.5 text-sm text-[#5c5a56] dark:text-neutral-400">{edu.school}</p>
                                                <p className="mt-0.5 text-sm text-[#5c5a56] dark:text-neutral-400">{edu.period}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Get in Touch — last on mobile (order-4), but bottom-left on desktop (lg:order-3) */}
                            <Card
                                id="contact"
                                ref={(el) => {
                                    sectionRefs.current.contact = el;
                                }}
                                className="order-4 gap-4 rounded-[20px] border-[var(--hair)] py-6 shadow-none lg:order-3"
                            >
                                <CardHeader className="px-6">
                                    <CardTitle className="flex items-center gap-2 text-[17px] font-semibold text-[#101010] dark:text-neutral-50">
                                        <SendMessageIcon />
                                        Get in Touch
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-6">
                                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                        <div>
                                            <p className="text-[15px] leading-relaxed text-[#4b4b4b] dark:text-neutral-400">
                                                Available for UI/UX and WordPress freelance projects, with added support in SEO, Google Search Console
                                                (GSC), Google My Business (GMB), and email campaigns.
                                            </p>
                                        </div>

                                        <div>
                                            <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-[#5c5a56] uppercase dark:text-neutral-400">
                                                Get in touch
                                            </p>
                                            <div className="flex flex-col gap-3">
                                                {CONTACT_POINTS.map((item) => (
                                                    <a
                                                        key={item.label}
                                                        href={item.href}
                                                        target={item.href.startsWith('http') ? '_blank' : undefined}
                                                        rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                                                        className="flex items-center gap-3 rounded-2xl border border-[var(--hair)] px-4 py-3.5 transition-colors hover:bg-[#F8F6F3] dark:hover:bg-neutral-800"
                                                    >
                                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F3F1EE] text-[#101010] dark:bg-neutral-800 dark:text-neutral-100">
                                                            <item.icon />
                                                        </span>
                                                        <div>
                                                            <p className="text-[11px] font-semibold tracking-[0.12em] text-[#5c5a56] uppercase dark:text-neutral-400">
                                                                {item.label}
                                                            </p>
                                                            <p className="text-[15px] font-medium text-[#101010] dark:text-neutral-100">
                                                                {item.value}
                                                            </p>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* PROJECTS */}
                    <section
                        data-nav-theme="dark"
                        id="projects"
                        ref={(el) => {
                            sectionRefs.current.projects = el;
                        }}
                        className="section"
                        style={{ padding: '7rem 0 5rem' }}
                    >
                        <div style={{ padding: '0 6vw' }}>
                            <p className="eyebrow">Projects</p>
                            <h2 className="h2">Selected work.</h2>
                            <p className="section-intro">
                                A handful of recent builds, taken from first commit to something real people use — spanning messaging, machine
                                learning, and role-based operations tools.
                            </p>
                        </div>
                        <ProjectsCarousel />
                    </section>

                    <p className="foot">© 2026 — Built with Laravel & React.</p>
                </main>
                {copiedLabel && (
                    <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-[#101010] px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900">
                        Email copied to clipboard
                    </div>
                )}
            </div>
        </>
    );
}
