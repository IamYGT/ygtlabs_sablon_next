/**
 * 🔐 Permission Configuration System
 *
 * Bu dosya tüm sistem yetkilerini merkezi olarak yönetir.
 * Developer'lar buradan:
 * - Yeni permission'lar ekleyebilir
 * - Mevcut permission'ları güncelleyebilir
 * - DB ile senkronize edebilir
 * - Permission'ları kategorilere göre organize edebilir
 */

export interface PermissionConfig {
  name: string;
  category: "layout" | "view" | "function";
  resourcePath: string;
  action:
    | "access"
    | "view"
    | "create"
    | "read"
    | "update"
    | "delete"
    | "manage";
  permissionType: "admin" | "user";
  displayName: {
    tr: string;
    en: string;
  };
  description: {
    tr: string;
    en: string;
  };
  // Developer notları - sadece development'ta görünür
  devNotes?: string;
  // Bağımlılıklar - bu permission için gerekli olan diğer permission'lar
  dependencies?: string[];
  // Bu permission hangi sayfa/component'lerde kullanılıyor
  usedIn?: string[];
}

// Database sync için permission objesi tipi
export interface PermissionSyncObject {
  name: string;
  category: PermissionConfig["category"];
  resourcePath: string;
  action: PermissionConfig["action"];
  permissionType: PermissionConfig["permissionType"];
  displayName: PermissionConfig["displayName"];
  description: PermissionConfig["description"];
  isActive: boolean;
}

/**
 * 🏗️ LAYOUT PERMISSIONS
 * Temel panel erişim yetkileri - sistem geneli
 */
export const LAYOUT_PERMISSIONS: PermissionConfig[] = [
  {
    name: "admin.layout",
    category: "layout",
    resourcePath: "admin",
    action: "access",
    permissionType: "admin",
    displayName: {
      tr: "Admin Panel Erişimi",
      en: "Admin Panel Access",
    },
    description: {
      tr: "Admin paneline erişim yetkisi",
      en: "Access permission to admin panel",
    },
    usedIn: ["AdminPageGuard", "AdminLayout"],
  },
  {
    name: "user.layout",
    category: "layout",
    resourcePath: "user",
    action: "access",
    permissionType: "user",
    displayName: {
      tr: "Kullanıcı Panel Erişimi",
      en: "User Panel Access",
    },
    description: {
      tr: "Kullanıcı paneline erişim yetkisi",
      en: "Access permission to user panel",
    },
    usedIn: ["UserPageGuard", "UserLayout"],
  },
];

/**
 * 👁️ VIEW PERMISSIONS
 * Sayfa görüntüleme yetkileri - her sayfa için ayrı
 */
export const VIEW_PERMISSIONS: PermissionConfig[] = [
  {
    name: "admin.dashboard.view",
    category: "view",
    resourcePath: "dashboard",
    action: "view",
    permissionType: "admin",
    displayName: {
      tr: "Admin Dashboard Görüntüleme",
      en: "Admin Dashboard View",
    },
    description: {
      tr: "Admin dashboard sayfasını görüntüleme ve sistem istatistiklerini okuma yetkisi",
      en: "Permission to view admin dashboard page and read system statistics",
    },
    devNotes:
      "Dashboard API endpoint'lerini de kapsar: /api/admin/system-status, /api/admin/sessions",
    dependencies: ["admin.layout"],
    usedIn: [
      "AdminDashboardClient",
      "/api/admin/system-status",
      "/api/admin/sessions",
    ],
  },
  {
    name: "admin.users.view",
    category: "view",
    resourcePath: "users",
    action: "view",
    permissionType: "admin",
    displayName: {
      tr: "Kullanıcı Yönetimi Görüntüleme",
      en: "User Management View",
    },
    description: {
      tr: "Kullanıcı listesi sayfasını görüntüleme ve kullanıcı bilgilerini okuma yetkisi",
      en: "Permission to view user management page and read user information",
    },
    devNotes:
      "User list API'sini kapsar. CRUD işlemleri için ayrı function permission'lar gerekli",
    dependencies: ["admin.layout"],
    usedIn: ["UsersPageClient", "/api/users (GET)"],
  },
  {
    name: "admin.roles.view",
    category: "view",
    resourcePath: "roles",
    action: "view",
    permissionType: "admin",
    displayName: {
      tr: "Rol Yönetimi Görüntüleme",
      en: "Role Management View",
    },
    description: {
      tr: "Rol listesi sayfasını görüntüleme ve rol bilgilerini okuma yetkisi",
      en: "Permission to view role management page and read role information",
    },
    devNotes:
      "Role list API'sini kapsar. Role CRUD işlemleri için ayrı function permission'lar gerekli",
    dependencies: ["admin.layout"],
    usedIn: ["RolesPageClient", "/api/admin/roles (GET)"],
  },
  {
    name: "admin.permissions.view",
    category: "view",
    resourcePath: "permissions",
    action: "view",
    permissionType: "admin",
    displayName: {
      tr: "Yetki Yönetimi Görüntüleme",
      en: "Permission Management View",
    },
    description: {
      tr: "Yetki listesi sayfasını görüntüleme ve mevcut yetkileri okuma yetkisi",
      en: "Permission to view permission management page and read existing permissions",
    },
    devNotes:
      "Permission list API'sini kapsar. Permission CRUD işlemleri için ayrı function permission'lar gerekli",
    dependencies: ["admin.layout"],
    usedIn: ["PermissionsPageClient", "/api/admin/permissions (GET)"],
  },
  {
    name: "admin.profile.view",
    category: "view",
    resourcePath: "profile",
    action: "view",
    permissionType: "admin",
    displayName: {
      tr: "Admin Profil Görüntüleme",
      en: "Admin Profile View",
    },
    description: {
      tr: "Admin profil sayfasını görüntüleme ve profil bilgilerini okuma yetkisi",
      en: "Permission to view admin profile page and read profile information",
    },
    devNotes:
      "Admin profil API'lerini kapsar. Profil güncelleme için ayrı function permission gerekli",
    dependencies: ["admin.layout"],
    usedIn: ["AdminProfileClient", "/api/admin/profile (GET)"],
  },
  {
    name: "admin.hero-slider.view",
    category: "view",
    resourcePath: "hero-slider",
    action: "view",
    permissionType: "admin",
    displayName: {
      tr: "Hero Slider Yönetimi Görüntüleme",
      en: "Hero Slider Management View",
    },
    description: {
      tr: "Hero slider yönetimi sayfasını görüntüleme ve mevcut slider'ları okuma yetkisi",
      en: "Permission to view hero slider management page and read existing sliders",
    },
    devNotes:
      "Hero slider list API'sini kapsar. Slider CRUD işlemleri için ayrı function permission'lar gerekli",
    dependencies: ["admin.layout"],
    usedIn: ["HeroSliderPageClient", "/api/admin/hero-slider (GET)"],
  },
  {
    name: "user.dashboard.view",
    category: "view",
    resourcePath: "dashboard",
    action: "view",
    permissionType: "user",
    displayName: {
      tr: "Kullanıcı Dashboard Görüntüleme",
      en: "User Dashboard View",
    },
    description: {
      tr: "Kullanıcı dashboard sayfasını görüntüleme ve kişisel istatistikleri okuma yetkisi",
      en: "Permission to view user dashboard page and read personal statistics",
    },
    devNotes: "User dashboard API'lerini kapsar",
    dependencies: ["user.layout"],
    usedIn: ["UserDashboardClient"],
  },
  {
    name: "user.profile.view",
    category: "view",
    resourcePath: "profile",
    action: "view",
    permissionType: "user",
    displayName: {
      tr: "Kullanıcı Profil Görüntüleme",
      en: "User Profile View",
    },
    description: {
      tr: "Kullanıcı profil sayfasını görüntüleme ve kişisel bilgileri okuma yetkisi",
      en: "Permission to view user profile page and read personal information",
    },
    devNotes:
      "User profil API'lerini kapsar. Profil güncelleme için ayrı function permission gerekli",
    dependencies: ["user.layout"],
    usedIn: ["UserProfileClient"],
  },
];

/**
 * ⚙️ FUNCTION PERMISSIONS
 * CRUD operasyonları ve özel işlevler
 */
export const FUNCTION_PERMISSIONS: PermissionConfig[] = [
  // USER MANAGEMENT FUNCTIONS
  {
    name: "users.create",
    category: "function",
    resourcePath: "users",
    action: "create",
    permissionType: "admin",
    displayName: {
      tr: "Kullanıcı Oluşturma",
      en: "Create User",
    },
    description: {
      tr: "Yeni kullanıcı hesabı oluşturma ve başlangıç ayarlarını yapılandırma yetkisi",
      en: "Permission to create new user accounts and configure initial settings",
    },
    devNotes:
      "POST /api/users endpoint'ini kapsar. Email validasyon ve password hashing dahil",
    dependencies: ["admin.users.view"],
    usedIn: ["CreateUserModal", "/api/users (POST)", "AddUserDialog"],
  },
  {
    name: "users.update",
    category: "function",
    resourcePath: "users",
    action: "update",
    permissionType: "admin",
    displayName: {
      tr: "Kullanıcı Güncelleme",
      en: "Update User",
    },
    description: {
      tr: "Mevcut kullanıcı bilgilerini güncelleme ve hesap ayarlarını değiştirme yetkisi",
      en: "Permission to update existing user information and modify account settings",
    },
    devNotes:
      "PATCH /api/users/[userId] endpoint'ini kapsar. Kendi hesabını düzenleme hariç",
    dependencies: ["admin.users.view"],
    usedIn: ["EditUserModal", "/api/users/[userId] (PATCH)", "UserEditForm"],
  },
  {
    name: "users.delete",
    category: "function",
    resourcePath: "users",
    action: "delete",
    permissionType: "admin",
    displayName: {
      tr: "Kullanıcı Silme",
      en: "Delete User",
    },
    description: {
      tr: "Kullanıcı hesaplarını kalıcı olarak silme ve ilişkili verileri temizleme yetkisi",
      en: "Permission to permanently delete user accounts and clean related data",
    },
    devNotes:
      "DELETE /api/users/[userId] endpoint'ini kapsar. Cascade delete işlemleri dahil",
    dependencies: ["admin.users.view"],
    usedIn: [
      "DeleteUserModal",
      "/api/users/[userId] (DELETE)",
      "BulkDeleteUsers",
    ],
  },
  {
    name: "users.assign-role",
    category: "function",
    resourcePath: "users",
    action: "manage",
    permissionType: "admin",
    displayName: {
      tr: "Kullanıcı Rol Atama",
      en: "Assign User Role",
    },
    description: {
      tr: "Kullanıcılara rol atama ve rol bazlı yetkileri yönetme yetkisi",
      en: "Permission to assign roles to users and manage role-based permissions",
    },
    devNotes:
      "Role assignment API'lerini kapsar. Role hierarchy kontrolü dahil",
    dependencies: ["admin.users.view", "admin.roles.view"],
    usedIn: [
      "AssignRoleModal",
      "/api/admin/users/assign-role",
      "UserRoleManager",
    ],
  },

  // ROLE MANAGEMENT FUNCTIONS
  {
    name: "roles.create",
    category: "function",
    resourcePath: "roles",
    action: "create",
    permissionType: "admin",
    displayName: {
      tr: "Rol Oluşturma",
      en: "Create Role",
    },
    description: {
      tr: "Yeni sistem rolleri oluşturma ve temel yetkileri atama yetkisi",
      en: "Permission to create new system roles and assign basic permissions",
    },
    devNotes:
      "POST /api/admin/roles endpoint'ini kapsar. Role validation ve default permissions dahil",
    dependencies: ["admin.roles.view"],
    usedIn: ["CreateRoleDialog", "/api/admin/roles (POST)", "RoleCreateForm"],
  },
  {
    name: "roles.update",
    category: "function",
    resourcePath: "roles",
    action: "update",
    permissionType: "admin",
    displayName: {
      tr: "Rol Güncelleme",
      en: "Update Role",
    },
    description: {
      tr: "Mevcut rol bilgilerini güncelleme ve rol özelliklerini değiştirme yetkisi",
      en: "Permission to update existing role information and modify role properties",
    },
    devNotes:
      "PATCH /api/admin/roles/[roleId] endpoint'ini kapsar. System role koruma dahil",
    dependencies: ["admin.roles.view"],
    usedIn: [
      "EditRoleDialog",
      "/api/admin/roles/[roleId] (PATCH)",
      "RoleEditForm",
    ],
  },
  {
    name: "roles.delete",
    category: "function",
    resourcePath: "roles",
    action: "delete",
    permissionType: "admin",
    displayName: {
      tr: "Rol Silme",
      en: "Delete Role",
    },
    description: {
      tr: "Sistem rollerini silme ve bağlantılı kullanıcıları yeniden atama yetkisi",
      en: "Permission to delete system roles and reassign connected users",
    },
    devNotes:
      "DELETE /api/admin/roles/[roleId] endpoint'ini kapsar. User reassignment dahil",
    dependencies: ["admin.roles.view"],
    usedIn: [
      "DeleteRoleDialog",
      "/api/admin/roles/[roleId] (DELETE)",
      "RoleDeleteForm",
    ],
  },
  {
    name: "roles.assign-permissions",
    category: "function",
    resourcePath: "roles",
    action: "manage",
    permissionType: "admin",
    displayName: {
      tr: "Rol Yetki Atama",
      en: "Assign Role Permissions",
    },
    description: {
      tr: "Rollere yetki atama ve permission matrisi yönetme yetkisi",
      en: "Permission to assign permissions to roles and manage permission matrix",
    },
    devNotes:
      "Role-Permission management API'lerini kapsar. Bulk assignment dahil",
    dependencies: ["admin.roles.view", "admin.permissions.view"],
    usedIn: [
      "RolePermissionMatrix",
      "/api/admin/roles/[roleId]/permissions",
      "PermissionAssigner",
    ],
  },

  // PERMISSION MANAGEMENT FUNCTIONS
  {
    name: "permissions.create",
    category: "function",
    resourcePath: "permissions",
    action: "create",
    permissionType: "admin",
    displayName: {
      tr: "Yetki Oluşturma",
      en: "Create Permission",
    },
    description: {
      tr: "Yeni sistem yetkileri oluşturma ve yetki kategorilerini tanımlama yetkisi",
      en: "Permission to create new system permissions and define permission categories",
    },
    devNotes:
      "POST /api/admin/permissions endpoint'ini kapsar. Permission validation dahil",
    dependencies: ["admin.permissions.view"],
    usedIn: [
      "CreatePermissionDialog",
      "/api/admin/permissions (POST)",
      "PermissionCreateForm",
    ],
  },
  {
    name: "permissions.update",
    category: "function",
    resourcePath: "permissions",
    action: "update",
    permissionType: "admin",
    displayName: {
      tr: "Yetki Güncelleme",
      en: "Update Permission",
    },
    description: {
      tr: "Mevcut yetki bilgilerini güncelleme ve yetki açıklamalarını değiştirme yetkisi",
      en: "Permission to update existing permission information and modify permission descriptions",
    },
    devNotes:
      "PATCH /api/admin/permissions/[permissionId] endpoint'ini kapsar. System permission koruma dahil",
    dependencies: ["admin.permissions.view"],
    usedIn: [
      "EditPermissionDialog",
      "/api/admin/permissions/[permissionId] (PATCH)",
      "PermissionEditForm",
    ],
  },
  {
    name: "permissions.delete",
    category: "function",
    resourcePath: "permissions",
    action: "delete",
    permissionType: "admin",
    displayName: {
      tr: "Yetki Silme",
      en: "Delete Permission",
    },
    description: {
      tr: "Sistem yetkilerini silme ve bağlantılı rol ilişkilerini temizleme yetkisi",
      en: "Permission to delete system permissions and clean related role connections",
    },
    devNotes:
      "DELETE /api/admin/permissions/[permissionId] endpoint'ini kapsar. Cascade delete dahil",
    dependencies: ["admin.permissions.view"],
    usedIn: [
      "DeletePermissionDialog",
      "/api/admin/permissions/[permissionId] (DELETE)",
    ],
  },

  // HERO SLIDER MANAGEMENT FUNCTIONS
  {
    name: "hero-slider.create",
    category: "function",
    resourcePath: "hero-slider",
    action: "create",
    permissionType: "admin",
    displayName: {
      tr: "Hero Slider Oluşturma",
      en: "Create Hero Slider",
    },
    description: {
      tr: "Yeni hero slider oluşturma ve medya yükleme yetkisi",
      en: "Permission to create new hero sliders and upload media",
    },
    devNotes:
      "POST /api/admin/hero-slider endpoint'ini ve file upload API'sini kapsar",
    dependencies: ["admin.hero-slider.view"],
    usedIn: [
      "CreateSliderDialog",
      "/api/admin/hero-slider (POST)",
      "SliderCreateForm",
    ],
  },
  {
    name: "hero-slider.update",
    category: "function",
    resourcePath: "hero-slider",
    action: "update",
    permissionType: "admin",
    displayName: {
      tr: "Hero Slider Güncelleme",
      en: "Update Hero Slider",
    },
    description: {
      tr: "Mevcut hero slider'ları güncelleme ve sıralama değiştirme yetkisi",
      en: "Permission to update existing hero sliders and modify ordering",
    },
    devNotes:
      "PATCH /api/admin/hero-slider/[sliderId] endpoint'ini kapsar. Order management dahil",
    dependencies: ["admin.hero-slider.view"],
    usedIn: [
      "EditSliderDialog",
      "/api/admin/hero-slider/[sliderId] (PATCH)",
      "SliderEditForm",
    ],
  },
  {
    name: "hero-slider.delete",
    category: "function",
    resourcePath: "hero-slider",
    action: "delete",
    permissionType: "admin",
    displayName: {
      tr: "Hero Slider Silme",
      en: "Delete Hero Slider",
    },
    description: {
      tr: "Hero slider'ları silme ve ilişkili medya dosyalarını temizleme yetkisi",
      en: "Permission to delete hero sliders and clean related media files",
    },
    devNotes:
      "DELETE /api/admin/hero-slider/[sliderId] endpoint'ini kapsar. File cleanup dahil",
    dependencies: ["admin.hero-slider.view"],
    usedIn: [
      "DeleteSliderDialog",
      "/api/admin/hero-slider/[sliderId] (DELETE)",
    ],
  },
];

/**
 * 🎯 ALL PERMISSIONS
 * Tüm permission'ları birleştiren ana export
 */
export const ALL_PERMISSIONS: PermissionConfig[] = [
  ...LAYOUT_PERMISSIONS,
  ...VIEW_PERMISSIONS,
  ...FUNCTION_PERMISSIONS,
];

/**
 * 🔍 PERMISSION HELPERS
 * Permission'ları bulmak ve yönetmek için yardımcı fonksiyonlar
 */
export const getPermissionByName = (
  name: string
): PermissionConfig | undefined => {
  return ALL_PERMISSIONS.find((p) => p.name === name);
};

export const getPermissionsByCategory = (
  category: PermissionConfig["category"]
): PermissionConfig[] => {
  return ALL_PERMISSIONS.filter((p) => p.category === category);
};

export const getPermissionsByType = (
  type: PermissionConfig["permissionType"]
): PermissionConfig[] => {
  return ALL_PERMISSIONS.filter((p) => p.permissionType === type);
};

export const getPermissionsByResource = (
  resourcePath: string
): PermissionConfig[] => {
  return ALL_PERMISSIONS.filter((p) => p.resourcePath === resourcePath);
};

/**
 * 🔄 DATABASE SYNC HELPERS
 * Veritabanı ile senkronizasyon için yardımcı fonksiyonlar
 */
export const getPermissionsForSync = (): PermissionSyncObject[] => {
  return ALL_PERMISSIONS.map((p) => ({
    name: p.name,
    category: p.category,
    resourcePath: p.resourcePath,
    action: p.action,
    permissionType: p.permissionType,
    displayName: p.displayName,
    description: p.description,
    isActive: true,
  }));
};

/**
 * 📊 STATISTICS
 */
export const PERMISSION_STATS = {
  total: ALL_PERMISSIONS.length,
  layout: LAYOUT_PERMISSIONS.length,
  view: VIEW_PERMISSIONS.length,
  function: FUNCTION_PERMISSIONS.length,
  admin: ALL_PERMISSIONS.filter((p) => p.permissionType === "admin").length,
  user: ALL_PERMISSIONS.filter((p) => p.permissionType === "user").length,
};

console.log("🔐 Permission System Loaded:", PERMISSION_STATS);
