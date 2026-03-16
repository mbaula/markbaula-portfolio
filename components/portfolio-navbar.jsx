'use client';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { PortfolioAudioToggle } from './portfolio-audio-toggle';

export function PortfolioNavbar() {
    const [open, setOpen] = useState(false);

    const navItems = [
        { href: '#home', label: 'Home' },
        { href: '#about', label: 'About' },
        { href: '#experience', label: 'Experience' },
        { href: '#projects', label: 'Projects' },
        { href: '/virtual', label: 'Click' }
    ];

    return (
        <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-center">
            <nav className="mt-4 flex w-[min(1120px,100%-1.5rem)] items-center justify-between rounded-full border border-neutral-700/60 bg-neutral-900/80 px-4 py-2 shadow-lg backdrop-blur">
                <Link href="#home" className="font-heading text-lg tracking-wide text-neutral-100 hover:text-white transition-colors no-underline">
                    Mark Baula
                </Link>

                <div className="hidden items-center gap-6 text-sm sm:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-neutral-400 hover:text-white hover:italic transition-colors no-underline"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <PortfolioAudioToggle />
                </div>

                <div className="flex items-center gap-3 sm:hidden">
                    <PortfolioAudioToggle />
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/80 text-neutral-100"
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </nav>

            {open && (
                <div className="fixed inset-x-0 top-16 z-40 mx-auto w-[min(360px,100%-2rem)] rounded-2xl border border-neutral-700 bg-neutral-900/95 px-5 py-4 shadow-xl sm:hidden">
                    <ul className="flex flex-col gap-2 text-sm">
                        {navItems.map((item, index) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2 py-1 text-neutral-100 hover:text-white hover:italic transition-colors no-underline"
                                >
                                    <span className="font-serif italic text-xs text-neutral-500">
                                        {index + 1}.
                                    </span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
}
