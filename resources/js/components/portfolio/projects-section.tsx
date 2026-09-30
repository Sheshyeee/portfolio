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

/**
 * Alignment — works like the align buttons in Word.
 * Set each row to 'left', 'center' or 'right'.
 */
type Align = 'left' | 'center' | 'right';

const ALIGN: Record<'meta' | 'title' | 'copy' | 'cta' | 'email' | 'socials' | 'footer', Align> = {
    meta: 'center', // location + local time
    title: 'center', // "Let's connect."
    copy: 'center', // paragraph
    cta: 'center', // "Contact me" button
    email: 'center', // email label + address
    socials: 'center', // Find me online + pills
    footer: 'center', // © line
};

/** Mobile bottom-sheet breakpoint (px). At or below this the dialog becomes a sheet. */
const SHEET_MAX = 640;

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

const CheckIcon = () => (
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

const MESSAGE_MAX = 2000;

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

    // Hides the dock/chat/toggle and locks body scroll while the dialog is open.
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

    const isSheet = () => window.innerWidth <= SHEET_MAX;

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isSheet()) return;
        setIsDragging(true);
        dragStartY.current = e.clientY;
        e.currentTarget.setPointerCapture(e.pointerId);
    };
    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        const delta = e.clientY - dragStartY.current;
        setDragY(delta > 0 ? delta : 0);
    };
    const handlePointerUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const shouldClose = dragY > 110;
        setDragY(0);
        if (shouldClose) handleOpenChange(false);
    };

    const dragStyle = dragY || isDragging ? ({ '--sheet-drag-y': `${dragY}px`, transition: 'none' } as React.CSSProperties) : undefined;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="contact-dialog"
                style={dragStyle}
                onOpenAutoFocus={(e) => {
                    // On phones, don't pop the keyboard the moment the sheet opens.
                    if (isSheet()) e.preventDefault();
                }}
            >
                <div
                    className="contact-handle"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    <span className="contact-handle-bar" aria-hidden="true" />
                </div>

                <div className="contact-dialog-body">
                    <DialogHeader className="contact-header">
                        <DialogTitle className="contact-dialog-title">{sent ? 'Message sent' : 'Send a message'}</DialogTitle>
                        <DialogDescription className="contact-dialog-desc">
                            {sent ? "Thanks for reaching out. I'll reply to your email soon." : "Tell me about your project and I'll reply by email."}
                        </DialogDescription>
                    </DialogHeader>

                    {sent ? (
                        <div className="contact-success">
                            <span className="contact-success-icon">
                                <CheckIcon />
                            </span>
                            <button type="button" className="contact-cta contact-submit" onClick={() => handleOpenChange(false)}>
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
                                    inputMode="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    aria-invalid={!!errors.email}
                                    placeholder="you@example.com"
                                />
                                {errors.email && <p className="contact-error">{errors.email}</p>}
                            </div>

                            <div className="contact-field">
                                <div className="contact-field-head">
                                    <label htmlFor="cf-message">Message</label>
                                    <span className="contact-count">
                                        {data.message.length}/{MESSAGE_MAX}
                                    </span>
                                </div>
                                <textarea
                                    id="cf-message"
                                    className="contact-input"
                                    rows={5}
                                    maxLength={MESSAGE_MAX}
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
                /* Two colours only: --bg / --ink (from app.css) and mixes of them. No gradients, no glows. */
                .contact-section,
                .contact-dialog {
                    --c-fill: var(--fill);
                    --c-line: var(--line);
                    --c-error: #c0392b;
                }
                :root.dark .contact-section,
                :root.dark .contact-dialog { --c-error: #ff8f8f; }

                /* .section.contact-section beats the generic .section rules in welcome.tsx.
                   The bottom padding is the only dock clearance on the page. */
                .section.contact-section {
                    justify-content: flex-start;
                    min-height: auto;
                    padding: 6rem 6vw calc(var(--dock-space-mobile) + 0.5rem);
                    border-bottom: none;
                }

                .contact-wrap {
                    display: flex;
                    flex-direction: column;
                    gap: 2.25rem;
                    width: 100%;
                    max-width: 1180px;
                    margin: 0 auto;
                }

                /* ---- Word-style alignment rows ---- */
                .contact-row {
                    display: flex;
                    flex-direction: column;
                    align-items: var(--a);
                    text-align: var(--t);
                }
                .contact-row[data-align='left']   { --a: flex-start; --t: left; }
                .contact-row[data-align='center'] { --a: center;     --t: center; }
                .contact-row[data-align='right']  { --a: flex-end;   --t: right; }

                .contact-meta {
                    flex-direction: row;
                    align-items: baseline;
                    justify-content: var(--a);
                    gap: 0.75rem;
                    font-size: 0.85rem;
                    color: var(--muted);
                }
                .contact-meta strong { color: var(--ink); font-weight: 600; font-variant-numeric: tabular-nums; }

                .contact-title {
                    margin: 0;
                    font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
                    font-weight: 800;
                    font-size: clamp(2rem, 8vw, 7rem);
                    line-height: 1;
                    white-space: nowrap;
                    letter-spacing: -0.045em;
                    text-transform: uppercase;
                    color: var(--ink);
                }
                .contact-copy {
                    max-width: 44ch;
                    margin: 0;
                    font-size: 1.05rem;
                    line-height: 1.65;
                    color: var(--muted);
                }

                /* Solid ink button — same idea as the "Let's talk" button in the reference */
                .contact-cta {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: fit-content;
                    padding: 0.9rem 1.7rem;
                    border-radius: 10px;
                    background: var(--ink);
                    color: var(--bg);
                    font-size: 0.95rem;
                    font-weight: 700;
                    transition: transform .25s ease, opacity .2s ease;
                }
                button.contact-cta { border: 0; cursor: pointer; font-family: inherit; }
                button.contact-cta:hover { transform: translateY(-2px); }
                button.contact-cta:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
                .contact-cta:focus-visible,
                .contact-pill:focus-visible,
                .contact-email:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }

                .contact-label { margin: 0 0 0.7rem; font-size: 0.85rem; color: var(--muted); }

                .contact-email {
                    font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
                    font-weight: 600;
                    letter-spacing: -0.02em;
                    font-size: clamp(1.3rem, 2.4vw, 2rem);
                    line-height: 1.15;
                    color: var(--ink);
                    text-decoration: none;
                    border-bottom: 1px solid var(--c-line);
                    overflow-wrap: anywhere;
                    transition: border-color .2s ease, color .2s ease;
                }
                .contact-email:hover { border-color: var(--ink); }

                .contact-links {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: var(--a);
                    gap: 0.6rem;
                    margin: 0;
                    padding: 0;
                    list-style: none;
                }
                .contact-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.55rem;
                    padding: 0.65rem 1.05rem;
                    border: 1px solid var(--hair);
                    border-radius: 10px;
                    background: transparent;
                    color: var(--ink);
                    font-size: 0.9rem;
                    font-weight: 500;
                    text-decoration: none;
                    transition: background-color .2s ease, color .2s ease, border-color .2s ease, transform .25s ease;
                }
                .contact-pill:hover {
                    background: var(--ink);
                    color: var(--bg);
                    border-color: var(--ink);
                    transform: translateY(-2px);
                }

                .contact-foot {
                    margin: 0.25rem 0 0;
                    padding-top: 1rem;
                    border-top: 1px solid var(--hair);
                    font-size: 0.8rem;
                    color: var(--muted);
                }

                @media (max-width: 900px) {
                    .section.contact-section { padding: 5rem 6vw calc(var(--dock-space-mobile) + 0.5rem); }
                    .contact-wrap { gap: 1.9rem; }
                }

                /* =====================================================
                   Contact dialog — centered modal on desktop,
                   bottom sheet on phones. (Portaled, so not scoped
                   to the section.)
                   ===================================================== */
                .contact-dialog {
                    padding: 0 !important;
                    gap: 0 !important;
                    width: calc(100% - 2rem);
                    max-width: 460px !important;
                    max-height: 90vh;
                    max-height: 90dvh;
                    overflow-y: auto;
                    border-radius: 22px !important;
                    background: var(--bg) !important;
                    color: var(--ink) !important;
                    border: 1px solid var(--hair) !important;
                    box-shadow: 0 30px 80px rgba(0,0,0,0.35) !important;
                    font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
                }

                /* Desktop close button (the shadcn X). Hidden on phones below. */
                .contact-dialog > button {
                    top: 1rem !important;
                    right: 1rem !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 2rem;
                    height: 2rem;
                    border-radius: 999px;
                    color: var(--muted);
                    opacity: 1 !important;
                    transition: background-color .2s ease, color .2s ease;
                }
                .contact-dialog > button:hover { background: var(--c-fill); color: var(--ink); }

                .contact-handle { display: none; }
                .contact-handle-bar { width: 2.5rem; height: 0.3rem; border-radius: 999px; background: var(--c-line); }

                .contact-dialog-body { padding: 2rem 2rem 2rem; }

                .contact-header { text-align: left; gap: 0.5rem; padding-right: 2rem; }
                .contact-dialog-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    line-height: 1.2;
                    letter-spacing: -0.03em;
                    color: var(--ink);
                }
                .contact-dialog-desc { font-size: 0.925rem; line-height: 1.55; color: var(--muted); }

                .contact-form { display: grid; gap: 1.1rem; margin-top: 1.75rem; }
                .contact-field label { display: block; margin-bottom: 0.4rem; font-size: 0.825rem; font-weight: 500; color: var(--ink); }
                .contact-field-head { display: flex; align-items: baseline; justify-content: space-between; }
                .contact-count { font-size: 0.75rem; color: var(--muted); font-variant-numeric: tabular-nums; }

                .contact-input {
                    width: 100%;
                    padding: 0.8rem 0.95rem;
                    border-radius: 10px;
                    border: 1px solid var(--c-line);
                    background: var(--c-fill);
                    color: var(--ink);
                    font: inherit;
                    font-size: 16px; /* 16px stops iOS from zooming on focus */
                    line-height: 1.4;
                    outline: none;
                    transition: border-color .2s ease, background-color .2s ease;
                }
                .contact-input::placeholder { color: var(--muted); opacity: 0.65; }
                .contact-input:hover { border-color: color-mix(in srgb, var(--ink) 50%, transparent); }
                .contact-input:focus { border-color: var(--ink); background: var(--bg); }
                .contact-input[aria-invalid='true'] { border-color: var(--c-error); }
                textarea.contact-input { min-height: 8rem; resize: none; }
                .contact-error { margin-top: 0.4rem; font-size: 0.8rem; color: var(--c-error); }
                .contact-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }

                .contact-submit { width: 100%; margin-top: 0.35rem; padding: 0.95rem 1.5rem; border-radius: 10px; }

                .contact-success { display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem; margin-top: 1.75rem; }
                .contact-success .contact-submit { margin-top: 0; }
                .contact-success-icon {
                    display: inline-flex; align-items: center; justify-content: center;
                    width: 3.25rem; height: 3.25rem; border-radius: 999px;
                    background: var(--ink);
                    color: var(--bg);
                }

                /* ---------- Phone: bottom sheet ---------- */
                @keyframes contact-sheet-in  { from { bottom: -100dvh; } to { bottom: 0; } }
                @keyframes contact-sheet-out { from { bottom: 0; } to { bottom: -100dvh; } }

                @media (max-width: ${SHEET_MAX}px) {
                    /* doubled class = wins over the shadcn positioning utilities */
                    .contact-dialog.contact-dialog {
                        position: fixed;
                        top: auto;
                        left: 0;
                        right: 0;
                        bottom: calc(var(--sheet-drag-y, 0px) * -1);
                        width: 100%;
                        max-width: none !important;
                        max-height: 92vh;
                        max-height: 92dvh;
                        margin: 0;
                        translate: none;
                        transform: none;
                        border-radius: 24px 24px 0 0 !important;
                        border-width: 1px 0 0 0 !important;
                        overscroll-behavior: contain;
                        animation: contact-sheet-in .38s cubic-bezier(.32,.72,0,1) backwards !important;
                    }
                    .contact-dialog.contact-dialog[data-state='closed'] {
                        animation: contact-sheet-out .26s ease-in forwards !important;
                    }

                    /* no X on phones — swipe down or tap outside */
                    .contact-dialog > button { display: none !important; }

                    .contact-handle {
                        position: sticky;
                        top: 0;
                        z-index: 2;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 0.75rem 0 0.5rem;
                        background: var(--bg);
                        touch-action: none;
                        cursor: grab;
                    }

                    .contact-dialog-body { padding: 0.5rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom, 0px)); }
                    .contact-header { padding-right: 0; }
                    .contact-dialog-title { font-size: 1.4rem; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .contact-cta, .contact-pill { transition: none; }
                    button.contact-cta:hover, .contact-pill:hover { transform: none; }
                    .contact-dialog.contact-dialog { animation-duration: .01s !important; }
                }
            `}</style>

            <div className="contact-wrap">
                <div className="contact-row contact-meta" data-align={ALIGN.meta}>
                    <span>{LOCATION}</span>
                    <strong>{time}</strong>
                </div>

                <div className="contact-row" data-align={ALIGN.title}>
                    <h2 className="contact-title">Let&apos;s connect.</h2>
                </div>

                <div className="contact-row" data-align={ALIGN.copy}>
                    <p className="contact-copy">Have a project in mind? Send me a message and we can talk through the details.</p>
                </div>

                <div className="contact-row" data-align={ALIGN.cta}>
                    <button type="button" className="contact-cta" onClick={() => setDialogOpen(true)}>
                        Contact me
                    </button>
                </div>

                <div className="contact-row" data-align={ALIGN.email}>
                    <p className="contact-label">Email</p>
                    <a className="contact-email" href={`mailto:${EMAIL}`}>
                        {EMAIL}
                    </a>
                </div>

                <div className="contact-row" data-align={ALIGN.socials}>
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

                <p className="contact-row contact-foot" data-align={ALIGN.footer}>
                    © 2026 — Built with Laravel &amp; React.
                </p>
            </div>

            <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </section>
    );
}
