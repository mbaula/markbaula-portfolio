'use client';
import { useEffect, useRef, useState } from 'react';
import { Github, Linkedin, Mail, FileText } from 'lucide-react';
import Image from 'next/image';

const socials = [
    { href: 'https://github.com/mbaula', icon: Github, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/mark-b17/', icon: Linkedin, label: 'LinkedIn' },
    { href: 'mailto:markbaula.1@gmail.com', icon: Mail, label: 'Email' },
    { href: '/resume.pdf', icon: FileText, label: 'Resume' }
];

export function PortfolioAbout() {
    const sectionRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.2 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20"
        >
            {/* Animated grain — neutral, distinct from Experience (different drift) */}
            <div
                className="about-bg-noise pointer-events-none absolute inset-0 z-0 opacity-[0.18]"
                aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(255,200,100,0.04),transparent)]" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-px bg-gradient-to-r from-transparent via-neutral-700/40 to-transparent" />

            <div className="relative z-10 mx-6 flex w-[min(1120px,100%)] flex-col items-center gap-12 sm:flex-row sm:items-center sm:gap-16">
                <div
                    className={`group relative shrink-0 transition-all duration-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                >
                    <div className="relative z-10 h-64 w-64 overflow-hidden rounded-3xl border border-neutral-700/60 bg-neutral-900 shadow-2xl transition-transform duration-300 group-hover:border-neutral-600/80 sm:h-80 sm:w-80 sm:group-hover:scale-[1.02]">
                        <Image
                            src="/images/portrait.jpg"
                            alt="Mark Baula"
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 256px, 320px"
                            priority={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/70 via-transparent to-transparent" />
                    </div>
                </div>

                <div
                    className={`max-w-lg space-y-6 transition-all duration-700 delay-200 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                >
                    <div className="flex items-baseline gap-3">
                        <div className="space-y-1">
                            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                                Get to know me
                            </p>
                            <h2 className="font-heading text-3xl text-neutral-50 sm:text-4xl">
                                About me
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-4 border-l-2 border-amber-500/20 pl-5 text-sm leading-relaxed text-neutral-400 sm:text-base">
                        <p>
                            <span className="font-heading italic text-neutral-300">
                                Hi! My name is Mark.
                            </span>{' '}
                            I am a Mechatronics Engineering student at the University of Waterloo.
                            My hobbies include playing video games (both competitive and casual), going to the gym and watching movies!
                            I also love discovering new music and collecting pokemon cards.
                        </p>
                        <p>
                            Like most engineers, there's an incredible amount of things I'd love to learn and build, but I'm particularly interested in the intersection of robotics and AI, BCIs and Fintech.
                            Thanks for checking out my projects and portfolio :)
                        </p>
                    </div>

                    <div
                        className={`space-y-3 pt-2 transition-all duration-700 delay-500 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                    >
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                            Find me
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    title={s.label}
                                    className="group/icon flex h-11 w-11 items-center justify-center rounded-full border border-neutral-700/60 bg-neutral-900/80 text-neutral-400 no-underline transition-all duration-200 hover:border-amber-500/30 hover:bg-neutral-800 hover:text-amber-400/90 hover:shadow-md hover:shadow-amber-500/5"
                                >
                                    <s.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
