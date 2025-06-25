import React from 'react';
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AdminGuard } from '@/components/panel/AuthGuards';
import RolesPageClient from './components/RolesPageClient';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "AdminRoles" });

    return {
        title: t("title"),
        description: t("subtitle"),
    };
}

export default function AdminRolesPage() {
    return (
        <AdminGuard>
            <RolesPageClient />
        </AdminGuard>
    );
}