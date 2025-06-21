-- Migration: RoleAccess'ten Permission ve RoleHasPermission'a geçiş
-- Bu script mevcut verileri koruyarak yeni yapıya geçiş yapar

BEGIN;

-- 1. Yeni Permission tablosunu oluştur
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourcePath" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "permissionType" TEXT NOT NULL DEFAULT 'user',
    "subCategory" TEXT,
    "displayName" JSONB,
    "description" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    "updatedById" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- 2. Yeni RoleHasPermission tablosunu oluştur
CREATE TABLE "RoleHasPermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "isAllowed" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "conditions" JSONB,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoleHasPermission_pkey" PRIMARY KEY ("id")
);

-- 3. Mevcut RoleAccess verilerinden unique permission'ları Permission tablosuna aktar
INSERT INTO "Permission" (
    "id",
    "name",
    "category",
    "resourceType",
    "resourcePath", 
    "action",
    "permissionType",
    "displayName",
    "description",
    "isActive",
    "isSystem",
    "createdAt",
    "updatedAt",
    "createdById",
    "updatedById"
)
SELECT DISTINCT
    gen_random_uuid(),
    CONCAT("category", '.', "resourcePath", '.', "action") as "name",
    "category",
    CASE 
        WHEN "category" = 'layout' THEN 'layout'
        WHEN "category" = 'view' THEN 'page'
        WHEN "category" = 'function' THEN 'api'
        ELSE 'other'
    END as "resourceType",
    "resourcePath",
    "action",
    COALESCE("permissionType", 'user'),
    "displayName",
    "description",
    "isActive",
    CASE 
        WHEN "category" = 'layout' THEN true
        ELSE false
    END as "isSystem",
    "createdAt",
    "updatedAt",
    "createdById",
    "updatedById"
FROM "RoleAccess"
WHERE "isActive" = true;

-- 4. Role-Permission ilişkilerini RoleHasPermission tablosuna aktar
INSERT INTO "RoleHasPermission" (
    "id",
    "roleId",
    "permissionId",
    "isAllowed",
    "isActive",
    "conditions",
    "grantedAt",
    "grantedById",
    "createdAt",
    "updatedAt"
)
SELECT 
    gen_random_uuid(),
    r."id" as "roleId",
    p."id" as "permissionId",
    ra."isAllowed",
    ra."isActive",
    ra."conditions",
    ra."grantedAt",
    ra."grantedById",
    ra."createdAt",
    ra."updatedAt"
FROM "RoleAccess" ra
JOIN "AuthRole" r ON r."name" = ra."roleName"
JOIN "Permission" p ON p."name" = CONCAT(ra."category", '.', ra."resourcePath", '.', ra."action")
WHERE ra."isActive" = true;

-- 5. İndeksleri oluştur
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");
CREATE INDEX "Permission_category_idx" ON "Permission"("category");
CREATE INDEX "Permission_resourceType_idx" ON "Permission"("resourceType");
CREATE INDEX "Permission_resourcePath_idx" ON "Permission"("resourcePath");
CREATE INDEX "Permission_permissionType_idx" ON "Permission"("permissionType");
CREATE INDEX "Permission_isActive_idx" ON "Permission"("isActive");
CREATE INDEX "Permission_category_permissionType_idx" ON "Permission"("category", "permissionType");
CREATE INDEX "Permission_resourceType_resourcePath_idx" ON "Permission"("resourceType", "resourcePath");

CREATE UNIQUE INDEX "RoleHasPermission_roleId_permissionId_key" ON "RoleHasPermission"("roleId", "permissionId");
CREATE INDEX "RoleHasPermission_roleId_idx" ON "RoleHasPermission"("roleId");
CREATE INDEX "RoleHasPermission_permissionId_idx" ON "RoleHasPermission"("permissionId");
CREATE INDEX "RoleHasPermission_isActive_idx" ON "RoleHasPermission"("isActive");
CREATE INDEX "RoleHasPermission_roleId_isActive_idx" ON "RoleHasPermission"("roleId", "isActive");

-- 6. Foreign key constraint'leri ekle
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "RoleHasPermission" ADD CONSTRAINT "RoleHasPermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "AuthRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoleHasPermission" ADD CONSTRAINT "RoleHasPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RoleHasPermission" ADD CONSTRAINT "RoleHasPermission_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 7. RoleAccess tablosunu yedekle (güvenlik için)
ALTER TABLE "RoleAccess" RENAME TO "RoleAccess_backup";

-- 8. AuthRole tablosundaki roleAccesses relation'ını güncelle (bu Prisma tarafından otomatik yapılacak)

COMMIT;

-- Verification queries (manuel kontrol için)
-- SELECT COUNT(*) as permission_count FROM "Permission";
-- SELECT COUNT(*) as role_permission_count FROM "RoleHasPermission";
-- SELECT COUNT(*) as backup_count FROM "RoleAccess_backup"; 