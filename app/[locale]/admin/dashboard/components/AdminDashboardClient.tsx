'use client';

import React from 'react';
import '../../styles/admin.css'; // Admin CSS'ini import ediyoruz
import { Users, FileText, Shield, ArrowRight, BarChart3, Calendar, Clock } from "lucide-react";
import { useAdminAuth } from "@/lib/hooks/useAuth";
import { type SimpleUser as AuthUser } from "@/lib";
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/src/i18n/navigation';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";   
import { DashboardSkeleton } from './../components/DashboardSkeleton';

type TFunction = ReturnType<typeof useTranslations<"AdminDashboard">>;

// Management Center quick actions
function getQuickActions(t: TFunction): QuickActionProps[] {
    return [
        {
            title: t('customerManagement'),
            description: t('customerManagementDesc'),
            href: "/admin/users",
            icon: Users,
            color: "blue" as const,
        },
        {
            title: t('financialReports'),
            description: t('financialReportsDesc'),
            href: "/admin/roles",
            icon: BarChart3,
            color: "emerald" as const,
        },
        {
            title: t('securityCenter'),
            description: t('securityCenterDesc'),
            href: "/admin/permissions",
            icon: Shield,
            color: "purple" as const,
        },
        {
            title: t('transactionLogs'),
            description: t('transactionLogsDesc'),
            href: "/admin/hero-slider",
            icon: FileText,
            color: "orange" as const,
        },
    ];
}

// Type definitions
type QuickActionProps = {
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    color: "blue" | "emerald" | "purple" | "orange";
};

// Enhanced Quick action component with better visual design
function QuickAction({ title, description, href, icon: Icon, color }: QuickActionProps) {
    const colorStyles = {
        blue: {
            gradient: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
            border: "border-blue-200/50 dark:border-blue-700/30",
            icon: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/25",
            hover: "hover:from-blue-100 hover:to-blue-150 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30",
            ring: "hover:ring-2 hover:ring-blue-500/20"
        },
        emerald: {
            gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
            border: "border-emerald-200/50 dark:border-emerald-700/30",
            icon: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/25",
            hover: "hover:from-emerald-100 hover:to-emerald-150 dark:hover:from-emerald-900/30 dark:hover:to-emerald-800/30",
            ring: "hover:ring-2 hover:ring-emerald-500/20"
        },
        purple: {
            gradient: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
            border: "border-purple-200/50 dark:border-purple-700/30",
            icon: "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-500/25",
            hover: "hover:from-purple-100 hover:to-purple-150 dark:hover:from-purple-900/30 dark:hover:to-purple-800/30",
            ring: "hover:ring-2 hover:ring-purple-500/20"
        },
        orange: {
            gradient: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
            border: "border-orange-200/50 dark:border-orange-700/30",
            icon: "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-orange-500/25",
            hover: "hover:from-orange-100 hover:to-orange-150 dark:hover:from-orange-900/30 dark:hover:to-orange-800/30",
            ring: "hover:ring-2 hover:ring-orange-500/20"
        }
    }[color];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const linkHref = href as any;

    return (
        <Link href={linkHref} className="group block">
            <Card className={`${colorStyles.gradient} ${colorStyles.border} ${colorStyles.hover} ${colorStyles.ring} border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden`}>
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        <div className={`p-4 rounded-xl ${colorStyles.icon} shadow-lg group-hover:scale-110 transition-all duration-300`}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                                {title}
                            </h3>
                            <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-sm">
                                {description}
                            </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-2 transition-all duration-300 flex-shrink-0 mt-1" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

// Enhanced Welcome section with better visual hierarchy
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
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Enhanced background patterns */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/10 via-blue-500/5 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-slate-800/50"></div>
            </div>

            <CardContent className="relative p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="flex-1">
                        <div className="flex items-start gap-6 mb-6">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-500/25">
                                <Shield className="h-8 w-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                    {t('welcome')}, <span className="text-blue-600 dark:text-blue-400">{admin.name || admin.email}</span>
                                </h1>
                                <div className="flex items-center gap-4 text-gray-500 dark:text-slate-400 text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{currentDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{currentTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-700 dark:text-slate-300 mb-8 text-lg leading-relaxed max-w-2xl">
                            {t('welcomeMessage')}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg shadow-blue-500/25">
                                <Shield className="h-4 w-4 mr-2" />
                                {admin.primaryRole || t('admin')} {t('authority')}
                            </Badge>
                            {admin.userRoles && admin.userRoles.length > 0 && (
                                admin.userRoles.map((roleName, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-white/80 dark:bg-slate-700/80 text-gray-700 dark:text-slate-300 border border-gray-200/50 dark:border-slate-600/50 px-4 py-2 text-sm font-medium backdrop-blur-sm"
                                    >
                                        {roleName}
                                    </Badge>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminDashboardClient() {
    const admin = useAdminAuth();
    const t = useTranslations('AdminDashboard');

    if (!admin) {
        return <DashboardSkeleton />;
    }

    return (
        <>
                <WelcomeSection admin={admin} t={t} />
                {/* Enhanced Management Center Section */}
                <div className="space-y-8 mt-10">
                    <div className="text-center">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('managementCenter')}
                        </h2>
                        <p className="text-gray-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            {t('managementCenterDesc')}
                        </p>
                        <div className="w-24 h-1 rounded-full mx-auto mt-6 bg-blue-300 dark:bg-white"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {getQuickActions(t).map((action) => (
                            <QuickAction key={action.title} {...action} />
                        ))}
                    </div>
                </div>
        </>
    );
}