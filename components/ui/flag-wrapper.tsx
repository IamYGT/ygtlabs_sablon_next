"use client";

import { TR, US } from 'country-flag-icons/react/3x2';
import { useEffect, useState } from 'react';

interface FlagWrapperProps {
    locale: string;
    className?: string;
}

export function FlagWrapper({ locale, className = "w-5 h-3 rounded-sm object-cover shadow-sm" }: FlagWrapperProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Server-side placeholder
        return (
            <div
                className={`${className} bg-gray-200 dark:bg-gray-700 animate-pulse`}
                aria-label={locale === 'tr' ? 'Türkiye bayrağı' : 'ABD bayrağı'}
            />
        );
    }

    // Client-side flag
    return locale === 'tr' ? (
        <TR className={className} />
    ) : (
        <US className={className} />
    );
} 