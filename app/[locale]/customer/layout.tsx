import './styles/calendar.css';
import { CustomerGuard } from "@/components/panel/AuthGuards";
import { CustomerHeader } from "@/components/panel/CustomerHeader";
import { CustomerSidebar } from "@/components/panel/CustomerSidebar";
import { LogoutModalProvider } from "@/components/panel/LogoutModalProvider";
import { routing } from "@/lib/i18n/routing";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import React from "react";
import { Toaster } from "sonner";
import "./styles/customer.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CustomerDashboard" });

  return {
    title: t("title"),
    description: t("description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export const dynamic = "force-dynamic";

interface CustomerLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function CustomerLayout({
  children,
  params,
}: CustomerLayoutProps) {
  const { locale } = await params;

  // Validate locale using dynamic routing locales
  const validLocale = (routing.locales as readonly string[]).includes(locale)
    ? locale
    : routing.defaultLocale;

  // Customer için özel mesajları yükle
  const customerMessages = (
    await import(
      `../../../messages/customer/customer_${validLocale}.json`
    ).catch(
      async () =>
        await import(
          `../../../messages/customer/customer_${routing.defaultLocale}.json`
        )
    )
  ).default;

  // getTranslations ile server-side çeviri al
  const t = await getTranslations({
    locale: validLocale,
    namespace: "CustomerDashboard",
  });

  return (
    <NextIntlClientProvider messages={customerMessages} locale={validLocale}>
      <CustomerGuard>
        <LogoutModalProvider dataScope="customer">
          {/* Z-Index Hierarchy: Sidebar(9999) < Toaster(10000) < Modal(99999) */}
          <div className="relative z-0" data-scope="customer">
            {/* Corporate Professional Layout - Banking/Finance Style */}
            <div className="flex h-screen bg-blue-100 dark:bg-slate-800">
              {/* Sidebar - Desktop: Fixed, Mobile: Overlay */}
              <div className="relative z-[9999]">
                <CustomerSidebar />
              </div>

              {/* Ana İçerik Alanı - Rounded Design */}
              <div className="flex flex-1 flex-col overflow-hidden md:rounded-tl-[1.5rem] md:rounded-bl-[1.5rem] bg-blue-100 dark:bg-neutral-900 relative z-10">
                {/* Header - Responsive */}
                <CustomerHeader
                  title={t("subtitle")}
                  subtitle={t("description")}
                />

                {/* Sayfa İçeriği - Corporate Professional Padding */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10 bg-gray-50/50 dark:bg-slate-900 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 dark:scrollbar-thumb-blue-600 dark:scrollbar-track-gray-800" style={{ scrollBehavior: 'smooth' }}>
                  <div className="max-w-7xl mx-auto h-full">{children}</div>
                </main>
              </div>
            </div>
          </div>

          {/* Toast Notifications - Higher z-index */}
          <Toaster
            position="top-right"
            toastOptions={{
              className: "z-[10000]",
              duration: 4000,
            }}
          />
        </LogoutModalProvider>
      </CustomerGuard>
    </NextIntlClientProvider>
  );
}
