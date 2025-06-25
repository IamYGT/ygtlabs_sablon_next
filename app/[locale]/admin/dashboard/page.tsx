import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AdminDashboardClient from "./AdminDashboardClient";

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "AdminDashboard" });

    return {
        title: t("title"),
        description: t("description"),
    };
}

export default function AdminDashboardPage() {
    // AdminGuard zaten client-side auth kontrolü yapıyor
    // Server-side getCurrentUser çağrısına gerek yok
    return <AdminDashboardClient />;
} 