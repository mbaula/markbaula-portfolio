'use client';

export function PortfolioExperience() {
    return (
        <section
            id="experience"
            className="relative w-full bg-gradient-to-b from-[#111111] via-[#0a0a0a] to-[#0a0a0a] py-20"
        >
            <div className="mx-auto flex w-[min(1120px,100%-1.5rem)] flex-col gap-8">
                <div>
                    <h2 className="font-heading text-2xl sm:text-3xl">Experience</h2>
                    <p className="mt-2 max-w-xl text-sm text-neutral-400 sm:text-base">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                    </p>
                </div>
                <div className="grid gap-4 border-l border-neutral-700/60 pl-6 sm:gap-6">
                    <div className="relative">
                        <div className="absolute -left-[13px] top-1 h-2.5 w-2.5 rounded-full bg-neutral-400" />
                        <div className="rounded-xl border border-neutral-700/70 bg-neutral-900/80 px-4 py-3 shadow-md sm:px-5 sm:py-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                                2024 — Present
                            </p>
                            <p className="mt-1 text-sm font-medium text-neutral-100 sm:text-base">
                                Lorem Ipsum @ Dolor Sit Amet
                            </p>
                            <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
