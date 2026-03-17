'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Github, Globe } from 'lucide-react';

const projects = [
    {
        title: 'Pawsitive Match',
        description:
            'PawsitiveMatch is a full-stack web app designed to connect pet owners looking to rehome their pets with potential adopters. The platform features full authentication and pet listing management workflows, search and filtering functionality for available pets, and an adoption request system.',
        image: '/images/projects/pawsitive-match.jpeg',
        tech: ['TypeScript', 'Express', 'Node.js', 'MongoDB', 'React', 'Vercel'],
        website: 'https://pawsitive-match-self.vercel.app/',
        github: 'https://github.com/mbaula/PawsitiveMatch',
    },
    {
        title: 'Visimulate',
        description:
            'A web app that allows users to upload images and simulate various visual impairments to experience how the images would appear to individuals with different visual conditions. It uses image processing algorithms to transform the images in real-time, providing an interactive and educational experience about different visual impairments.',
        image: '/images/projects/visimulate.png',
        tech: ['React', 'JavaScript', 'React-Bootstrap', 'Vercel', 'Image Processing'],
        website: 'https://visimulate.netlify.app/',
        github: 'https://github.com/mbaula/ViSimulate',
    },
];

function ProjectCard({ project }) {
    const { title, description, image, tech, website, github } = project;

    return (
        <Link
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/70 shadow-[0_18px_45px_-22px_rgba(0,0,0,0.7)] transition-colors duration-200 hover:border-neutral-600/80 hover:bg-neutral-900/80 no-underline"
            aria-label={`Open ${title} project`}
        >
            <div className="relative h-56 w-full overflow-hidden sm:h-64 md:h-72">
                <div className="pointer-events-none absolute inset-0 opacity-30 transition-opacity duration-200 group-hover:opacity-45">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.14)_0,transparent_50%),radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.12)_0,transparent_55%)] mix-blend-soft-light" />
                </div>
                <Image
                    src={image}
                    alt={`Screenshot of ${title} project`}
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
                            {title}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                        {website && (
                            <button
                                type="button"
                                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-700/70 bg-neutral-900/70 text-neutral-300 transition-colors hover:border-neutral-400 hover:bg-neutral-800 hover:text-neutral-50"
                                aria-label={`Open ${title} website`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open(website, '_blank', 'noopener,noreferrer');
                                }}
                            >
                                <Globe className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                        )}
                        {github && (
                            <button
                                type="button"
                                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-700/70 bg-neutral-900/70 text-neutral-300 transition-colors hover:border-neutral-400 hover:bg-neutral-800 hover:text-neutral-50"
                                aria-label={`View ${title} on GitHub`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open(github, '_blank', 'noopener,noreferrer');
                                }}
                            >
                                <Github className="h-4 w-4" strokeWidth={1.5} />
                            </button>
                        )}
                    </div>
                </header>

                <p className="text-xs leading-relaxed text-neutral-400 sm:text-sm">
                    {description}
                </p>

                <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {tech.map((t) => (
                        <span
                            key={t}
                            className="rounded-full bg-neutral-900/80 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-neutral-400"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}

export function PortfolioProjects() {
    return (
        <section className="w-full bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24 pt-16">
            <div className="mx-auto w-[min(1120px,100%-1.5rem)]">
                <div className="mb-6 text-center sm:mb-10">
                    <h2 className="font-heading text-2xl sm:text-3xl">Projects</h2>
                    <p className="mt-2 text-sm text-neutral-400 sm:text-base">
                        A snapshot of things I&apos;ve built in my free time.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                    {projects.map((project) => (
                        <ProjectCard key={project.title} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
