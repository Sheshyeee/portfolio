import { useEffect, useMemo, useState } from 'react';

// 👉 Change these to match your app
const APP_NAME = 'App';
const BACKGROUND_COLOR = '#FFFFFF'; // page background behind the shatter (white)
const BASE_COLOR = '#000000'; // final, settled letter color (black)
const HIGHLIGHT_COLOR = '#333333'; // front shard tint while in flight (soft gray)
const SHADOW_COLOR = '#000000'; // back shard tint while in flight (near-black)

// ---- timing (ms) ----------------------------------------------------------
const ALIGN_DELAY_BASE = 150; // when the very first shard starts moving
const LETTER_STAGGER = 90; // delay added per letter, left to right
const SHARD_GAP = 60; // extra delay for a letter's second shard (the "snap")
const TRANSFORM_DURATION = 950; // how long a shard takes to fly into place
const COLOR_SETTLE_DURATION = 550; // how long the highlight/shadow tint takes to fade to base
const HOLD_DURATION = 550; // pause once fully assembled, before fading out
const EXIT_DURATION = 500; // fade-out duration

interface LoadingScreenProps {
    onComplete: () => void;
}

interface CrackPoint {
    x: number; // 0-100, percentage across the letter box
    y: number; // 0-100
}

interface ShardTransform {
    x: number;
    y: number;
    r: number;
    scale: number;
}

interface LetterPieces {
    crack: CrackPoint[];
    front: ShardTransform; // highlight shard, clipped to the left/top side of the crack
    back: ShardTransform; // shadow shard, clipped to the right/bottom side of the crack
}

// A jagged vertical-ish crack from the top of the letter to the bottom.
function makeCrack(): CrackPoint[] {
    const ys = [0, 22, 45, 68, 88, 100];
    return ys.map((y) => ({ y, x: 38 + Math.random() * 24 }));
}

function frontClipPath(crack: CrackPoint[]): string {
    // Use the exact crack coordinates in order for the front polygon
    const mid = crack.map((p) => `${p.x}% ${p.y}%`).join(', ');
    return `polygon(0% 0%, ${mid}, 0% 100%)`;
}

function backClipPath(crack: CrackPoint[]): string {
    // Mirror the same crack coordinates in reverse order so the seam is pixel-perfect
    const midReversed = [...crack].slice().reverse().map((p) => `${p.x}% ${p.y}%`).join(', ');
    return `polygon(100% 0%, 100% 100%, ${midReversed}, 100% 0%)`;
}

// Wide, chaotic scatter so pieces genuinely feel "shattered" across the screen.
function randomShardStart(): ShardTransform {
    const angle = Math.random() * Math.PI * 2;
    const dist = 220 + Math.random() * 380;
    return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        r: (Math.random() - 0.5) * 300,
        scale: 0.4 + Math.random() * 0.5,
    };
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const letters = useMemo(() => APP_NAME.split(''), []);

    const [pieces] = useState<LetterPieces[]>(() =>
            letters.map((letter) => {
                if (letter === ' ') return { crack: [], front: randomShardStart(), back: randomShardStart() };

                const crack = makeCrack();

                // Generate a single base transform and mirror it for the opposing shard so
                // both shards follow symmetric motion. This makes the jagged crack line
                // remain consistent between the two halves during the entire flight.
                const base = randomShardStart();
                const mirrored = {
                    x: -base.x,
                    y: base.y,
                    r: -base.r,
                    scale: base.scale,
                } as ShardTransform;

                return {
                    crack,
                    front: base,
                    back: mirrored,
                };
            }),
        );

    const [aligned, setAligned] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [progress, setProgress] = useState(0);

    const lastLetterDelay = ALIGN_DELAY_BASE + Math.max(0, letters.length - 1) * LETTER_STAGGER + SHARD_GAP;
    const lastLetterFinish = lastLetterDelay + TRANSFORM_DURATION;
    const exitStart = lastLetterFinish + HOLD_DURATION;
    const completeTime = exitStart + EXIT_DURATION;

    useEffect(() => {
        const toAligned = setTimeout(() => setAligned(true), 20);
        const toExit = setTimeout(() => setExiting(true), exitStart);
        const toComplete = setTimeout(() => onComplete(), completeTime);

        const start = performance.now();
        let raf: number;
        const tick = (now: number) => {
            const elapsed = now - start;
            const pct = Math.min(100, Math.round((elapsed / lastLetterFinish) * 100));
            setProgress(pct);
            if (elapsed < lastLetterFinish) {
                raf = requestAnimationFrame(tick);
            } else {
                setProgress(100);
            }
        };
        raf = requestAnimationFrame(tick);

        return () => {
            clearTimeout(toAligned);
            clearTimeout(toExit);
            clearTimeout(toComplete);
            cancelAnimationFrame(raf);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onComplete]);

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity ease-in-out"
            style={{
                backgroundColor: BACKGROUND_COLOR,
                opacity: exiting ? 0 : 1,
                transitionDuration: `${EXIT_DURATION}ms`,
                pointerEvents: exiting ? 'none' : 'auto',
            }}
        >
            <style>{`
                @keyframes shatterSnapFlash {
                                    0% { filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
                                    55% { filter: drop-shadow(0 0 18px rgba(200,200,200,0.55)); }
                                    100% { filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
                }
            `}</style>

            <div className="flex">
                {letters.map((letter, i) => {
                    const p = pieces[i];
                    const letterDelay = ALIGN_DELAY_BASE + i * LETTER_STAGGER;
                    const frontDelay = letterDelay;
                    const backDelay = letterDelay + SHARD_GAP;
                    const finishTime = backDelay + TRANSFORM_DURATION;

                    if (letter === ' ') {
                        return (
                            <span key={i} className="inline-block text-6xl sm:text-7xl lg:text-8xl">
                                {'\u00A0'}
                            </span>
                        );
                    }

                    const sharedFontStyle: React.CSSProperties = {
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                    };

                    const shardBaseStyle = (delay: number, t: ShardTransform, tint: string, clip: string): React.CSSProperties => ({
                        ...sharedFontStyle,
                        position: 'absolute',
                        inset: 0,
                        clipPath: clip,
                        WebkitClipPath: clip,
                        color: aligned ? BASE_COLOR : tint,
                                            transformOrigin: 'center center',
                                            backfaceVisibility: 'hidden',
                                            transform: aligned
                                                ? 'translate(0px, 0px) rotate(0deg) scale(1)'
                                                : `translate(${t.x}px, ${t.y}px) rotate(${t.r}deg) scale(${t.scale})`,
                                            transition: [
                                                `transform ${TRANSFORM_DURATION}ms cubic-bezier(0.2, 1.6, 0.4, 1) ${delay}ms`,
                                                `color ${COLOR_SETTLE_DURATION}ms ease-out ${delay + TRANSFORM_DURATION - 250}ms`,
                                            ].join(', '),
                                            animation: aligned ? `shatterSnapFlash 650ms ease-out ${finishTime}ms` : 'none',
                                            willChange: 'transform',
                                        });

                    return (
                        <span key={i} className="relative inline-block text-6xl sm:text-7xl lg:text-8xl" style={sharedFontStyle}>
                            {/* invisible spacer keeps layout width correct */}
                            <span className="invisible">{letter}</span>

                            {/* back / shadow shard */}
                            <span aria-hidden style={shardBaseStyle(backDelay, p.back, SHADOW_COLOR, backClipPath(p.crack))}>
                                {letter}
                            </span>

                            {/* front / highlight shard */}
                            <span aria-hidden style={shardBaseStyle(frontDelay, p.front, HIGHLIGHT_COLOR, frontClipPath(p.crack))}>
                                {letter}
                            </span>
                        </span>
                    );
                })}
            </div>

            <div className="mt-14 flex flex-col items-center gap-3" style={{ color: BASE_COLOR }}>
                <span className="text-lg font-semibold tabular-nums opacity-90">{progress}%</span>
                <div className="h-[3px] w-40 overflow-hidden rounded-full bg-white/15">
                    <div
                        className="h-full rounded-full"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: BASE_COLOR,
                            transition: 'width 120ms linear',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
