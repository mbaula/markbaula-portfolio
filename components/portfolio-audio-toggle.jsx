'use client';
import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function PortfolioAudioToggle() {
    const [enabled, setEnabled] = useState(false);

    const toggle = () => {
        setEnabled((prev) => !prev);
    };

    return (
        <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/70 px-3 py-1 text-xs sm:text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
        >
            {enabled ? (
                <>
                    <Volume2 className="mr-1 h-4 w-4" />
                    On
                </>
            ) : (
                <>
                    <VolumeX className="mr-1 h-4 w-4" />
                    Off
                </>
            )}
        </button>
    );
}
