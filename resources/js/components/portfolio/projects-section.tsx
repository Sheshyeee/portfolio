import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Edit these                                                          */
/* ------------------------------------------------------------------ */

const EMAIL = 'clapisdave8@gmail.com';
const LOCATION = 'Philippines';
const TIME_ZONE = 'Asia/Manila';

const SOCIALS = [
    { label: 'Dribbble', href: 'https://dribbble.com/yourname', icon: 'dribbble' },
    { label: 'Instagram', href: 'https://instagram.com/yourname', icon: 'instagram' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/yourname', icon: 'linkedin' },
] as const;

/* ------------------------------------------------------------------ */
/*  Icons                                                               */
/* ------------------------------------------------------------------ */

const svgProps = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
};

const ICONS: Record<string, React.ReactNode> = {
    dribbble: (
        <svg {...svgProps}>
            <circle cx="12" cy="12" r="9" />
            <path d="M8.5 3.6c3 3.6 5 7.6 6.2 12.6M3.2 11c4.2.2 9-.5 12.9-2.8M9.3 20.5c.9-3.8 3.6-7.2 8.7-8.4" />
        </svg>
    ),
    instagram: (
        <svg {...svgProps}>
            <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
        </svg>
    ),
    linkedin: (
        <svg {...svgProps}>
            <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
            <path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.5 1-2.5 2.3-2.5S16 11.4 16 13v3" />
        </svg>
    ),
};

const CheckCircle = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

/* ------------------------------------------------------------------ */
/*  Live local time                                                     */
/* ------------------------------------------------------------------ */

function useLocalTime() {
    const format = () => new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', timeZone: TIME_ZONE }).format(new Date());

    const [time, setTime] = useState(format);

    useEffect(() => {
        const id = setInterval(() => setTime(format()), 15_000);
        return () => clearInterval(id);
    }, []);

    return time;
}

/* ------------------------------------------------------------------ */
/*  Contact dialog (desktop modal / mobile draggable bottom sheet)      */
/* ------------------------------------------------------------------ */

function ContactDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [sent, setSent] = useState(false);
    const dragStartY = useRef(0);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        message: '',
        website: '', // honeypot: real users never fill this in
    });

    // Hides the dock/chat/toggle and locks body scroll on mobile while the sheet is open.
    useEffect(() => {
        document.body.classList.toggle('sheet-open', open);
        return () => document.body.classList.remove('sheet-open');
    }, [open]);

    const handleOpenChange = (v: boolean) => {
        onOpenChange(v);
        if (!v) {
            // wait for the close animation before resetting the view
            setTimeout(() => {
                setSent(false);
                clearErrors();
            }, 300);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSent(true);
            },
        });
    };

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
        if (dragY > 110) handleOpenChange(false);
        setDragY(0);
    };

    const dragStyle = dragY || isDragging ? ({ '--sheet-drag-y': `${dragY}px`, transition: 'none' } as React.CSSProperties) : undefined;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="case-study-sheet contact-dialog max-h-[90vh] overflow-y-auto rounded-[24px] p-0 sm:max-w-[520px]"
                style={dragStyle}
            >
                <div
                    className="sheet-drag-handle"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    <span className="sheet-drag-bar" aria-hidden="true" />
                </div>

                <div className="contact-dialog-body">
                    <DialogHeader className="items-start text-left">
                        <DialogTitle className="contact-dialog-title">{sent ? 'Message sent' : 'Send a message'}</DialogTitle>
                        <DialogDescription className="contact-dialog-desc">
                            {sent ? "Thanks for reaching out. I'll reply to your email soon." : "Tell me about your project and I'll reply by email."}
                        </DialogDescription>
                    </DialogHeader>

                    {sent ? (
                        <div className="contact-success">
                            <span className="contact-success-icon">
                                <CheckCircle />
                            </span>
                            <button type="button" className="contact-cta" onClick={() => handleOpenChange(false)}>
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={submit} noValidate className="contact-form">
                            <div className="contact-field">
                                <label htmlFor="cf-name">Name</label>
                                <input
                                    id="cf-name"
                                    className="contact-input"
                                    type="text"
                                    autoComplete="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    aria-invalid={!!errors.name}
                                    placeholder="Your name"
                                />
                                {errors.name && <p className="contact-error">{errors.name}</p>}
                            </div>

                            <div className="contact-field">
                                <label htmlFor="cf-email">Email</label>
                                <input
                                    id="cf-email"
                                    className="contact-input"
                                    type="email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    aria-invalid={!!errors.email}
                                    placeholder="you@example.com"
                                />
                                {errors.email && <p className="contact-error">{errors.email}</p>}
                            </div>

                            <div className="contact-field">
                                <label htmlFor="cf-message">Message</label>
                                <textarea
                                    id="cf-message"
                                    className="contact-input"
                                    rows={5}
                                    maxLength={2000}
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    aria-invalid={!!errors.message}
                                    placeholder="What would you like to build?"
                                />
                                {errors.message && <p className="contact-error">{errors.message}</p>}
                            </div>

                            <input
                                className="contact-hp"
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                value={data.website}
                                onChange={(e) => setData('website', e.target.value)}
                            />

                            <button type="submit" className="contact-cta contact-submit" disabled={processing}>
                                {processing ? 'Sending…' : 'Send message'}
                            </button>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */

export function ContactSection({ sectionRef }: { sectionRef: (el: HTMLElement | null) => void }) {
    const time = useLocalTime();
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <section id="contact-us" ref={sectionRef} className="section contact-section">
            <style>{`
                @import url('https://fonts.bunny.net/css?family=instrument-serif:400');

                /* Follows the site theme via --bg / --ink / --muted / --hair from welcome.tsx */
                .contact-section,
                .contact-dialog {
                    --c-fill: rgba(0,0,0,0.035);
                    --c-line: rgba(0,0,0,0.22);
                    --c-accent: #0A84FF;
                    --c-error: #dc2626;
                    --c-serif: 'Instrument Serif', Georgia, 'Times New Roman', serif;
                }
                :root.dark .contact-section,
                :root.dark .contact-dialog {
                    --c-fill: rgba(255,255,255,0.06);
                    --c-line: rgba(255,255,255,0.28);
                    --c-accent: #6cb3ff;
                    --c-error: #ff8f8f;
                }

                /* .section.contact-section beats the generic .section rules in welcome.tsx.
                   The bottom padding is the only dock clearance on the page. */
                .section.contact-section {
                    justify-content: flex-start;
                    min-height: auto;
                    padding: 6rem 6vw calc(var(--dock-space-mobile) + 0.75rem);
                    border-bottom: none;
                }

                .contact-wrap {
                    display: flex;
                    flex-direction: column;
                    gap: 3.5rem;
                    width: 100%;
                    max-width: 1180px;
                    margin: 0 auto;
                }

                .contact-top {
                    display: flex;
                    justify-content: flex-end;
                    align-items: baseline;
                    gap: 0.75rem;
                    font-size: 0.85rem;
                    color: var(--muted);
                }
                .contact-top strong { color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }

                .contact-grid {
                    display: grid;
                    grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
                    gap: 4rem 5rem;
                    align-items: end;
                }

                .contact-title {
                    margin: 0;
                    font-family: var(--c-serif);
                    font-weight: 400;
                    font-size: clamp(3.6rem, 10vw, 8.5rem);
                    line-height: 0.92;
                    letter-spacing: -0.025em;
                    color: var(--ink);
                }
                .contact-copy {
                    max-width: 40ch;
                    margin: 1.75rem 0 2rem;
                    font-size: 1.05rem;
                    line-height: 1.65;
                    color: var(--muted);
                }

                .contact-cta {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: fit-content;
                    padding: 0.9rem 1.7rem;
                    border-radius: 999px;
                    background: var(--ink);
                    color: var(--bg);
                    font-size: 0.95rem;
                    font-weight: 600;
                    transition: transform .25s ease, opacity .2s ease;
                }
                button.contact-cta { border: 0; cursor: pointer; font-family: inherit; }
                button.contact-cta:hover { transform: translateY(-2px); }
                button.contact-cta:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
                .contact-cta:focus-visible,
                .contact-pill:focus-visible,
                .contact-email:focus-visible { outline: 2px solid var(--c-accent); outline-offset: 3px; }

                .contact-side { display: flex; flex-direction: column; gap: 2rem; padding-bottom: 0.4rem; }
                .contact-block { padding-top: 1.1rem; border-top: 1px solid var(--hair); }
                .contact-label { margin: 0 0 0.8rem; font-size: 0.85rem; color: var(--muted); }

                .contact-email {
                    font-family: var(--c-serif);
                    font-size: clamp(1.6rem, 2.6vw, 2.2rem);
                    line-height: 1.15;
                    color: var(--ink);
                    text-decoration: none;
                    border-bottom: 1px solid var(--c-line);
                    overflow-wrap: anywhere;
                    transition: border-color .2s ease;
                }
                .contact-email:hover { border-color: var(--ink); }

                .contact-links { display: flex; flex-wrap: wrap; gap: 0.6rem; margin: 0; padding: 0; list-style: none; }
                .contact-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.55rem;
                    padding: 0.65rem 1.05rem;
                    border: 1px solid var(--hair);
                    border-radius: 999px;
                    background: var(--c-fill);
                    color: var(--ink);
                    font-size: 0.9rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: background-color .2s ease, color .2s ease, border-color .2s ease, transform .25s ease;
                }
                .contact-pill:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); transform: translateY(-2px); }

                .contact-foot { margin: 0; padding-top: 1.5rem; border-top: 1px solid var(--hair); font-size: 0.8rem; color: var(--muted); }

                @media (max-width: 900px) {
                    .section.contact-section { padding: 5rem 6vw calc(var(--dock-space-mobile) + 0.75rem); }
                    .contact-wrap { gap: 2.5rem; }
                    .contact-top { justify-content: flex-start; }
                    .contact-grid { grid-template-columns: 1fr; gap: 2.75rem; }
                }

                /* ---------- contact dialog / bottom sheet (portal, so not scoped to the section) ---------- */
                .contact-dialog {
                    background: var(--bg) !important;
                    color: var(--ink) !important;
                    border-color: var(--hair) !important;
                    font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
                }
                .contact-dialog > button.absolute { color: var(--ink); }
                .contact-dialog .sheet-drag-bar { background: var(--c-line); }
                .contact-dialog-body { padding: 1.5rem 1.5rem 2rem; }
                @media (min-width: 640px) { .contact-dialog-body { padding: 2.25rem 2.25rem 2.5rem; } }

                .contact-dialog-title { font-family: var(--c-serif); font-weight: 400; font-size: 2.5rem; line-height: 1; letter-spacing: -0.02em; color: var(--ink); }
                .contact-dialog-desc { margin-top: 0.6rem; font-size: 0.9rem; line-height: 1.6; color: var(--muted); }

                .contact-form { display: grid; gap: 1.1rem; margin-top: 1.75rem; }
                .contact-field label { display: block; margin-bottom: 0.45rem; font-size: 0.85rem; font-weight: 500; color: var(--muted); }
                .contact-input {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border-radius: 14px;
                    border: 1px solid var(--c-line);
                    background: var(--c-fill);
                    color: var(--ink);
                    font: inherit;
                    font-size: 16px; /* 16px stops iOS from zooming on focus */
                    outline: none;
                    transition: border-color .2s ease, box-shadow .2s ease;
                }
                .contact-input::placeholder { color: var(--muted); opacity: 0.6; }
                .contact-input:focus { border-color: var(--c-accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--c-accent) 22%, transparent); }
                .contact-input[aria-invalid='true'] { border-color: var(--c-error); }
                textarea.contact-input { min-height: 8rem; resize: vertical; }
                .contact-error { margin-top: 0.4rem; font-size: 0.8rem; color: var(--c-error); }
                .contact-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
                .contact-submit { width: 100%; margin-top: 0.4rem; }

                .contact-success { display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem; margin-top: 1.75rem; }
                .contact-success-icon {
                    display: inline-flex; align-items: center; justify-content: center;
                    width: 3.5rem; height: 3.5rem; border-radius: 999px;
                    background: var(--ink); color: var(--bg);
                }

                @media (prefers-reduced-motion: reduce) {
                    .contact-cta, .contact-pill { transition: none; }
                    button.contact-cta:hover, .contact-pill:hover { transform: none; }
                }
            `}</style>

            <div className="contact-wrap">
                <div className="contact-top">
                    <span>{LOCATION}</span>
                    <strong>{time}</strong>
                </div>

                <div className="contact-grid">
                    <div>
                        <h2 className="contact-title">
                            Let&apos;s
                            <br />
                            connect.
                        </h2>
                        <p className="contact-copy">Have a project in mind? Send me a message and we can talk through the details.</p>
                        <button type="button" className="contact-cta" onClick={() => setDialogOpen(true)}>
                            Contact me
                        </button>
                    </div>

                    <div className="contact-side">
                        <div className="contact-block">
                            <p className="contact-label">Email</p>
                            <a className="contact-email" href={`mailto:${EMAIL}`}>
                                {EMAIL}
                            </a>
                        </div>

                        <div className="contact-block">
                            <p className="contact-label">Find me online</p>
                            <ul className="contact-links">
                                {SOCIALS.map((s) => (
                                    <li key={s.label}>
                                        <a className="contact-pill" href={s.href} target="_blank" rel="noreferrer noopener">
                                            {ICONS[s.icon]}
                                            {s.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <p className="contact-foot">© 2026 — Built with Laravel &amp; React.</p>
            </div>

            <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </section>
    );
}
