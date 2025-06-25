'use client';

import React from 'react';
import '../styles/admin.css'; // Admin CSS'ini import ediyoruz
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Users, FileText, Shield, Clock, ArrowRight, BarChart3, PieChart, Calendar } from "lucide-react";
import { useAdminAuth } from "@/lib/hooks/useAuth";
import { type SimpleUser as AuthUser } from "@/lib";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/panel/LanguageSwitcher';
import { Link } from '@/src/i18n/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsChart } from './components/StatsChart';
import { DashboardSkeleton } from './components/DashboardSkeleton';

type TFunction = ReturnType<typeof useTranslations<"AdminDashboard">>;

// Corporate Professional dashboard cards - Banking/Finance style
function getDashboardCards(t: TFunction): DashboardCardProps[] {
    return [
        {
            title: t('totalRevenue'),
            icon: BarChart3,
            value: "₺2,847,350",
            description: t('totalRevenueDesc'),
            trend: "+12.5%",
            trendUp: true,
            color: "blue" as const,
        },
        {
            title: t('activeCustomers'),
            icon: Users,
            value: "15,847",
            description: t('activeCustomersDesc'),
            trend: "+8.2%",
            trendUp: true,
            color: "emerald" as const,
        },
        {
            title: t('transactionVolume'),
            icon: Activity,
            value: "₺45.2M",
            description: t('transactionVolumeDesc'),
            trend: "+15.7%",
            trendUp: true,
            color: "purple" as const,
        },
        {
            title: t('systemSecurity'),
            icon: Shield,
            value: "99.98%",
            description: t('systemSecurityDesc'),
            trend: "+0.02%",
            trendUp: true,
            color: "orange" as const,
        },
    ];
}

// Corporate Professional quick actions - Banking/Finance style
function getQuickActions(t: TFunction): QuickActionProps[] {
    return [
        {
            title: t('customerManagement'),
            description: t('customerManagementDesc'),
            href: "/admin/customers",
            icon: Users,
            color: "blue" as const,
        },
        {
            title: t('financialReports'),
            description: t('financialReportsDesc'),
            href: "/admin/financial-reports",
            icon: BarChart3,
            color: "emerald" as const,
        },
        {
            title: t('securityCenter'),
            description: t('securityCenterDesc'),
            href: "/admin/security",
            icon: Shield,
            color: "purple" as const,
        },
        {
            title: t('transactionLogs'),
            description: t('transactionLogsDesc'),
            href: "/admin/transaction-logs",
            icon: FileText,
            color: "orange" as const,
        },
    ];
}

// Corporate Professional recent activities - Banking/Finance style
function getRecentActivities(t: TFunction) {
    return [
        {
            title: t('bigTransactionAlert'),
            description: t('bigTransactionAlertDesc'),
            time: t('timeAgo15min'),
            type: "warning" as const,
            priority: "high" as const,
        },
        {
            title: t('newCorporateCustomer'),
            description: t('newCorporateCustomerDesc'),
            time: t('timeAgo2hours'),
            type: "success" as const,
            priority: "medium" as const,
        },
        {
            title: t('securityScan'),
            description: t('securityScanDesc'),
            time: t('timeAgo6hours'),
            type: "info" as const,
            priority: "low" as const,
        },
        {
            title: t('systemMaintenance'),
            description: t('systemMaintenanceDesc'),
            time: t('timeAgo1day'),
            type: "success" as const,
            priority: "medium" as const,
        },
        {
            title: t('complianceReport'),
            description: t('complianceReportDesc'),
            time: t('timeAgo2days'),
            type: "info" as const,
            priority: "low" as const,
        },
    ];
}

// Corporate Professional type definitions - Banking/Finance style
type DashboardCardProps = {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    value: string;
    description: string;
    trend: string;
    trendUp: boolean;
    color: "blue" | "emerald" | "purple" | "orange";
};

type QuickActionProps = {
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    color: "blue" | "emerald" | "purple" | "orange";
};

type ActivityItemProps = {
    title: string;
    description: string;
    time: string;
    type: "info" | "success" | "warning";
    priority: "low" | "medium" | "high";
};

// Corporate Professional dashboard card component - Banking/Finance style
function DashboardCard({ title, icon: Icon, value, description, trend, trendUp, color }: DashboardCardProps) {
    const colorStyles = {
        blue: {
            bg: "bg-white dark:bg-slate-800",
            border: "border-gray-200 dark:border-slate-700",
            icon: "bg-blue-600 text-white",
            accent: "text-blue-600 dark:text-blue-400",
            trend: trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
        },
        emerald: {
            bg: "bg-white dark:bg-slate-800",
            border: "border-gray-200 dark:border-slate-700",
            icon: "bg-emerald-600 text-white",
            accent: "text-emerald-600 dark:text-emerald-400",
            trend: trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
        },
        purple: {
            bg: "bg-white dark:bg-slate-800",
            border: "border-gray-200 dark:border-slate-700",
            icon: "bg-purple-600 text-white",
            accent: "text-purple-600 dark:text-purple-400",
            trend: trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
        },
        orange: {
            bg: "bg-white dark:bg-slate-800",
            border: "border-gray-200 dark:border-slate-700",
            icon: "bg-orange-600 text-white",
            accent: "text-orange-600 dark:text-orange-400",
            trend: trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
        }
    }[color];

    return (
        <Card className={`${colorStyles.bg} ${colorStyles.border} border shadow-lg hover:shadow-xl transition-all duration-300`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                    <div className={`p-3 rounded-lg ${colorStyles.icon} shadow-md`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className={`text-sm font-semibold px-2 py-1 rounded ${colorStyles.trend} bg-gray-100 dark:bg-slate-700`}>
                        {trend}
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400 uppercase tracking-wide">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                    <p className="text-sm text-gray-600 dark:text-slate-300">{description}</p>
                </div>
            </CardContent>
        </Card>
    );
}

// Corporate Professional quick action component - Banking/Finance style
function QuickAction({ title, description, href, icon: Icon, color }: QuickActionProps) {
    const colorStyles = {
        blue: {
            bg: "bg-white dark:bg-slate-800",
            border: "border-gray-200 dark:border-slate-700",
            icon: "bg-blue-600 text-white",
            hover: "hover:bg-gray-50 dark:hover:bg-slate-700"
        },
        emerald: {
            bg: "bg-white dark:bg-slate-800",
            border: "border-gray-200 dark:border-slate-700",
            icon: "bg-emerald-600 text-white",
            hover: "hover:bg-gray-50 dark:hover:bg-slate-700"
        },
        purple: {
            bg: "bg-white dark:bg-slate-800",
            border: "border-gray-200 dark:border-slate-700",
            icon: "bg-purple-600 text-white",
            hover: "hover:bg-gray-50 dark:hover:bg-slate-700"
        },
        orange: {
            bg: "bg-white dark:bg-slate-800",
            border: "border-gray-200 dark:border-slate-700",
            icon: "bg-orange-600 text-white",
            hover: "hover:bg-gray-50 dark:hover:bg-slate-700"
        }
    }[color];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const linkHref = href as any;

    return (
        <Link href={linkHref}>
            <div className={`group p-6 ${colorStyles.bg} ${colorStyles.border} border rounded-lg ${colorStyles.hover} shadow-lg hover:shadow-xl transition-all duration-300`}>
                <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${colorStyles.icon} shadow-md group-hover:scale-105 transition-transform duration-200`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 dark:text-slate-400 group-hover:text-gray-600 dark:group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                </div>
            </div>
        </Link>
    );
}

// Corporate Professional activity item component - Banking/Finance style
function ActivityItem({ title, description, time, type, priority }: ActivityItemProps) {
    const typeStyles = {
        info: {
            icon: PieChart,
            bg: 'bg-blue-100 dark:bg-blue-900/50',
            text: 'text-blue-800 dark:text-blue-300',
            iconColor: 'text-blue-600 dark:text-blue-400'
        },
        success: {
            icon: Calendar,
            bg: 'bg-emerald-100 dark:bg-emerald-900/50',
            text: 'text-emerald-800 dark:text-emerald-300',
            iconColor: 'text-emerald-600 dark:text-emerald-400'
        },
        warning: {
            icon: Shield,
            bg: 'bg-orange-100 dark:bg-orange-900/50',
            text: 'text-orange-800 dark:text-orange-300',
            iconColor: 'text-orange-600 dark:text-orange-400'
        }
    };

    const priorityStyles = {
        low: "border-l-4 border-transparent",
        medium: "border-l-4 border-yellow-500",
        high: "border-l-4 border-red-600"
    };

    const { icon: Icon, bg, text, iconColor } = typeStyles[type];

    return (
        <div className={`p-4 rounded-lg shadow-sm transition-all duration-300 flex items-start space-x-4 ${bg} ${priorityStyles[priority]}`}>
            <div className={`p-2 rounded-full ${iconColor} bg-white dark:bg-slate-700`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
                <p className={`font-semibold ${text}`}>{title}</p>
                <p className={`text-sm ${text} opacity-80`}>{description}</p>
            </div>
            <div className={`text-xs ${text} opacity-70 flex items-center space-x-1`}>
                <Clock className="h-3 w-3" />
                <span>{time}</span>
            </div>
        </div>
    );
}

// Corporate Professional welcome section component - Banking/Finance style
function WelcomeSection({ admin, t }: { admin: AuthUser; t: TFunction }) {
    const locale = useLocale();

    const currentTime = new Date().toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
    });
    const currentDate = new Date().toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="relative mb-8 p-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-2xl overflow-hidden">
            {/* Corporate background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 opacity-50"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/5 dark:from-blue-600/10 to-purple-600/5 dark:to-purple-600/10 rounded-full -translate-y-32 translate-x-32"></div>

            <div className="relative flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-blue-600 shadow-lg">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                                {t('welcome')}, {admin.name || admin.email}
                            </h2>
                            <p className="text-gray-600 dark:text-slate-300 text-sm uppercase tracking-wide">
                                {currentDate} • {currentTime}
                            </p>
                        </div>
                    </div>

                    <p className="text-gray-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                        {t('welcomeMessage')}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <Badge className="bg-blue-600 text-white border-blue-500 px-3 py-1 text-sm font-medium">
                            <Shield className="h-4 w-4 mr-2" />
                            {admin.primaryRole || t('admin')} {t('authority')}
                        </Badge>
                        {admin.userRoles && admin.userRoles.length > 0 && (
                            admin.userRoles.map((roleName, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-600 px-3 py-1 text-sm"
                                >
                                    {roleName}
                                </Badge>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <LanguageSwitcher />
                    <Button variant="outline" size="sm" className="bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-white transition-all duration-200">
                        <Calendar className="h-4 w-4 mr-2" />
                        {t('calendar')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Debug komponenti - props olarak user bilgisi alacak
function UserPermissionsDebug({ user, t }: { user: AuthUser; t: TFunction }) {
    const [_isSettingUp, _setIsSettingUp] = React.useState(false);

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    const _handlePagePermissionSetup = async () => {
        _setIsSettingUp(true);
        try {
            const response = await fetch('/api/admin/permissions/setup-layout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (response.ok) {
                alert(t('debug.setupSuccess') + '\n\n' + result.message);
            } else {
                alert(t('debug.setupError') + ': ' + (result.error || t('debug.unknownError')));
            }
        } catch (error) {
            alert(t('debug.connectionError') + ': ' + error);
        } finally {
            _setIsSettingUp(false);
        }
    };

    const _handleGrantAdminAccess = async () => {
        const email = 'ercanyter@gmail.com';
        _setIsSettingUp(true);
        try {
            const response = await fetch('/api/admin/users/grant-admin-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(t('debug.grantAdminSuccess') + '\n\n' + result.message);
            } else {
                alert(t('debug.setupError') + ': ' + (result.error || t('debug.unknownError')));
            }
        } catch (error) {
            alert(t('debug.connectionError') + ': ' + error);
        } finally {
            _setIsSettingUp(false);
        }
    };

    const _handleAddAdminAccessToRole = async () => {
        _setIsSettingUp(true);
        try {
            const response = await fetch('/api/admin/roles/add-permission-to-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roleName: 'seyirciadi',
                    permissionName: 'layout.admin.access'
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(t('debug.addPermissionSuccess', { permissionName: 'layout.admin.access', roleName: 'seyirciadi' }) + '\n\n' + result.message);
                // Sayfayı yenile ki yetkiler güncellensin
                window.location.reload();
            } else {
                alert(t('debug.setupError') + ': ' + (result.error || t('debug.unknownError')));
            }
        } catch (error) {
            alert(t('debug.connectionError') + ': ' + error);
        } finally {
            _setIsSettingUp(false);
        }
    };

    const _handleAddUsersManageToRole = async () => {
        _setIsSettingUp(true);
        try {
            const response = await fetch('/api/admin/roles/add-permission-to-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roleName: 'seyirciadi',
                    permissionName: 'users.manage'
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(t('debug.addPermissionSuccess', { permissionName: 'users.manage', roleName: 'seyirciadi' }) + '\n\n' + result.message);
                // Sayfayı yenile ki yetkiler güncellensin
                window.location.reload();
            } else {
                alert(t('debug.setupError') + ': ' + (result.error || t('debug.unknownError')));
            }
        } catch (error) {
            alert(t('debug.connectionError') + ': ' + error);
        } finally {
            _setIsSettingUp(false);
        }
    };

    return (
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="font-bold text-sm mb-2">{t('debug.title')}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('debug.user')}: {user.email}
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
                {t('debug.roles')}: {user.userRoles.join(", ")}
            </p>
            <details className="mt-2">
                <summary className="text-xs cursor-pointer text-blue-600 dark:text-blue-400">
                    {t('debug.allPermissions', { count: user.permissions.length })}
                </summary>
                <div className="mt-1 text-xs space-y-1">
                    {user.permissions.map((perm) => (
                        <div key={perm} className="text-yellow-600 dark:text-yellow-400">
                            • {perm}
                        </div>
                    ))}
                </div>
            </details>
            <p className="text-xs mt-2 text-red-600 dark:text-red-400">
                {t('debug.hasPermission', { permission: 'roles.edit' })}: {user.permissions.includes("roles.edit") ? t('debug.permissionYes') : t('debug.permissionNo')}
            </p>
        </div>
    );
}

// Dashboard stats component
function DashboardStats({ t }: { t: TFunction }) {
    const dashboardCards = getDashboardCards(t);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardCards.map((card) => (
                <DashboardCard key={card.title} {...card} />
            ))}
        </div>
    );
}

export default function AdminDashboardClient() {
    // Modern hook kullanımı
    const admin = useAdminAuth();
    const t = useTranslations('AdminDashboard');

    // Enhanced loading state while auth is being checked
    if (!admin) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-8">
            <UserPermissionsDebug user={admin} t={t} />
            <WelcomeSection admin={admin} t={t} />

            {/* Corporate Dashboard Metrics */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('financialSummary')}</h3>
                        <p className="text-gray-600 dark:text-slate-300">{t('financialSummaryDesc')}</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2 bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-white">
                        <PieChart className="h-4 w-4" />
                        {t('detailedAnalysis')}
                    </Button>
                </div>
                <DashboardStats t={t} />
            </div>

            {/* Corporate Quick Actions */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('managementCenter')}</h3>
                        <p className="text-gray-600 dark:text-slate-300">{t('managementCenterDesc')}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {getQuickActions(t).map((action) => (
                        <QuickAction key={action.title} {...action} />
                    ))}
                </div>
            </div>

            {/* Corporate Activities and Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent activities */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('systemActivities')}</h3>
                            <p className="text-gray-600 dark:text-slate-300">{t('systemActivitiesDesc')}</p>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2 bg-gray-100 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-white">
                            <Clock className="h-4 w-4" />
                            {t('allLogs')}
                        </Button>
                    </div>
                    <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-2xl">
                        <CardContent className="p-6">
                            <div className="space-y-0">
                                {getRecentActivities(t).map((activity, index) => (
                                    <ActivityItem key={index} {...activity} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Analytics Chart */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('performance')}</h3>
                        <p className="text-gray-600 dark:text-slate-300">{t('performanceDesc')}</p>
                    </div>
                    <StatsChart />
                </div>
            </div>
        </div>
    );
}