"use client";

import { AdminPageGuard } from "@/components/panel/AdminPageGuard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  Activity,
  Users,
  Clock,
  Calendar,
  UserCheck,
  MessageSquare,
  Database,
  Eye,
  UserPlus,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
    },
  },
} as const;

// Dashboard data types
interface DashboardData {
  overview: {
    totalUsers: number;
    totalCustomers: number;
    totalTickets: number;
    totalRoles: number;
    totalPermissions: number;
    activeSessions: number;
  };
  crmMetrics: {
    totalRevenue: number;
    monthlyGrowth: number;
    activeCustomers: number;
    customerGrowth: number;
    totalLeads: number;
    leadConversion: number;
    openOpportunities: number;
    opportunityValue: number;
    activeCampaigns: number;
    campaignROI: number;
    teamPerformance: number;
    avgDealSize: number;
  };
  supportSystem: {
    totalTickets: number;
    openTickets: number;
    resolvedTickets: number;
    ticketResolutionRate: number;
    ticketStatusDistribution: Record<string, number>;
    avgTicketsPerUser: number;
  };
  contentManagement: {
    blogPosts: number;
    faqItems: number;
    infoArticles: number;
    heroSliders: number;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
    status?: string;
    priority?: string;
    translationKey?: string;
    titleKey?: string;
    descriptionKey?: string;
    titleParams?: Record<string, string | number>;
    descriptionParams?: Record<string, string | number>;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    startDate: Date;
    endDate: Date;
    user: string;
  }>;
  recentLogins: Array<{
    id: string;
    user: string;
    loginTime: Date;
    successful: boolean;
    ipAddress?: string;
    userAgent?: string;
  }>;
}

function MetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  suffix = "",
}: {
  title: string;
  value: number | string;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  suffix?: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-900/80 dark:to-slate-900/40 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {title}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {typeof value === "number" ? value.toLocaleString() : value}
                  {suffix}
                </span>
                {change !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${
                    changeType === "positive"
                      ? "text-green-600 dark:text-green-400"
                      : changeType === "negative"
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {changeType === "positive" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : changeType === "negative" ? (
                      <ArrowDown className="h-3 w-3" />
                    ) : null}
                    {Math.abs(change)}%
                  </div>
                )}
              </div>
            </div>
            <div className={`p-3 rounded-xl ${color} shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


function RecentActivities({ activities, t, locale }: { activities: DashboardData['recentActivities'], t: (key: string, params?: Record<string, string | number>) => string, locale: string }) {

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ticket_created':
        return <MessageSquare className="h-5 w-5 mt-0.5 text-blue-500" />;
      case 'user_registered':
        return <UserPlus className="h-5 w-5 mt-0.5 text-green-500" />;
      case 'customer_added':
        return <UserCheck className="h-5 w-5 mt-0.5 text-purple-500" />;
      default:
        return <Activity className="h-5 w-5 mt-0.5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status?: string, priority?: string) => {
    if (!status) return null;

    const statusColors = {
      open: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      in_progress: "bg-orange-100 text-orange-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };

    const priorityColors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };

    return (
      <div className="flex gap-1">
        <Badge className={`text-xs ${statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
          {status}
        </Badge>
        {priority && (
          <Badge className={`text-xs ${priorityColors[priority as keyof typeof priorityColors] || "bg-gray-100 text-gray-800"}`}>
            {priority}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t("recentActivities")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.slice(0, 8).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {activity.titleKey ? t(activity.titleKey, activity.titleParams) : activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.descriptionKey ? t(activity.descriptionKey, activity.descriptionParams) : activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(() => {
                          const date = new Date(activity.time);
                          const now = new Date();
                          const diffMs = now.getTime() - date.getTime();
                          const diffHours = diffMs / (1000 * 60 * 60);
                          const diffDays = diffMs / (1000 * 60 * 60 * 24);

                          if (diffHours < 1) {
                            return t("timeAgo", { time: Math.floor(diffMs / (1000 * 60)), unit: locale === 'tr' ? "dk" : "min" });
                          } else if (diffHours < 24) {
                            return t("timeAgo", { time: Math.floor(diffHours), unit: locale === 'tr' ? "saat" : "hours" });
                          } else if (diffDays < 7) {
                            return t("timeAgo", { time: Math.floor(diffDays), unit: locale === 'tr' ? "gün" : "days" });
                          } else {
                            return date.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                            });
                          }
                        })()}
                      </p>
                    </div>
                    {getStatusBadge(activity.status, activity.priority)}
                  </div>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>{t("noActivitiesYet")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}


export default function AdminDashboardClient() {
  const { user: admin } = useAuth();
  const t = useTranslations("AdminDashboard");
  const locale = useLocale();

  // Dashboard verilerini çek
  const { data: dashboardData, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) {
        throw new Error("Dashboard verileri alınamadı");
      }
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 30000, // 30 saniyede bir yenile
    staleTime: 10000, // 10 saniye boyunca taze kabul et
  });

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">Dashboard verileri yüklenirken hata oluştu</div>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const currentTime = new Date().toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const currentDate = new Date().toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AdminPageGuard requiredPermission="admin.dashboard.view">
      <motion.div
        className="space-y-8 p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            {t("crmPanel")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("panelDescription")}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{currentDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{currentTime}</span>
            </div>
          </div>
        </motion.div>

        {/* Sistem Genel Bakış */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <MetricCard
            title={t("totalUsers")}
            value={dashboardData.overview.totalUsers}
            icon={Users}
            color="bg-gradient-to-br from-blue-500 to-cyan-500"
          />
          <MetricCard
            title={t("activeCustomers")}
            value={dashboardData.overview.totalCustomers}
            icon={UserCheck}
            color="bg-gradient-to-br from-green-500 to-emerald-500"
          />
          <MetricCard
            title={t("supportTickets")}
            value={dashboardData.overview.totalTickets}
            icon={MessageSquare}
            color="bg-gradient-to-br from-purple-500 to-pink-500"
          />
          <MetricCard
            title={t("activeSessions")}
            value={dashboardData.overview.activeSessions}
            icon={Eye}
            color="bg-gradient-to-br from-orange-500 to-red-500"
          />
        </motion.div>


        {/* Ana İçerik */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Destek Sistemi İstatistikleri */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t("supportSystem")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardData.supportSystem.totalTickets}
                    </div>
                    <div className="text-sm text-muted-foreground">{t("totalTickets")}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {dashboardData.supportSystem.ticketResolutionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">{t("resolutionRate")}</div>
                  </div>
                </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{t("ticketStatusDistribution")}</h4>
                    {Object.entries(dashboardData.supportSystem.ticketStatusDistribution).map(([status, count]) => (
                      <div key={status} className="flex justify-between items-center">
                        <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* Alt Kısım - Aktiviteler ve Sistem Durumu */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Son Aktiviteler */}
          <motion.div variants={itemVariants}>
            <RecentActivities activities={dashboardData.recentActivities} t={t} locale={locale} />
          </motion.div>

          {/* Sistem Durumu */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {t("systemStatus")}
                </CardTitle>
              </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/50">
                      <span className="text-sm font-medium text-blue-900 dark:text-blue-100">{t("roles")}</span>
                      <Badge variant="secondary" className="font-bold text-lg px-3 py-1 bg-blue-600 text-white">{dashboardData.overview.totalRoles}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200/50 dark:border-purple-800/50">
                      <span className="text-sm font-medium text-purple-900 dark:text-purple-100">{t("permissions")}</span>
                      <Badge variant="secondary" className="font-bold text-lg px-3 py-1 bg-purple-600 text-white">{dashboardData.overview.totalPermissions}</Badge>
                    </div>
                  </div>
                </CardContent>
            </Card>
          </motion.div>
        </div>

      </motion.div>
    </AdminPageGuard>
  );
}
