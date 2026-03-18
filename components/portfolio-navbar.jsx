'use client';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { PortfolioAudioToggle } from './portfolio-audio-toggle';

export function PortfolioNavbar() {
    const [open, setOpen] = useState(false);
    const [pikaPop, setPikaPop] = useState(false);

    useEffect(() => {
        const show = () => {
            setPikaPop(true);
            setTimeout(() => setPikaPop(false), 3000);
        };
        const first = setTimeout(show, 5000);
        const iv = setInterval(show, 12000);
        return () => { clearTimeout(first); clearInterval(iv); };
    }, []);

    const navItems = [
        { href: '#home', label: 'Home' },
        { href: '#about', label: 'About' },
        { href: '#experience', label: 'Experience' },
        { href: '#projects', label: 'Projects' },
        { href: '/virtual', label: 'Click Me!' }
    ];

    return (
        <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-center">
            <nav className="mt-4 flex w-[min(1120px,100%-1.5rem)] items-center justify-between rounded-full border border-neutral-700/60 bg-neutral-900/80 px-4 py-2 shadow-lg backdrop-blur">
                <Link href="#home" className="font-heading text-lg tracking-wide text-neutral-100 hover:text-white transition-colors no-underline">
                    Mark Baula
                </Link>

                <div className="hidden items-center gap-6 text-sm sm:flex">
                    {navItems.map((item) =>
                        item.label === 'Click Me!' ? (
                            <span key={item.label} className="relative">
                                <Link
                                    href={item.href}
                                    className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-400 no-underline transition-all hover:border-amber-400/60 hover:bg-amber-500/20 hover:text-amber-300"
                                >
                                    {item.label}
                                </Link>
                                <img
                                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif"
                                    alt=""
                                    className={`pointer-events-none absolute -right-8 -top-5 h-8 w-8 transition-all duration-500 ${pikaPop ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}
                                    style={{ imageRendering: 'pixelated' }}
                                    draggable={false}
                                />
                            </span>
                        ) : (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-neutral-400 hover:text-white hover:italic transition-colors no-underline"
                            >
                                {item.label}
                            </Link>
                        )
                    )}
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
                <div className="fixed inset-0 z-40 flex min-h-screen min-w-full flex-col items-center justify-center bg-neutral-900 sm:hidden">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-neutral-100 hover:bg-neutral-700 hover:text-white"
                        aria-label="Close menu"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <ul className="flex flex-col items-center gap-6 text-lg">
                        {navItems.map((item, index) => (
                            <li key={item.label}>
                                {item.label === 'Click Me!' ? (
                                    <Link
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-amber-400 no-underline transition-all hover:border-amber-400/60 hover:bg-amber-500/20"
                                    >
                                        <img
                                            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif"
                                            alt=""
                                            className="h-6 w-6"
                                            style={{ imageRendering: 'pixelated' }}
                                            draggable={false}
                                        />
                                        {item.label}
                                    </Link>
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-2 py-1 text-neutral-100 hover:text-white hover:italic transition-colors no-underline"
                                    >
                                        <span className="font-serif italic text-sm text-neutral-500">
                                            {index + 1}.
                                        </span>
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </header>
    );
}
