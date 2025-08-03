"use client";

import { ROLES } from "@/lib/constants";
import { useAuth } from "@/lib/hooks/useAuth";
import { type PermissionName } from "@/lib/permissions/config";
import {
  Key,
  LayoutDashboard,
  Monitor,
  Shield,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

// Navigation config interface (moved from permissions system)
interface NavigationConfig {
  icon: string; // Lucide icon name
  translationKey: string;
  href: string;
  order: number;
  isVisible?: boolean;
  requiredPermission: PermissionName;
  children?: NavigationConfig[];
}

// Navigation item for UI
interface NavigationItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactElement;
  order: number;
}

// 🧭 NAVIGATION CONFIGURATIONS (Moved from permission system)
// Sidebar kendi navigation'ını yönetiyor, sadece permission kontrolü permission sisteminden
const NAVIGATION_CONFIGURATIONS: Record<string, NavigationConfig> = {
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
  profile: {
    icon: "User",
    translationKey: "profile",
    href: "/admin/profile",
    order: 6,
    requiredPermission: "admin.profile.view",
  },
};

// Lucide icon mapping
const LUCIDE_ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Monitor,
  Users,
  Shield,
  Key,
  User,
};

// Helper function to get Lucide icon by name
const getLucideIcon = (iconName: string): LucideIcon => {
  return LUCIDE_ICONS[iconName] || Users; // Default fallback
};

// Navigation helper functions (moved from permission system)
const getNavigationItems = (userPermissions: string[]): NavigationConfig[] => {
  return Object.values(NAVIGATION_CONFIGURATIONS)
    .filter((nav) => userPermissions.includes(nav.requiredPermission))
    .sort((a, b) => a.order - b.order);
};

/**
 * 🚀 ADMIN NAVIGATION HOOK
 * Sidebar kendi navigation'ını yönetiyor!
 * Permission sisteminden sadece permission kontrolü alıyor.
 */
export function useAdminNavigation(): NavigationItem[] {
  const t = useTranslations("AdminNavigation");
  const { user } = useAuth();

  // User'ın permissions'larını al
  const userPermissions = user?.permissions || [];

  // super_admin için tüm navigation items'ları döndür
  const isSuperAdmin = user?.primaryRole === ROLES.SUPER_ADMIN;

  if (isSuperAdmin) {
    // Super admin tüm navigation items'ları görebilir
    return Object.entries(NAVIGATION_CONFIGURATIONS)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([key, config]) => {
        const IconComponent = getLucideIcon(config.icon);
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
  }

  // Normal kullanıcılar için permission-based navigation
  const allowedNavigationItems = getNavigationItems(userPermissions);

  return allowedNavigationItems.map((config) => {
    const key =
      Object.keys(NAVIGATION_CONFIGURATIONS).find(
        (k) => NAVIGATION_CONFIGURATIONS[k] === config
      ) || "";

    const IconComponent = getLucideIcon(config.icon);

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
}

/**
 * 🎯 SAYFA YETKİSİ KONTROLÜ
 * Navigation config'den required permission'ı bulur ve permission kontrolü yapar
 */
export function useHasPageAccess(pageName: string): boolean {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];

  // Super admin her şeye erişebilir
  const isSuperAdmin = user?.primaryRole === ROLES.SUPER_ADMIN;
  if (isSuperAdmin) return true;

  // Navigation config'den required permission'ı bul
  const navigationConfig = NAVIGATION_CONFIGURATIONS[pageName];
  if (!navigationConfig) return false;

  return userPermissions.includes(navigationConfig.requiredPermission);
}

/**
 * 📋 USER'IN ERİŞEBİLDİĞİ SAYFALARI LİSTELE
 * Navigation config'den erişilebilir navigation items'larını filtreler
 */
export function useUserAccessiblePages(): string[] {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];

  // Super admin tüm sayfaları görebilir
  const isSuperAdmin = user?.primaryRole === ROLES.SUPER_ADMIN;
  if (isSuperAdmin) {
    return Object.keys(NAVIGATION_CONFIGURATIONS);
  }

  // Permission'a göre erişilebilir sayfalar
  return Object.entries(NAVIGATION_CONFIGURATIONS)
    .filter(([, config]) => userPermissions.includes(config.requiredPermission))
    .map(([key]) => key);
}

/**
 * 🔍 PERMISSION KONTROLÜ
 * Permission sisteminden permission name'lerini kullanarak kontrol yapar
 */
export function useHasPermission(permissionName: PermissionName): boolean {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];

  // Super admin her şeye erişebilir
  const isSuperAdmin = user?.primaryRole === ROLES.SUPER_ADMIN;
  if (isSuperAdmin) return true;

  return userPermissions.includes(permissionName);
}

/**
 * 🚀 NAVIGATION HELPERS
 * Navigation sistemi kendi helper'larını sağlıyor
 */
export const NavigationHelpers = {
  NAVIGATION_CONFIGURATIONS,
  getLucideIcon,
  getNavigationItems,
} as const;
