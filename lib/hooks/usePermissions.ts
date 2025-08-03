"use client";

import React from "react";
import { type PermissionName } from "../permissions";
import { useAuthStore } from "../stores/auth-store";

/**
 * Merkezi ve Type-Safe Yetki Kontrolü Hook'u
 *
 * Bu hook, client-side'da yetki kontrollerini standart hale getirir.
 * Tamamen type-safe'dir ve yetki isimleri için autocompletion sağlar.
 *
 * @example
 * const { has, isLoading } = usePermissions();
 *
 * if (isLoading) return <Spinner />;
 *
 * return (
 *   <div>
 *     {has("users.create") && <CreateUserButton />}
 *     {has("users.delete") && <DeleteUserButton />}
 *   </div>
 * );
 */
export function usePermissions() {
  const userPermissions =
    useAuthStore((state) => state.user?.permissions) || [];
  const isLoading = useAuthStore((state) => state.isLoading);
  const isSuperAdmin = useAuthStore((state) => state.isSuperAdmin());

  /**
   * Belirtilen yetkinin kullanıcıda olup olmadığını kontrol eder.
   * Süper admin her zaman yetkilidir.
   * @param permission - Kontrol edilecek yetki adı (type-safe)
   */
  const has = React.useCallback(
    (permission: PermissionName): boolean => {
      if (isSuperAdmin) return true;
      return userPermissions.includes(permission);
    },
    [userPermissions, isSuperAdmin]
  );

  /**
   * Belirtilen yetkilerden herhangi birinin kullanıcıda olup olmadığını kontrol eder.
   * @param permissions - Kontrol edilecek yetki adları (type-safe)
   */
  const hasAny = React.useCallback(
    (...permissions: PermissionName[]): boolean => {
      if (isSuperAdmin) return true;
      return permissions.some((p) => userPermissions.includes(p));
    },
    [userPermissions, isSuperAdmin]
  );

  /**
   * Belirtilen yetkilerin tümünün kullanıcıda olup olmadığını kontrol eder.
   * @param permissions - Kontrol edilecek yetki adları (type-safe)
   */
  const hasAll = React.useCallback(
    (...permissions: PermissionName[]): boolean => {
      if (isSuperAdmin) return true;
      return permissions.every((p) => userPermissions.includes(p));
    },
    [userPermissions, isSuperAdmin]
  );

  return {
    /**
     * Tek bir yetkinin varlığını kontrol eder.
     * @param permission - `PermissionName` tipinde yetki adı.
     * @returns `boolean`
     */
    has,
    /**
     * Verilen yetkilerden en az birinin varlığını kontrol eder.
     * @param permissions - `PermissionName` tipinde yetki adları.
     * @returns `boolean`
     */
    hasAny,
    /**
     * Verilen tüm yetkilerin varlığını kontrol eder.
     * @param permissions - `PermissionName` tipinde yetki adları.
     * @returns `boolean`
     */
    hasAll,
    /**
     * Yetkilerin yüklenip yüklenmediğini belirtir.
     */
    isLoading,
    /**
     * Kullanıcının yetkilerinin tam listesi.
     */
    list: userPermissions,
  };
}
