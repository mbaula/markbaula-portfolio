'use client';

import { FileText } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const CIBC_LOGO = 'https://logos-world.net/wp-content/uploads/2021/05/CIBC-Emblem.png';
const BORDERLESS_LOGO = 'https://media.licdn.com/dms/image/v2/D560BAQFbn0v2utGhCw/company-logo_200_200/company-logo_200_200/0/1733953620866/hireborderless_logo?e=1778112000&v=beta&t=VALK_YoeqOmCHPbCFdnvx6JJmbVI4GxF8D1A1BTFrwk';
const UW_LOGO = 'https://upload.wikimedia.org/wikipedia/en/6/6e/University_of_Waterloo_seal.svg';

const ARXIV_LINK = 'https://arxiv.org/abs/2305.14177';
const ARXIV_TITLE = 'ChemGymRL: An Interactive Framework for Reinforcement Learning for Digital Chemistry';

const experience = [
    { period: 'May 2025 — Aug 2025', title: 'Software Developer', company: 'CIBC', logo: CIBC_LOGO },
    { period: 'May 2024 — Dec 2024', title: 'Software Developer', company: 'CIBC', logo: CIBC_LOGO },
    { period: 'Sep 2022 — Dec 2022', title: 'Full Stack Developer', company: 'Borderless', logo: BORDERLESS_LOGO },
    { period: 'Sep 2021 — Apr 2022', title: 'Data Analyst', company: 'CIBC', logo: CIBC_LOGO },
    {
        period: 'Jan 2021 — Apr 2021',
        title: 'Software Developer',
        company: 'University of Waterloo / NRC',
        logo: UW_LOGO,
        publication: { url: ARXIV_LINK, title: ARXIV_TITLE }
    }
];

const STAGGER_DELAY_MS = 80;

export function PortfolioExperience() {
    const listRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="experience"
            className="relative flex min-h-screen w-full items-center overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] py-12"
        >
            <div className="relative z-10 mx-auto flex w-[min(1120px,100%-1.5rem)] flex-col gap-6">
                <div>
                    <h2 className="font-heading text-2xl sm:text-3xl">Experience</h2>
                    <p className="mt-3 max-w-4xl text-sm leading-relaxed text-neutral-400 sm:text-base">
                        With hands-on experience in full-stack development, I have contributed to a variety of high-impact projects across multiple industries, from banking to startups to academic research.
                        I'm passionate about working on projects that are high impact and make the life of others easier. I am always eager to learn and try out new experiences!
                    </p>
                </div>

                <ul
                    ref={listRef}
                    className={`experience-list flex flex-col gap-2.5 sm:gap-3 ${inView ? 'in-view' : ''}`}
                >
                    {experience.map((job, index) => (
                        <li
                            key={`${job.company}-${job.period}`}
                            className="experience-row flex items-stretch gap-4"
                            style={{ animationDelay: `${index * STAGGER_DELAY_MS}ms` }}
                        >
                            {/* Card with depth + logo */}
                            <div className="group min-w-0 flex-1 rounded-xl border border-neutral-800/90 bg-neutral-900/60 px-4 py-3 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.03)] transition-all duration-200 hover:border-neutral-700/90 hover:bg-neutral-900/80 hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:px-5 sm:py-3.5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-800/80 ring-2 ring-neutral-700/50 transition-all duration-200 group-hover:scale-105 sm:h-11 sm:w-11">
                                        <img
                                            src={job.logo}
                                            alt=""
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-medium text-neutral-100">{job.company}</span>
                                            <span className="text-neutral-500">·</span>
                                            <span className="text-sm text-neutral-400">{job.title}</span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-neutral-500">{job.period}</p>
                                        {job.publication && (
                                            <div className="mt-1 flex flex-wrap items-center gap-2">
                                                <a
                                                    href={job.publication.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex flex-wrap items-start gap-2 text-[0.65rem] text-neutral-500 underline decoration-neutral-600 underline-offset-2 transition-colors hover:text-amber-400/90 hover:decoration-amber-500/40"
                                                    aria-label={`Open publication: ${job.publication.title}`}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ imageRendering: 'pixelated' }}>
                                                        <rect x="1" y="1" width="12" height="12" rx="2" fill="rgba(245,158,11,0.15)" stroke="rgba(245,158,11,0.7)" />
                                                        <path d="M5.2 8.9L6.2 5.4H7.2L8.2 8.9H7.2L6.9 7.9H6.5L6.2 8.9H5.2Z" fill="rgba(245,158,11,0.9)" />
                                                        <path d="M4.3 6.2C4.6 5.1 5.4 4.5 6.6 4.5C7.3 4.5 8 4.7 8.6 5.1L8.1 5.8C7.6 5.5 7.1 5.4 6.6 5.4C5.8 5.4 5.3 5.8 5.1 6.2L4.3 6.2Z" fill="rgba(245,158,11,0.65)" />
                                                    </svg>
                                                    <span className="max-w-[240px] whitespace-normal wrap-break-word leading-snug sm:max-w-none">
                                                        arXiv · {job.publication.title}
                                                    </span>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <p className="text-sm text-neutral-500">
                    For a more detailed overview,{' '}
                    <Link
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-neutral-300 underline decoration-neutral-600 underline-offset-2 transition-colors hover:text-amber-400/90 hover:decoration-amber-500/40"
                    >
                        check out my resume
                        <FileText className="h-4 w-4" strokeWidth={1.5} />
                    </Link>
                    .
                </p>
            </div>
        </section>
    );
}
