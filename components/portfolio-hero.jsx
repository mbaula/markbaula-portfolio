'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { SquareArrowDownRight, FastForward } from 'lucide-react';
import Link from 'next/link';

function Constellation() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: null, y: null });
    const lastMouseRef = useRef({ x: null, y: null });
    const starsRef = useRef([]);

    const initStars = useCallback((width, height) => {
        const stars = [];
        const starCount = 180;
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

            animationId = requestAnimationFrame(draw);
        };

        resize();
        draw();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars(canvas.width, canvas.height);
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
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0"
        />
    );
}

export function PortfolioHero() {
    const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
    const [scrollCueVisible, setScrollCueVisible] = useState(true);
    const spotlightRef = useRef(null);

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

            <Constellation />

            <div
                ref={spotlightRef}
                className="pointer-events-none absolute inset-0 mix-blend-screen opacity-80"
            />
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-20 mix-blend-soft-light" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0,#0a0a0a_75%)]" />

            <div className="relative z-10 flex flex-col items-center text-center text-neutral-50">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400 sm:text-sm">
                    Software • Data • Systems Design
                </p>
                <div className="flex flex-col items-center font-heading leading-none">
                    <span className="text-[2.5rem] text-neutral-600 sm:text-[3.5rem] md:text-[4rem]">
                        MARK BAULA
                    </span>
                    <a href="#about" className="group relative flex items-center justify-center">
                        <span className="text-[3rem] text-neutral-100 transition-all duration-300 sm:text-[4.5rem] md:text-[5.5rem] sm:group-hover:translate-x-[-25px] sm:group-hover:tracking-[0.04em] sm:group-hover:-translate-y-1">
                            MARK BAULA
                        </span>
                        <FastForward className="absolute right-0 hidden h-12 w-12 translate-x-[calc(100%+4px)] opacity-0 transition-opacity duration-300 sm:block sm:group-hover:opacity-100" />
                    </a>
                    <span className="text-[2.5rem] text-neutral-600 sm:text-[3.5rem] md:text-[4rem]">
                        MARK BAULA
                    </span>
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
