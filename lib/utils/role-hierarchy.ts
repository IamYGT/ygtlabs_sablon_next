/**
 * 🛡️ Role Hierarchy Utility
 * 
 * Rol hiyerarşisi ve yetki kontrolleri için yardımcı fonksiyonlar
 */

import { ROLES } from "@/lib/constants";

// Rol hiyerarşi seviyeleri (düşük numara = yüksek yetki)
export const ROLE_HIERARCHY: Record<string, number> = {
  [ROLES.SUPER_ADMIN]: 1,
  admin: 2,
  moderator: 3,
  editor: 4,
  [ROLES.CUSTOMER]: 5,
  user: 6,
  guest: 99,
} as const;

// Sistem rolleri (silinemez/değiştirilemez)
export const PROTECTED_ROLES = [ROLES.SUPER_ADMIN] as const;

/**
 * İki rolün hiyerarşik seviyesini karşılaştırır
 * @returns true eğer sourceRole, targetRole'den daha yüksek veya eşit seviyedeyse
 */
export function canAssignRole(
  sourceRole: string | null | undefined,
  targetRole: string | null | undefined
): boolean {
  if (!sourceRole || !targetRole) return false;

  // Super admin her rolü atayabilir
  if (sourceRole === ROLES.SUPER_ADMIN) return true;

  const sourceLevel = ROLE_HIERARCHY[sourceRole] ?? 99;
  const targetLevel = ROLE_HIERARCHY[targetRole] ?? 99;

  // Kullanıcı sadece kendi seviyesinden düşük rolleri atayabilir
  return sourceLevel < targetLevel;
}

/**
 * Kullanıcının belirli bir rolü düzenleyip düzenleyemeyeceğini kontrol eder
 */
export function canEditRole(
  userRole: string | null | undefined,
  targetRole: string | null | undefined
): boolean {
  if (!userRole || !targetRole) return false;

  // Korunan roller sadece super admin tarafından düzenlenebilir
  if (PROTECTED_ROLES.includes(targetRole as typeof PROTECTED_ROLES[number])) {
    return userRole === ROLES.SUPER_ADMIN;
  }

  // Diğer durumlarda hiyerarşi kontrolü
  return canAssignRole(userRole, targetRole);
}

/**
 * Kullanıcının belirli bir rolü silip silemeyeceğini kontrol eder
 */
export function canDeleteRole(
  userRole: string | null | undefined,
  targetRole: string | null | undefined
): boolean {
  if (!userRole || !targetRole) return false;

  // Korunan roller silinemez
  if (PROTECTED_ROLES.includes(targetRole as typeof PROTECTED_ROLES[number])) {
    return false;
  }

  // Diğer durumlarda hiyerarşi kontrolü
  return canAssignRole(userRole, targetRole);
}

/**
 * Kullanıcının görebileceği rolleri filtreler
 */
export function getAvailableRoles(userRole: string | null | undefined): string[] {
  if (!userRole) return [];

  // Super admin tüm rolleri görebilir
  if (userRole === ROLES.SUPER_ADMIN) {
    return Object.keys(ROLE_HIERARCHY);
  }

  const userLevel = ROLE_HIERARCHY[userRole] ?? 99;

  // Kullanıcı sadece kendi seviyesinden düşük rolleri görebilir
  return Object.entries(ROLE_HIERARCHY)
    .filter(([_, level]) => level > userLevel)
    .map(([role]) => role);
}

/**
 * Kullanıcının atayabileceği rolleri filtreler
 */
export function getAssignableRoles(userRole: string | null | undefined): string[] {
  return getAvailableRoles(userRole);
}

/**
 * Rol ismini kullanıcı dostu formata çevirir
 */
export function getRoleDisplayName(role: string): string {
  const displayNames: Record<string, string> = {
    [ROLES.SUPER_ADMIN]: "Süper Admin",
    admin: "Admin",
    moderator: "Moderatör",
    editor: "Editör",
    [ROLES.CUSTOMER]: "Müşteri",
    user: "Kullanıcı",
    guest: "Misafir",
  };

  return displayNames[role] || role;
}

/**
 * Rolün rengini döndürür (UI için)
 */
export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    [ROLES.SUPER_ADMIN]: "bg-red-500",
    admin: "bg-orange-500",
    moderator: "bg-yellow-500",
    editor: "bg-green-500",
    [ROLES.CUSTOMER]: "bg-blue-500",
    user: "bg-gray-500",
    guest: "bg-gray-400",
  };

  return colors[role] || "bg-gray-500";
}

/**
 * Kullanıcının kendi rolünü değiştirip değiştiremeyeceğini kontrol eder
 */
export function canModifyOwnRole(_userRole: string | null | undefined): boolean {
  // Sadece super admin kendi rolünü değiştirebilir (tehlikeli!)
  // Genelde bu false olmalı güvenlik için
  return false;
}

/**
 * Verilen roller arasındaki en yüksek yetkili rolü döndürür
 */
export function getHighestRole(roles: string[]): string | null {
  if (!roles || roles.length === 0) return null;

  return roles.reduce((highest, current) => {
    const highestLevel = ROLE_HIERARCHY[highest] ?? 99;
    const currentLevel = ROLE_HIERARCHY[current] ?? 99;
    return currentLevel < highestLevel ? current : highest;
  });
}
