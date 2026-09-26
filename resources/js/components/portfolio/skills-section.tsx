import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactElement } from 'react';

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

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
const MailIcon = () => (
    <svg {...cardIconProps}>
        <rect x="3.5" y="5.5" width="17" height="13" rx="1.6" />
        <path d="M4 6.5l8 6.5 8-6.5" />
    </svg>
);
const ChatIcon = () => (
    <svg {...cardIconProps}>
        <path d="M4 5.5h16v10.5H9.5L5.5 19v-3H4V5.5Z" />
        <path d="M8 9.5h8M8 12.5h5" />
    </svg>
);
const LinkedInIcon = () => (
    <svg {...cardIconProps}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7.5 9.5v7M7.5 6.8v.01" />
        <path d="M11.5 16.5v-4.2c0-1.3 1-2.3 2.3-2.3s2.2 1 2.2 2.3v4.2" />
        <path d="M11.5 9.5v7" />
    </svg>
);
/** Small award/medal icon for honors badges */
const AwardIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="5.5" />
        <path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5" />
    </svg>
);

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

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

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

const EXPERIENCE = [
    { role: 'Web Developer / Fullstack Developer', org: 'Freelance', period: '2025 – Present', current: true },
    { role: 'Web Developer Intern', org: 'DOST – Technology Application and Promotion Institute', period: '2025', current: false },
    { role: 'Developer / UI Designer Intern', org: 'Ollopa Corporation', period: '2024', current: false },
    { role: 'Lead Developer', org: 'Capstone & school software projects', period: undefined as string | undefined, current: false },
];

const EDUCATION = [
    { program: 'BS Computer Science', school: 'Bicol University', period: '2022 – 2026', honor: 'Cum Laude' },
    { program: 'Senior High School', school: 'San Lorenzo Academy', period: '2020 – 2022', honor: 'With Honors' },
    { program: 'NC III — Programming', school: 'TESDA National Certification', period: '2024', honor: 'TESDA Certified' },
];

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

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */

type SkillsSectionProps = {
    sectionRef: (el: HTMLElement | null) => void; // outer "about" section
    skillsRef: (el: HTMLElement | null) => void; // Tech Stack card (nav target)
    contactRef: (el: HTMLElement | null) => void; // Get in Touch card (nav target)
};

export function SkillsSection({ sectionRef, skillsRef, contactRef }: SkillsSectionProps) {
    return (
        <section id="about" ref={sectionRef} className="section">
            <p className="eyebrow">Skills</p>
            <h2 className="h2">Stack, experience, education.</h2>
            <p className="section-intro">
                A quick look at how I work day to day: the tools I reach for, the roles I've held, where I studied, and the fastest way to reach me if
                you'd like to talk.
            </p>

            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
                {/* Tech Stack — first on both mobile and desktop */}
                <Card id="skills" ref={skillsRef} className="order-1 gap-4 rounded-[20px] border-[var(--hair)] py-6 shadow-none lg:order-1">
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
                            {EXPERIENCE.map((exp) => (
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

                {/* Education — third on mobile, bottom-right on desktop */}
                <Card className="order-3 gap-4 rounded-[20px] border-[var(--hair)] py-6 shadow-none lg:order-4">
                    <CardHeader className="px-6">
                        <CardTitle className="flex items-center gap-2 text-[17px] font-semibold text-[#101010] dark:text-neutral-50">
                            <GradCapIcon />
                            Education
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6">
                        <div className="flex flex-col">
                            {EDUCATION.map((edu) => (
                                <div key={edu.program} className="border-b border-[var(--hair)] py-4 first:pt-0 last:border-b-0 last:pb-0">
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

                {/* Get in Touch — last on mobile, bottom-left on desktop */}
                <Card id="contact" ref={contactRef} className="order-4 gap-4 rounded-[20px] border-[var(--hair)] py-6 shadow-none lg:order-3">
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
                                    Available for UI/UX and WordPress freelance projects, with added support in SEO, Google Search Console (GSC),
                                    Google My Business (GMB), and email campaigns.
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
                                                <p className="text-[15px] font-medium text-[#101010] dark:text-neutral-100">{item.value}</p>
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
    );
}

/* ------------------------------------------------------------------ */
/*  Styles this section needs                                          */
/* ------------------------------------------------------------------ */
/*
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
   :root.dark .honor-badge { background: rgba(255,255,255,0.08); }
*/
