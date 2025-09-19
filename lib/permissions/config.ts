/**
 * 🔐 Merkezi Permission Configuration System
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
  permissionType: "admin" | "customer";
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
    name: "customer.layout",
    category: "layout",
    resourcePath: "customer",
    action: "access",
    permissionType: "customer",
    displayName: {
      tr: "Müşteri Panel Erişimi",
      en: "Customer Panel Access",
    },
    description: {
      tr: "Müşteri paneline erişim yetkisi",
      en: "Access permission to customer panel",
    },
    usedIn: ["CustomerPageGuard", "CustomerLayout"],
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
      tr: "CRM Dashboard Görüntüleme",
      en: "CRM Dashboard View",
    },
    description: {
      tr: "CRM dashboard sayfasını görüntüleme ve müşteri istatistiklerini okuma yetkisi",
      en: "Permission to view CRM dashboard page and read customer statistics",
    },
    devNotes:
      "CRM Dashboard API endpoint'lerini kapsar: /api/admin/crm-stats, /api/admin/sessions",
    dependencies: ["admin.layout"],
    usedIn: [
      "AdminDashboardClient",
      "/api/admin/crm-stats",
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
    name: "admin.customers.view",
    category: "view",
    resourcePath: "customers",
    action: "view",
    permissionType: "admin",
    displayName: {
      tr: "Müşteri Yönetimi Görüntüleme",
      en: "Customer Management View",
    },
    description: {
      tr: "Müşteri listesi sayfasını görüntüleme ve müşteri bilgilerini okuma yetkisi",
      en: "Permission to view customer management page and read customer information",
    },
    dependencies: ["admin.layout"],
    usedIn: ["CustomersPageClient", "/api/admin/customers (GET)"],
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
    name: "customer.dashboard.view",
    category: "view",
    resourcePath: "dashboard",
    action: "view",
    permissionType: "customer",
    displayName: {
      tr: "Müşteri Dashboard Görüntüleme",
      en: "Customer Dashboard View",
    },
    description: {
      tr: "Müşteri dashboard sayfasını görüntüleme ve kişisel istatistikleri okuma yetkisi",
      en: "Permission to view customer dashboard page and read personal statistics",
    },
    devNotes: "Customer dashboard API'lerini kapsar",
    dependencies: ["customer.layout"],
    usedIn: ["CustomerDashboardClient"],
  },
  {
    name: "customer.profile.view",
    category: "view",
    resourcePath: "profile",
    action: "view",
    permissionType: "customer",
    displayName: {
      tr: "Müşteri Profil Görüntüleme",
      en: "Customer Profile View",
    },
    description: {
      tr: "Müşteri profil sayfasını görüntüleme ve kişisel bilgileri okuma yetkisi",
      en: "Permission to view customer profile page and read personal information",
    },
    devNotes:
      "Customer profil API'lerini kapsar. Profil güncelleme için ayrı function permission gerekli",
    dependencies: ["customer.layout"],
    usedIn: ["CustomerProfileClient"],
  },
    {
    name: "customer.settings.view",
    category: "view",
    resourcePath: "settings",
    action: "view",
    permissionType: "customer",
    displayName: {
      tr: "Hesap Ayarlarım Görüntüleme",
      en: "Account Settings View",
    },
    description: {
      tr: "Hesap ayarlarını ve tercihlerini görüntüleme yetkisi",
      en: "Permission to view account settings and preferences",
    },
    devNotes: "Customer settings API'lerini kapsar",
    dependencies: ["customer.layout"],
    usedIn: ["CustomerSettingsClient", "/api/customer/settings"],
  },
  {
    name: "customer.activity.view",
    category: "view",
    resourcePath: "activity",
    action: "view",
    permissionType: "customer",
    displayName: {
      tr: "Aktivite Raporu Görüntüleme",
      en: "Activity Report View",
    },
    description: {
      tr: "Müşterinin kendi aktivite raporunu görüntüleme yetkisi",
      en: "Permission to view own activity report",
    },
    dependencies: ["customer.layout"],
    usedIn: ["CustomerActivityClient", "/api/customer/activity"],
  },
  {
    name: "customer.calendar.view",
    category: "view",
    resourcePath: "calendar",
    action: "view",
    permissionType: "customer",
    displayName: {
      tr: "Takvim Görüntüleme",
      en: "Calendar View",
    },
    description: {
      tr: "Müşterinin kendi takvimini görüntüleme yetkisi",
      en: "Permission to view own calendar",
    },
    dependencies: ["customer.layout"],
    usedIn: ["CustomerCalendarClient", "/api/customer/calendar"],
  },
  {
    name: "admin.support.view",
    category: "view",
    resourcePath: "support",
    action: "view",
    permissionType: "admin",
    displayName: {
      tr: "Destek Sistemi Görüntüleme",
      en: "Support System View",
    },
    description: {
      tr: "Destek taleplerini görüntüleme ve yönetme yetkisi",
      en: "Permission to view and manage support tickets",
    },
    dependencies: ["admin.layout"],
    usedIn: ["SupportDashboard", "/api/admin/support"],
  },
  {
    name: "customer.support.view",
    category: "view",
    resourcePath: "support",
    action: "view",
    permissionType: "customer",
    displayName: {
      tr: "Destek Taleplerim Görüntüleme",
      en: "My Support Tickets View",
    },
    description: {
      tr: "Kendi destek taleplerini görüntüleme yetkisi",
      en: "Permission to view own support tickets",
    },
    dependencies: ["customer.layout"],
    usedIn: ["CustomerSupportClient", "/api/customer/support"],
  },
];

/**
 * ⚙️ FUNCTION PERMISSIONS
 * CRUD operasyonları ve özel işlevler
 */
export const FUNCTION_PERMISSIONS: PermissionConfig[] = [
  // SUPPORT SYSTEM FUNCTIONS
  {
    name: "support.tickets.create",
    category: "function",
    resourcePath: "support/tickets",
    action: "create",
    permissionType: "admin",
    displayName: {
      tr: "Destek Talebi Oluşturma",
      en: "Create Support Ticket",
    },
    description: {
      tr: "Yeni destek talebi oluşturma yetkisi",
      en: "Permission to create new support tickets",
    },
    dependencies: ["admin.support.view"],
    usedIn: ["SupportTicketCreate", "/api/admin/support/tickets (POST)"],
  },
  {
    name: "support.tickets.update",
    category: "function",
    resourcePath: "support/tickets",
    action: "update",
    permissionType: "admin",
    displayName: {
      tr: "Destek Talebi Güncelleme",
      en: "Update Support Ticket",
    },
    description: {
      tr: "Destek talebi bilgilerini güncelleme yetkisi",
      en: "Permission to update support ticket information",
    },
    dependencies: ["admin.support.view"],
    usedIn: ["SupportTicketEdit", "/api/admin/support/tickets/[id] (PUT)"],
  },
  {
    name: "support.tickets.delete",
    category: "function",
    resourcePath: "support/tickets",
    action: "delete",
    permissionType: "admin",
    displayName: {
      tr: "Destek Talebi Silme",
      en: "Delete Support Ticket",
    },
    description: {
      tr: "Destek taleplerini silme yetkisi",
      en: "Permission to delete support tickets",
    },
    dependencies: ["admin.support.view"],
    usedIn: ["SupportTicketDelete", "/api/admin/support/tickets/[id] (DELETE)"],
  },
  {
    name: "support.tickets.assign",
    category: "function",
    resourcePath: "support/tickets",
    action: "manage",
    permissionType: "admin",
    displayName: {
      tr: "Destek Talebi Atama",
      en: "Assign Support Ticket",
    },
    description: {
      tr: "Destek taleplerini personele atama yetkisi",
      en: "Permission to assign support tickets to staff",
    },
    dependencies: ["admin.support.view"],
    usedIn: ["SupportTicketAssign", "/api/admin/support/tickets/[id]/assign (POST)"],
  },
  {
    name: "support.tickets.respond",
    category: "function",
    resourcePath: "support/tickets",
    action: "update",
    permissionType: "admin",
    displayName: {
      tr: "Destek Talebine Yanıt",
      en: "Respond to Support Ticket",
    },
    description: {
      tr: "Destek taleplerine yanıt verme yetkisi",
      en: "Permission to respond to support tickets",
    },
    dependencies: ["admin.support.view"],
    usedIn: ["SupportTicketRespond", "/api/admin/support/tickets/[id]/respond (POST)"],
  },
  {
    name: "support.categories.manage",
    category: "function",
    resourcePath: "support/categories",
    action: "manage",
    permissionType: "admin",
    displayName: {
      tr: "Destek Kategorilerini Yönetme",
      en: "Manage Support Categories",
    },
    description: {
      tr: "Destek talebi kategorilerini oluşturma, güncelleme ve silme yetkisi",
      en: "Permission to create, update and delete support ticket categories",
    },
    dependencies: ["admin.support.view"],
    usedIn: ["SupportCategoryManager", "/api/admin/support/categories"],
  },
  {
    name: "customer.support.create",
    category: "function",
    resourcePath: "support",
    action: "create",
    permissionType: "customer",
    displayName: {
      tr: "Destek Talebi Oluşturma",
      en: "Create Support Ticket",
    },
    description: {
      tr: "Yeni destek talebi oluşturma yetkisi",
      en: "Permission to create new support tickets",
    },
    dependencies: ["customer.support.view"],
    usedIn: ["CustomerSupportCreate", "/api/customer/support (POST)"],
  },
  {
    name: "customer.support.update",
    category: "function",
    resourcePath: "support",
    action: "update",
    permissionType: "customer",
    displayName: {
      tr: "Destek Talebi Güncelleme",
      en: "Update Support Ticket",
    },
    description: {
      tr: "Kendi destek taleplerini güncelleme yetkisi",
      en: "Permission to update own support tickets",
    },
    dependencies: ["customer.support.view"],
    usedIn: ["CustomerSupportUpdate", "/api/customer/support/[id] (PUT)"],
  },

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
    dependencies: ["admin.roles.view"],
    usedIn: [
      "RolePermissionMatrix",
      "/api/admin/roles/[roleId]/permissions",
      "PermissionAssigner",
    ],
  },



  // CUSTOMER MANAGEMENT FUNCTIONS
  {
    name: "customers.create",
    category: "function",
    resourcePath: "customers",
    action: "create",
    permissionType: "admin",
    displayName: {
      tr: "Müşteri Oluşturma",
      en: "Create Customer",
    },
    description: {
      tr: "Yeni müşteri oluşturma ve temel bilgileri kaydetme yetkisi",
      en: "Permission to create new customers and save basic information",
    },
    dependencies: ["admin.customers.view"],
    usedIn: ["CustomerCreateDialog", "/api/admin/customers (POST)"],
  },
  {
    name: "customers.update",
    category: "function",
    resourcePath: "customers",
    action: "update",
    permissionType: "admin",
    displayName: {
      tr: "Müşteri Güncelleme",
      en: "Update Customer",
    },
    description: {
      tr: "Mevcut müşteri bilgilerini güncelleme yetkisi",
      en: "Permission to update existing customer information",
    },
    dependencies: ["admin.customers.view"],
    usedIn: ["CustomerEditDialog", "/api/admin/customers/[id] (PUT)"],
  },
  {
    name: "customers.delete",
    category: "function",
    resourcePath: "customers",
    action: "delete",
    permissionType: "admin",
    displayName: {
      tr: "Müşteri Silme",
      en: "Delete Customer",
    },
    description: {
      tr: "Müşteri kaydını silme yetkisi",
      en: "Permission to delete customer records",
    },
    dependencies: ["admin.customers.view"],
    usedIn: ["CustomerDeleteDialog", "/api/admin/customers/[id] (DELETE)"],
  },
  
  // PROFILE MANAGEMENT FUNCTIONS
  {
    name: "customer.profile.update",
    category: "function",
    resourcePath: "profile",
    action: "update",
    permissionType: "customer",
    displayName: {
      tr: "Müşteri Profil Güncelleme",
      en: "Update Customer Profile",
    },
    description: {
      tr: "Kendi profil bilgilerini (isim, e-posta) güncelleme yetkisi.",
      en: "Permission to update own profile information (name, email).",
    },
    dependencies: ["customer.profile.view"],
    usedIn: ["CustomerProfileClient", "/api/customer/profile (PUT)"],
  },
  {
    name: "customer.profile.changePassword",
    category: "function",
    resourcePath: "profile",
    action: "update",
    permissionType: "customer",
    displayName: {
      tr: "Müşteri Şifre Değiştirme",
      en: "Customer Change Password",
    },
    description: {
      tr: "Kendi şifresini değiştirme yetkisi.",
      en: "Permission to change own password.",
    },
    dependencies: ["customer.profile.view"],
    usedIn: [
      "CustomerProfileClient",
      "/api/customer/profile/change-password (POST)",
    ],
  },
  {
    name: "customer.calendar.create",
    category: "function",
    resourcePath: "calendar",
    action: "create",
    permissionType: "customer",
    displayName: {
      tr: "Takvim Etkinliği Oluşturma",
      en: "Create Calendar Event",
    },
    description: {
      tr: "Kendi takvimine yeni etkinlik ekleme yetkisi.",
      en: "Permission to add new events to own calendar.",
    },
    dependencies: ["customer.calendar.view"],
    usedIn: ["CustomerCalendarClient", "/api/customer/calendar (POST)"],
  },
  {
    name: "customer.calendar.update",
    category: "function",
    resourcePath: "calendar",
    action: "update",
    permissionType: "customer",
    displayName: {
      tr: "Takvim Etkinliği Güncelleme",
      en: "Update Calendar Event",
    },
    description: {
      tr: "Kendi takvimindeki etkinlikleri güncelleme yetkisi.",
      en: "Permission to update events in own calendar.",
    },
    dependencies: ["customer.calendar.view"],
    usedIn: ["CustomerCalendarClient", "/api/customer/calendar/[eventId] (PUT)"],
  },
  {
    name: "customer.calendar.delete",
    category: "function",
    resourcePath: "calendar",
    action: "delete",
    permissionType: "customer",
    displayName: {
      tr: "Takvim Etkinliği Silme",
      en: "Delete Calendar Event",
    },
    description: {
      tr: "Kendi takvimindeki etkinlikleri silme yetkisi.",
      en: "Permission to delete events from own calendar.",
    },
    dependencies: ["customer.calendar.view"],
    usedIn: [
      "CustomerCalendarClient",
      "/api/customer/calendar/[eventId] (DELETE)",
    ],
  },
  {
    name: "admin.profile.update",
    category: "function",
    resourcePath: "profile",
    action: "update",
    permissionType: "admin",
    displayName: {
      tr: "Admin Profil Güncelleme",
      en: "Update Admin Profile",
    },
    description: {
      tr: "Kendi admin profil bilgilerini (isim, e-posta) güncelleme yetkisi.",
      en: "Permission to update own admin profile information (name, email).",
    },
    devNotes:
      "PUT /api/admin/profile endpoint'ini kapsar. Şifre değiştirme için ayrı permission gerekli.",
    dependencies: ["admin.profile.view"],
    usedIn: [
      "AdminProfileClient",
      "/api/admin/profile (PUT)",
      "ProfileDetails",
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
  customer: ALL_PERMISSIONS.filter((p) => p.permissionType === "customer").length,
};

// 🚨 NAVIGATION SYSTEM REMOVED
// Navigation artık hooks/useAdminNavigation.ts'de yönetiliyor
// Permission sistemi sadece permission kontrolü yapıyor!

/**
 * 👥 ROLE SYSTEM - DATABASE MANAGED
 *
 * ⚠️ IMPORTANT:
 * Roller tamamen database üzerinden yönetiliyor! (AuthRole tablosu)
 * - Kod üzerinden role tanımı YOK
 * - Tüm role'ler AuthRole tablosundan gelir
 * - isSystemDefault: true/false (sistem varsayılanı mı)
 * - isActive: true/false (aktif mi)
 * - layoutType: 'admin' | 'user' (hangi layout)
 *
 * Database Schema (AuthRole):
 * - id, name, displayName, description, color
 * - isSystemDefault, isActive, layoutType
 * - createdAt, updatedAt, createdById, updatedById
 */

// 🚨 NAVIGATION HELPERS REMOVED
// Navigation helper'lar artık hooks/useAdminNavigation.ts'de

/**
 * 🔍 PERMISSION VALIDATION
 * Permission validation helpers
 */
export const validatePermissionExists = (permissionName: string): boolean => {
  return ALL_PERMISSIONS.some((p) => p.name === permissionName);
};

export const validatePermissionDependencies = (
  permissionName: string
): { isValid: boolean; missingDependencies: string[] } => {
  const permission = getPermissionByName(permissionName);
  if (!permission?.dependencies) {
    return { isValid: true, missingDependencies: [] };
  }

  const missingDependencies = permission.dependencies.filter(
    (dep) => !validatePermissionExists(dep)
  );

  return {
    isValid: missingDependencies.length === 0,
    missingDependencies,
  };
};

/**
 * 🎯 MAIN EXPORTS
 * Merkezi export'lar (sadece permission sistemi)
 */
export const SYSTEM_CONFIG = {
  permissions: ALL_PERMISSIONS,
  stats: PERMISSION_STATS,
};

// Auto-generated type'lar için hazırlık
export type PermissionName = (typeof ALL_PERMISSIONS)[number]["name"];

console.log("🔐 Permission System Loaded:", PERMISSION_STATS);