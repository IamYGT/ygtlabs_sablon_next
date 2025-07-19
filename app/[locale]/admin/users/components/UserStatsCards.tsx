'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslations, useLocale } from 'next-intl';
import {
    Users,
    Shield,
    CheckCircle,
    XCircle,
    Activity,
    Settings,
    TrendingUp,
    UserPlus,
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
    const t = useTranslations('AdminUsers');
    const locale = useLocale();

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
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Toplam Kullanıcılar */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('users')}</CardTitle>
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                        <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{userStats.total}</div>
                    <div className="flex items-center flex-wrap gap-2 mt-3">
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {userStats.active} {t('active')}
                        </Badge>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs">
                            <XCircle className="h-3 w-3 mr-1" />
                            {userStats.inactive} {t('inactive')}
                        </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                        <UserPlus className="h-3 w-3" />
                        {t('usersWithRoles', { count: userStats.withRoles })}
                    </p>
                </CardContent>
            </Card>

            {/* Roller */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('roles')}</CardTitle>
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{roleStats.total}</div>
                    <div className="flex items-center flex-wrap gap-2 mt-3">
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 text-xs">
                            <Activity className="h-3 w-3 mr-1" />
                            {roleStats.active} {t('active')}
                        </Badge>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs">
                            <Settings className="h-3 w-3 mr-1" />
                            {roleStats.system} {t('system')}
                        </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {t('roleManagementLink.text')} <Link href={`/${locale}/admin/roles`} className="text-orange-600 dark:text-orange-400 hover:underline font-medium">{t('roleManagementLink.linkText')}</Link> {t('roleManagementLink.suffix')}
                    </p>
                </CardContent>
            </Card>

            {/* Aktif Kullanıcılar Yüzdesi */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('activeUsersRatio')}</CardTitle>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {userStats.total > 0 ? Math.round((userStats.active / userStats.total) * 100) : 0}%
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${userStats.total > 0 ? (userStats.active / userStats.total) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {userStats.active} / {userStats.total} {t('usersActive')}
                    </p>
                </CardContent>
            </Card>

            {/* Rol Ataması Oranı */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('roleAssignmentRatio')}</CardTitle>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {userStats.total > 0 ? Math.round((userStats.withRoles / userStats.total) * 100) : 0}%
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${userStats.total > 0 ? (userStats.withRoles / userStats.total) * 100 : 0}%` }}
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {userStats.withRoles} / {userStats.total} {t('usersRoleAssigned')}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
} 