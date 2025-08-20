'use client';

import { CustomerPageGuard } from '@/components/panel/CustomerPageGuard';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type SimpleUser as AuthUser } from "@/lib";
import { useAuth } from "@/lib/hooks/useAuth";
import { Link } from '@/src/i18n/navigation';
import { 
  ArrowRight, 
  CreditCard, 
  Heart, 
  Package, 
  ShoppingBag, 
  ShoppingCart, 
  Star, 
  TrendingUp,
  Clock,
  Calendar,
  Award
} from "lucide-react";
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import { DashboardSkeleton } from './DashboardSkeleton';

type TFunction = ReturnType<typeof useTranslations<"CustomerDashboard">>;

// Customer quick actions
function getQuickActions(t: TFunction): QuickActionProps[] {
    return [
        {
            title: t('myOrders'),
            description: t('myOrdersDesc'),
            href: "/customer/orders",
            icon: Package,
            color: "purple" as const,
            stats: "5",
        },
        {
            title: t('wishlist'),
            description: t('wishlistDesc'),
            href: "/customer/wishlist",
            icon: Heart,
            color: "pink" as const,
            stats: "12",
        },
        {
            title: t('loyaltyPoints'),
            description: t('loyaltyPointsDesc'),
            href: "/customer/loyalty",
            icon: Award,
            color: "indigo" as const,
            stats: "450",
        },
        {
            title: t('paymentMethods'),
            description: t('paymentMethodsDesc'),
            href: "/customer/payment",
            icon: CreditCard,
            color: "emerald" as const,
            stats: "3",
        },
    ];
}

// Type definitions
type QuickActionProps = {
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    color: "purple" | "pink" | "indigo" | "emerald";
    stats?: string;
};

// Enhanced Quick action component
function QuickAction({ title, description, href, icon: Icon, color, stats }: QuickActionProps) {
    const colorStyles = {
        purple: {
            gradient: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
            border: "border-purple-200/50 dark:border-purple-700/30",
            icon: "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-500/25",
            hover: "hover:from-purple-100 hover:to-purple-150 dark:hover:from-purple-900/30 dark:hover:to-purple-800/30",
            ring: "hover:ring-2 hover:ring-purple-500/20",
            stats: "text-purple-600 dark:text-purple-400"
        },
        pink: {
            gradient: "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20",
            border: "border-pink-200/50 dark:border-pink-700/30",
            icon: "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-pink-500/25",
            hover: "hover:from-pink-100 hover:to-pink-150 dark:hover:from-pink-900/30 dark:hover:to-pink-800/30",
            ring: "hover:ring-2 hover:ring-pink-500/20",
            stats: "text-pink-600 dark:text-pink-400"
        },
        indigo: {
            gradient: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
            border: "border-indigo-200/50 dark:border-indigo-700/30",
            icon: "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-indigo-500/25",
            hover: "hover:from-indigo-100 hover:to-indigo-150 dark:hover:from-indigo-900/30 dark:hover:to-indigo-800/30",
            ring: "hover:ring-2 hover:ring-indigo-500/20",
            stats: "text-indigo-600 dark:text-indigo-400"
        },
        emerald: {
            gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
            border: "border-emerald-200/50 dark:border-emerald-700/30",
            icon: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/25",
            hover: "hover:from-emerald-100 hover:to-emerald-150 dark:hover:from-emerald-900/30 dark:hover:to-emerald-800/30",
            ring: "hover:ring-2 hover:ring-emerald-500/20",
            stats: "text-emerald-600 dark:text-emerald-400"
        }
    }[color];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const linkHref = href as any;

    return (
        <Link href={linkHref} className="group block">
            <Card className={`${colorStyles.gradient} ${colorStyles.border} ${colorStyles.hover} ${colorStyles.ring} border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden customer-widget`}>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
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
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {stats && (
                                <span className={`text-2xl font-bold ${colorStyles.stats}`}>
                                    {stats}
                                </span>
                            )}
                            <ArrowRight className="h-5 w-5 text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-2 transition-all duration-300" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

// Recent Orders Component
function RecentOrders({ t }: { t: TFunction }) {
    const orders = [
        { id: "#12345", date: "2024-01-15", status: "delivered", amount: "$250.00", items: 3 },
        { id: "#12346", date: "2024-01-14", status: "shipping", amount: "$180.50", items: 2 },
        { id: "#12347", date: "2024-01-13", status: "processing", amount: "$420.00", items: 5 },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
            case "shipping": return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
            case "processing": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
        }
    };

    return (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <ShoppingBag className="h-6 w-6 text-purple-600" />
                        {t('recentOrders')}
                    </h2>
                    <Link href="/customer/orders" className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium flex items-center gap-1">
                        {t('viewAll')}
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                                    <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{order.id}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.date} • {order.items} items</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Badge className={getStatusColor(order.status)}>
                                    {t(`orderStatus.${order.status}`)}
                                </Badge>
                                <span className="font-bold text-gray-900 dark:text-white">{order.amount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// Welcome section
function WelcomeSection({ customer, t }: { customer: AuthUser; t: TFunction }) {
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
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900">
            {/* Background patterns */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
            </div>

            <CardContent className="relative p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="flex-1">
                        <div className="flex items-start gap-6 mb-6">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-xl shadow-purple-500/25">
                                <ShoppingCart className="h-8 w-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                    {t('welcome')}, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{customer.name || customer.email}</span>
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
                            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg shadow-purple-500/25">
                                <Star className="h-4 w-4 mr-2" />
                                {t('premiumMember')}
                            </Badge>
                            <Badge className="bg-white/80 dark:bg-slate-700/80 text-gray-700 dark:text-slate-300 border border-gray-200/50 dark:border-slate-600/50 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                {t('activeSince')} 2023
                            </Badge>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">28</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalOrders')}</p>
                        </div>
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">450</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('loyaltyPoints')}</p>
                        </div>
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">12</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('wishlistItems')}</p>
                        </div>
                        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 text-center">
                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">95%</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{t('satisfaction')}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function CustomerDashboardClient() {
    const { user: customer } = useAuth();
    const t = useTranslations('CustomerDashboard');

    if (!customer) {
        return <DashboardSkeleton />;
    }

    return (
        <CustomerPageGuard>
            <div className="space-y-8 animate-customer-fade-in">
                {/* Welcome Section */}
                <WelcomeSection customer={customer} t={t} />

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {getQuickActions(t).map((action, index) => (
                        <QuickAction key={index} {...action} />
                    ))}
                </div>

                {/* Recent Orders */}
                <RecentOrders t={t} />
            </div>
        </CustomerPageGuard>
    );
}
