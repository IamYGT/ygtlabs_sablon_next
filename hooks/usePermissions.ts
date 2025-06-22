import { useState, useEffect, useCallback } from "react";

interface Permission {
  id: string;
  roleName?: string;
  resourceType: string;
  resourcePath: string;
  action: string;
  displayName?: string;
  description?: string;
  category?: string;
  isActive: boolean;
  isSystemPermission: boolean;
  role?: {
    name: string;
    displayName: string;
    color?: string;
  };
}

interface GroupedPermissions {
  [key: string]: Permission[];
}

// Özel gruplandırma - benzer işlevleri bir araya getir
const functionalGroups = {
  profile: {
    name: "Profil Yetkileri",
    keywords: ["profile", "profil"],
  },
  roles: {
    name: "Rol Yetkileri",
    keywords: ["role", "rol"],
  },
  users: {
    name: "Kullanıcı Yetkileri",
    keywords: ["user", "kullanıcı"],
  },
  permissions: {
    name: "Yetki Yetkileri",
    keywords: ["permission", "yetki"],
  },
};

// ResourceType bazında gruplandırma
const resourceTypeConfig = {
  layout: { name: "Layout" },
  page: { name: "Sayfa" },
  function: { name: "Fonksiyon" },
};

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [groupedPermissions, setGroupedPermissions] =
    useState<GroupedPermissions>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Yetkiyi hangi gruba ait olduğunu belirle
  const getPermissionGroup = (permission: Permission): string => {
    const path = permission.resourcePath.toLowerCase();
    const displayName = (permission.displayName || "").toLowerCase();
    const description = (permission.description || "").toLowerCase();

    // Önce özel grupları kontrol et
    for (const [groupKey, group] of Object.entries(functionalGroups)) {
      if (
        group.keywords.some(
          (keyword) =>
            path.includes(keyword) ||
            displayName.includes(keyword) ||
            description.includes(keyword)
        )
      ) {
        return groupKey;
      }
    }

    // Sonra resourceType'a göre grupla
    return permission.resourceType;
  };

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/permissions?limit=1000");

      if (!response.ok) {
        throw new Error("Yetkiler getirilemedi");
      }

      const data = await response.json();

      // Client-side gruplandırma
      const grouped = data.permissions.reduce(
        (acc: GroupedPermissions, perm: Permission) => {
          const group = getPermissionGroup(perm);
          if (!acc[group]) {
            acc[group] = [];
          }
          acc[group].push(perm);
          return acc;
        },
        {}
      );

      setPermissions(data.permissions);
      setGroupedPermissions(grouped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const getGroupName = (groupKey: string): string => {
    return (
      functionalGroups[groupKey as keyof typeof functionalGroups]?.name ||
      resourceTypeConfig[groupKey as keyof typeof resourceTypeConfig]?.name ||
      groupKey
    );
  };

  const getPermissionsByRole = (roleName: string): Permission[] => {
    return permissions.filter((perm) => perm.roleName === roleName);
  };

  const getGroupedPermissionsByRole = (
    roleName: string
  ): GroupedPermissions => {
    const rolePermissions = getPermissionsByRole(roleName);
    return rolePermissions.reduce(
      (acc: GroupedPermissions, perm: Permission) => {
        const group = getPermissionGroup(perm);
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(perm);
        return acc;
      },
      {}
    );
  };

  return {
    permissions,
    groupedPermissions,
    loading,
    error,
    refetch: fetchPermissions,
    getGroupName,
    getPermissionsByRole,
    getGroupedPermissionsByRole,
  };
}
