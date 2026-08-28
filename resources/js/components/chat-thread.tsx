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
            className="min-w-0 self-end overflow-hidden rounded-full ring-1 ring-black/5 dark:ring-white/10"
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
        >
            <img src="/dp.jpg" alt="" />
        </MessageAvatarBase>
    );
}

/* First-mount hero: an animated gradient orb (voice-assistant style)
   stands in for the old text greeting bubble. Suggested questions sit
   underneath it — this whole block only renders while there are no
   messages yet, and disappears the moment the conversation starts. */
function EmptyState({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
    return (
        <div className="flex h-full flex-col items-center justify-center px-6 pb-6 text-center">
            <div className="relative mb-5 h-28 w-28" style={{ animation: 'orb-pop-in 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
                <div
                    className="absolute inset-0 rounded-full opacity-80 blur-lg"
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

            <p className="text-[15px] font-semibold tracking-tight text-[#101010] dark:text-[#e5e5e5]">Hey, I'm Dave's AI assistant</p>
            <p className="mt-1.5 max-w-[240px] text-[13px] leading-relaxed text-[#8a877f] dark:text-[#a9a9a9]">
                Ask about his projects, stack, experience, or how to get in touch.
            </p>

            <div className="mt-6 flex w-full max-w-[280px] flex-col gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                        key={q}
                        type="button"
                        onClick={() => onSuggestionClick(q)}
                        className="rounded-full border border-black/10 bg-gradient-to-r from-[#F8F6F3] to-white px-4 py-2 text-[13px] font-medium text-[#101010] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-black/15 hover:from-[#F0EFEC] active:scale-[0.98] dark:border-white/15 dark:from-neutral-800 dark:to-neutral-700 dark:text-neutral-200 dark:hover:from-neutral-700"
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
        <div className="flex h-full flex-col bg-[#FBFAF8] dark:bg-[#0a0a0a]">
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
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
                                                    ? 'w-fit max-w-[78%] bg-white px-3.5 py-2.5 text-[14px] leading-relaxed text-[#1a1a1a] shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.06] dark:bg-neutral-100 dark:text-neutral-900 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] dark:ring-white/[0.08]'
                                                    : 'w-fit max-w-[78%] bg-[#101010] px-3.5 py-2.5 text-[14px] leading-relaxed text-white shadow-[0_2px_10px_rgba(0,0,0,0.14)] dark:bg-neutral-800 dark:text-neutral-200'
                                            }
                                        >
                                            {m.text}
                                        </MessageContent>
                                    </Message>

                                    {showDelivered && (
                                        <span className="mt-1 pr-1 text-right text-[11px] font-medium text-[#a8a6a1] dark:text-neutral-400">
                                            Sent
                                        </span>
                                    )}
                                </div>
                            );
                        })}

                        {isTyping && (
                            <Message align="start" className="items-end gap-2">
                                <DaveAvatar />
                                <MessageContent className="flex w-fit flex-row items-center gap-1.5 rounded-[18px] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.06] dark:bg-neutral-100 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] dark:ring-white/[0.08]">
                                    <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-[#c4c2bd] [animation-delay:-0.3s] dark:bg-neutral-600" />
                                    <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-[#c4c2bd] [animation-delay:-0.15s] dark:bg-neutral-600" />
                                    <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-[#c4c2bd] dark:bg-neutral-600" />
                                </MessageContent>
                            </Message>
                        )}

                        <div ref={bottomRef} />
                    </div>
                )}
            </div>

            <div
                className="flex shrink-0 items-center gap-2 border-t border-black/[0.06] bg-white/90 px-3.5 py-3 backdrop-blur-sm dark:border-white/[0.06] dark:bg-neutral-900/90"
                style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
            >
                <Input
                    value={draft}
                    onChange={(e) => onDraftChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about Dave's work..."
                    disabled={disabled}
                    className="h-10 flex-1 rounded-full border-none bg-[#F1F0EC] px-4 text-[14px] text-neutral-900 placeholder:text-[#9b9994] focus-visible:ring-2 focus-visible:ring-neutral-400/40 disabled:opacity-60 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus-visible:ring-neutral-400/50"
                />
                <Button
                    size="icon"
                    onClick={onSend}
                    disabled={!draft.trim() || disabled}
                    className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-[#151515] to-[#0a0a0a] text-white shadow-[0_4px_14px_rgba(0,0,0,0.28)] transition-transform hover:scale-105 active:scale-95 disabled:opacity-25 disabled:shadow-none dark:from-neutral-200 dark:to-neutral-100 dark:text-neutral-900 dark:shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
                    aria-label="Send message"
                >
                    <SendArrowIcon />
                </Button>
            </div>
        </div>
    );
}
