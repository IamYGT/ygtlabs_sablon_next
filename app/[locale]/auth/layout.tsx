import { GuestGuard } from "@/components/panel/AuthGuards";
import { routing } from "@/lib/i18n/routing";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import { AuthLayoutClient } from "./AuthLayoutClient";
import "./styles/auth.css"; // Auth pages'e özel stil dosyası

export const metadata: Metadata = {
  title: "Giriş - CRM Sistem",
  description: "CRM Sistem yönetim paneline giriş yapın",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

interface AuthLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AuthLayout({
  children,
  params,
}: AuthLayoutProps) {
  const { locale } = await params;

  // Validate locale using dynamic routing locales
  const validLocale = (routing.locales as readonly string[]).includes(locale)
    ? locale
    : routing.defaultLocale;

  // Auth sayfaları için normal mesajları yükle (admin mesajları değil)
  const messages = (
    await import(`../../../messages/${validLocale}.json`).catch(
      async () =>
        await import(`../../../messages/${routing.defaultLocale}.json`)
    )
  ).default;

  return (
    <NextIntlClientProvider messages={messages}>
      <GuestGuard>
        <div data-scope="auth">
          <AuthLayoutClient>{children}</AuthLayoutClient>
        </div>
      </GuestGuard>
    </NextIntlClientProvider>
  );
}
