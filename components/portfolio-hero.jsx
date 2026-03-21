'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { FastForward, X, Sparkles } from 'lucide-react';

const CLICKABLE_ANCHORS = [
    { xPct: 0.15, yPct: 0.25, size: 117 },
    { xPct: 0.85, yPct: 0.28, size: 170 },
    { xPct: 0.14, yPct: 0.72, size: 143 },
    { xPct: 0.83, yPct: 0.75, size: 117 }
];

const STAR_IMAGES = [
    '/stars/star-1.svg',
    '/stars/star-2.svg',
    '/stars/star-7.svg',
    '/stars/star-1.svg'
];

function ClickableStar({ anchor, index, onClick, time }) {
    const orbitSpeed = 0.4 + index * 0.15;
    const orbitRadius = 12 + index * 4;
    const offsetX = Math.cos(time * orbitSpeed) * orbitRadius;
    const offsetY = Math.sin(time * orbitSpeed) * orbitRadius;
    const displaySize = Math.min(anchor.size * 0.6, 80);

    return (
        <button
            type="button"
            onClick={() => onClick(index)}
            className="absolute cursor-pointer transition-transform duration-200 hover:scale-110 focus:outline-none"
            style={{
                left: `calc(${anchor.xPct * 100}% + ${offsetX}px)`,
                top: `calc(${anchor.yPct * 100}% + ${offsetY}px)`,
                transform: 'translate(-50%, -50%)',
                width: displaySize,
                height: displaySize
            }}
            aria-label={`Star ${index + 1} - click to learn more`}
        >
            {/* Native <img> keeps SVG + embedded art sharp; next/image rasterizes SVGs and looks soft */}
            <img
                src={STAR_IMAGES[index]}
                alt=""
                width={displaySize}
                height={displaySize}
                draggable={false}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                className="pointer-events-none h-full w-full object-contain select-none"
                style={{
                    // Crisp compositing when the parent scales on hover
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                }}
            />
        </button>
    );
}

function Constellation({ onStarClick }) {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: null, y: null });
    const lastMouseRef = useRef({ x: null, y: null });
    const starsRef = useRef([]);
    const clickableStarsRef = useRef([]);
    const [time, setTime] = useState(0);

    const initStars = useCallback((width, height) => {
        const stars = [];
        const clickableStars = [];
        const starCount = 180;

        CLICKABLE_ANCHORS.forEach((anchor, idx) => {
            clickableStars.push({
                anchorX: anchor.xPct * width,
                anchorY: anchor.yPct * height,
                x: anchor.xPct * width,
                y: anchor.yPct * height,
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
                radius: Math.random() * 1.8 + 0.6
            });
        }

        starsRef.current = stars;
        clickableStarsRef.current = clickableStars;
    }, []);

    useEffect(() => {
        let animationId;
        const animate = () => {
            setTime(performance.now() * 0.001);
            animationId = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationId);
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
            const clickableStars = clickableStarsRef.current;
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

            clickableStars.forEach((star) => {
                star.x = star.anchorX + Math.cos(t * star.orbitSpeed) * star.orbitRadius;
                star.y = star.anchorY + Math.sin(t * star.orbitSpeed) * star.orbitRadius;
            });

            for (let i = 0; i < stars.length; i++) {
                const star = stars[i];

                star.x += star.vx;
                star.y += star.vy;
                if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
                if (star.y < 0 || star.y > canvas.height) star.vy *= -1;

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
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

                clickableStars.forEach((clickable) => {
                    const dx = star.x - clickable.x;
                    const dy = star.y - clickable.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(clickable.x, clickable.y);
                        ctx.strokeStyle = `rgba(255, 200, 120, ${0.25 * (1 - dist / connectionDistance)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                });

                if (useMouse) {
                    const dx = star.x - mouse.x;
                    const dy = star.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouseRadius) {
                        ctx.beginPath();
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.35 * (1 - dist / mouseRadius)})`;
                        ctx.lineWidth = 0.9;
                        ctx.stroke();
                    }
                }
            }

            if (useMouse) {
                clickableStars.forEach((clickable) => {
                    const dx = clickable.x - mouse.x;
                    const dy = clickable.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouseRadius) {
                        ctx.beginPath();
                        ctx.moveTo(clickable.x, clickable.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.strokeStyle = `rgba(255, 200, 120, ${0.3 * (1 - dist / mouseRadius)})`;
                        ctx.lineWidth = 0.9;
                        ctx.stroke();
                    }
                });
            }

            animationId = requestAnimationFrame(draw);
        };

        resize();
        draw();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const clickableStars = clickableStarsRef.current;
            if (starsRef.current.length === 0) {
                initStars(canvas.width, canvas.height);
            } else {
                CLICKABLE_ANCHORS.forEach((anchor, idx) => {
                    const star = clickableStars[idx];
                    if (star) {
                        star.anchorX = anchor.xPct * canvas.width;
                        star.anchorY = anchor.yPct * canvas.height;
                    }
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, [initStars]);

    useEffect(() => {
        const handleMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleLeave = () => {
            mouseRef.current = { x: null, y: null };
            lastMouseRef.current = { x: null, y: null };
        };

        window.addEventListener('pointermove', handleMove);
        window.addEventListener('pointerleave', handleLeave);

        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerleave', handleLeave);
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-[5] cursor-default"
            />
            <div className="absolute inset-0 z-[6] pointer-events-none">
                {CLICKABLE_ANCHORS.map((anchor, index) => (
                    <div key={index} className="pointer-events-auto">
                        <ClickableStar
                            anchor={anchor}
                            index={index}
                            onClick={onStarClick}
                            time={time}
                        />
                    </div>
                ))}
            </div>
        </>
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

            {activeFactIndex === null && (
                <div
                    className="pointer-events-none absolute bottom-[18%] left-1/2 z-20 -translate-x-1/2 animate-[factCardIn_0.8s_ease-out]"
                    aria-hidden
                >
                </div>
            )}

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
                className={`pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 ${scrollCueVisible ? 'opacity-100' : 'opacity-0'}`}
                aria-hidden
            >
                <span className="flex h-7 w-7 flex-col items-center rounded-full border border-neutral-500/70">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-neutral-400 animate-[scrollBounce_2s_ease-in-out_infinite]" />
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">scroll</span>
            </div>

        </section>
    );
}
