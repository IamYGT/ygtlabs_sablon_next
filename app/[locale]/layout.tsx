import { ClientThemeProvider } from "@/components/panel/ClientThemeProvider";
import { routing } from "@/lib/i18n/routing";
import { QueryProvider } from "@/lib/providers/query-provider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import HydrationErrorBoundary from "@/components/panel/HydrationErrorBoundary";

export const metadata: Metadata = {
  // You can define locale-specific metadata here
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <QueryProvider>
        <HydrationErrorBoundary>
          <ClientThemeProvider>{children}</ClientThemeProvider>
        </HydrationErrorBoundary>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
