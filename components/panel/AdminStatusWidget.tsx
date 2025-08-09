"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Database,
  Settings,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface SystemStatus {
  cpu: number;
  memory: number;
  storage: number;
  uptime: string;
  activeUsers: number;
  totalUsers: number;
  systemHealth: "healthy" | "warning" | "critical";
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  variant?: "default" | "destructive" | "secondary";
}

export function AdminStatusWidget() {
  const t = useTranslations("AdminStatusWidget");
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpu: 45,
    memory: 62,
    storage: 78,
    uptime: "7d 14h 32m",
    activeUsers: 24,
    totalUsers: 156,
    systemHealth: "healthy",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Sistem durumunu simüle et
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus((prev) => ({
        ...prev,
        cpu: Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(
          30,
          Math.min(95, prev.memory + (Math.random() - 0.5) * 8)
        ),
        activeUsers: Math.max(
          10,
          Math.min(50, prev.activeUsers + Math.floor((Math.random() - 0.5) * 6))
        ),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Sistem sağlığını belirle
  useEffect(() => {
    const avgLoad =
      (systemStatus.cpu + systemStatus.memory + systemStatus.storage) / 3;
    let health: SystemStatus["systemHealth"] = "healthy";

    if (avgLoad > 80) health = "critical";
    else if (avgLoad > 65) health = "warning";

    setSystemStatus((prev) => ({ ...prev, systemHealth: health }));
  }, [systemStatus.cpu, systemStatus.memory, systemStatus.storage]);

  const quickActions: QuickAction[] = [
    {
      id: "users",
      label: t("actions.users"),
      icon: <Users className="h-4 w-4" />,
      action: () =>
        (window.location.href = `/${
          window.location.pathname.split("/")[1]
        }/admin/users`),
    },
    {
      id: "settings",
      label: t("actions.settings"),
      icon: <Settings className="h-4 w-4" />,
      action: () =>
        (window.location.href = `/${
          window.location.pathname.split("/")[1]
        }/admin/settings`),
    },
    {
      id: "analytics",
      label: t("actions.analytics"),
      icon: <BarChart3 className="h-4 w-4" />,
      action: () =>
        (window.location.href = `/${
          window.location.pathname.split("/")[1]
        }/admin/analytics`),
    },
    {
      id: "backup",
      label: t("actions.backup"),
      icon: <Database className="h-4 w-4" />,
      action: () => console.log("Backup initiated"),
      variant: "secondary" as const,
    },
  ];

  const getHealthColor = (health: SystemStatus["systemHealth"]) => {
    switch (health) {
      case "healthy":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getHealthIcon = (health: SystemStatus["systemHealth"]) => {
    switch (health) {
      case "healthy":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getProgressColor = (value: number) => {
    if (value > 80) return "bg-red-500";
    if (value > 65) return "bg-yellow-500";
    return "bg-green-500";
  };

  const healthText = (health: SystemStatus["systemHealth"]) => {
    switch (health) {
      case "healthy":
        return t("healthy");
      case "warning":
        return t("warning");
      case "critical":
        return t("critical");
      default:
        return t("healthy");
    }
  };

  return (
    <DropdownMenu open={isExpanded} onOpenChange={setIsExpanded}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative transition-all duration-200 hover:scale-105 hover:bg-accent/50 rounded-lg h-9 w-9"
        >
          <div
            className={`${getHealthColor(
              systemStatus.systemHealth
            )} transition-colors duration-300`}
          >
            {getHealthIcon(systemStatus.systemHealth)}
          </div>
          {systemStatus.systemHealth !== "healthy" && (
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 border-border/60 shadow-xl p-0"
      >
        <DropdownMenuLabel className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <span className="font-semibold">{t("title")}</span>
          </div>
          <Badge
            variant={
              systemStatus.systemHealth === "healthy"
                ? "default"
                : "destructive"
            }
            className="text-xs"
          >
            {healthText(systemStatus.systemHealth)}
          </Badge>
        </DropdownMenuLabel>

        <div className="px-4 pb-4">
          {/* Sistem Metrikleri */}
          <Card className="mb-4">
            <CardContent className="p-4 space-y-3">
              {/* CPU */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">{t("cpu")}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {systemStatus.cpu.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                    systemStatus.cpu
                  )}`}
                  style={{ width: `${systemStatus.cpu}%` }}
                />
              </div>

              {/* Memory */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">{t("memory")}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {systemStatus.memory.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                    systemStatus.memory
                  )}`}
                  style={{ width: `${systemStatus.memory}%` }}
                />
              </div>

              {/* Storage */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{t("storage")}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {systemStatus.storage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                    systemStatus.storage
                  )}`}
                  style={{ width: `${systemStatus.storage}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* İstatistikler */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card>
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground">
                    {t("uptime")}
                  </span>
                </div>
                <p className="text-sm font-semibold">{systemStatus.uptime}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">
                    {t("activeUsers")}
                  </span>
                </div>
                <p className="text-sm font-semibold">
                  {systemStatus.activeUsers}/{systemStatus.totalUsers}
                </p>
              </CardContent>
            </Card>
          </div>

          <DropdownMenuSeparator />

          {/* Hızlı Eylemler */}
          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              {t("quickActions")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant || "outline"}
                  size="sm"
                  className="h-auto p-3 flex flex-col items-center gap-2 text-xs transition-all duration-200 hover:scale-105"
                  onClick={() => {
                    action.action();
                    setIsExpanded(false);
                  }}
                >
                  {action.icon}
                  <span className="text-center leading-tight">
                    {action.label}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
