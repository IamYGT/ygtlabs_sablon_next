import { PrismaClient } from "@prisma/client";
import { hashPasswordPbkdf2 } from "../lib/crypto.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Kullanıcı oluştur
  const hashedPassword = await hashPasswordPbkdf2("123456");
  
  const user = await prisma.user.upsert({
    where: { email: "ercanyter@gmail.com" },
    update: {},
    create: {
      id: "d771fadb-2744-4b06-9087-e29411408dc8",
      email: "ercanyter@gmail.com",
      name: "Ercan Yter",
      password: hashedPassword,
      isActive: true,
    },
  });

  console.log("✅ User created:", user.email);

  // 2. Rolleri oluştur
  const superAdminRole = await prisma.authRole.upsert({
    where: { name: "super_admin" },
    update: {},
    create: {
      name: "super_admin",
      displayName: "Super Admin",
      description: "Sistem yöneticisi - tüm yetkilere sahip",
      color: "#dc2626",
      isSystemDefault: true,
      createdById: user.id,
    },
  });

  const userRole = await prisma.authRole.upsert({
    where: { name: "user" },
    update: {},
    create: {
      name: "user",
      displayName: "User",
      description: "Standart kullanıcı",
      color: "#3b82f6",
      isSystemDefault: true,
      createdById: user.id,
    },
  });

  console.log("✅ Roles created");

  // 3. Permissions oluştur
  const permissions = [
    // Layout permissions
    {
      name: "layout.admin.access",
      category: "layout",
      resourcePath: "admin",
      action: "access",
      permissionType: "admin",
      displayName: { tr: "Admin Paneli Erişimi", en: "Admin Panel Access" },
      description: { tr: "Admin paneline erişim yetkisi", en: "Access permission to admin panel" },
    },
    {
      name: "layout.user.access",
      category: "layout",
      resourcePath: "user",
      action: "access",
      permissionType: "user",
      displayName: { tr: "Kullanıcı Paneli Erişimi", en: "User Panel Access" },
      description: { tr: "Kullanıcı paneline erişim yetkisi", en: "Access permission to user panel" },
    },

    // View permissions - Admin
    {
      name: "view./admin/dashboard.view",
      category: "view",
      resourcePath: "/admin/dashboard",
      action: "view",
      permissionType: "admin",
      displayName: { tr: "Admin Dashboard Görüntüleme", en: "Admin Dashboard View" },
      description: { tr: "Admin dashboard sayfasını görüntüleme yetkisi", en: "Permission to view admin dashboard page" },
    },
    {
      name: "view./admin/roles.view",
      category: "view",
      resourcePath: "/admin/roles",
      action: "view",
      permissionType: "admin",
      displayName: { tr: "Rol Listesi Görüntüleme", en: "Roles List View" },
      description: { tr: "Rol listesi sayfasını görüntüleme yetkisi", en: "Permission to view roles list page" },
    },
    {
      name: "view./admin/users.view",
      category: "view",
      resourcePath: "/admin/users",
      action: "view",
      permissionType: "admin",
      displayName: { tr: "Kullanıcı Listesi Görüntüleme", en: "Users List View" },
      description: { tr: "Kullanıcı listesi sayfasını görüntüleme yetkisi", en: "Permission to view users list page" },
    },
    {
      name: "view./admin/permissions.view",
      category: "view",
      resourcePath: "/admin/permissions",
      action: "view",
      permissionType: "admin",
      displayName: { tr: "Yetki Listesi Görüntüleme", en: "Permissions List View" },
      description: { tr: "Yetki listesi sayfasını görüntüleme yetkisi", en: "Permission to view permissions list page" },
    },
    {
      name: "view./admin/profile.view",
      category: "view",
      resourcePath: "/admin/profile",
      action: "view",
      permissionType: "admin",
      displayName: { tr: "Admin Profil Görüntüleme", en: "Admin Profile View" },
      description: { tr: "Admin profil sayfasını görüntüleme yetkisi", en: "Permission to view admin profile page" },
    },

    // View permissions - User
    {
      name: "view./user/dashboard.view",
      category: "view",
      resourcePath: "/user/dashboard",
      action: "view",
      permissionType: "user",
      displayName: { tr: "Kullanıcı Dashboard Görüntüleme", en: "User Dashboard View" },
      description: { tr: "Kullanıcı dashboard sayfasını görüntüleme yetkisi", en: "Permission to view user dashboard page" },
    },
    {
      name: "view./user/profile.view",
      category: "view",
      resourcePath: "/user/profile",
      action: "view",
      permissionType: "user",
      displayName: { tr: "Kullanıcı Profil Görüntüleme", en: "User Profile View" },
      description: { tr: "Kullanıcı profil sayfasını görüntüleme yetkisi", en: "Permission to view user profile page" },
    },

    // Function permissions - Admin
    {
      name: "function.roles.create",
      category: "function",
      resourcePath: "roles",
      action: "create",
      permissionType: "admin",
      displayName: { tr: "Rol Oluşturma", en: "Create Role" },
      description: { tr: "Yeni rol oluşturma yetkisi", en: "Permission to create new roles" },
    },
    {
      name: "function.roles.edit",
      category: "function",
      resourcePath: "roles",
      action: "edit",
      permissionType: "admin",
      displayName: { tr: "Rol Düzenleme", en: "Edit Role" },
      description: { tr: "Rol bilgilerini düzenleme yetkisi", en: "Permission to edit role information" },
    },
    {
      name: "function.roles.delete",
      category: "function",
      resourcePath: "roles",
      action: "delete",
      permissionType: "admin",
      displayName: { tr: "Rol Silme", en: "Delete Role" },
      description: { tr: "Rol silme yetkisi", en: "Permission to delete roles" },
    },
    {
      name: "function.roles.view",
      category: "function",
      resourcePath: "roles",
      action: "view",
      permissionType: "admin",
      displayName: { tr: "Rol Görüntüleme", en: "View Role" },
      description: { tr: "Rol listesi görüntüleme yetkisi", en: "Permission to view roles list" },
    },
    {
      name: "function.users.create",
      category: "function",
      resourcePath: "users",
      action: "create",
      permissionType: "admin",
      displayName: { tr: "Kullanıcı Oluşturma", en: "Create User" },
      description: { tr: "Yeni kullanıcı oluşturma yetkisi", en: "Permission to create new users" },
    },
    {
      name: "function.users.edit",
      category: "function",
      resourcePath: "users",
      action: "edit",
      permissionType: "admin",
      displayName: { tr: "Kullanıcı Düzenleme", en: "Edit User" },
      description: { tr: "Kullanıcı bilgilerini düzenleme yetkisi", en: "Permission to edit user information" },
    },
    {
      name: "function.users.delete",
      category: "function",
      resourcePath: "users",
      action: "delete",
      permissionType: "admin",
      displayName: { tr: "Kullanıcı Silme", en: "Delete User" },
      description: { tr: "Kullanıcı silme yetkisi", en: "Permission to delete users" },
    },
    {
      name: "function.permissions.create",
      category: "function",
      resourcePath: "permissions",
      action: "create",
      permissionType: "admin",
      displayName: { tr: "Yetki Oluşturma", en: "Create Permission" },
      description: { tr: "Yeni yetki oluşturma yetkisi", en: "Permission to create new permissions" },
    },
    {
      name: "function.permissions.edit",
      category: "function",
      resourcePath: "permissions",
      action: "edit",
      permissionType: "admin",
      displayName: { tr: "Yetki Düzenleme", en: "Edit Permission" },
      description: { tr: "Yetki bilgilerini düzenleme yetkisi", en: "Permission to edit permission information" },
    },
    {
      name: "function.permissions.delete",
      category: "function",
      resourcePath: "permissions",
      action: "delete",
      permissionType: "admin",
      displayName: { tr: "Yetki Silme", en: "Delete Permission" },
      description: { tr: "Yetki silme yetkisi", en: "Permission to delete permissions" },
    },

   
  ];

  const createdPermissions = [];
  for (const permData of permissions) {
    const permission = await prisma.permission.upsert({
      where: { name: permData.name },
      update: {},
      create: {
        name: permData.name,
        category: permData.category,
        resourcePath: permData.resourcePath,
        action: permData.action,
        permissionType: permData.permissionType,
        displayName: JSON.stringify(permData.displayName),
        description: JSON.stringify(permData.description),
        createdById: user.id,
      },
    });
    createdPermissions.push(permission);
  }

  console.log("✅ Permissions created:", createdPermissions.length);

  // 4. Super Admin rolüne tüm admin permissions'ları ata
  const adminPermissions = createdPermissions.filter(p => p.permissionType === "admin");
  
  for (const permission of adminPermissions) {
    await prisma.roleHasPermission.upsert({
      where: {
        roleName_permissionName: {
          roleName: superAdminRole.name,
          permissionName: permission.name,
        },
      },
      update: {},
      create: {
        roleName: superAdminRole.name,
        permissionName: permission.name,
        grantedById: user.id,
      },
    });
  }

  // 5. User rolüne user permissions'ları ata
  const userPermissions = createdPermissions.filter(p => p.permissionType === "user");
  
  for (const permission of userPermissions) {
    await prisma.roleHasPermission.upsert({
      where: {
        roleName_permissionName: {
          roleName: userRole.name,
          permissionName: permission.name,
        },
      },
      update: {},
      create: {
        roleName: userRole.name,
        permissionName: permission.name,
        grantedById: user.id,
      },
    });
  }

  console.log("✅ Role permissions assigned");

  // 6. Kullanıcıya super_admin rolü ata
  await prisma.user.update({
    where: { id: user.id },
    data: {
      roleId: superAdminRole.id,
      roleAssignedAt: new Date(),
      roleAssignedById: user.id,
    },
  });

  console.log("✅ User assigned to super_admin role");
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
