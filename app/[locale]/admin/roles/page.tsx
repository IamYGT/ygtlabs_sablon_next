import React from 'react';
import { AdminGuard } from '../../components/AuthGuards';
import RolesPageClient from './components/RolesPageClient';

export default function AdminRolesPage() {
    return (
        <AdminGuard>
            <RolesPageClient />
        </AdminGuard>
    );
}