'use client';

import { useEffect, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  IntroAnimation                                                     */
/* ------------------------------------------------------------------ */
/*
 * Logo intro for the wordmark "dave studio", mimicking the reference
 * video exactly:
 *
 *   Phase 1 — a gray square "chip" falls straight down from the top of
 *   the viewport, tumbling / wobbling like a die under gravity and
 *   shrinking as it approaches its resting spot above the wordmark.
 *
 *   Phase 2 — while it falls, "dave" is revealed left-to-right as a
 *   continuous width-wipe (not letter typing) in orange, and the
 *   stacked "STU / DIO" block fades in to the right and stays static.
 *
 *   Phase 3 — the instant the chip lands it "stamps": colors snap in
 *   one abrupt cut — "dave" -> near-black, "STUDIO" -> gray, chip ->
 *   orange — then the chip fades so the clean wordmark is left, exactly
 *   like the video's final frame.
 *
 * Motion is pure CSS @keyframes so it runs on mount without any
 * measurement — it always plays. One timer flips the `landed` class
 * for the color snap.
 */

const FALL_MS = 1500; // square fall + wordmark wipe both finish here
const REVEAL_START_MS = 360; // wipe begins partway into the fall
const HOLD_MS = 650; // hold on the finished logo before handoff

export const INTRO_DURATION_MS = FALL_MS + HOLD_MS;

/* exact hex from the brief */
const GRAY_CHIP = '#a6a6ab';
const ACCENT = '#f58b2f';
const ACCENT_DOT = '#f5981a';
const INK = '#121212';
const SUB_GRAY = '#b0afb4';

type Props = {
    onFinished?: () => void;
};

export default function IntroAnimation({ onFinished }: Props) {
    const [landed, setLanded] = useState(false);

    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];
        timers.push(setTimeout(() => setLanded(true), FALL_MS));
        timers.push(setTimeout(() => onFinished?.(), INTRO_DURATION_MS));
        return () => timers.forEach(clearTimeout);
    }, [onFinished]);

    return (
        <div className={`intro ${landed ? 'is-landed' : ''}`} role="img" aria-label="dave studio">
            <style>{`
                .intro {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: clamp(12px, 1.6vw, 26px);
                    font-family: var(--font-poppins), 'Poppins', 'Montserrat', ui-sans-serif, system-ui, sans-serif;
                    -webkit-font-smoothing: antialiased;
                    --chip: ${GRAY_CHIP};
                    --word: ${ACCENT};
                    --sub: ${ACCENT};
                }
                .intro.is-landed { --chip: ${ACCENT_DOT}; --word: ${INK}; --sub: ${SUB_GRAY}; }

                /* ---- wordmark "dave": revealed by a left->right width wipe ---- */
                .intro__word {
                    font-weight: 800;
                    font-size: clamp(78px, 15vw, 180px);
                    line-height: .9;
                    letter-spacing: -0.03em;
                    color: var(--word);
                    transition: color 90ms linear;                 /* the snap */
                    clip-path: inset(0 100% 0 -0.06em);
                    animation: intro-reveal ${FALL_MS - REVEAL_START_MS}ms cubic-bezier(.45,0,.2,1) ${REVEAL_START_MS}ms forwards;
                }
                @keyframes intro-reveal {
                    to { clip-path: inset(0 -0.06em 0 -0.06em); }
                }

                /* ---- stacked "STU / DIO": fades in early, stays static ---- */
                .intro__sub {
                    display: flex;
                    flex-direction: column;
                    font-weight: 600;
                    font-size: clamp(23px, 4.4vw, 52px);
                    line-height: 1.0;
                    letter-spacing: .1em;
                    text-transform: uppercase;
                    color: var(--sub);
                    transition: color 90ms linear;                 /* the snap */
                    opacity: 0;
                    transform: translateY(6px);
                    animation: intro-sub-in 640ms cubic-bezier(.16,1,.3,1) 300ms forwards;
                }
                @keyframes intro-sub-in {
                    to { opacity: 1; transform: translateY(0); }
                }

                /* ---- falling chip: outer = gravity fall, inner = tumble ---- */
                .intro__faller {
                    position: absolute;
                    left: clamp(18px, 4vw, 52px);
                    top: -1.1em;
                    width: clamp(14px, 1.2vw, 18px);
                    height: clamp(14px, 1.2vw, 18px);
                    animation: intro-fall ${FALL_MS}ms cubic-bezier(.6,.05,.95,.35) forwards;
                    will-change: transform;
                }
                @keyframes intro-fall {
                    0%   { transform: translateY(-84vh); }
                    100% { transform: translateY(0); }
                }
                .intro__chip {
                    width: 100%;
                    height: 100%;
                    background: var(--chip);
                    border-radius: 3px;
                    transition: background 80ms linear, opacity 300ms ease 140ms;
                    animation: intro-tumble ${FALL_MS}ms linear forwards;
                    will-change: transform;
                }
                .intro.is-landed .intro__chip { opacity: 0; }      /* clears to match the video's final frame */
                @keyframes intro-tumble {
                    0%   { transform: rotate(48deg)  scale(2.7); }
                    12%  { transform: rotate(-30deg) scale(2.4); }
                    24%  { transform: rotate(38deg)  scale(2.05); }
                    36%  { transform: rotate(-24deg) scale(1.75); }
                    48%  { transform: rotate(30deg)  scale(1.5); }
                    60%  { transform: rotate(-16deg) scale(1.3); }
                    72%  { transform: rotate(20deg)  scale(1.16); }
                    84%  { transform: rotate(-9deg)  scale(1.06); }
                    94%  { transform: rotate(5deg)   scale(1); }
                    100% { transform: rotate(0deg)   scale(1); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .intro { --chip: ${ACCENT_DOT}; --word: ${INK}; --sub: ${SUB_GRAY}; }
                    .intro__word { clip-path: none; animation: none; }
                    .intro__sub  { opacity: 1; transform: none; animation: none; }
                    .intro__faller, .intro__chip { animation: none; }
                    .intro__chip { opacity: 0; }
                }
            `}</style>

            <span className="intro__faller" aria-hidden="true">
                <span className="intro__chip" />
            </span>

            <span className="intro__word">dave</span>

            <span className="intro__sub" aria-hidden="true">
                <span>STU</span>
                <span>DIO</span>
            </span>
        </div>
    );
}
