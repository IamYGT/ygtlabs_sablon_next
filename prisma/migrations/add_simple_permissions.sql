-- =============================================================================
-- YENİ BASİT PERMİSSİON SİSTEMİ MİGRATİON
-- =============================================================================
-- Bu script yeni basit permission formatlarını ekler
-- Mevcut sistemi bozmadan yeni sistemi destekler

BEGIN;

-- 1. Yeni basit admin permission'larını ekle
INSERT INTO "Permission" (
    "id",
    "name",
    "category", 
    "resourcePath",
    "action",
    "permissionType",
    "displayName",
    "description",
    "isActive",
    "createdAt",
    "updatedAt"
) VALUES 
-- Admin Dashboard Permission
(
    gen_random_uuid(),
    'admin.dashboard',
    'admin',
    'dashboard', 
    'access',
    'admin',
    '{"tr": "Kullanıcı Dashboard Görüntüleme", "en": "User Dashboard View"}',
    '{"tr": "Admin dashboard sayfasını görüntüleme yetkisi", "en": "Permission to view admin dashboard page"}',
    true,
    NOW(),
    NOW()
),

-- Admin Hero Slider Permission  
(
    gen_random_uuid(),
    'admin.hero-slider',
    'admin', 
    'hero-slider',
    'access',
    'admin',
    '{"tr": "Hero Slider Yönetimi", "en": "Hero Slider Management"}',
    '{"tr": "Hero slider yönetimi sayfasını görüntüleme yetkisi", "en": "Permission to view hero slider management page"}',
    true,
    NOW(),
    NOW()
),

-- Admin Users Permission
(
    gen_random_uuid(),
    'admin.users',
    'admin',
    'users',
    'access', 
    'admin',
    '{"tr": "Kullanıcı Yönetimi", "en": "User Management"}',
    '{"tr": "Kullanıcı yönetimi sayfasını görüntüleme yetkisi", "en": "Permission to view user management page"}',
    true,
    NOW(),
    NOW()
),

-- Admin Roles Permission
(
    gen_random_uuid(),
    'admin.roles',
    'admin',
    'roles', 
    'access',
    'admin',
    '{"tr": "Rol Yönetimi", "en": "Role Management"}',
    '{"tr": "Rol yönetimi sayfasını görüntüleme yetkisi", "en": "Permission to view role management page"}',
    true,
    NOW(),
    NOW()
),

-- Admin Profile Permission
(
    gen_random_uuid(),
    'admin.profile',
    'admin',
    'profile',
    'access',
    'admin', 
    '{"tr": "Admin Profil", "en": "Admin Profile"}',
    '{"tr": "Admin profil sayfasını görüntüleme yetkisi", "en": "Permission to view admin profile page"}',
    true,
    NOW(),
    NOW()
)
ON CONFLICT ("name") DO NOTHING; -- Zaten varsa skip et

-- 2. "ahmeticin" rolünü oluştur (yoksa)
INSERT INTO "AuthRole" (
    "id",
    "name", 
    "displayName",
    "description",
    "color",
    "isSystemDefault",
    "isActive",
    "layoutType",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'ahmeticin',
    'Ahmed İçin Özel Rol',
    'Sadece dashboard ve hero slider erişimi olan özel rol',
    '#3B82F6',
    false,
    true,
    'admin',
    NOW(),
    NOW()
) ON CONFLICT ("name") DO NOTHING;

-- 3. "ahmeticin" rolüne permission'ları ata
INSERT INTO "RoleHasPermission" (
    "id",
    "roleName",
    "permissionName", 
    "isAllowed",
    "isActive",
    "grantedAt",
    "createdAt",
    "updatedAt"
) VALUES 
-- Layout admin access (genel admin panel erişimi)
(
    gen_random_uuid(),
    'ahmeticin',
    'layout.admin.access',
    true,
    true,
    NOW(),
    NOW(), 
    NOW()
),
-- Dashboard access
(
    gen_random_uuid(),
    'ahmeticin',
    'admin.dashboard',
    true,
    true,
    NOW(),
    NOW(),
    NOW()
),
-- Hero slider access  
(
    gen_random_uuid(),
    'ahmeticin',
    'admin.hero-slider',
    true,
    true,
    NOW(),
    NOW(),
    NOW()
)
ON CONFLICT ("roleName", "permissionName") DO NOTHING;

-- 4. Migration başarılı mesajı
INSERT INTO "UserActivityLog" (
    "id",
    "userId",
    "action", 
    "details",
    "createdAt"
) VALUES (
    gen_random_uuid(),
    (SELECT "id" FROM "User" WHERE "email" = 'admin@example.com' LIMIT 1),
    'MIGRATION_SIMPLE_PERMISSIONS',
    '{"message": "Basit permission sistemi başarıyla eklendi", "permissions": ["admin.dashboard", "admin.hero-slider"], "role": "ahmeticin"}',
    NOW()
);

COMMIT;

-- =============================================================================
-- MİGRATİON TAMAMLANDI ✅
-- =============================================================================
-- Artık ahmeticin rolündeki kullanıcılar:
-- ✅ Admin paneline erişebilir (layout.admin.access)
-- ✅ Dashboard'u görebilir (admin.dashboard)  
-- ✅ Hero slider'ı yönetebilir (admin.hero-slider)
-- ❌ Users, roles, profile sayfalarını göremez
-- =============================================================================