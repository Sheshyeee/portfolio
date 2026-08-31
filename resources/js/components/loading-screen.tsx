'use client';

import { useState } from 'react';
import IntroAnimation from './intro-animation';

/* ------------------------------------------------------------------ */
/*  LoadingScreen                                                       */
/* ------------------------------------------------------------------ */
/*
 * Thin full-screen shell around <IntroAnimation />. It owns the fixed
 * white overlay, anchors the big wordmark toward the bottom of the
 * viewport (leaving headroom for the chip to fall through), and plays
 * the final fade/scale-out once the intro finishes — then tells the
 * parent it's safe to unmount (via onComplete) and reveal the site.
 *
 * The drop / wipe / color-snap choreography lives entirely in
 * intro-animation.tsx — this file just hosts it.
 */

const EXIT_MS = 560;

type Props = {
    onComplete: () => void;
};

export default function LoadingScreen({ onComplete }: Props) {
    const [exiting, setExiting] = useState(false);

    const handleFinished = () => {
        setExiting(true);
        setTimeout(onComplete, EXIT_MS);
    };

    return (
        <div className={`loading-screen ${exiting ? 'loading-screen--exiting' : ''}`}>
            <style>{`
                .loading-screen {
                    position: fixed;
                    inset: 0;
                    z-index: 200;
                    display: flex;
                    align-items: flex-end;         /* anchor the logo toward the bottom */
                    justify-content: center;
                    background: #ffffff;
                    overflow: hidden;               /* the chip falls from off-screen top */
                    padding-bottom: clamp(56px, 13vh, 150px);
                    transition:
                        opacity ${EXIT_MS}ms cubic-bezier(.16,1,.3,1),
                        transform ${EXIT_MS}ms cubic-bezier(.16,1,.3,1);
                }
                .loading-screen--exiting {
                    opacity: 0;
                    transform: scale(1.02);
                    pointer-events: none;
                }
            `}</style>

            <IntroAnimation onFinished={handleFinished} />
        </div>
    );
}
