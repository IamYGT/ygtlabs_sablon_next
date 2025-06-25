import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PermissionsPageClient } from "./components/PermissionsPageClient";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "AdminPermissions" });

    return {
        title: t("title"),
        description: t("subtitle"),
    };
}

export default function PermissionsPage() {
    return <PermissionsPageClient />;
} 