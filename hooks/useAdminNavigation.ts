"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { type PermissionName } from "@/lib/permissions";
import {
  LayoutDashboard,
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


// Sidebar'ın tek gerçek kaynağı (Single Source of Truth)
const NAVIGATION_CONFIG: Record<string, NavigationConfig> = {
  dashboard: {
    icon: "LayoutDashboard",
    translationKey: "dashboard",
    href: "/admin/dashboard",
    order: 1,
    requiredPermission: "admin.dashboard.view",
  },

  // CRM MODULES
  customers: {
    icon: "Users",
    translationKey: "customers",
    href: "/admin/customers",
    order: 2,
    requiredPermission: "admin.customers.view",
  },
  leads: {
    icon: "Users",
    translationKey: "leads",
    href: "/admin/leads",
    order: 3,
    requiredPermission: "admin.leads.view",
  },
  opportunities: {
    icon: "Users",
    translationKey: "opportunities",
    href: "/admin/opportunities",
    order: 4,
    requiredPermission: "admin.opportunities.view",
  },
  campaigns: {
    icon: "Users",
    translationKey: "campaigns",
    href: "/admin/campaigns",
    order: 5,
    requiredPermission: "admin.campaigns.view",
  },
  users: {
    icon: "Users",
    translationKey: "users",
    href: "/admin/users",
    order: 6,
    requiredPermission: "admin.users.view",
  },
  roles: {
    icon: "Shield",
    translationKey: "roles",
    href: "/admin/roles",
    order: 7,
    requiredPermission: "admin.roles.view",
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
  Users,
  Shield,
  User,
} as const;

/**
 * 🚀 ADMIN NAVIGATION HOOK - YENİ STANDART
 *
 * Sidebar navigasyonunu oluşturur.
 * Tüm yetki kontrolleri için merkezi `usePermissions` hook'unu kullanır.
 */
export function useAdminNavigation() {
  const t = useTranslations("AdminNavigation");
  const { has } = usePermissions();

  const { crmItems, otherItems } = React.useMemo(() => {
    // CRM modüllerini ayır - tüm müşteri yönetimi ve satış süreçleri
    const crmKeys = new Set(["customers", "leads", "opportunities", "campaigns", "users", "roles"]);

    const allItems = Object.entries(NAVIGATION_CONFIG)
      .filter(([, config]) => has(config.requiredPermission))
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([key, config]) => {
        const IconComponent = LUCIDE_ICONS[config.icon] || Users;
        return {
          key,
          label: t(config.translationKey),
          href: config.href,
          order: config.order,
          icon: IconComponent,
        };
      });

    const crm = allItems.filter((item) => crmKeys.has(item.key));
    const others = allItems.filter((item) => !crmKeys.has(item.key));

    return {
      crmItems: crm,
      otherItems: others,
    };
  }, [has, t]);

  return { crmItems, otherItems };
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
