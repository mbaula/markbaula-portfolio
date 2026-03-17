'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Github, Globe } from 'lucide-react';

export function PortfolioProjects() {
    return (
        <section className="w-full bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24 pt-16">
            <div className="mx-auto w-[min(1120px,100%-1.5rem)]">
                <div className="mb-6 text-center sm:mb-10">
                    <p className="mt-3 text-lg text-neutral-400 sm:text-xl">
                        A snapshot of things I&apos;ve been built in my free time.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                    {/* Pawsitive Match project */}
                    <Link
                        href="https://pawsitive-match-self.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/70 shadow-[0_18px_45px_-22px_rgba(0,0,0,0.7)] transition-colors duration-200 hover:border-neutral-600/80 hover:bg-neutral-900/80 no-underline"
                        aria-label="Open Pawsitive Match project"
                    >
                        <div className="relative h-56 w-full overflow-hidden sm:h-64 md:h-72">
                            <div className="pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-200 group-hover:opacity-45">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.14)_0,transparent_50%),radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.12)_0,transparent_55%)] mix-blend-soft-light" />
                            </div>
                            <Image
                                src="/images/projects/pawsitive-match.jpeg"
                                alt="Screenshot of Pawsitive Match project"
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={false}
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
                        </div>

                        <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
                            <header className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="mt-1 text-base font-semibold text-neutral-50 sm:text-lg">
                                        Pawsitive Match
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 text-neutral-400">
                                    <button
                                        type="button"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700/70 bg-neutral-900/70 text-neutral-300 transition-colors hover:border-neutral-400 hover:bg-neutral-800 hover:text-neutral-50"
                                        aria-label="Open Pawsitive Match website"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            window.open('https://pawsitive-match-self.vercel.app/', '_blank', 'noopener,noreferrer');
                                        }}
                                    >
                                        <Globe className="h-4 w-4" strokeWidth={1.5} />
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700/70 bg-neutral-900/70 text-neutral-300 transition-colors hover:border-neutral-400 hover:bg-neutral-800 hover:text-neutral-50"
                                        aria-label="View Pawsitive Match on GitHub"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            window.open('https://github.com/mbaula/PawsitiveMatch', '_blank', 'noopener,noreferrer');
                                        }}
                                    >
                                        <Github className="h-4 w-4" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </header>

                            <p className="text-xs leading-relaxed text-neutral-400 sm:text-sm">
                            PawsitiveMatch is a full-stack web application designed to connect pet owners looking to rehome their pets with potential adopters. 
                            The platform features full authentication and pet listing management workflows, search and filtering functionality for available pets, and an adoption request system.
                            </p>
                            <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                                {['TypeScript', 'Express', 'Node.js', 'MongoDB', 'React', 'Vercel'].map((tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-full bg-neutral-900/80 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-neutral-400"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}
