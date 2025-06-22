import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
              {children}
            </ClientThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
