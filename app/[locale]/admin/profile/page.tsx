import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AdminProfileClient from "./components/AdminProfileClient";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "AdminProfile" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function AdminProfilePage() {
    return <AdminProfileClient />;
} 