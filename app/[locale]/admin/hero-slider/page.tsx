import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroSliderPageClient } from "./components/HeroSliderPageClient";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "HeroSlider" });

    return {
        title: t("title"),
        description: t("subtitle"),
    };
}

export default function HeroSliderPage() {
    return <HeroSliderPageClient />;
} 