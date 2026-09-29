import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Edit these                                                          */
/* ------------------------------------------------------------------ */

const EMAIL = 'hello@yourdomain.com';
const CONTACT_IMAGE = '/contact.png'; // put your image in /public
const LOCATION = 'Naga City, PH';
const TIME_ZONE = 'Asia/Manila';

const SOCIALS = [
    { label: 'Dribbble', href: 'https://dribbble.com/yourname', icon: 'dribbble' },
    { label: 'Instagram', href: 'https://instagram.com/yourname', icon: 'instagram' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/yourname', icon: 'linkedin' },
    { label: 'Behance', href: 'https://behance.net/yourname', icon: 'behance' },
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
    behance: (
        <svg {...svgProps}>
            <path d="M3 6.5h5a2.3 2.3 0 0 1 0 4.5H3zM3 11h5.5a2.5 2.5 0 0 1 0 5H3zM3 6.5V16M14.5 7.5h5M20.5 13.5h-6.2a2.9 2.9 0 0 0 5.2 1.4" />
            <path d="M14.4 13.5a3 3 0 0 1 6.1 0" />
        </svg>
    ),
};

const ArrowUpRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M8 7h9v9" />
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

const CheckCircle = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
);

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

    // Same behaviour as the old case-study sheet: hides the dock/chat/toggle and locks body scroll on mobile.
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
                className="case-study-sheet contact-dialog max-h-[90vh] overflow-y-auto rounded-[24px] border-white/10 bg-black p-0 text-white sm:max-w-[520px]"
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
                                {!processing && <ArrowUpRight />}
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
                @import url('https://fonts.bunny.net/css?family=anton:400|space-mono:400,700');

                /* .section.contact-section beats the generic .section rule in welcome.tsx */
                .section.contact-section {
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    justify-content: flex-start;
                    min-height: 100vh;
                    padding: 0;
                    background: #000;
                    color: #fff;
                    border-bottom: none;
                }

                /* soft grey glow behind the headline */
                .contact-section::before {
                    content: '';
                    position: absolute;
                    z-index: -1;
                    top: -20%;
                    left: -10%;
                    width: 70vw;
                    height: 70vw;
                    max-width: 900px;
                    max-height: 900px;
                    background: radial-gradient(circle at 40% 40%, rgba(255,255,255,0.14), rgba(255,255,255,0.03) 45%, transparent 70%);
                    filter: blur(40px);
                    pointer-events: none;
                }

                .contact-inner {
                    position: relative;
                    z-index: 2;
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                    width: 100%;
                    max-width: 62%;
                    padding: 7rem 0 7rem 6vw;
                }

                .contact-title {
                    font-family: 'Anton', 'Impact', sans-serif;
                    font-weight: 400;
                    font-size: clamp(3.4rem, 10.5vw, 9rem);
                    line-height: 0.95;
                    letter-spacing: 0.005em;
                    text-transform: uppercase;
                    margin: 0;
                    background: linear-gradient(180deg, #ffffff 25%, #8a8a8a 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    color: transparent;
                }

                .contact-mono { font-family: 'Space Mono', ui-monospace, monospace; }

                .contact-copy {
                    max-width: 44ch;
                    font-size: 0.85rem;
                    line-height: 1.7;
                    color: rgba(255,255,255,0.72);
                    margin: 0;
                }

                .contact-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    width: fit-content;
                    padding: 0.85rem 1.5rem;
                    border-radius: 999px;
                    background: linear-gradient(180deg, #ffffff, #d4d4d4);
                    color: #000;
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-decoration: none;
                    box-shadow: 0 10px 30px rgba(255,255,255,0.12), inset 0 1px 0 #fff;
                    transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease;
                }
                .contact-cta:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 14px 38px rgba(255,255,255,0.2), inset 0 1px 0 #fff; }
                .contact-cta:focus-visible,
                .contact-pill:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }

                .contact-label {
                    font-size: 0.7rem;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.45);
                    margin: 0 0 0.9rem;
                }

                .contact-email {
                    display: inline-block;
                    font-family: 'Anton', 'Impact', sans-serif;
                    font-size: clamp(1.1rem, 2vw, 1.5rem);
                    letter-spacing: 0.03em;
                    color: #fff;
                    text-decoration: none;
                    text-transform: uppercase;
                    border-bottom: 1px solid rgba(255,255,255,0.25);
                    padding-bottom: 2px;
                    transition: border-color .25s ease, color .25s ease;
                    word-break: break-all;
                }
                .contact-email:hover { border-color: #fff; }

                .contact-details { display: flex; flex-wrap: wrap; gap: 3rem 4.5rem; }

                /* vertical social pills */
                .contact-socials { display: flex; flex-direction: column; gap: 0.6rem; }
                .contact-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.65rem;
                    width: 11.5rem;
                    padding: 0.7rem 1.1rem;
                    border-radius: 999px;
                    background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(226,226,226,0.92));
                    color: #101010;
                    font-size: 0.85rem;
                    font-weight: 600;
                    text-decoration: none;
                    box-shadow: 0 8px 24px rgba(255,255,255,0.06), inset 0 1px 0 #fff;
                    transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s ease, background .3s ease;
                }
                .contact-pill:hover {
                    transform: translateX(6px);
                    box-shadow: 0 10px 30px rgba(255,255,255,0.16), inset 0 1px 0 #fff;
                }
                .contact-pill svg { flex: none; }

                /* right-hand image */
                .contact-visual {
                    position: absolute;
                    z-index: 1;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 42%;
                    pointer-events: none;
                }
                .contact-visual img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: grayscale(1) contrast(1.05);
                }
                .contact-visual::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background:
                        linear-gradient(90deg, #000 0%, rgba(0,0,0,0.55) 30%, transparent 75%),
                        linear-gradient(180deg, #000 0%, transparent 28%, transparent 70%, #000 100%);
                }

                .contact-meta {
                    position: absolute;
                    z-index: 3;
                    top: 2rem;
                    right: 6vw;
                    text-align: right;
                    font-family: 'Space Mono', ui-monospace, monospace;
                    text-transform: uppercase;
                    font-size: 0.8rem;
                    line-height: 1.5;
                    color: rgba(255,255,255,0.6);
                }
                .contact-meta strong { display: block; color: #fff; font-size: 0.95rem; font-weight: 700; letter-spacing: 0.04em; }

                @media (max-width: 900px) {
                    .section.contact-section { min-height: auto; }
                    .contact-inner { max-width: 100%; padding: 5.5rem 6vw 2rem; gap: 2rem; }
                    .contact-meta { top: 1.25rem; left: 6vw; right: auto; text-align: left; }
                    .contact-visual {
                        position: relative;
                        width: 100%;
                        height: 300px;
                        margin-bottom: var(--dock-space-mobile, 6rem);
                    }
                    .contact-visual::after {
                        background: linear-gradient(180deg, #000 0%, transparent 40%, transparent 75%, #000 100%);
                    }
                    .contact-pill { width: 100%; max-width: 20rem; }
                }


                /* ---------- contact dialog / bottom sheet (portal, so not scoped to the section) ---------- */
                button.contact-cta { border: 0; cursor: pointer; font-family: inherit; }
                button.contact-cta:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

                .contact-dialog { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
                .contact-dialog > button.absolute { color: #fff; }
                .contact-dialog .sheet-drag-bar { background: rgba(255,255,255,0.3); }
                .contact-dialog-body { padding: 1.5rem 1.5rem 2rem; }
                @media (min-width: 640px) { .contact-dialog-body { padding: 2.25rem 2.25rem 2.5rem; } }

                .contact-dialog-title {
                    font-family: 'Anton', 'Impact', sans-serif;
                    font-weight: 400;
                    font-size: 2.1rem;
                    line-height: 1;
                    text-transform: uppercase;
                    background: linear-gradient(180deg, #ffffff 30%, #8a8a8a 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .contact-dialog-desc { margin-top: 0.6rem; font-size: 0.875rem; line-height: 1.6; color: rgba(255,255,255,0.6); }

                .contact-form { display: grid; gap: 1.1rem; margin-top: 1.75rem; }
                .contact-field label {
                    display: block;
                    margin-bottom: 0.45rem;
                    font-family: 'Space Mono', ui-monospace, monospace;
                    font-size: 0.7rem;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.5);
                }
                .contact-input {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border-radius: 14px;
                    border: 1px solid rgba(255,255,255,0.14);
                    background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
                    color: #fff;
                    font: inherit;
                    font-size: 16px; /* 16px stops iOS from zooming on focus */
                    outline: none;
                    transition: border-color .2s ease, box-shadow .2s ease;
                }
                .contact-input::placeholder { color: rgba(255,255,255,0.3); }
                .contact-input:focus { border-color: rgba(255,255,255,0.6); box-shadow: 0 0 0 3px rgba(255,255,255,0.08); }
                .contact-input[aria-invalid='true'] { border-color: #ff7a7a; }
                textarea.contact-input { min-height: 8rem; resize: vertical; }
                .contact-error { margin-top: 0.4rem; font-size: 0.78rem; color: #ff8f8f; }
                .contact-hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
                .contact-submit { width: 100%; justify-content: center; margin-top: 0.4rem; }

                .contact-success { display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem; margin-top: 1.75rem; }
                .contact-success-icon {
                    display: inline-flex; align-items: center; justify-content: center;
                    width: 3.5rem; height: 3.5rem; border-radius: 999px;
                    background: linear-gradient(180deg, #ffffff, #cfcfcf); color: #000;
                }

                @media (prefers-reduced-motion: reduce) {
                    .contact-cta, .contact-pill { transition: none; }
                    .contact-cta:hover, .contact-pill:hover { transform: none; }
                }
            `}</style>

            <div className="contact-meta">
                {LOCATION}
                <strong>{time}</strong>
            </div>

            <div className="contact-inner">
                <h2 className="contact-title">
                    Let&apos;s
                    <br />
                    connect!
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <p className="contact-copy contact-mono">Have a project in mind? Send me a message and we can talk through the details.</p>
                    <button type="button" className="contact-cta" onClick={() => setDialogOpen(true)}>
                        Contact me
                        <ArrowUpRight />
                    </button>
                </div>

                <div className="contact-details">
                    <div>
                        <p className="contact-label contact-mono">Email</p>
                        <a className="contact-email" href={`mailto:${EMAIL}`}>
                            {EMAIL}
                        </a>
                    </div>

                    <div>
                        <p className="contact-label contact-mono">Connect</p>
                        <div className="contact-socials">
                            {SOCIALS.map((s) => (
                                <a key={s.label} className="contact-pill" href={s.href} target="_blank" rel="noreferrer noopener">
                                    {ICONS[s.icon]}
                                    {s.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="contact-visual" aria-hidden="true">
                <img src={CONTACT_IMAGE} alt="" />
            </div>

            <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </section>
    );
}
