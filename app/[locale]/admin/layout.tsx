import { AdminHeader } from "@/components/panel/AdminHeader";
import { AdminSidebar } from "@/components/panel/AdminSidebar";
import { AdminGuard } from "@/components/panel/AuthGuards";
import { LogoutModalProvider } from "@/components/panel/LogoutModalProvider";
import { routing } from "@/lib/i18n/routing";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import React from "react";
import { Toaster } from "sonner";
import "./styles/admin.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AdminDashboard" });

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

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { locale } = await params;

  // Validate locale using dynamic routing locales
  const validLocale = (routing.locales as readonly string[]).includes(locale)
    ? locale
    : routing.defaultLocale;

  // Admin için özel mesajları yükle
  const adminMessages = (
    await import(`../../../messages/admin/admin_${validLocale}.json`).catch(
      async () =>
        await import(
          `../../../messages/admin/admin_${routing.defaultLocale}.json`
        )
    )
  ).default;
  const t = await getTranslations({
    locale: validLocale,
    namespace: "AdminDashboard",
  });

  return (
    <NextIntlClientProvider messages={adminMessages} locale={validLocale}>
      <AdminGuard>
        <LogoutModalProvider dataScope="admin">
          {/* Z-Index Hierarchy: Sidebar(9999) < Toaster(10000) < Modal(99999) */}
          <div className="relative z-0" data-scope="admin">
            {/* Corporate Professional Layout - Banking/Finance Style */}
            <div className="flex h-screen bg-blue-100 dark:bg-slate-800">
              {/* Sidebar - Desktop: Fixed, Mobile: Overlay */}
              <div className="relative z-[9999]">
                <AdminSidebar />
              </div>

              {/* Ana İçerik Alanı - Rounded Design */}
              <div className="flex flex-1 flex-col overflow-hidden md:rounded-tl-[1.5rem] md:rounded-bl-[1.5rem] bg-gray-50/50 dark:bg-slate-900 relative z-10">
                {/* Header - Responsive */}
                <AdminHeader
                  title={t("subtitle")}
                  subtitle={t("description")}
                />

                {/* Sayfa İçeriği - Corporate Professional Padding */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 dark:scrollbar-thumb-blue-600 dark:scrollbar-track-gray-800" style={{ scrollBehavior: 'smooth' }}>
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
      </AdminGuard>
    </NextIntlClientProvider>
  );
}
