import { Button } from '@/components/ui/button';
import { MessageAvatar } from '@/components/ui/message';
import { sendChatMessage, type ChatTurn } from '@/lib/chat-api';
import { useEffect, useRef, useState } from 'react';
import ChatThread, { now, type ChatMessage } from './chat-thread';

// Clean Black & White Wave Visualizer
// Black & White Animated Aurora Borealis
// Replace the entire current MonochromeWaveIcon with this
const MonochromeWaveIcon = () => (
    <span className="aurora-icon" aria-hidden="true">
        <span className="aurora-orbit aurora-orbit-1">
            <span className="aurora-comet aurora-comet-1" />
        </span>
        <span className="aurora-orbit aurora-orbit-2">
            <span className="aurora-comet aurora-comet-2" />
        </span>
        <span className="aurora-orbit aurora-orbit-3">
            <span className="aurora-comet aurora-comet-3" />
        </span>
        <span className="aurora-orbit aurora-orbit-4">
            <span className="aurora-comet aurora-comet-4" />
        </span>
        <span className="aurora-glow" />
        <span className="aurora-core" />
    </span>
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
            <style>{`
             /* =========================================================
   TRUE MONOCHROME AURORA VORTEX
   Transparent background — black/white only
   Ribbons orbit/spiral around the center rather than sliding
   ========================================================= */

.aurora-icon {
    position: relative;
    display: block;
    width: 44px;
    height: 44px;
    overflow: hidden;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    isolation: isolate;
    animation: aurora-breathe 5s ease-in-out infinite;
}

.aurora-orbit {
    position: absolute;
    inset: 0;
    transform-origin: 50% 50%;
}

.aurora-comet {
    position: absolute;
    border-radius: 50%;
}

/* Orbit 1: wide, slow clockwise sweep with in/out spiral — 8s */
.aurora-orbit-1 { animation: spin-cw-1 8s linear infinite; }
.aurora-comet-1 {
    top: 2%; left: 50%;
    width: 34%; height: 46%;
    transform: translateX(-50%);
    background: linear-gradient(to bottom, transparent, currentColor 55%, transparent);
    opacity: 0.85;
    filter: blur(2.5px);
}
@keyframes spin-cw-1 {
    0%   { transform: rotate(0deg)   scale(0.85); }
    50%  { transform: rotate(180deg) scale(1.2); }
    100% { transform: rotate(360deg) scale(0.85); }
}

/* Orbit 2: fast counter-clockwise, tight radius — 3s */
.aurora-orbit-2 { animation: spin-ccw-2 3s linear infinite; }
.aurora-comet-2 {
    top: 8%; left: 50%;
    width: 22%; height: 30%;
    transform: translateX(-50%);
    background: linear-gradient(to bottom, transparent, currentColor 60%, transparent);
    opacity: 0.9;
    filter: blur(1.5px);
}
@keyframes spin-ccw-2 {
    0%   { transform: rotate(360deg); }
    100% { transform: rotate(0deg); }
}

/* Orbit 3: medium, diagonal drift, radius pulses in/out — 6s */
.aurora-orbit-3 { animation: spin-cw-3 6s ease-in-out infinite; }
.aurora-comet-3 {
    top: 4%; left: 50%;
    width: 28%; height: 40%;
    transform: translateX(-50%);
    background: linear-gradient(to bottom, transparent, currentColor 50%, transparent);
    opacity: 0.6;
    filter: blur(3px);
}
@keyframes spin-cw-3 {
    0%   { transform: rotate(0deg)   scale(1); }
    30%  { transform: rotate(140deg) scale(0.8); }
    65%  { transform: rotate(230deg) scale(1.25); }
    100% { transform: rotate(360deg) scale(1); }
}

/* Orbit 4: slowest, loosest, reverse direction — 10s */
.aurora-orbit-4 { animation: spin-ccw-4 10s ease-in-out infinite; }
.aurora-comet-4 {
    top: 0%; left: 50%;
    width: 40%; height: 50%;
    transform: translateX(-50%);
    background: linear-gradient(to bottom, transparent, currentColor 45%, transparent);
    opacity: 0.4;
    filter: blur(4px);
}
@keyframes spin-ccw-4 {
    0%   { transform: rotate(360deg) scale(0.9); }
    50%  { transform: rotate(180deg) scale(1.3); }
    100% { transform: rotate(0deg)   scale(0.9); }
}

.aurora-glow {
    position: absolute;
    inset: -20%;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle at 50% 50%, color-mix(in srgb, currentColor 18%, transparent) 0%, transparent 65%);
    filter: blur(6px);
    animation: glow-pulse 4.5s ease-in-out infinite;
}
@keyframes glow-pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.9); }
    50%      { opacity: 0.65; transform: scale(1.15); }
}

.aurora-core {
    position: absolute;
    inset: 38%;
    border-radius: 50%;
    pointer-events: none;
    background: currentColor;
    filter: blur(1px);
    animation: core-pulse 2.4s ease-in-out infinite;
}
@keyframes core-pulse {
    0%, 100% { opacity: 0.6; transform: scale(0.8); }
    50%      { opacity: 1;   transform: scale(1.25); }
}c

@keyframes aurora-breathe {
    0%, 100% { transform: scale(0.97); filter: brightness(0.88); }
    50%      { transform: scale(1.03); filter: brightness(1.12); }
}


            `}</style>

            {!open && (
                <div className="fixed right-4 bottom-4 z-[9999] flex items-center gap-2.5 sm:right-6 sm:bottom-6">
                    <div
                        className={`pointer-events-none flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-[13px] font-medium whitespace-nowrap text-white transition-all duration-500 ease-out sm:text-[13.5px] dark:bg-white dark:text-black ${
                            teaserVisible ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-1.5 scale-95 opacity-0'
                        }`}
                        aria-hidden={!teaserVisible}
                    >
                        <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-white dark:bg-black" />
                        Ask my AI assistant anything
                    </div>

                    {/* Pure Black and White Floating Action Button without borders or shadows */}
                    <Button
                        size="icon"
                        onClick={handleOpen}
                        aria-label="Open chat"
                        className={`relative h-[56px] w-[56px] shrink-0 overflow-hidden rounded-full border-0 bg-transparent p-0 text-black shadow-none transition-transform duration-200 hover:scale-105 hover:bg-transparent active:scale-95 dark:bg-transparent dark:text-white dark:hover:bg-transparent ${
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
                        style={{ transform: `translateY(${dragY}px)` }}
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
                                        <MessageAvatar className="min-w-0 overflow-hidden rounded-full" style={{ width: 38, height: 38 }}>
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
