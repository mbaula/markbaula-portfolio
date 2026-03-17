'use client';

export function PortfolioProjects() {
    return (
        <section
            className="w-full bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] pb-24 pt-16"
        >
            <div className="mx-auto w-[min(1120px,100%-1.5rem)]">
                <div className="mb-6 text-center sm:mb-10">
                    <h2 className="font-heading text-2xl sm:text-3xl">Projects</h2>
                    <p className="mt-2 text-sm text-neutral-400 sm:text-base">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="h-40 rounded-2xl border border-neutral-700/70 bg-neutral-900/80 p-4 shadow-md sm:h-48"
                        >
                            <div className="h-6 w-20 rounded-full bg-neutral-700/60" />
                            <div className="mt-2 h-4 w-32 rounded-full bg-neutral-700/40" />
                            <div className="mt-4 h-16 w-full rounded-xl bg-neutral-800/80" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
