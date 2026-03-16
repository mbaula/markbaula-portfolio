'use client';

export function PortfolioAbout() {
    return (
        <section
            id="about"
            className="flex min-h-[80vh] w-full items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#0a0a0a]"
        >
            <div className="mx-6 flex w-[min(1120px,100%)] flex-col gap-8 sm:flex-row sm:items-center">
                <div className="h-48 w-48 shrink-0 rounded-3xl border border-neutral-700 bg-neutral-900 shadow-2xl sm:h-64 sm:w-64" />
                <div className="space-y-4">
                    <h2 className="font-heading text-2xl sm:text-3xl">About me</h2>
                    <p className="text-sm text-neutral-300 sm:text-base">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                    </p>
                    <p className="text-xs text-neutral-500 sm:text-sm">
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>
                </div>
            </div>
        </section>
    );
}
