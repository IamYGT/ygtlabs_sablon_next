import type { Metadata } from "next";
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';

export const metadata: Metadata = {
    title: "ECU Sistem - Chip Tuning ve Performans Çözümleri",
    description: "Profesyonel chip tuning, ECU yazılımı ve araç performans optimizasyonu hizmetleri",
    keywords: "chip tuning, ecu, performans, yazılım, araç, motor, optimizasyon",
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "ECU Sistem - Chip Tuning Uzmanları",
        description: "Aracınızın performansını maksimuma çıkarın. Profesyonel chip tuning hizmetleri.",
        type: "website",
        locale: "tr_TR",
    },
};

export const dynamic = 'force-dynamic';

interface LandingLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function LandingLayout({ children, params }: LandingLayoutProps) {
    const { locale } = await params;

    // Validate locale and fallback to 'en' if invalid
    const validLocales = ['en', 'tr'];
    const validLocale = validLocales.includes(locale) ? locale : 'en';

    // Landing page için normal mesajları yükle
    const messages = (await import(`../../../messages/${validLocale}.json`)).default;

    return (
        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>
    );
} 