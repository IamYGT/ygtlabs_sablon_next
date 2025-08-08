-- Safe enum cast and alignment for live DB (no data loss)
-- This script standardizes enum-typed columns and indexes without dropping tables.

BEGIN;

-- 1) Create enum types if not exists
DO $$ BEGIN
  CREATE TYPE "PermissionCategory" AS ENUM ('layout','view','function');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PermissionAction" AS ENUM ('access','view','create','read','update','delete','manage','edit');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "PermissionType" AS ENUM ('admin','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "LayoutType" AS ENUM ('admin','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "SessionType" AS ENUM ('normal','incognito','mobile');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) Normalize possibly legacy values before casting
-- Map any unknown Permission.action values to a valid enum (prefer 'view' or 'manage')
UPDATE "Permission" SET "action" = 'manage'
WHERE LOWER("action") IN ('crud');

-- 3) Convert columns to enum types using safe CASE mapping
-- Drop defaults before changing type (to avoid cast errors)
ALTER TABLE "Permission" ALTER COLUMN "permissionType" DROP DEFAULT;

ALTER TABLE "Permission"
  ALTER COLUMN "category" TYPE "PermissionCategory" USING (
    CASE
      WHEN LOWER("category") = 'layout' THEN 'layout'::"PermissionCategory"
      WHEN LOWER("category") = 'view' THEN 'view'::"PermissionCategory"
      WHEN LOWER("category") = 'function' THEN 'function'::"PermissionCategory"
      ELSE 'view'::"PermissionCategory"
    END
  ),
  ALTER COLUMN "action" TYPE "PermissionAction" USING (
    CASE
      WHEN LOWER("action") IN ('access','view','create','read','update','delete','manage','edit') THEN LOWER("action")::"PermissionAction"
      ELSE 'view'::"PermissionAction"
    END
  ),
  ALTER COLUMN "permissionType" TYPE "PermissionType" USING (
    CASE
      WHEN LOWER("permissionType") = 'admin' THEN 'admin'::"PermissionType"
      ELSE 'user'::"PermissionType"
    END
  );

-- Restore default after type change
ALTER TABLE "Permission" ALTER COLUMN "permissionType" SET DEFAULT 'user'::"PermissionType";

-- AuthRole.layoutType: drop default, change type, set default
ALTER TABLE "AuthRole" ALTER COLUMN "layoutType" DROP DEFAULT;

ALTER TABLE "AuthRole"
  ALTER COLUMN "layoutType" TYPE "LayoutType" USING (
    CASE WHEN LOWER("layoutType") = 'admin' THEN 'admin'::"LayoutType" ELSE 'user'::"LayoutType" END
  );

ALTER TABLE "AuthRole" ALTER COLUMN "layoutType" SET DEFAULT 'user'::"LayoutType";

-- Session.sessionType: drop default, change type, set default
ALTER TABLE "Session" ALTER COLUMN "sessionType" DROP DEFAULT;

ALTER TABLE "Session"
  ALTER COLUMN "sessionType" TYPE "SessionType" USING (
    CASE
      WHEN LOWER("sessionType") IN ('normal','incognito','mobile') THEN LOWER("sessionType")::"SessionType"
      ELSE 'normal'::"SessionType"
    END
  );

ALTER TABLE "Session" ALTER COLUMN "sessionType" SET DEFAULT 'normal'::"SessionType";

-- 4) Migrate User.image -> User.profileImage (then drop image)
UPDATE "User"
SET "profileImage" = COALESCE("profileImage", "image")
WHERE "image" IS NOT NULL;

ALTER TABLE "User" DROP COLUMN IF EXISTS "image";

-- 5) Add helpful indexes (if not exists)
CREATE INDEX IF NOT EXISTS "Session_userId_isActive_idx" ON "Session"("userId", "isActive");
CREATE INDEX IF NOT EXISTS "Session_expires_idx" ON "Session"("expires");
CREATE INDEX IF NOT EXISTS "User_roleId_idx" ON "User"("roleId");

-- 6) Ensure unique ordering for HeroSlider.order (deduplicate then add constraint)
WITH d AS (
  SELECT id, "order", ROW_NUMBER() OVER (PARTITION BY "order" ORDER BY COALESCE("updatedAt","createdAt"), id) AS rn
  FROM "HeroSlider"
)
UPDATE "HeroSlider" h
SET "order" = h."order" + d.rn - 1
FROM d
WHERE h.id = d.id AND d.rn > 1;

DO $$ BEGIN
  ALTER TABLE "HeroSlider" ADD CONSTRAINT "HeroSlider_order_key" UNIQUE ("order");
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

COMMIT;


