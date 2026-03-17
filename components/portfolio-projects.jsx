'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Github, Globe } from 'lucide-react';

const STAGGER_DELAY_MS = 120;

const FLOATING_ACCENTS = [
    { type: 'circle', size: 6, x: 8, y: 15, duration: 22, delay: 0 },
    { type: 'circle', size: 4, x: 92, y: 25, duration: 26, delay: 3 },
    { type: 'ring', size: 10, x: 5, y: 55, duration: 30, delay: 1 },
    { type: 'ring', size: 8, x: 95, y: 70, duration: 24, delay: 5 },
    { type: 'dot', size: 3, x: 12, y: 85, duration: 20, delay: 2 },
    { type: 'dot', size: 2, x: 88, y: 40, duration: 18, delay: 4 },
    { type: 'circle', size: 5, x: 3, y: 35, duration: 28, delay: 6 },
    { type: 'ring', size: 6, x: 97, y: 90, duration: 25, delay: 0 },
];

const projects = [
    {
        title: 'Mental Health Journal',
        description:
            'Mental health journaling app that performs real-time NLP analysis on entries using a hybrid ML pipeline: fine-tuned DistilBERT for multi-label emotion detection (28 emotions) and topic identification, and TF-IDF + Linear SVM for binary sentiment classification on Sentiment140. Models served via FastAPI; frontend built with React, Vite, and Tailwind.',
        image: '/images/projects/sentiment-analyzer.jpeg',
        imageContain: true,
        tech: [
            'PyTorch',
            'Hugging Face Transformers',
            'scikit-learn',
            'FastAPI',
            'React',
            'Vite',
            'Tailwind CSS',
        ],
        website: 'https://github.com/mbaula/SentimentAnalyzer',
        github: 'https://github.com/mbaula/SentimentAnalyzer',
    },
    {
        title: 'PawsitiveMatch',
        description:
            'PawsitiveMatch is a full-stack web app designed to connect pet owners looking to rehome their pets with potential adopters. The platform features full authentication and pet listing management workflows, search and filtering functionality for available pets, and an adoption request system.',
        image: '/images/projects/pawsitive-match.png',
        tech: ['TypeScript', 'Express', 'Node.js', 'MongoDB', 'React', 'Vercel'],
        website: 'https://pawsitive-match-self.vercel.app/',
        github: 'https://github.com/mbaula/PawsitiveMatch',
        footnote: 'Uses Render free tier — API may take ~1 min to spin up on first load.',
    },
    {
        title: 'Snake Game (ARM Cortex-M3)',
        description:
            'Classic Snake game implemented on an ARM Cortex-M3 development board in C. Supports wall collision game-over, self-collision detection, growth on apple consumption, and score display via on-board LEDs, with reset via physical push button.',
        image: '/images/projects/snake-game.webp',
        tech: ['C', 'ARM Cortex-M3', 'Embedded Systems'],
        website: 'https://www.youtube.com/watch?v=46SF3pjkcG4',
        github: '',
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
    {
        title: 'JettBot',
        description:
            'A feature-rich single-guild Discord bot built with JavaScript, Discord.js, Sequelize, and Distube. Includes a full economy system with a database, gambling game commands (roulette, blackjack, slots), Valorant-themed features (random agents, skin gacha), and music playback.',
        image: '/images/projects/jettbot.png',
        tech: ['JavaScript', 'Node.js', 'Discord.js'],
        website: 'https://github.com/mbaula/JettBot',
        github: 'https://github.com/mbaula/JettBot',
        footnote: 'Used daily by 200+ people in a personal Discord server.',
    },
    {
        title: 'DeepLearning.AI Specialization',
        description:
            'A five-course Coursera specialization covering neural networks and deep learning, hyperparameter tuning, structured ML projects, convolutional networks, and sequence models, with hands-on implementations in TensorFlow and Python.',
        image: '/images/projects/deeplearning-ai.png',
        tech: [
            'TensorFlow',
            'Python',
            'Deep Learning',
            'Transformers',
            'Hyperparameter Tuning',
            'NLP',
        ],
        website: 'https://www.coursera.org/account/accomplishments/specialization/QWA5PZ4VFZ2H?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=s12n'
    },
];

function ProjectCard({ project }) {
    const { title, description, image, imageContain, tech, website, github, footnote } = project;

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
                    className={`transition-transform duration-300 group-hover:scale-[1.03] ${imageContain ? 'object-contain' : 'object-cover'}`}
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

                {footnote && (
                    <p className="text-[0.65rem] italic text-neutral-500">
                        {footnote}
                    </p>
                )}

                <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                    {tech.map((t) => (
                        <span
                            key={t}
                            className="tech-tag rounded-full bg-neutral-900/80 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-neutral-400 transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-800 hover:text-neutral-200 hover:shadow-[0_4px_12px_-2px_rgba(255,255,255,0.08)]"
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
    const gridRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = gridRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24 pt-16">
            {/* Floating accent elements */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
                {FLOATING_ACCENTS.map((accent, i) => (
                    <div
                        key={i}
                        className={`floating-accent absolute ${accent.type === 'ring' ? 'rounded-full border border-neutral-700/30' : 'rounded-full bg-neutral-600/20'}`}
                        style={{
                            width: accent.size,
                            height: accent.size,
                            left: `${accent.x}%`,
                            top: `${accent.y}%`,
                            animationDuration: `${accent.duration}s`,
                            animationDelay: `${accent.delay}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative mx-auto w-[min(1120px,100%-1.5rem)]">
                <div className="mb-8 text-center sm:mb-12">
                    <p className="text-lg text-neutral-400 sm:text-xl md:text-2xl">
                        A snapshot of things I&apos;ve built in my free time.
                    </p>
                </div>

                <div
                    ref={gridRef}
                    className={`projects-grid grid gap-6 sm:grid-cols-2 sm:gap-8 ${inView ? 'in-view' : ''}`}
                >
                    {projects.map((project, index) => (
                        <div
                            key={project.title}
                            className="project-card"
                            style={{ animationDelay: `${index * STAGGER_DELAY_MS}ms` }}
                        >
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
