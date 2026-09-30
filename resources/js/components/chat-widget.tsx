import { Button } from '@/components/ui/button';
import { MessageAvatar } from '@/components/ui/message';
import { sendChatMessage, type ChatTurn } from '@/lib/chat-api';
import { useEffect, useRef, useState } from 'react';
import ChatThread, { now, type ChatMessage } from './chat-thread';

/*
 * Chatbot icon
 *
 * Theme: violet / purple gradient in both light and dark mode.
 * The image itself does NOT animate.
 * Only the outer border has a subtle slow rotation.
 */
const MonochromeWaveIcon = () => (
    <span className="chatbot-icon-wrap relative block h-full w-full rounded-full p-[2px]" aria-hidden="true">
        {/* Animated border */}
        <span className="chatbot-icon-border absolute inset-0 rounded-full" aria-hidden="true" />

        {/* Icon image */}
        <span className="relative block h-full w-full overflow-hidden rounded-full">
            <img src="/chatbot-icon-light.png" alt="" draggable={false} className="block h-full w-full rounded-full object-cover dark:hidden" />
            <img src="/chatbot-icon-dark.png" alt="" draggable={false} className="hidden h-full w-full rounded-full object-cover dark:block" />
        </span>
    </span>
);

const ChevronDownIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

const SparkleIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2 13.8 9.2 21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8L12 2Z" />
    </svg>
);

const TrashIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0 1 12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-12" />
    </svg>
);

const FALLBACK_REPLY = "Sorry, I'm having trouble connecting right now. Try again in a bit, or email me directly at clapisdave8@gmail.com.";

const DRAG_CLOSE_THRESHOLD = 110;
const ACTIVATE_DURATION_MS = 380;
const STORAGE_KEY = 'portfolio-chat-v1';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

type PersistedChat = {
    messages: ChatMessage[];
    savedAt: number;
};

function loadPersistedChat(): PersistedChat | null {
    if (typeof window === 'undefined') return null;

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) return null;

        const parsed = JSON.parse(raw) as PersistedChat;

        if (!parsed || !Array.isArray(parsed.messages) || typeof parsed.savedAt !== 'number') {
            return null;
        }

        if (Date.now() - parsed.savedAt > MAX_AGE_MS) {
            window.localStorage.removeItem(STORAGE_KEY);
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
}

function savePersistedChat(data: PersistedChat) {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Storage unavailable
    }
}

function isMobileViewport() {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
    const [teaserVisible, setTeaserVisible] = useState(false);

    const [isActivating, setIsActivating] = useState(false);

    const [messages, setMessages] = useState<ChatMessage[]>(() => loadPersistedChat()?.messages ?? []);

    const [draft, setDraft] = useState('');
    const [isSending, setIsSending] = useState(false);

    const [dragY, setDragY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const dragStartY = useRef<number | null>(null);

    const activateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        savePersistedChat({
            messages,
            savedAt: Date.now(),
        });
    }, [messages]);

    useEffect(() => {
        if (open) {
            setDragY(0);
        }
    }, [open]);

    useEffect(() => {
        if (hasOpenedOnce) {
            setTeaserVisible(false);
            return;
        }

        let showTimer: ReturnType<typeof setTimeout>;
        let hideTimer: ReturnType<typeof setTimeout>;
        let loopTimer: ReturnType<typeof setTimeout>;

        const cycle = (initialDelay: number) => {
            showTimer = setTimeout(() => {
                setTeaserVisible(true);

                hideTimer = setTimeout(() => {
                    setTeaserVisible(false);

                    loopTimer = setTimeout(() => {
                        cycle(0);
                    }, 3000);
                }, 3000);
            }, initialDelay);
        };

        cycle(2000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
            clearTimeout(loopTimer);
        };
    }, [hasOpenedOnce]);

    useEffect(
        () => () => {
            if (activateTimer.current) {
                clearTimeout(activateTimer.current);
            }
        },
        [],
    );

    const handleOpen = () => {
        if (isActivating) return;

        setIsActivating(true);
        setTeaserVisible(false);

        activateTimer.current = setTimeout(() => {
            setOpen(true);
            setHasOpenedOnce(true);
            setIsActivating(false);
        }, ACTIVATE_DURATION_MS);
    };

    const handleReset = () => {
        setMessages([]);
        setDraft('');

        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (!isMobileViewport()) return;

        dragStartY.current = e.clientY;
        setIsDragging(true);

        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (dragStartY.current === null) return;

        const delta = e.clientY - dragStartY.current;

        if (delta > 0) {
            setDragY(delta);
        }
    };

    const handlePointerUp = () => {
        if (dragStartY.current === null) return;

        if (dragY > DRAG_CLOSE_THRESHOLD) {
            setOpen(false);
        }

        setDragY(0);
        setIsDragging(false);
        dragStartY.current = null;
    };

    const sendMessage = async (raw: string) => {
        const text = raw.trim();

        if (!text || isSending) return;

        const userMessage: ChatMessage = {
            id: `v-${Date.now()}`,
            from: 'visitor',
            text,
            time: now(),
        };

        const historyBase = [...messages, userMessage];

        setMessages(historyBase);
        setDraft('');
        setIsSending(true);

        try {
            const history: ChatTurn[] = messages.slice(-16).map((m) => ({
                role: m.from === 'dave' ? 'model' : 'user',
                content: m.text,
            }));

            const reply = await sendChatMessage(text, history);

            setMessages((prev) => [
                ...prev,
                {
                    id: `d-${Date.now()}`,
                    from: 'dave',
                    text: reply,
                    time: now(),
                },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `d-${Date.now()}`,
                    from: 'dave',
                    text: FALLBACK_REPLY,
                    time: now(),
                },
            ]);
        } finally {
            setIsSending(false);
        }
    };

    const handleSend = () => {
        sendMessage(draft);
    };

    return (
        <>
            <style>{`
                /*
                 * Animated violet chatbot border, matching the
                 * purple/indigo glow theme. Robot image stays static.
                 */

                .chatbot-icon-border {
    background: conic-gradient(/* unchanged */);
    animation: chatbot-border-spin 7s linear infinite;
    will-change: transform;   /* replaces: filter: blur(0.2px); */
    opacity: 0.95;
}

                .dark .chatbot-icon-border {
                    background: conic-gradient(
                        from 0deg,
                        #c4b5fd,
                        #e9d5ff,
                        #a78bfa,
                        #d8b4fe,
                        #9333ea,
                        #c4b5fd
                    );
                }

                @keyframes chatbot-border-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .chatbot-icon-border {
                        animation: none;
                    }
                }

                /*
                 * Ambient violet glow behind the panel — softer in light
                 * mode, richer in dark mode.
                 */
                .chat-panel-glow {
                    background-image:
                        radial-gradient(60% 40% at 15% 0%, rgba(139,92,246,0.10), transparent 60%),
                        radial-gradient(50% 35% at 100% 15%, rgba(99,102,241,0.08), transparent 65%);
                }

                .dark .chat-panel-glow {
                    background-image:
                        radial-gradient(60% 40% at 15% 0%, rgba(124,58,237,0.28), transparent 60%),
                        radial-gradient(50% 35% at 100% 15%, rgba(99,102,241,0.18), transparent 65%);
                }

                /*
                 * Thin, theme-aware scrollbar for the chat panel.
                 * Violet thumb over a transparent track, small footprint.
                 */
                .chat-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(124, 58, 237, 0.3) transparent;
                }

                .chat-scroll::-webkit-scrollbar {
                    width: 5px;
                }

                .chat-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }

                .chat-scroll::-webkit-scrollbar-thumb {
                    background-color: rgba(124, 58, 237, 0.28);
                    border-radius: 9999px;
                }

                .chat-scroll::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(124, 58, 237, 0.45);
                }

                .dark .chat-scroll {
                    scrollbar-color: rgba(196, 181, 253, 0.3) transparent;
                }

                .dark .chat-scroll::-webkit-scrollbar-thumb {
                    background-color: rgba(196, 181, 253, 0.25);
                }

                .dark .chat-scroll::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(196, 181, 253, 0.4);
                }
            `}</style>

            {!open && (
                <div className="chat-widget-fab fixed right-4 bottom-4 z-[9999] flex items-center gap-2.5 sm:right-6 sm:bottom-6">
                    <div
                        className={`pointer-events-none flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-[13px] font-medium whitespace-nowrap text-white shadow-[0_4px_20px_rgba(139,92,246,0.45)] transition-all duration-500 ease-out sm:text-[13.5px] ${
                            teaserVisible ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-1.5 scale-95 opacity-0'
                        }`}
                        aria-hidden={!teaserVisible}
                    >
                        <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-white" />
                        Ask my AI assistant anything
                    </div>

                    <Button
                        size="icon"
                        onClick={handleOpen}
                        aria-label="Open chat"
                        className={`relative h-[56px] w-[56px] shrink-0 overflow-hidden rounded-full border-0 bg-transparent p-0 shadow-[0_6px_24px_rgba(124,58,237,0.35)] transition-transform duration-200 hover:scale-105 hover:bg-transparent active:scale-95 dark:bg-transparent dark:shadow-[0_6px_24px_rgba(124,58,237,0.5)] dark:hover:bg-transparent ${
                            isActivating ? 'scale-95' : ''
                        }`}
                    >
                        <MonochromeWaveIcon />
                    </Button>
                </div>
            )}

            {open && (
                <>
                    <div
                        className="animate-in fade-in fixed inset-0 z-[9998] bg-black/30 backdrop-blur-[2px] duration-200 sm:hidden dark:bg-black/60"
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />

                    <div
                        role="dialog"
                        aria-label="Chat with Dave's AI assistant"
                        className={`chat-panel-glow animate-in slide-in-from-bottom-8 fade-in fixed inset-x-0 top-[max(28px,_env(safe-area-inset-top))] bottom-0 z-[9999] flex flex-col overflow-hidden rounded-t-[24px] bg-white duration-300 sm:inset-auto sm:top-auto sm:right-6 sm:bottom-24 sm:h-[560px] sm:max-h-[calc(100vh-140px)] sm:w-[380px] sm:rounded-[20px] sm:shadow-[0_20px_60px_rgba(124,58,237,0.18)] sm:ring-1 sm:ring-violet-200 dark:bg-[#0d0a14] dark:sm:shadow-[0_20px_60px_rgba(76,29,149,0.45)] dark:sm:ring-violet-500/20 ${
                            isDragging ? '' : 'transition-transform ease-out'
                        }`}
                        style={{
                            transform: `translateY(${dragY}px)`,
                        }}
                    >
                        <div
                            className="relative z-10 shrink-0 touch-none"
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                        >
                            <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
                                <span className="h-[5px] w-9 rounded-full bg-black/15 dark:bg-white/20" />
                            </div>

                            <div className="relative z-10 flex items-center justify-between border-b border-black/[0.06] bg-transparent px-4 py-3 dark:border-white/[0.06]">
                                <div className="flex items-center gap-3">
                                    <div className="relative shrink-0">
                                        <MessageAvatar
                                            className="min-w-0 overflow-hidden rounded-full ring-1 ring-violet-300/50 dark:ring-violet-400/30"
                                            style={{
                                                width: 38,
                                                height: 38,
                                            }}
                                        >
                                            <img src="/dp.jpg" alt="Dave" />
                                        </MessageAvatar>

                                        <span className="absolute right-0 bottom-0 h-[10px] w-[10px] rounded-full bg-emerald-500 ring-2 ring-white dark:bg-emerald-400 dark:ring-[#0d0a14]" />
                                    </div>

                                    <div>
                                        <p className="text-[15px] leading-tight font-semibold tracking-tight text-[#151024] dark:text-white">
                                            Dave Michael Clapis
                                        </p>

                                        <p className="mt-0.5 flex items-center gap-1 text-[12px] font-medium text-violet-600/80 dark:text-violet-300/80">
                                            <SparkleIcon />
                                            AI assistant · Active now
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-0.5">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={handleReset}
                                        aria-label="Start a new conversation"
                                        title="Start a new conversation"
                                        className="h-8 w-8 rounded-full text-violet-500/70 hover:bg-violet-500/10 hover:text-violet-700 dark:text-violet-300/70 dark:hover:bg-white/10 dark:hover:text-white"
                                    >
                                        <TrashIcon />
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setOpen(false)}
                                        aria-label="Minimize chat"
                                        className="h-8 w-8 rounded-full text-violet-500/70 hover:bg-violet-500/10 hover:text-violet-700 dark:text-violet-300/70 dark:hover:bg-white/10 dark:hover:text-white"
                                    >
                                        <ChevronDownIcon />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-0 min-h-0 flex-1">
                            <ChatThread
                                messages={messages}
                                draft={draft}
                                onDraftChange={setDraft}
                                onSend={handleSend}
                                onSuggestionClick={sendMessage}
                                isTyping={isSending}
                                disabled={isSending}
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
