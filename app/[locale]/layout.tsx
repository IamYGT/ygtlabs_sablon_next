import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientThemeProvider } from "@/components/panel/ClientThemeProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/src/i18n/routing";
import { QueryProvider } from "@/lib/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ClientThemeProvider>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                {children}
              </div>
            </ClientThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// Bu layout kullanıcı çerezi okuduğundan statik ön üretim yerine her istekte dinamiktir
export const dynamic = 'force-dynamic';
