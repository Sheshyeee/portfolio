import { Button } from '@/components/ui/button';
import { MessageAvatar } from '@/components/ui/message';
import { sendChatMessage, type ChatTurn } from '@/lib/chat-api';
import { useEffect, useRef, useState } from 'react';
import ChatThread, { now, type ChatMessage } from './chat-thread';

/*
 * Chatbot icon
 *
 * Light mode:
 *   - Dark / purple robot
 *   - Purple-blue animated border
 *
 * Dark mode:
 *   - Beige / yellow robot
 *   - Warm gold animated border
 *
 * The image itself does NOT animate.
 * Only the outer border has a subtle slow rotation.
 */
const MonochromeWaveIcon = () => (
    <span className="chatbot-icon-wrap relative block h-full w-full rounded-full p-[2px]" aria-hidden="true">
        {/* Animated border */}
        <span className="chatbot-icon-border absolute inset-0 rounded-full" aria-hidden="true" />

        {/* Icon image */}
        <span className="relative block h-full w-full overflow-hidden rounded-full">
            {/* Light mode: dark/purple robot */}
            <img src="/chatbot-icon-light.png" alt="" draggable={false} className="block h-full w-full rounded-full object-cover dark:hidden" />

            {/* Dark mode: beige/yellow robot */}
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
                 * Subtle animated chatbot border.
                 *
                 * The actual robot image stays completely static.
                 * Only the border rotates slowly.
                 */

                .chatbot-icon-border {
                    background: conic-gradient(
                        from 0deg,
                        #7c3aed,
                        #a78bfa,
                        #60a5fa,
                        #7c3aed,
                        #4f46e5,
                        #7c3aed
                    );
                    animation: chatbot-border-spin 7s linear infinite;
                    filter: blur(0.2px);
                    opacity: 0.95;
                }

                /*
                 * Dark mode uses warm cream/gold colors
                 * matching the beige/yellow robot.
                 */
                .dark .chatbot-icon-border {
                    background: conic-gradient(
                        from 0deg,
                        #f6d28b,
                        #fff1c7,
                        #e8b968,
                        #ffe5a8,
                        #d9a85c,
                        #f6d28b
                    );
                }

                @keyframes chatbot-border-spin {
                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }
                }

                /*
                 * Respect users who have reduced-motion enabled.
                 */
                @media (prefers-reduced-motion: reduce) {
                    .chatbot-icon-border {
                        animation: none;
                    }
                }
            `}</style>

            {!open && (
                <div className="chat-widget-fab fixed right-4 bottom-4 z-[9999] flex items-center gap-2.5 sm:right-6 sm:bottom-6">
                    <div
                        className={`pointer-events-none flex items-center gap-2 rounded-full bg-violet-200 px-4 py-2.5 text-[13px] font-medium whitespace-nowrap text-black transition-all duration-500 ease-out sm:text-[13.5px] ${
                            teaserVisible ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-1.5 scale-95 opacity-0'
                        }`}
                        aria-hidden={!teaserVisible}
                    >
                        <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-black dark:bg-black" />
                        Ask my AI assistant anything
                    </div>

                    <Button
                        size="icon"
                        onClick={handleOpen}
                        aria-label="Open chat"
                        className={`relative h-[56px] w-[56px] shrink-0 overflow-hidden rounded-full border-0 bg-transparent p-0 shadow-none transition-transform duration-200 hover:scale-105 hover:bg-transparent active:scale-95 dark:bg-transparent dark:hover:bg-transparent ${
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
                        className="animate-in fade-in fixed inset-0 z-[9998] bg-black/50 backdrop-blur-[2px] duration-200 sm:hidden"
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />

                    <div
                        role="dialog"
                        aria-label="Chat with Dave's AI assistant"
                        className={`animate-in slide-in-from-bottom-8 fade-in fixed inset-x-0 top-[max(28px,_env(safe-area-inset-top))] bottom-0 z-[9999] flex flex-col overflow-hidden rounded-t-[24px] bg-white duration-300 sm:inset-auto sm:top-auto sm:right-6 sm:bottom-24 sm:h-[560px] sm:max-h-[calc(100vh-140px)] sm:w-[380px] sm:rounded-[20px] dark:bg-black ${
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
                                <span className="h-[5px] w-9 rounded-full bg-black/20 dark:bg-white/20" />
                            </div>

                            <div className="relative z-10 flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
                                <div className="flex items-center gap-3">
                                    <div className="relative shrink-0">
                                        <MessageAvatar
                                            className="min-w-0 overflow-hidden rounded-full"
                                            style={{
                                                width: 38,
                                                height: 38,
                                            }}
                                        >
                                            <img src="/dp.jpg" alt="Dave" />
                                        </MessageAvatar>

                                        <span className="absolute right-0 bottom-0 h-[10px] w-[10px] rounded-full bg-black dark:bg-white" />
                                    </div>

                                    <div>
                                        <p className="text-[15px] leading-tight font-semibold tracking-tight text-black dark:text-white">
                                            Dave Michael Clapis
                                        </p>

                                        <p className="mt-0.5 flex items-center gap-1 text-[12px] font-medium text-zinc-600 dark:text-zinc-400">
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
                                        className="h-8 w-8 rounded-full text-zinc-600 hover:bg-black/5 hover:text-black dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                                    >
                                        <TrashIcon />
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setOpen(false)}
                                        aria-label="Minimize chat"
                                        className="h-8 w-8 rounded-full text-zinc-600 hover:bg-black/5 hover:text-black dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
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
