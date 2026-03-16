'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { SquareArrowDownRight, FastForward, X, Sparkles } from 'lucide-react';
import Link from 'next/link';

const CLICKABLE_ANCHORS = [
    { xPct: 0.15, yPct: 0.25 },
    { xPct: 0.85, yPct: 0.28 },
    { xPct: 0.14, yPct: 0.72 },
    { xPct: 0.83, yPct: 0.75 }
];

function Constellation({ onStarClick }) {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: null, y: null });
    const lastMouseRef = useRef({ x: null, y: null });
    const starsRef = useRef([]);

    const initStars = useCallback((width, height) => {
        const stars = [];
        const starCount = 180;

        CLICKABLE_ANCHORS.forEach((anchor, idx) => {
            stars.push({
                anchorX: anchor.xPct * width,
                anchorY: anchor.yPct * height,
                x: anchor.xPct * width,
                y: anchor.yPct * height,
                vx: 0,
                vy: 0,
                radius: 2.4,
                clickable: true,
                factIndex: idx,
                orbitSpeed: 0.4 + idx * 0.15,
                orbitRadius: 12 + idx * 4
            });
        });

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                radius: Math.random() * 1.8 + 0.6,
                clickable: false,
                factIndex: -1
            });
        }

        starsRef.current = stars;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        const connectionDistance = 130;
        const mouseRadius = 180;
        const moveThreshold = 8;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (starsRef.current.length === 0) {
                initStars(canvas.width, canvas.height);
            }
        };

        const draw = () => {
            const stars = starsRef.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mouse = mouseRef.current;
            const last = lastMouseRef.current;
            const t = performance.now() * 0.001;

            let useMouse = false;
            if (mouse.x !== null && last.x !== null) {
                const mdx = mouse.x - last.x;
                const mdy = mouse.y - last.y;
                if (Math.sqrt(mdx * mdx + mdy * mdy) >= moveThreshold) {
                    useMouse = true;
                    lastMouseRef.current = { ...mouse };
                }
            } else if (mouse.x !== null) {
                useMouse = true;
                lastMouseRef.current = { ...mouse };
            }

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];

                if (star.clickable) {
                    star.x = star.anchorX + Math.cos(t * star.orbitSpeed) * star.orbitRadius;
                    star.y = star.anchorY + Math.sin(t * star.orbitSpeed) * star.orbitRadius;
                } else {
                    star.x += star.vx;
                    star.y += star.vy;
                    if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
                    if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
                }

                if (star.clickable) {
                    const pulse = 0.35 + 0.15 * Math.sin(t + i * 0.5);
                    const glowRadius = star.radius * 8 + 18;
                    const gradient = ctx.createRadialGradient(
                        star.x, star.y, 0,
                        star.x, star.y, glowRadius
                    );
                    gradient.addColorStop(0, `rgba(255, 200, 100, ${pulse})`);
                    gradient.addColorStop(0.35, 'rgba(255, 180, 80, 0.12)');
                    gradient.addColorStop(0.7, 'rgba(255, 160, 60, 0.02)');
                    gradient.addColorStop(1, 'rgba(255, 140, 40, 0)');
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }

                const coreRadius = star.clickable ? star.radius * 1.8 : star.radius;
                ctx.beginPath();
                ctx.arc(star.x, star.y, coreRadius, 0, Math.PI * 2);
                ctx.fillStyle = star.clickable
                    ? 'rgba(255, 210, 120, 0.98)'
                    : 'rgba(255, 255, 255, 0.7)';
                ctx.fill();

                for (let j = i + 1; j < stars.length; j++) {
                    const other = stars[j];
                    const dx = star.x - other.x;
                    const dy = star.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - dist / connectionDistance)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }

                if (useMouse) {
                    const dx = star.x - mouse.x;
                    const dy = star.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouseRadius) {
                        ctx.beginPath();
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = star.clickable
                            ? `rgba(255, 200, 120, ${0.25 * (1 - dist / mouseRadius)})`
                            : `rgba(255, 255, 255, ${0.35 * (1 - dist / mouseRadius)})`;
                        ctx.lineWidth = 0.9;
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(draw);
        };

        resize();
        draw();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const stars = starsRef.current;
            if (stars.length === 0) {
                initStars(canvas.width, canvas.height);
            } else {
                CLICKABLE_ANCHORS.forEach((anchor, idx) => {
                    const star = stars[idx];
                    if (star && star.clickable) {
                        star.anchorX = anchor.xPct * canvas.width;
                        star.anchorY = anchor.yPct * canvas.height;
                    }
                });
            }
        };

        window.addEventListener('resize', handleResize);

        const handleClick = (e) => {
            if (!onStarClick) return;
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const stars = starsRef.current;
            let closest = null;
            let closestDist = Infinity;
            const clickRadius = 40;

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                if (!star.clickable) continue;
                const dx = star.x - x;
                const dy = star.y - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < clickRadius && dist < closestDist) {
                    closest = star;
                    closestDist = dist;
                }
            }

            if (closest && typeof closest.factIndex === 'number') {
                onStarClick(closest.factIndex);
            }
        };

        canvas.addEventListener('pointerdown', handleClick);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('pointerdown', handleClick);
        };
    }, [initStars, onStarClick]);

    const hoverRadius = 42;

    useEffect(() => {
        const handleMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
            const canvas = canvasRef.current;
            if (!canvas || !onStarClick) return;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            const stars = starsRef.current;
            let overClickable = false;
            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];
                if (!star.clickable) continue;
                const dx = star.x - x;
                const dy = star.y - y;
                if (Math.sqrt(dx * dx + dy * dy) < hoverRadius) {
                    overClickable = true;
                    break;
                }
            }
            canvas.style.cursor = overClickable ? 'pointer' : 'default';
        };

        const handleLeave = () => {
            mouseRef.current = { x: null, y: null };
            lastMouseRef.current = { x: null, y: null };
            const canvas = canvasRef.current;
            if (canvas) canvas.style.cursor = 'default';
        };

        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerleave', handleLeave);

        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerleave', handleLeave);
        };
    }, [onStarClick]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-[5] cursor-default"
        />
    );
}

export function PortfolioHero() {
    const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
    const [scrollCueVisible, setScrollCueVisible] = useState(true);
    const [activeFactIndex, setActiveFactIndex] = useState(null);
    const spotlightRef = useRef(null);

    const facts = [
        {
            title: 'Systems mindset',
            body: 'I like designing end-to-end systems that connect hardware, software, and data into something cohesive. This mindset applies to everything I build - always thinking about the bigger picture.'
        },
        {
            title: 'Robotics & mechatronics',
            body: 'I study Mechatronics Engineering at the University of Waterloo and have an interest in how AI can be used to enhance the robotics industry.'
        },
        {
            title: 'Pragmatic builder',
            body: 'I enjoy shipping efficient, thoughtful tools that make workflows smoother and more enjoyable for me and my team. This can be anything from a simple script to a full-fledged application.'
        },
        {
            title: 'Curiosity-driven',
            body: "I love to learn - it's one of the reasons I chose to become an engineer. I'm always looking for new ways to improve my skills and knowledge be it through reading, learning from others, or experimenting with new technologies on my own."
        }
    ];

    useEffect(() => {
        const handleMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            setCursorPos({ x, y });
            if (spotlightRef.current) {
                spotlightRef.current.style.background =
                    `radial-gradient(circle at ${x}% ${y}%, rgba(255, 255, 255, 0.08), transparent 70%)`;
            }
        };

        window.addEventListener('pointermove', handleMove);
        return () => window.removeEventListener('pointermove', handleMove);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrollCueVisible(window.scrollY < 60);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const parallax1 = {
        transform: `translate(${(cursorPos.x - 50) * 0.4}%, ${(cursorPos.y - 50) * 0.4}%)`
    };
    const parallax2 = {
        transform: `translate(${(cursorPos.x - 50) * -0.35}%, ${(cursorPos.y - 50) * -0.35}%)`
    };

    return (
        <section
            id="home"
            className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#0a0a0a]"
        >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,#1a1a1a_0,#0a0a0a_50%),radial-gradient(circle_at_100%_100%,#2a2a2a_0,#0a0a0a_60%)] animate-[heroGradient_18s_ease-in-out_infinite_alternate]" />

            <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.14]"
                style={parallax1}
            >
                <div className="h-[min(80vmax,800px)] w-[min(80vmax,800px)] rounded-full border border-white/30 bg-transparent" />
            </div>
            <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.08]"
                style={parallax2}
            >
                <div className="h-[min(100vmax,1000px)] w-[min(100vmax,1000px)] rounded-full border border-white/40 bg-transparent" />
            </div>

            <div
                ref={spotlightRef}
                className="pointer-events-none absolute inset-0 mix-blend-screen opacity-80"
            />
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-20 mix-blend-soft-light" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0,#0a0a0a_75%)]" />

            <Constellation
                onStarClick={(index) => {
                    const safeIndex = ((index ?? 0) % facts.length + facts.length) % facts.length;
                    setActiveFactIndex(safeIndex);
                }}
            />

            {activeFactIndex !== null && (
                <div
                    className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm animate-[factBackdropIn_0.2s_ease-out]"
                    onClick={() => setActiveFactIndex(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="fact-title"
                >
                    <div
                        className="relative max-w-md rounded-2xl border border-amber-500/20 bg-neutral-900/98 p-6 pr-12 text-left shadow-2xl shadow-black/50 ring-1 ring-amber-400/10 animate-[factCardIn_0.25s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setActiveFactIndex(null)}
                            className="absolute right-3 top-3 rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="mb-3 flex items-center gap-2 text-amber-400/90">
                            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em]">
                            </span>
                        </div>
                        <h2
                            id="fact-title"
                            className="mb-3 font-heading text-xl text-neutral-50"
                        >
                            {facts[activeFactIndex].title}
                        </h2>
                        <p className="leading-relaxed text-neutral-400">
                            {facts[activeFactIndex].body}
                        </p>
                    </div>
                </div>
            )}

            <div className="relative z-10 flex flex-col items-center text-center text-neutral-50">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400 sm:text-sm">
                    Software &bull; Data &bull; Systems Design
                </p>
                <div className="flex flex-col items-center font-heading leading-none">
                    <a href="#about" className="group relative flex items-center justify-center no-underline">
                        <span className="pointer-events-none absolute translate-x-[6px] translate-y-[6px] text-[3rem] text-neutral-700 opacity-60 blur-[1px] sm:text-[4.5rem] md:text-[5.5rem] sm:group-hover:translate-x-[0px] sm:group-hover:translate-y-[10px] sm:group-hover:opacity-70">
                            MARK BAULA
                        </span>
                        <span className="relative text-[3rem] text-neutral-100 transition-all duration-300 sm:text-[4.5rem] md:text-[5.5rem] sm:group-hover:translate-x-[-25px] sm:group-hover:tracking-[0.04em] sm:group-hover:-translate-y-1">
                            MARK BAULA
                        </span>
                        <FastForward className="absolute right-0 hidden h-12 w-12 translate-x-[calc(100%+4px)] opacity-0 transition-opacity duration-300 sm:block sm:group-hover:opacity-100" />
                    </a>
                </div>
                <p className="mt-4 text-sm text-neutral-300 sm:text-base">
                    Mechatronics Engineering Student
                </p>
                <p className="mt-1 text-xs text-neutral-500 sm:text-sm">University of Waterloo</p>
            </div>

            <div
                className={`pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center transition-opacity duration-500 ${scrollCueVisible ? 'opacity-100' : 'opacity-0'}`}
                aria-hidden
            >
                <span className="flex h-7 w-7 flex-col items-center rounded-full border border-neutral-500/70">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-neutral-400 animate-[scrollBounce_2s_ease-in-out_infinite]" />
                </span>
            </div>

            <Link
                href="/virtual"
                className="group absolute bottom-8 right-6 flex flex-col items-center text-xs text-neutral-300 sm:bottom-10 sm:right-10 sm:text-sm"
            >
                <span className="mb-1 rounded-md border border-neutral-600 bg-neutral-900/80 p-2 shadow-lg backdrop-blur transition-all duration-300 group-hover:border-neutral-400 group-hover:bg-neutral-800/90 group-hover:rotate-[-12deg] animate-[ctaPulse_2.5s_ease-in-out_infinite]">
                    <SquareArrowDownRight className="h-10 w-10 animate-[wiggle_2s_ease-in-out_infinite_3s] stroke-[1] sm:h-14 sm:w-14" />
                </span>
                <span className="font-serif italic tracking-wide text-neutral-400 transition-colors group-hover:text-neutral-100">
                    Click me!
                </span>
            </Link>
        </section>
    );
}
