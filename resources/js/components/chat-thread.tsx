import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message, MessageAvatar as MessageAvatarBase, MessageContent } from '@/components/ui/message';
import { useEffect, useRef } from 'react';

export type ChatMessage = {
    id: string;
    from: 'dave' | 'visitor';
    text: string;
    time: string;
};

export const now = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const SendArrowIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11 20 4l-6.5 16-3-6.5L4 11Z" />
    </svg>
);

const SUGGESTED_QUESTIONS = ["What's your tech stack?", 'Walk me through your projects', "What's your experience?", 'How do I get in touch?'];

type ChatThreadProps = {
    messages: ChatMessage[];
    draft: string;
    onDraftChange: (value: string) => void;
    onSend: () => void;
    onSuggestionClick: (text: string) => void;
    isTyping?: boolean;
    disabled?: boolean;
};

function isLastInGroup(messages: ChatMessage[], index: number) {
    const next = messages[index + 1];
    return !next || next.from !== messages[index].from;
}

function isFirstInGroup(messages: ChatMessage[], index: number) {
    const prev = messages[index - 1];
    return !prev || prev.from !== messages[index].from;
}

const AVATAR_SIZE = 30;

function DaveAvatar() {
    return (
        <MessageAvatarBase
            className="min-w-0 self-end overflow-hidden rounded-full ring-1 ring-violet-300/50 dark:ring-violet-400/30"
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
        >
            <img src="/dp.jpg" alt="" />
        </MessageAvatarBase>
    );
}

/* First-mount hero: an animated violet gradient orb (voice-assistant style)
   stands in for the old text greeting bubble. Suggested questions sit
   underneath it — this whole block only renders while there are no
   messages yet, and disappears the moment the conversation starts. */
function EmptyState({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
    return (
        <div className="flex h-full flex-col items-center justify-center px-6 pb-6 text-center">
            <div
                className="relative mb-5 h-28 w-28 text-violet-500 dark:text-violet-400"
                style={{ animation: 'orb-pop-in 0.5s cubic-bezier(0.16,1,0.3,1)' }}
            >
                <div
                    className="absolute inset-0 rounded-full opacity-70 blur-lg dark:opacity-80"
                    style={{
                        background: 'conic-gradient(from 0deg, currentColor, transparent 30%, currentColor 60%, transparent)',
                        animation: 'orb-rotate 8s linear infinite',
                    }}
                    aria-hidden="true"
                />
                <div
                    className="absolute inset-3 rounded-full"
                    style={{
                        background: 'radial-gradient(circle at 32% 28%, currentColor, transparent 70%)',
                        animation: 'orb-breathe 3.6s ease-in-out infinite',
                        boxShadow: '0 8px 30px color-mix(in srgb, currentColor 30%, transparent)',
                    }}
                    aria-hidden="true"
                />
            </div>

            <p className="text-[15px] font-semibold tracking-tight text-[#151024] dark:text-white">Hey, I'm Dave's AI assistant</p>
            <p className="mt-1.5 max-w-[240px] text-[13px] leading-relaxed text-violet-700/50 dark:text-violet-200/60">
                Ask about his projects, stack, experience, or how to get in touch.
            </p>

            <div className="mt-6 flex w-full max-w-[280px] flex-col gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                        key={q}
                        type="button"
                        onClick={() => onSuggestionClick(q)}
                        className="rounded-full border border-violet-200 bg-violet-50/60 px-4 py-2 text-[13px] font-medium text-violet-900 shadow-[0_1px_2px_rgba(124,58,237,0.06)] transition-colors hover:border-violet-300 hover:bg-violet-100/70 active:scale-[0.98] dark:border-violet-400/20 dark:bg-white/[0.04] dark:text-violet-100 dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:hover:border-violet-400/40 dark:hover:bg-white/[0.08]"
                    >
                        {q}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function ChatThread({ messages, draft, onDraftChange, onSend, onSuggestionClick, isTyping, disabled }: ChatThreadProps) {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const hasMessages = messages.length > 0;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages, isTyping]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onSend();
    };

    const lastVisitorIndex = [...messages].map((m) => m.from).lastIndexOf('visitor');

    return (
        <div className="flex h-full flex-col bg-white dark:bg-transparent">
            <div className="chat-scroll flex-1 overflow-y-auto overscroll-contain px-4 py-5">
                {!hasMessages ? (
                    <EmptyState onSuggestionClick={onSuggestionClick} />
                ) : (
                    <div className="flex flex-col gap-[6px]">
                        {messages.map((m, i) => {
                            const showAvatar = m.from === 'dave' && isLastInGroup(messages, i);
                            const first = isFirstInGroup(messages, i);
                            const last = isLastInGroup(messages, i);
                            const showDelivered = m.from === 'visitor' && i === lastVisitorIndex && !isTyping;

                            const radius =
                                m.from === 'visitor'
                                    ? `${first ? '18px' : '6px'} 18px 18px ${last ? '18px' : '6px'}`
                                    : `18px ${first ? '18px' : '6px'} ${last ? '18px' : '6px'} 18px`;

                            return (
                                <div key={m.id} className="flex flex-col">
                                    <Message align={m.from === 'visitor' ? 'end' : 'start'} className="items-end gap-2">
                                        {m.from === 'dave' &&
                                            (showAvatar ? <DaveAvatar /> : <div style={{ width: AVATAR_SIZE }} className="shrink-0" />)}

                                        <MessageContent
                                            style={{ borderRadius: radius }}
                                            className={
                                                m.from === 'dave'
                                                    ? 'w-fit max-w-[78%] bg-violet-50/70 px-3.5 py-2.5 text-[14px] leading-relaxed text-[#1a1530] ring-1 ring-violet-100 dark:bg-white/[0.06] dark:text-violet-50 dark:ring-white/[0.08] dark:backdrop-blur-sm'
                                                    : 'w-fit max-w-[78%] bg-gradient-to-br from-violet-600 to-purple-700 px-3.5 py-2.5 text-[14px] leading-relaxed text-white shadow-[0_4px_16px_rgba(124,58,237,0.25)] dark:shadow-[0_4px_16px_rgba(124,58,237,0.35)]'
                                            }
                                        >
                                            {m.text}
                                        </MessageContent>
                                    </Message>

                                    {showDelivered && (
                                        <span className="mt-1 pr-1 text-right text-[11px] font-medium text-violet-400/70 dark:text-violet-300/50">
                                            Sent
                                        </span>
                                    )}
                                </div>
                            );
                        })}

                        {isTyping && (
                            <Message align="start" className="items-end gap-2">
                                <DaveAvatar />
                                <MessageContent className="flex w-fit flex-row items-center gap-1.5 rounded-[18px] bg-violet-50/70 px-4 py-3 ring-1 ring-violet-100 dark:bg-white/[0.06] dark:ring-white/[0.08]">
                                    <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-violet-400/70 [animation-delay:-0.3s] dark:bg-violet-300/70" />
                                    <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-violet-400/70 [animation-delay:-0.15s] dark:bg-violet-300/70" />
                                    <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-violet-400/70 dark:bg-violet-300/70" />
                                </MessageContent>
                            </Message>
                        )}

                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            <div
                className="flex shrink-0 items-center gap-2 border-t border-violet-100 bg-white/90 px-3.5 py-3 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03]"
                style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
            >
                <Input
                    value={draft}
                    onChange={(e) => onDraftChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about Dave's work..."
                    disabled={disabled}
                    className="h-10 flex-1 rounded-full border-none bg-violet-50/80 px-4 text-[14px] text-[#1a1530] placeholder:text-violet-400/60 focus-visible:ring-2 focus-visible:ring-violet-400/40 disabled:opacity-60 dark:bg-white/[0.06] dark:text-violet-50 dark:placeholder:text-violet-300/40"
                />
                <Button
                    size="icon"
                    onClick={onSend}
                    disabled={!draft.trim() || disabled}
                    className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)] transition-transform hover:scale-105 active:scale-95 disabled:opacity-25 disabled:shadow-none dark:shadow-[0_4px_14px_rgba(124,58,237,0.45)]"
                    aria-label="Send message"
                >
                    <SendArrowIcon />
                </Button>
            </div>
        </div>
    );
}
