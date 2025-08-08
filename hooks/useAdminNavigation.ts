"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { type PermissionName } from "@/lib/permissions";
import {
  Key,
  LayoutDashboard,
  Monitor,
  Shield,
  User,
  Users,
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
  icon: React.ReactElement;
  order: number;
}

// Sidebar'ın tek gerçek kaynağı (Single Source of Truth)
const NAVIGATION_CONFIG: Record<string, NavigationConfig> = {
  dashboard: {
    icon: "LayoutDashboard",
    translationKey: "dashboard",
    href: "/admin/dashboard",
    order: 1,
    requiredPermission: "admin.dashboard.view",
  },
  "hero-slider": {
    icon: "Monitor",
    translationKey: "heroSlider",
    href: "/admin/hero-slider",
    order: 2,
    requiredPermission: "admin.hero-slider.view",
  },
  users: {
    icon: "Users",
    translationKey: "users",
    href: "/admin/users",
    order: 3,
    requiredPermission: "admin.users.view",
  },
  roles: {
    icon: "Shield",
    translationKey: "roles",
    href: "/admin/roles",
    order: 4,
    requiredPermission: "admin.roles.view",
  },
  permissions: {
    icon: "Key",
    translationKey: "permissions",
    href: "/admin/permissions",
    order: 5,
    requiredPermission: "admin.permissions.view",
  },
  i18nRoutes: {
    icon: "Monitor",
    translationKey: "i18nRoutes",
    href: "/admin/i18n/routes",
    order: 9,
    requiredPermission: "admin.permissions.view",
  },
  i18nLanguages: {
    icon: "Monitor",
    translationKey: "i18nLanguages",
    href: "/admin/i18n/languages",
    order: 7,
    requiredPermission: "admin.permissions.view",
  },
  i18nMessages: {
    icon: "Monitor",
    translationKey: "i18nMessages",
    href: "/admin/i18n/messages",
    order: 8,
    requiredPermission: "admin.permissions.view",
  },
  profile: {
    icon: "User",
    translationKey: "profile",
    href: "/admin/profile",
    order: 6,
    requiredPermission: "admin.profile.view",
  },
};

// Lucide icon mapping
const LUCIDE_ICONS = {
  LayoutDashboard,
  Monitor,
  Users,
  Shield,
  Key,
  User,
} as const;

/**
 * 🚀 ADMIN NAVIGATION HOOK - YENİ STANDART
 *
 * Sidebar navigasyonunu oluşturur.
 * Tüm yetki kontrolleri için merkezi `usePermissions` hook'unu kullanır.
 */
export function useAdminNavigation(): NavigationItem[] {
  const t = useTranslations("AdminNavigation");
  const { has } = usePermissions();

  const navItems = React.useMemo(() => {
    return Object.entries(NAVIGATION_CONFIG)
      .filter(([, config]) => has(config.requiredPermission))
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([key, config]) => {
        const IconComponent = LUCIDE_ICONS[config.icon] || Users;
        return {
          key,
          label: t(config.translationKey),
          href: config.href,
          order: config.order,
          icon: React.createElement(IconComponent, {
            className:
              "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0",
          }),
        };
      });
  }, [has, t]);

  return navItems;
}

/**
 * 🎯 SAYFA YETKİSİ KONTROLÜ - YENİ STANDART
 *
 * Bir kullanıcının belirli bir sayfaya erişim yetkisi olup olmadığını kontrol eder.
 * @param pageName - `NAVIGATION_CONFIG` içerisindeki sayfa anahtarı.
 *
 * @example
 * const canAccess = useHasPageAccess('users');
 * if (!canAccess) return <Forbidden />;
 */
export function useHasPageAccess(
  pageName: keyof typeof NAVIGATION_CONFIG
): boolean {
  const { has } = usePermissions();
  const requiredPermission = NAVIGATION_CONFIG[pageName]?.requiredPermission;

  if (!requiredPermission) {
    console.warn(
      `[useHasPageAccess] No navigation config found for page: ${pageName}`
    );
    return false;
  }

  return has(requiredPermission);
}
