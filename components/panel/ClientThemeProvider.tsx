'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// next-themes'in kendi type definitionlarını kullan
export function ClientThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);

        // Hydration mismatch'i handle et
        const handleHydrationError = () => {
            // Browser extension'lardan kaynaklanan hydration mismatch'i suppress et
            if (typeof window !== 'undefined') {
                const originalError = console.error;
                console.error = (...args) => {
                    if (args[0]?.includes?.('hydration') || args[0]?.includes?.('Hydration')) {
                        // Hydration hatalarını logla ama crash etme
                        console.warn('Hydration mismatch detected (likely from browser extension):', args);
                        return;
                    }
                    originalError.apply(console, args);
                };
            }
        };

        handleHydrationError();
    }, []);

    if (!mounted) {
        // Server-side render'da theme olmadan render et
        return <>{children}</>;
    }

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
} 