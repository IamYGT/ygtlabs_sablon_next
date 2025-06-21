'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    Shield,
    CheckCircle,
    XCircle,
    Activity,
    Settings,
} from 'lucide-react';

// User ve Role interfaces
interface User {
    id: string;
    name: string | null;
    email: string | null;
    profileImage: string | null;
    isActive: boolean;
    createdAt: string;
    roleId?: string | null;
    roleAssignedAt?: string | null;
    currentRole?: {
        id: string;
        name: string;
        displayName: string;
        color: string | null;
    } | null;
}

interface Role {
    id: string;
    name: string;
    displayName: string;
    description: string | null;
    color: string | null;
    layoutType: string;
    isActive: boolean;
    isSystemDefault: boolean;
    permissions: Array<{
        id: string;
        name: string;
        displayName: string;
    }>;
}

interface UserStatsCardsProps {
    users: User[];
    roles: Role[];
}

export default function UserStatsCards({ users, roles }: UserStatsCardsProps) {
    // İstatistikleri hesapla
    const userStats = {
        total: users.length,
        active: users.filter(u => u.isActive).length,
        inactive: users.filter(u => !u.isActive).length,
        withRoles: users.filter(u => u.currentRole).length,
    };

    const roleStats = {
        total: roles.length,
        active: roles.filter(r => r.isActive).length,
        system: roles.filter(r => r.isSystemDefault).length,
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Kullanıcılar</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{userStats.total}</div>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="default" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {userStats.active} Aktif
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                            <XCircle className="h-3 w-3 mr-1" />
                            {userStats.inactive} Pasif
                        </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {userStats.withRoles} kullanıcıya rol atanmış
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Roller</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{roleStats.total}</div>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="default" className="text-xs">
                            <Activity className="h-3 w-3 mr-1" />
                            {roleStats.active} Aktif
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                            <Settings className="h-3 w-3 mr-1" />
                            {roleStats.system} Sistem
                        </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Rol yönetimi için <Link href="/tr/admin/roles" className="text-blue-600 hover:underline">Roller</Link> sayfasını ziyaret edin
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 