import type { Metadata } from "next";
import React from 'react';
import { UserGuard } from '@/app/[locale]/components/AuthGuards';

export const metadata: Metadata = {
    title: "Kullanıcı Paneli - ECU Sistem",
    description: "Kullanıcı yönetim paneli",
    robots: {
        index: false,
        follow: false,
    },
};

export const dynamic = 'force-dynamic';

interface UserLayoutProps {
    children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <UserGuard>
            {children}
        </UserGuard>
    );
}