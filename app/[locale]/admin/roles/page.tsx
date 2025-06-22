import React from 'react';
import { AdminGuard } from '@/components/panel/AuthGuards';
import RolesPageClient from './components/RolesPageClient';

export default function AdminRolesPage() {
    return (
        <AdminGuard>
            <RolesPageClient />
        </AdminGuard>
    );
}