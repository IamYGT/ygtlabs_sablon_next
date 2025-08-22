import { useCallback, useEffect, useState } from "react";

interface Permission {
  id: string; // Yeni sistem: temiz isimler (admin.dashboard, users.create)
  name: string;
  category: string; // "layout", "view", "function"
  resourcePath: string; // "admin", "users", "dashboard"
  action: string; // "access", "view", "crud"
  permissionType: string; // "admin", "user"
  displayName?: { tr: string; en: string };
  description?: { tr: string; en: string };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}


interface GroupedPermissions {
  [key: string]: Permission[];
}

// Yeni permission sistemi gruplandırma
const categoryConfig = {
  layout: {
    name: "Layout Erişim",
    description: "Temel panel erişim yetkileri",
    icon: "🏠",
  },
  view: {
    name: "Sayfa Görüntüleme",
    description: "Sayfa görüntüleme yetkileri",
    icon: "👁️",
  },
  function: {
    name: "İşlevsel Yetkiler",
    description: "CRUD ve özel işlem yetkileri",
    icon: "⚙️",
  },
};

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [userPermissions, setUserPermissions] = useState<Set<string>>(
    new Set()
  );
  const [groupedPermissions, setGroupedPermissions] =
    useState<GroupedPermissions>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Permission kontrolü - Set kullanarak O(1) karmaşıklığında
  const has = useCallback(
    (permissionName: string): boolean => {
      return userPermissions.has(permissionName);
    },
    [userPermissions]
  );

  // Layout erişim kontrolü
  const hasLayoutAccess = useCallback(
    (layoutType: "admin" | "user"): boolean => {
      return has(`${layoutType}.layout`);
    },
    [has]
  );

  // View erişim kontrolü
  const hasViewAccess = useCallback(
    (viewName: string): boolean => {
      return has(viewName);
    },
    [has]
  );

  // Function erişim kontrolü
  const hasFunctionAccess = useCallback(
    (functionName: string): boolean => {
      return has(functionName);
    },
    [has]
  );

  // Permission'ı kategorisine göre grupla
  const getPermissionGroup = (permission: Permission): string => {
    return `${permission.category}_${permission.permissionType}`;
  };

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Hem tüm permission'ları hem de kullanıcının permission'larını getir
      const [permissionsResponse, userPermissionsResponse] = await Promise.all([
        fetch("/api/admin/permissions?limit=1000"),
        fetch("/api/auth/current-user"),
      ]);



      if (!permissionsResponse.ok) {
        throw new Error("Yetkiler getirilemedi");
      }

      if (!userPermissionsResponse.ok) {
        throw new Error("Kullanıcı bilgileri getirilemedi");
      }

      const permissionsData = await permissionsResponse.json();
      const userData = await userPermissionsResponse.json();

      // Client-side gruplandırma - category ve type'a göre
      const grouped = permissionsData.permissions.reduce(
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

      setPermissions(permissionsData.permissions);
      // Gelen yanıt { user: { ... } } yapısında olduğu için userData.user.permissions kullanılır.
      setUserPermissions(new Set(userData.user?.permissions || []));
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

  // Grup adını getir
  const getGroupName = (groupKey: string): string => {
    const [category, type] = groupKey.split("_");
    const categoryName =
      categoryConfig[category as keyof typeof categoryConfig]?.name || category;
    const typeName = type === "admin" ? "Admin" : "Kullanıcı";
    return `${categoryName} (${typeName})`;
  };

  // Grup ikonunu getir
  const getGroupIcon = (groupKey: string): string => {
    const [category] = groupKey.split("_");
    return (
      categoryConfig[category as keyof typeof categoryConfig]?.icon || "📋"
    );
  };

  // Kategori bazında permission'ları getir
  const getPermissionsByCategory = (category: string): Permission[] => {
    return permissions.filter((perm) => perm.category === category);
  };

  // Permission type bazında permission'ları getir
  const getPermissionsByType = (permissionType: string): Permission[] => {
    return permissions.filter((perm) => perm.permissionType === permissionType);
  };

  // Resource bazında permission'ları getir
  const getPermissionsByResource = (resourcePath: string): Permission[] => {
    return permissions.filter((perm) => perm.resourcePath === resourcePath);
  };

  // Permission'ın display name'ini getir (Türkçe)
  const getPermissionDisplayName = (permission: Permission): string => {
    return permission.displayName?.tr || permission.name;
  };

  // Permission'ın açıklamasını getir (Türkçe)
  const getPermissionDescription = (permission: Permission): string => {
    return permission.description?.tr || "";
  };

  return {
    // State
    permissions,
    userPermissions,
    groupedPermissions,
    loading,
    error,

    // Permission kontrolleri
    has,
    hasLayoutAccess,
    hasViewAccess,
    hasFunctionAccess,

    // Data filtreleme
    getPermissionsByCategory,
    getPermissionsByType,
    getPermissionsByResource,

    // UI helpers
    getGroupName,
    getGroupIcon,
    getPermissionDisplayName,
    getPermissionDescription,

    // Actions
    refetch: fetchPermissions,
  };
}
