-- Permission System Migration Script
-- Bu script mevcut permission verilerini yeni yapıya dönüştürür

-- 1. Önce backup tablosu oluştur
CREATE TABLE "public"."Permission_Backup" AS SELECT * FROM "public"."Permission";

-- 2. Mevcut permission'ları temizle
DELETE FROM "public"."RoleHasPermission";
DELETE FROM "public"."Permission";

-- 3. Layout Permissions
INSERT INTO "public"."Permission" (
    id, name, category, "resourcePath", action, "permissionType", 
    "displayName", description, "isActive", "createdAt", "updatedAt"
) VALUES 
(
    gen_random_uuid(),
    'admin.layout',
    'layout',
    'admin',
    'access',
    'admin',
    '{"tr": "Admin Panel Erişimi", "en": "Admin Panel Access"}',
    '{"tr": "Admin paneline erişim yetkisi", "en": "Access permission to admin panel"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'user.layout',
    'layout',
    'user',
    'access',
    'user',
    '{"tr": "Kullanıcı Panel Erişimi", "en": "User Panel Access"}',
    '{"tr": "Kullanıcı paneline erişim yetkisi", "en": "Access permission to user panel"}',
    true,
    NOW(),
    NOW()
);

-- 4. View Permissions
INSERT INTO "public"."Permission" (
    id, name, category, "resourcePath", action, "permissionType", 
    "displayName", description, "isActive", "createdAt", "updatedAt"
) VALUES 
(
    gen_random_uuid(),
    'admin.dashboard',
    'view',
    'dashboard',
    'view',
    'admin',
    '{"tr": "Admin Dashboard Görüntüleme", "en": "Admin Dashboard View"}',
    '{"tr": "Admin dashboard sayfasını görüntüleme yetkisi", "en": "Permission to view admin dashboard page"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'admin.users',
    'view',
    'users',
    'view',
    'admin',
    '{"tr": "Kullanıcı Yönetimi Görüntüleme", "en": "User Management View"}',
    '{"tr": "Kullanıcı yönetimi sayfasını görüntüleme yetkisi", "en": "Permission to view user management page"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'admin.roles',
    'view',
    'roles',
    'view',
    'admin',
    '{"tr": "Rol Yönetimi Görüntüleme", "en": "Role Management View"}',
    '{"tr": "Rol yönetimi sayfasını görüntüleme yetkisi", "en": "Permission to view role management page"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'admin.permissions',
    'view',
    'permissions',
    'view',
    'admin',
    '{"tr": "Yetki Yönetimi Görüntüleme", "en": "Permission Management View"}',
    '{"tr": "Yetki yönetimi sayfasını görüntüleme yetkisi", "en": "Permission to view permission management page"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'admin.profile',
    'view',
    'profile',
    'view',
    'admin',
    '{"tr": "Admin Profil Görüntüleme", "en": "Admin Profile View"}',
    '{"tr": "Admin profil sayfasını görüntüleme yetkisi", "en": "Permission to view admin profile page"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'admin.hero-slider',
    'view',
    'hero-slider',
    'view',
    'admin',
    '{"tr": "Hero Slider Yönetimi Görüntüleme", "en": "Hero Slider Management View"}',
    '{"tr": "Hero slider yönetimi sayfasını görüntüleme yetkisi", "en": "Permission to view hero slider management page"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'user.dashboard',
    'view',
    'dashboard',
    'view',
    'user',
    '{"tr": "Kullanıcı Dashboard Görüntüleme", "en": "User Dashboard View"}',
    '{"tr": "Kullanıcı dashboard sayfasını görüntüleme yetkisi", "en": "Permission to view user dashboard page"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'user.profile',
    'view',
    'profile',
    'view',
    'user',
    '{"tr": "Kullanıcı Profil Görüntüleme", "en": "User Profile View"}',
    '{"tr": "Kullanıcı profil sayfasını görüntüleme yetkisi", "en": "Permission to view user profile page"}',
    true,
    NOW(),
    NOW()
);

-- 5. Function Permissions - Users
INSERT INTO "public"."Permission" (
    id, name, category, "resourcePath", action, "permissionType", 
    "displayName", description, "isActive", "createdAt", "updatedAt"
) VALUES 
(
    gen_random_uuid(),
    'users.create',
    'function',
    'users',
    'crud',
    'admin',
    '{"tr": "Kullanıcı Oluşturma", "en": "Create User"}',
    '{"tr": "Yeni kullanıcı oluşturma yetkisi", "en": "Permission to create new users"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'users.edit',
    'function',
    'users',
    'crud',
    'admin',
    '{"tr": "Kullanıcı Düzenleme", "en": "Edit User"}',
    '{"tr": "Kullanıcı bilgilerini düzenleme yetkisi", "en": "Permission to edit user information"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'users.delete',
    'function',
    'users',
    'crud',
    'admin',
    '{"tr": "Kullanıcı Silme", "en": "Delete User"}',
    '{"tr": "Kullanıcı silme yetkisi", "en": "Permission to delete users"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'users.assign-role',
    'function',
    'users',
    'crud',
    'admin',
    '{"tr": "Kullanıcı Rol Atama", "en": "Assign User Role"}',
    '{"tr": "Kullanıcıya rol atama yetkisi", "en": "Permission to assign roles to users"}',
    true,
    NOW(),
    NOW()
);

-- 6. Function Permissions - Roles
INSERT INTO "public"."Permission" (
    id, name, category, "resourcePath", action, "permissionType", 
    "displayName", description, "isActive", "createdAt", "updatedAt"
) VALUES 
(
    gen_random_uuid(),
    'roles.create',
    'function',
    'roles',
    'crud',
    'admin',
    '{"tr": "Rol Oluşturma", "en": "Create Role"}',
    '{"tr": "Yeni rol oluşturma yetkisi", "en": "Permission to create new roles"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'roles.edit',
    'function',
    'roles',
    'crud',
    'admin',
    '{"tr": "Rol Düzenleme", "en": "Edit Role"}',
    '{"tr": "Rol bilgilerini düzenleme yetkisi", "en": "Permission to edit role information"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'roles.delete',
    'function',
    'roles',
    'crud',
    'admin',
    '{"tr": "Rol Silme", "en": "Delete Role"}',
    '{"tr": "Rol silme yetkisi", "en": "Permission to delete roles"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'roles.assign-permissions',
    'function',
    'roles',
    'crud',
    'admin',
    '{"tr": "Rol Yetki Atama", "en": "Assign Role Permissions"}',
    '{"tr": "Role yetki atama yetkisi", "en": "Permission to assign permissions to roles"}',
    true,
    NOW(),
    NOW()
);

-- 7. Function Permissions - Permissions
INSERT INTO "public"."Permission" (
    id, name, category, "resourcePath", action, "permissionType", 
    "displayName", description, "isActive", "createdAt", "updatedAt"
) VALUES 
(
    gen_random_uuid(),
    'permissions.create',
    'function',
    'permissions',
    'crud',
    'admin',
    '{"tr": "Yetki Oluşturma", "en": "Create Permission"}',
    '{"tr": "Yeni yetki oluşturma yetkisi", "en": "Permission to create new permissions"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'permissions.edit',
    'function',
    'permissions',
    'crud',
    'admin',
    '{"tr": "Yetki Düzenleme", "en": "Edit Permission"}',
    '{"tr": "Yetki bilgilerini düzenleme yetkisi", "en": "Permission to edit permission information"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'permissions.delete',
    'function',
    'permissions',
    'crud',
    'admin',
    '{"tr": "Yetki Silme", "en": "Delete Permission"}',
    '{"tr": "Yetki silme yetkisi", "en": "Permission to delete permissions"}',
    true,
    NOW(),
    NOW()
);

-- 8. Function Permissions - Hero Slider
INSERT INTO "public"."Permission" (
    id, name, category, "resourcePath", action, "permissionType", 
    "displayName", description, "isActive", "createdAt", "updatedAt"
) VALUES 
(
    gen_random_uuid(),
    'hero-slider.create',
    'function',
    'hero-slider',
    'crud',
    'admin',
    '{"tr": "Hero Slider Oluşturma", "en": "Create Hero Slider"}',
    '{"tr": "Yeni hero slider oluşturma yetkisi", "en": "Permission to create new hero sliders"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'hero-slider.edit',
    'function',
    'hero-slider',
    'crud',
    'admin',
    '{"tr": "Hero Slider Düzenleme", "en": "Edit Hero Slider"}',
    '{"tr": "Hero slider bilgilerini düzenleme yetkisi", "en": "Permission to edit hero slider information"}',
    true,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'hero-slider.delete',
    'function',
    'hero-slider',
    'crud',
    'admin',
    '{"tr": "Hero Slider Silme", "en": "Delete Hero Slider"}',
    '{"tr": "Hero slider silme yetkisi", "en": "Permission to delete hero sliders"}',
    true,
    NOW(),
    NOW()
);

-- 9. Admin rolüne tüm admin permission'larını ata
INSERT INTO "public"."RoleHasPermission" (
    id, "roleName", "permissionName", "isAllowed", "isActive", "grantedAt", "createdAt", "updatedAt"
)
SELECT 
    gen_random_uuid(),
    'admin',
    p.name,
    true,
    true,
    NOW(),
    NOW(),
    NOW()
FROM "public"."Permission" p
WHERE p."permissionType" = 'admin';

-- 10. User rolüne user permission'larını ata
INSERT INTO "public"."RoleHasPermission" (
    id, "roleName", "permissionName", "isAllowed", "isActive", "grantedAt", "createdAt", "updatedAt"
)
SELECT 
    gen_random_uuid(),
    'user',
    p.name,
    true,
    true,
    NOW(),
    NOW(),
    NOW()
FROM "public"."Permission" p
WHERE p."permissionType" = 'user';

-- 11. Değişiklikleri kontrol et
SELECT 
    category,
    COUNT(*) as permission_count,
    array_agg(DISTINCT action) as actions,
    array_agg(DISTINCT "permissionType") as types
FROM "public"."Permission" 
WHERE "isActive" = true 
GROUP BY category 
ORDER BY category;

-- 12. Rol - Permission ilişkilerini kontrol et
SELECT 
    r."roleName",
    COUNT(*) as permission_count,
    array_agg(p.category) as categories
FROM "public"."RoleHasPermission" r
JOIN "public"."Permission" p ON r."permissionName" = p.name
WHERE r."isActive" = true 
GROUP BY r."roleName"
ORDER BY r."roleName";

COMMIT;