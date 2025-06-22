import type { Metadata } from "next";
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { GuestGuard } from '@/components/panel/AuthGuards';
import { AuthLayoutClient } from './AuthLayoutClient';
import "../auth/styles/auth.css"; // Auth pages'e özel stil dosyası

export const metadata: Metadata = {
    title: "Giriş - ECU Sistem",
    description: "ECU Sistem yönetim paneline giriş yapın",
    robots: {
        index: false,
        follow: false,
    },
};

export const dynamic = 'force-dynamic';

interface AuthLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
    const { locale } = await params;

    // Validate locale and fallback to 'en' if invalid
    const validLocales = ['en', 'tr'];
    const validLocale = validLocales.includes(locale) ? locale : 'en';

    // Auth sayfaları için normal mesajları yükle (admin mesajları değil)
    const messages = (await import(`../../../messages/${validLocale}.json`)).default;

    return (
        <NextIntlClientProvider messages={messages}>
            <GuestGuard>
                <AuthLayoutClient>
                    {children}
                </AuthLayoutClient>
            </GuestGuard>
        </NextIntlClientProvider>
    );
} 