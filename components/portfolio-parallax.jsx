'use client';

import { useEffect, useRef, useState } from 'react';

const STARS_FAR = Array.from({ length: 70 }, (_, i) => ({
    x: (i * 37 + 13) % 100,
    y: (i * 53 + 7) % 100,
    s: 1 + (i % 3) * 0.4,
    o: 0.12 + (i % 5) * 0.06,
}));

const STARS_MID = Array.from({ length: 40 }, (_, i) => ({
    x: (i * 43 + 19) % 100,
    y: (i * 61 + 11) % 100,
    s: 1.5 + (i % 3) * 0.6,
    o: 0.2 + (i % 4) * 0.08,
}));

const STARS_NEAR = Array.from({ length: 18 }, (_, i) => ({
    x: (i * 59 + 7) % 100,
    y: (i * 47 + 23) % 100,
    s: 2.5 + (i % 3) * 1.2,
    o: 0.35 + (i % 3) * 0.15,
}));

const NODES_A = [
    { x: 8, y: 18 }, { x: 22, y: 48 }, { x: 38, y: 12 },
    { x: 52, y: 58 }, { x: 65, y: 22 }, { x: 78, y: 52 },
    { x: 92, y: 15 }, { x: 28, y: 78 }, { x: 58, y: 82 },
    { x: 82, y: 75 }, { x: 12, y: 68 }, { x: 45, y: 38 },
];
const EDGES_A = [
    [0, 1], [0, 2], [1, 3], [2, 4], [2, 11],
    [3, 5], [4, 5], [4, 6], [1, 10], [3, 7],
    [3, 8], [5, 9], [7, 8], [8, 9], [10, 7],
    [11, 4], [11, 3], [10, 1],
];

const NODES_B = [
    { x: 16, y: 32 }, { x: 42, y: 62 }, { x: 60, y: 18 },
    { x: 75, y: 48 }, { x: 92, y: 38 }, { x: 22, y: 88 },
    { x: 50, y: 45 }, { x: 85, y: 78 },
];
const EDGES_B = [
    [0, 1], [0, 6], [1, 5], [2, 3], [2, 6],
    [3, 4], [3, 7], [6, 3], [1, 6], [5, 1],
];

const PULSE_INDICES_A = [0, 3, 5, 8, 11];
const PULSE_INDICES_B = [1, 4, 6];

export function PortfolioParallax() {
    const sectionRef = useRef(null);
    const [p, setP] = useState(0);
    const ticking = useRef(false);

    useEffect(() => {
        function onScroll() {
            if (ticking.current) return;
            ticking.current = true;
            requestAnimationFrame(() => {
                const section = sectionRef.current;
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const vh = window.innerHeight;
                    if (rect.top < vh && rect.bottom > 0) {
                        setP(Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height))));
                    }
                }
                ticking.current = false;
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const centered = p - 0.5;
    const titleOpacity = Math.min(1, p * 3.2) * Math.min(1, (1 - p) * 3.2);

    return (
        <div id="projects">
            <section
                ref={sectionRef}
                className="relative flex h-screen items-center justify-center overflow-hidden bg-[#030308]"
            >
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 55% 45% at ${38 + p * 12}% ${28 + p * 20}%, rgba(35,25,70,0.28) 0%, transparent 70%),
                            radial-gradient(ellipse 45% 50% at ${62 - p * 10}% ${62 - p * 15}%, rgba(18,35,75,0.22) 0%, transparent 70%)
                        `,
                    }}
                    aria-hidden
                />

                <div
                    className="pointer-events-none absolute inset-0"
                    style={{ transform: `translateY(${centered * 40}px)` }}
                    aria-hidden
                >
                    {STARS_FAR.map((s, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white"
                            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o }}
                        />
                    ))}
                </div>

                <div
                    className="pointer-events-none absolute inset-0"
                    style={{ transform: `translateY(${centered * 160}px)` }}
                    aria-hidden
                >
                    {STARS_MID.map((s, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white"
                            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o }}
                        />
                    ))}
                </div>

                <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    style={{ transform: `translateY(${centered * 260}px)` }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden
                >
                    {EDGES_A.map(([a, b], i) => (
                        <line
                            key={i}
                            x1={NODES_A[a].x} y1={NODES_A[a].y}
                            x2={NODES_A[b].x} y2={NODES_A[b].y}
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="0.12"
                        />
                    ))}
                    {NODES_A.map((n, i) => (
                        <g key={i}>
                            <circle cx={n.x} cy={n.y} r="0.45" fill="rgba(255,255,255,0.06)" />
                            <circle
                                cx={n.x} cy={n.y} r="0.18"
                                fill="rgba(255,255,255,0.4)"
                                className={PULSE_INDICES_A.includes(i) ? 'parallax-node-pulse' : ''}
                                style={PULSE_INDICES_A.includes(i) ? { animationDelay: `${i * 0.7}s` } : undefined}
                            />
                        </g>
                    ))}
                </svg>

                <svg
                    className="pointer-events-none absolute inset-0 h-full w-full"
                    style={{ transform: `translateY(${centered * 420}px)` }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden
                >
                    {EDGES_B.map(([a, b], i) => (
                        <line
                            key={i}
                            x1={NODES_B[a].x} y1={NODES_B[a].y}
                            x2={NODES_B[b].x} y2={NODES_B[b].y}
                            stroke="rgba(255,255,255,0.09)"
                            strokeWidth="0.15"
                        />
                    ))}
                    {NODES_B.map((n, i) => (
                        <g key={i}>
                            <circle cx={n.x} cy={n.y} r="0.55" fill="rgba(255,255,255,0.07)" />
                            <circle
                                cx={n.x} cy={n.y} r="0.22"
                                fill="rgba(255,255,255,0.5)"
                                className={PULSE_INDICES_B.includes(i) ? 'parallax-node-pulse' : ''}
                                style={PULSE_INDICES_B.includes(i) ? { animationDelay: `${i * 0.9}s` } : undefined}
                            />
                        </g>
                    ))}
                </svg>

                <div
                    className="pointer-events-none absolute inset-0"
                    style={{ transform: `translateY(${centered * 600}px)` }}
                    aria-hidden
                >
                    {STARS_NEAR.map((s, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white"
                            style={{
                                left: `${s.x}%`,
                                top: `${s.y}%`,
                                width: s.s,
                                height: s.s,
                                opacity: s.o,
                                boxShadow: `0 0 ${s.s * 4}px ${s.s * 1.5}px rgba(255,255,255,0.15)`,
                            }}
                        />
                    ))}
                </div>

                <div
                    className="pointer-events-none absolute h-px w-36 rotate-[-28deg] sm:w-52"
                    style={{
                        left: `${-20 + p * 130}%`,
                        top: `${18 + p * 25}%`,
                        background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${0.25 * titleOpacity}) 60%, rgba(255,255,255,${0.5 * titleOpacity}) 100%)`,
                        filter: 'blur(0.5px)',
                    }}
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute h-px w-20 rotate-[-22deg] sm:w-32"
                    style={{
                        left: `${-15 + p * 120}%`,
                        top: `${55 + p * 15}%`,
                        background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${0.15 * titleOpacity}) 50%, rgba(255,255,255,${0.35 * titleOpacity}) 100%)`,
                        filter: 'blur(0.3px)',
                    }}
                    aria-hidden
                />

                <h2
                    className="font-heading relative z-10 select-none text-4xl tracking-wide text-neutral-100 sm:text-6xl md:text-7xl"
                    style={{
                        transform: `translateY(${(0.5 - p) * 120}px)`,
                        opacity: titleOpacity,
                        textShadow: '0 0 100px rgba(255,255,255,0.1), 0 0 30px rgba(255,255,255,0.05)',
                    }}
                >
                    Projects
                </h2>

                <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#0a0a0a] to-transparent" aria-hidden />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0a0a0a] to-transparent" aria-hidden />
            </section>
        </div>
    );
}
