import { Metadata } from "next";
import "./styles/landing.css"; // Landing page'e özel stil dosyası
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SEO.landing' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords'),
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title: t('ogTitle'),
            description: t('ogDescription'),
            type: 'website',
            locale: locale === 'tr' ? 'tr_TR' : 'en_US',
        },
    };
}

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div data-scope="landing">{children}</div>;
} 