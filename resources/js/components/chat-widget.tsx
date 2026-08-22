import { Button } from '@/components/ui/button';
import { MessageAvatar } from '@/components/ui/message';
import { sendChatMessage, type ChatTurn } from '@/lib/chat-api';
import { useEffect, useRef, useState } from 'react';
import ChatThread, { now, type ChatMessage } from './chat-thread';

const ChatBubbleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5.5h16v10.5H9.5L5.5 19v-3H4V5.5Z" />
        <path d="M8 9.5h8M8 12.5h5" />
    </svg>
);
const CloseIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6l12 12M18 6 6 18" />
    </svg>
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

/* ------------------------------------------------------------------ */
/*  Persistence — survives page refresh, expires after 24h so a        */
/*  returning visitor days later doesn't see a stale, contextless      */
/*  conversation instead of a clean first-open state.                  */
/*                                                                      */
/*  Note: only the conversation itself is persisted. Whether the        */
/*  teaser bubble has already been dismissed ("hasOpenedOnce") is       */
/*  intentionally kept OUT of storage and reset on every fresh page     */
/*  load — otherwise the teaser would stop appearing forever after      */
/*  the very first time someone opened the chat.                       */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'portfolio-chat-v1';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

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
        // Corrupted or blocked storage (private browsing, quota, etc.) —
        // fail quietly and just start a fresh conversation.
        return null;
    }
}

function savePersistedChat(data: PersistedChat) {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // Storage full or unavailable — chat still works for this session,
        // it just won't survive a refresh. Not worth surfacing to the user.
    }
}

function isMobileViewport() {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches;
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    // Deliberately NOT hydrated from storage — whether the teaser bubble
    // shows should reset on every fresh page load, independent of whether
    // there's a restored conversation. Persisting this would mean the
    // teaser never shows again once someone has opened the chat once,
    // even across brand new visits days later.
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

    // Persist only the conversation itself — see note above on why
    // hasOpenedOnce is excluded.
    useEffect(() => {
        savePersistedChat({ messages, savedAt: Date.now() });
    }, [messages]);

    useEffect(() => {
        if (open) setDragY(0);
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
                    loopTimer = setTimeout(() => cycle(0), 3000);
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
            if (activateTimer.current) clearTimeout(activateTimer.current);
        },
        [],
    );

    // Brief ripple/pulse "activation" beat before the panel opens —
    // same idea as a voice assistant flashing to life when tapped.
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
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (dragStartY.current === null) return;
        const delta = e.clientY - dragStartY.current;
        if (delta > 0) setDragY(delta);
    };

    const handlePointerUp = () => {
        if (dragStartY.current === null) return;
        if (dragY > DRAG_CLOSE_THRESHOLD) setOpen(false);
        setDragY(0);
        setIsDragging(false);
        dragStartY.current = null;
    };

    // Shared send path — used by the input box AND by tapping a
    // suggested question, so both go through identical logic.
    const sendMessage = async (raw: string) => {
        const text = raw.trim();
        if (!text || isSending) return;

        const userMessage: ChatMessage = { id: `v-${Date.now()}`, from: 'visitor', text, time: now() };
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
            setMessages((prev) => [...prev, { id: `d-${Date.now()}`, from: 'dave', text: reply, time: now() }]);
        } catch {
            setMessages((prev) => [...prev, { id: `d-${Date.now()}`, from: 'dave', text: FALLBACK_REPLY, time: now() }]);
        } finally {
            setIsSending(false);
        }
    };

    const handleSend = () => sendMessage(draft);

    return (
        <>
            {/* Keyframes for the FAB activation ripple and the empty-state orb.
                Scoped here so this widget stays a drop-in, self-contained component. */}
            <style>{`
                @keyframes chat-ripple {
                    0% { transform: scale(0.85); opacity: 0.6; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
                @keyframes orb-rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes orb-breathe {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.06); }
                }
                @keyframes orb-pop-in {
                    0% { transform: scale(0.85); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>

            {!open && (
                <div className="fixed right-4 bottom-4 z-[9999] flex items-center gap-2.5 sm:right-6 sm:bottom-6">
                    <div
                        className={`pointer-events-none flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-[13px] font-medium whitespace-nowrap text-[#101010] shadow-[0_10px_30px_rgba(0,0,0,0.14)] ring-1 ring-black/[0.06] backdrop-blur-sm transition-all duration-500 ease-out sm:text-[13.5px] ${
                            teaserVisible ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-1.5 scale-95 opacity-0'
                        }`}
                        aria-hidden={!teaserVisible}
                    >
                        <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#31A24C] shadow-[0_0_0_3px_rgba(49,162,76,0.2)]" />
                        Ask my AI assistant anything
                    </div>

                    <Button
                        size="icon"
                        onClick={handleOpen}
                        aria-label="Open chat"
                        className={`relative h-[58px] w-[58px] shrink-0 rounded-full bg-gradient-to-br from-[#232323] to-[#0a0a0a] text-white shadow-[0_16px_34px_rgba(0,0,0,0.28)] ring-1 ring-white/10 transition-transform duration-200 hover:scale-105 active:scale-95 ${
                            isActivating ? 'scale-95' : ''
                        }`}
                    >
                        {isActivating && (
                            <>
                                <span
                                    className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#A78BFA]"
                                    style={{ animation: 'chat-ripple 0.9s ease-out forwards' }}
                                />
                                <span
                                    className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#A78BFA]"
                                    style={{ animation: 'chat-ripple 0.9s ease-out 0.15s forwards' }}
                                />
                                <span
                                    className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#A78BFA]"
                                    style={{ animation: 'chat-ripple 0.9s ease-out 0.3s forwards' }}
                                />
                            </>
                        )}
                        <ChatBubbleIcon />
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#101010] shadow-sm">
                            <SparkleIcon />
                        </span>
                    </Button>
                </div>
            )}

            {open && (
                <>
                    <div
                        className="animate-in fade-in fixed inset-0 z-[9998] bg-black/40 backdrop-blur-[2px] duration-200 sm:hidden"
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />

                    <div
                        role="dialog"
                        aria-label="Chat with Dave's AI assistant"
                        className={`animate-in slide-in-from-bottom-8 fade-in fixed inset-x-0 top-[max(28px,_env(safe-area-inset-top))] bottom-0 z-[9999] flex flex-col overflow-hidden rounded-t-[24px] bg-[#FBFAF8] shadow-[0_-20px_60px_rgba(0,0,0,0.28)] duration-300 sm:inset-auto sm:top-auto sm:right-6 sm:bottom-24 sm:h-[560px] sm:max-h-[calc(100vh-140px)] sm:w-[380px] sm:rounded-[20px] sm:shadow-[0_24px_60px_rgba(0,0,0,0.18),0_4px_14px_rgba(0,0,0,0.08)] sm:ring-1 sm:ring-violet-200/50 ${
                            isDragging ? '' : 'transition-transform ease-out'
                        }`}
                        style={{ transform: `translateY(${dragY}px)` }}
                    >
                        {/* Soft violet wash at the top of the panel — subtle, single-hue */}
                        <div
                            className="pointer-events-none absolute inset-x-0 top-0 z-0 h-44"
                            style={{ background: 'linear-gradient(to bottom, rgba(124,58,237,0.08), transparent)' }}
                            aria-hidden="true"
                        />

                        <div
                            className="relative z-10 shrink-0 touch-none"
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                        >
                            <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
                                <span className="h-[5px] w-9 rounded-full bg-black/15" />
                            </div>

                            <div className="relative z-10 flex items-center justify-between bg-white/90 px-4 py-3 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="relative shrink-0">
                                        <MessageAvatar
                                            className="min-w-0 overflow-hidden rounded-full ring-1 ring-black/5"
                                            style={{ width: 38, height: 38 }}
                                        >
                                            <img src="/dp.jpg" alt="" />
                                        </MessageAvatar>
                                        <span className="absolute right-0 bottom-0 h-[11px] w-[11px] rounded-full border-2 border-white bg-[#31A24C]" />
                                    </div>
                                    <div>
                                        <p className="text-[15px] leading-tight font-semibold tracking-tight text-[#101010]">Dave Michael Clapis</p>
                                        <p className="mt-0.5 flex items-center gap-1 text-[12px] font-medium text-[#8a877f]">
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
                                        className="h-8 w-8 rounded-full text-[#6b6863] hover:bg-black/[0.05] hover:text-[#101010]"
                                    >
                                        <TrashIcon />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setOpen(false)}
                                        aria-label="Minimize chat"
                                        className="h-8 w-8 rounded-full text-[#6b6863] hover:bg-black/[0.05] hover:text-[#101010]"
                                    >
                                        <ChevronDownIcon />
                                    </Button>
                                </div>
                            </div>
                            <div className="h-px bg-gradient-to-r from-transparent via-[#7C3AED]/15 to-transparent" />
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
