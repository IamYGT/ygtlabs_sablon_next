"use client";

import { ROLES } from "@/lib/constants";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  LayoutDashboard,
  Monitor,
  Shield,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

// Type tanımları
interface AdminPageConfig {
  icon: LucideIcon;
  translationKey: string;
  href: string;
  requiredPermission: string;
}

interface NavigationItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactElement;
}

// 🎯 BASIT NAVIGATION CONFIGURATION
// Sadece burada tanımla, her şey otomatik çalışsın!
export const ADMIN_PAGES_CONFIG: Record<string, AdminPageConfig> = {
  dashboard: {
    icon: LayoutDashboard,
    translationKey: "dashboard",
    href: "/admin/dashboard",
    requiredPermission: "admin.dashboard.view", // Database'deki tam format
  },
  "hero-slider": {
    icon: Monitor,
    translationKey: "heroSlider",
    href: "/admin/hero-slider",
    requiredPermission: "admin.hero-slider.view",
  },
  users: {
    icon: Users,
    translationKey: "users",
    href: "/admin/users",
    requiredPermission: "admin.users.view",
  },
  roles: {
    icon: Shield,
    translationKey: "roles",
    href: "/admin/roles",
    requiredPermission: "admin.roles.view",
  },
  profile: {
    icon: User,
    translationKey: "profile",
    href: "/admin/profile",
    requiredPermission: "admin.profile.view",
  },
};

/**
 * 🚀 SÜPER BASIT NAVIGATION HOOK
 * Tek satırda tüm navigation'ı halleder!
 */
export function useAdminNavigation(): NavigationItem[] {
  const t = useTranslations("AdminNavigation");
  const { user } = useAuth();

  // User'ın permissions'larını al (basit format)
  const userPermissions = user?.permissions || [];

  // super_admin için tüm kısıtlamaları kaldır
  const isSuperAdmin = user?.primaryRole === ROLES.SUPER_ADMIN;

  // Configuration'dan navigation items'ları oluştur
  const navigationItems = Object.entries(ADMIN_PAGES_CONFIG)
    .filter(([_, config]) => {
      // super_admin tüm sayfaları görebilir
      if (isSuperAdmin) return true;

      // Diğer roller için permission kontrolü
      return userPermissions.includes(config.requiredPermission);
    })
    .map(([key, config]) => {
      const IconComponent = config.icon;
      return {
        key,
        label: t(config.translationKey),
        href: config.href,
        icon: React.createElement(IconComponent, {
          className:
            "text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0",
        }),
      };
    });

  return navigationItems;
}

/**
 * 🎯 SAYFA YETKİSİ KONTROLÜ (Süper basit!)
 */
export function useHasPageAccess(pageName: string) {
  const { user } = useAuth();
  const requiredPermission = `admin.${pageName}`;
  return user?.permissions?.includes(requiredPermission) || false;
}

/**
 * 📋 USER'IN ERİŞEBİLDİĞİ SAYFALARI LİSTELE
 */
export function useUserAccessiblePages() {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];

  return userPermissions
    .filter((permission) => permission.startsWith("admin."))
    .map((permission) => permission.replace("admin.", ""));
}
