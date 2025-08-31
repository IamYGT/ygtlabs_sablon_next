"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { type PermissionName } from "@/lib/permissions";
import {
  LayoutDashboard,
  User,
  Calendar,
  Activity,
  LifeBuoy,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

// Navigation config interface
interface NavigationConfig {
  icon: keyof typeof LUCIDE_ICONS;
  translationKey: string;
  href: string;
  order: number;
  requiredPermission: PermissionName;
}

// Navigation item for UI
interface NavigationItem {
  key: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  order: number;
}

// Sidebar'ın tek gerçek kaynağı (Single Source of Truth)
const NAVIGATION_CONFIG: Record<string, NavigationConfig> = {
  dashboard: {
    icon: "LayoutDashboard",
    translationKey: "dashboard",
    href: "/customer/dashboard",
    order: 1,
    requiredPermission: "customer.dashboard.view",
  },
  profile: {
    icon: "User",
    translationKey: "profileSettings",
    href: "/customer/profile",
    order: 2,
    requiredPermission: "customer.profile.view",
  },
  activity: {
    icon: "Activity",
    translationKey: "activityReport",
    href: "/customer/activity",
    order: 3,
    requiredPermission: "customer.activity.view",
  },
  calendar: {
    icon: "Calendar",
    translationKey: "calendar",
    href: "/customer/calendar",
    order: 4,
    requiredPermission: "customer.calendar.view",
  },
  support: {
    icon: "LifeBuoy",
    translationKey: "support",
    href: "/customer/support",
    order: 5,
    requiredPermission: "customer.support.view",
  },
};

// Lucide icon mapping
const LUCIDE_ICONS = {
  LayoutDashboard,
  User,
  Calendar,
  Activity,
  LifeBuoy,
} as const;

/**
 * 🚀 CUSTOMER NAVIGATION HOOK
 *
 * Customer sidebar navigasyonunu oluşturur.
 * Tüm yetki kontrolleri için merkezi `usePermissions` hook'unu kullanır.
 */
export function useCustomerNavigation(): NavigationItem[] {
  const t = useTranslations("CustomerNavigation");
  const { has } = usePermissions();

  const navItems = React.useMemo(() => {
    return Object.entries(NAVIGATION_CONFIG)
      .filter(([, config]) => has(config.requiredPermission))
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([key, config]) => {
        const IconComponent = LUCIDE_ICONS[config.icon] || User;
        return {
          key,
          label: t(config.translationKey),
          href: config.href,
          order: config.order,
          icon: IconComponent,
        };
      });
  }, [has, t]);

  return navItems;
}

/**
 * 🎯 SAYFA YETKİSİ KONTROLÜ
 *
 * Bir kullanıcının belirli bir müşteri sayfasına erişim yetkisi olup olmadığını kontrol eder.
 * @param pageName - `NAVIGATION_CONFIG` içerisindeki sayfa anahtarı.
 */
export function useHasCustomerPageAccess(
  pageName: keyof typeof NAVIGATION_CONFIG
): boolean {
  const { has } = usePermissions();
  const requiredPermission = NAVIGATION_CONFIG[pageName]?.requiredPermission;

  if (!requiredPermission) {
    console.warn(
      `[useHasCustomerPageAccess] No navigation config found for page: ${pageName}`
    );
    return false;
  }

  return has(requiredPermission);
}