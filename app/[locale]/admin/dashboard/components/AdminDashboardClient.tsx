"use client";

import { DebugAuth } from "@/components/debug/DebugAuth";
import { AdminPageGuard } from "@/components/panel/AdminPageGuard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type SimpleUser as AuthUser } from "@/lib";
import { useAuth } from "@/lib/hooks/useAuth";
import { Link } from "@/lib/i18n/navigation";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Clock,
  FileText,
  Shield,
  Users,
  Activity,
  TrendingUp,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import "../../styles/admin.css"; // Admin CSS'ini import ediyoruz
import { DashboardSkeleton } from "./../components/DashboardSkeleton";

type TFunction = ReturnType<typeof useTranslations<"AdminDashboard">>;

// Animation variants (simplified for TypeScript compatibility)
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

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    y: -8,
    transition: {
      duration: 0.3,
    },
  },
} as const;

// Stats data for demo
const statsData = [
  { label: "Toplam Kullanıcı", value: 1247, icon: Users, color: "blue" },
  { label: "Aktif Oturum", value: 89, icon: Activity, color: "emerald" },
  { label: "Bugünkü İşlem", value: 156, icon: TrendingUp, color: "purple" },
  { label: "Sistem Durumu", value: 99.9, icon: Shield, color: "orange", suffix: "%" },
];

// Stats Card Component
function StatsCard({ label, value, icon: Icon, color, suffix }: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  suffix?: string;
}) {
  const colorStyles = {
    blue: {
      gradient: "bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-cyan-500/10",
      glass: "backdrop-blur-xl bg-white/10 dark:bg-slate-900/10 border border-white/20 dark:border-slate-700/30",
      icon: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-blue-500/40",
      glow: "shadow-blue-500/20 hover:shadow-blue-500/40",
      text: "text-blue-600 dark:text-blue-400",
    },
    emerald: {
      gradient: "bg-gradient-to-br from-emerald-500/10 via-green-600/5 to-teal-500/10",
      glass: "backdrop-blur-xl bg-white/10 dark:bg-slate-900/10 border border-white/20 dark:border-slate-700/30",
      icon: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/40",
      glow: "shadow-emerald-500/20 hover:shadow-emerald-500/40",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    purple: {
      gradient: "bg-gradient-to-br from-purple-500/10 via-violet-600/5 to-pink-500/10",
      glass: "backdrop-blur-xl bg-white/10 dark:bg-slate-900/10 border border-white/20 dark:border-slate-700/30",
      icon: "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-purple-500/40",
      glow: "shadow-purple-500/20 hover:shadow-purple-500/40",
      text: "text-purple-600 dark:text-purple-400",
    },
    orange: {
      gradient: "bg-gradient-to-br from-orange-500/10 via-amber-600/5 to-red-500/10",
      glass: "backdrop-blur-xl bg-white/10 dark:bg-slate-900/10 border border-white/20 dark:border-slate-700/30",
      icon: "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-orange-500/40",
      glow: "shadow-orange-500/20 hover:shadow-orange-500/40",
      text: "text-orange-600 dark:text-orange-400",
    },
  }[color as "blue" | "emerald" | "purple" | "orange"];

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`${colorStyles.glass} ${colorStyles.glow} relative border-0 transition-all duration-500 hover:shadow-2xl hover:shadow-black/10`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-600 dark:text-slate-400 text-sm font-medium mb-2">
                {label}
              </p>
              <div className={`text-3xl font-bold ${colorStyles.text}`}>
                <CountUp
                  end={value}
                  duration={2}
                  separator=","
                  suffix={suffix}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </div>
            </div>
            <motion.div
              className={`p-4 rounded-2xl ${colorStyles.icon} shadow-xl`}
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className="h-7 w-7" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Management Center quick actions
function getQuickActions(t: TFunction): QuickActionProps[] {
  return [
    {
      title: t("customerManagement"),
      description: t("customerManagementDesc"),
      href: "/admin/users",
      icon: Users,
      color: "blue" as const,
    },
    {
      title: t("financialReports"),
      description: t("financialReportsDesc"),
      href: "/admin/roles",
      icon: BarChart3,
      color: "emerald" as const,
    },
    {
      title: t("securityCenter"),
      description: t("securityCenterDesc"),
      href: "/admin/permissions",
      icon: Shield,
      color: "purple" as const,
    },
    {
      title: t("transactionLogs"),
      description: t("transactionLogsDesc"),
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

// Enhanced Quick action component with modern glassmorphism design and animations
function QuickAction({
  title,
  description,
  href,
  icon: Icon,
  color,
}: QuickActionProps) {
  const colorStyles = {
    blue: {
      gradient: "bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-cyan-500/10",
      glass: "backdrop-blur-xl bg-white/10 dark:bg-slate-900/10 border border-white/20 dark:border-slate-700/30",
      icon: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-blue-500/40",
      hover: "hover:from-blue-500/20 hover:via-blue-600/10 hover:to-cyan-500/20",
      glow: "shadow-blue-500/20 hover:shadow-blue-500/40",
    },
    emerald: {
      gradient: "bg-gradient-to-br from-emerald-500/10 via-green-600/5 to-teal-500/10",
      glass: "backdrop-blur-xl bg-white/10 dark:bg-slate-900/10 border border-white/20 dark:border-slate-700/30",
      icon: "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald-500/40",
      hover: "hover:from-emerald-500/20 hover:via-green-600/10 hover:to-teal-500/20",
      glow: "shadow-emerald-500/20 hover:shadow-emerald-500/40",
    },
    purple: {
      gradient: "bg-gradient-to-br from-purple-500/10 via-violet-600/5 to-pink-500/10",
      glass: "backdrop-blur-xl bg-white/10 dark:bg-slate-900/10 border border-white/20 dark:border-slate-700/30",
      icon: "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-purple-500/40",
      hover: "hover:from-purple-500/20 hover:via-violet-600/10 hover:to-pink-500/20",
      glow: "shadow-purple-500/20 hover:shadow-purple-500/40",
    },
    orange: {
      gradient: "bg-gradient-to-br from-orange-500/10 via-amber-600/5 to-red-500/10",
      glass: "backdrop-blur-xl bg-white/10 dark:bg-slate-900/10 border border-white/20 dark:border-slate-700/30",
      icon: "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-orange-500/40",
      hover: "hover:from-orange-500/20 hover:via-amber-600/10 hover:to-red-500/20",
      glow: "shadow-orange-500/20 hover:shadow-orange-500/40",
    },
  }[color];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const linkHref = href as any;

  return (
    <motion.div variants={itemVariants}>
      <Link href={linkHref} className="group block">
        <motion.div
          variants={cardHoverVariants}
          whileHover="hover"
          className="relative overflow-hidden rounded-2xl"
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 ${colorStyles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

          {/* Glass morphism card */}
          <Card className={`${colorStyles.glass} ${colorStyles.glow} relative border-0 transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 group-hover:border-white/30`}>
            <CardContent className="p-8">
              <div className="flex items-start space-x-6">
                <motion.div
                  className={`p-5 rounded-2xl ${colorStyles.icon} shadow-xl group-hover:scale-110 transition-all duration-500`}
                  whileHover={{ rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="h-7 w-7" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-3 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-sm group-hover:text-gray-700 dark:group-hover:text-slate-200 transition-colors duration-300">
                    {description}
                  </p>
                </div>
                <motion.div
                  className="flex-shrink-0"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowRight className="h-6 w-6 text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-300" />
                </motion.div>
              </div>

              {/* Subtle bottom gradient */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${colorStyles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </CardContent>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Modern Welcome section with glassmorphism and animations
function WelcomeSection({ admin, t }: { admin: AuthUser; t: TFunction }) {
  const locale = useLocale();

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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="relative overflow-hidden border-0 shadow-2xl backdrop-blur-xl bg-white/20 dark:bg-slate-900/20">
        {/* Animated background patterns */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/15 via-purple-500/8 to-transparent rounded-full -translate-y-48 translate-x-48"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-500/15 via-blue-500/8 to-transparent rounded-full translate-y-32 -translate-x-32"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-slate-800/30"></div>
        </div>

        <CardContent className="relative p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex-1">
              <motion.div
                className="flex items-start gap-6 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <motion.div
                  className="p-5 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-2xl shadow-blue-500/30"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Shield className="h-10 w-10 text-white" />
                </motion.div>
                <div className="flex-1">
                  <motion.h1
                    className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    {t("welcome")},{" "}
                    <motion.span
                      className="bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    >
                      {admin.name || admin.email}
                    </motion.span>
                  </motion.h1>
                  <motion.div
                    className="flex items-center gap-4 text-gray-500 dark:text-slate-400 text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{currentDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{currentTime}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.p
                className="text-gray-700 dark:text-slate-300 mb-8 text-lg leading-relaxed max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                {t("welcomeMessage")}
              </motion.p>

              <motion.div
                className="flex flex-wrap items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Badge className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-0 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-500/30 backdrop-blur-sm">
                    <Shield className="h-4 w-4 mr-2" />
                    {admin.primaryRole || t("admin")} {t("authority")}
                  </Badge>
                </motion.div>
                {admin.userRoles &&
                  admin.userRoles.length > 0 &&
                  admin.userRoles.map((roleName, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-white/60 dark:bg-slate-700/60 text-gray-700 dark:text-slate-300 border border-gray-200/50 dark:border-slate-600/50 px-4 py-2 text-sm font-medium backdrop-blur-sm shadow-sm"
                      >
                        {roleName}
                      </Badge>
                    </motion.div>
                  ))}
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AdminDashboardClient() {
  const { user: admin } = useAuth();
  const t = useTranslations("AdminDashboard");

  if (!admin) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <AdminPageGuard requiredPermission="admin.dashboard.view">
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Section */}
          <WelcomeSection admin={admin} t={t} />

          {/* Stats Section */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <div className="text-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Sistem İstatistikleri
              </h2>
              <p className="text-gray-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
                Gerçek zamanlı sistem performans ve kullanım verileri
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData.map((stat) => (
                <StatsCard key={stat.label} {...stat} />
              ))}
            </div>
          </motion.div>

          {/* Management Center Section */}
          <motion.div
            className="space-y-8"
            variants={itemVariants}
          >
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("managementCenter")}
              </h2>
              <p className="text-gray-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                {t("managementCenterDesc")}
              </p>
              <motion.div
                className="w-24 h-1 rounded-full mx-auto mt-6 bg-gradient-to-r from-blue-500 to-cyan-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
              />
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
              variants={containerVariants}
            >
              {getQuickActions(t).map((action) => (
                <QuickAction key={action.title} {...action} />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </AdminPageGuard>
      <DebugAuth />
    </>
  );
}
