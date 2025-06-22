import type { Metadata } from "next";
import React from 'react';
import { UserGuard } from '@/components/panel/AuthGuards';
import "./styles/user.css"; // User panel'e özel stil dosyası

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