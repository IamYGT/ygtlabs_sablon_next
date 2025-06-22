'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// next-themes'in kendi type definitionlarını kullan
export function ClientThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Server-side render'da theme olmadan render et
        return <>{children}</>;
    }

    return (
        <NextThemesProvider {...props}>
            {children}
        </NextThemesProvider>
    );
} 