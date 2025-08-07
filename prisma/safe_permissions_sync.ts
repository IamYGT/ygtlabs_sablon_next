import { PrismaClient } from "@prisma/client";
import { ALL_PERMISSIONS, PERMISSION_STATS } from "../lib/permissions/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Permission Config System - Safe DB Sync başlıyor...");
  console.log(`📊 Toplam ${PERMISSION_STATS.total} permission sync edilecek:`);
  console.log(`   • Layout: ${PERMISSION_STATS.layout}`);
  console.log(`   • View: ${PERMISSION_STATS.view}`);
  console.log(`   • Function: ${PERMISSION_STATS.function}`);
  console.log(`   • Admin: ${PERMISSION_STATS.admin}`);
  console.log(`   • User: ${PERMISSION_STATS.user}`);

  // 1. Mevcut permission'ları al
  console.log("📋 Mevcut permission'lar kontrol ediliyor...");
  const existingPermissions = await prisma.permission.findMany({
    select: { id: true, name: true },
  });

  const existingPermissionNames = new Set(
    existingPermissions.map((p) => p.name)
  );
  console.log(`   • DB'de mevcut: ${existingPermissions.length} permission`);

  // 2. Config'den permission'ları upsert et (güvenli güncelleme)
  console.log("🔄 Config dosyasından permission'lar sync ediliyor...");

  let createdCount = 0;
  let updatedCount = 0;

  for (const permConfig of ALL_PERMISSIONS) {
    const isExisting = existingPermissionNames.has(permConfig.name);

    await prisma.permission.upsert({
      where: { name: permConfig.name },
      update: {
        // Sadece metadata'yı güncelle, ID ve ilişkileri koru
        category: permConfig.category,
        resourcePath: permConfig.resourcePath,
        action: permConfig.action,
        permissionType: permConfig.permissionType,
        displayName: permConfig.displayName,
        description: permConfig.description,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        name: permConfig.name,
        category: permConfig.category,
        resourcePath: permConfig.resourcePath,
        action: permConfig.action,
        permissionType: permConfig.permissionType,
        displayName: permConfig.displayName,
        description: permConfig.description,
        isActive: true,
      },
    });

    if (isExisting) {
      updatedCount++;
      console.log(`   🔄 ${permConfig.name} (güncellendi)`);
    } else {
      createdCount++;
      console.log(`   ✅ ${permConfig.name} (yeni oluşturuldu)`);
    }
  }

  console.log(
    `✅ Permission sync tamamlandı: ${createdCount} yeni, ${updatedCount} güncellendi`
  );

  // 3. Rolleri oluştur/kontrol et ve permission'ları ata
  console.log("🔍 Rol-permission ilişkileri kontrol ediliyor...");

  // Rol tanımları ve permission dağılımı
  const roleDefinitions = {
    super_admin: {
      displayName: "Super Admin",
      description: "Sistem süper yöneticisi - tüm yetkiler",
      layoutType: "admin",
      permissions: "all", // Tüm permission'lar
    },
    admin: {
      displayName: "Admin",
      description: "Sistem yöneticisi",
      layoutType: "admin",
      permissions: "admin", // Sadece admin tipindeki permission'lar
    },
    user: {
      displayName: "User",
      description: "Normal kullanıcı",
      layoutType: "user",
      permissions: "user", // Sadece user tipindeki permission'lar
    },
  };

  // Rolleri oluştur/güncelle
  for (const [roleName, roleConfig] of Object.entries(roleDefinitions)) {
    await prisma.authRole.upsert({
      where: { name: roleName },
      update: {
        displayName: roleConfig.displayName,
        description: roleConfig.description,
        layoutType: roleConfig.layoutType,
        isActive: true,
      },
      create: {
        name: roleName,
        displayName: roleConfig.displayName,
        description: roleConfig.description,
        layoutType: roleConfig.layoutType,
        isSystemDefault: true,
        isActive: true,
      },
    });
    console.log(`   ✅ ${roleName} rolü hazırlandı`);
  }

  // Permission'ları rollere ata
  const allPermissions = await prisma.permission.findMany({
    where: { isActive: true },
  });

  for (const [roleName, roleConfig] of Object.entries(roleDefinitions)) {
    let rolePermissions: typeof allPermissions = [];

    if (roleConfig.permissions === "all") {
      // Super admin - tüm permission'lar
      rolePermissions = allPermissions;
    } else if (roleConfig.permissions === "admin") {
      // Admin - sadece admin tipindeki permission'lar
      rolePermissions = allPermissions.filter(
        (p) => p.permissionType === "admin"
      );
    } else if (roleConfig.permissions === "user") {
      // User - sadece user tipindeki permission'lar
      rolePermissions = allPermissions.filter(
        (p) => p.permissionType === "user"
      );
    }

    console.log(
      `   🔧 ${roleName} rolüne ${rolePermissions.length} permission atanıyor...`
    );

    for (const perm of rolePermissions) {
      const existingRelation = await prisma.roleHasPermission.findUnique({
        where: {
          roleName_permissionName: {
            roleName: roleName,
            permissionName: perm.name,
          },
        },
      });

      if (!existingRelation) {
        await prisma.roleHasPermission.create({
          data: {
            roleName: roleName,
            permissionName: perm.name,
            isAllowed: true,
            isActive: true,
          },
        });
        console.log(`     ➕ ${perm.name} eklendi`);
      }
    }

    console.log(
      `   ✅ ${roleName} rolüne ${rolePermissions.length} permission atandı`
    );
  }

  // 4. Config'de olmayan permission'ları sil (prune)
  console.log("🔍 Artık kullanılmayan permission'lar temizleniyor (prune)...");
  const configPermissionNames = new Set(ALL_PERMISSIONS.map((p) => p.name));
  const permissionsToRemove = await prisma.permission.findMany({
    where: {
      name: {
        notIn: Array.from(configPermissionNames),
      },
    },
    select: { name: true },
  });

  if (permissionsToRemove.length > 0) {
    console.log(
      `🧹 Config'de olmayan ${permissionsToRemove.length} permission silinecek:`
    );
    for (const p of permissionsToRemove) {
      console.log(`   • ${p.name}`);
    }

    // İlişkiler (RoleHasPermission) Prisma şemasında onDelete: Cascade ile bağlı, otomatik temizlenecek
    await prisma.permission.deleteMany({
      where: {
        name: { in: permissionsToRemove.map((p) => p.name) },
      },
    });

    console.log(
      "   ✅ Gereksiz permission'lar silindi. İlişkiler otomatik temizlendi."
    );
  } else {
    console.log("   ✅ Temizlenecek gereksiz permission bulunamadı.");
  }

  // 5. Final istatistikler
  const finalStats = await prisma.permission.groupBy({
    by: ["category", "permissionType"],
    _count: true,
    where: { isActive: true },
  });

  console.log("\n📊 Final Permission İstatistikleri (Aktif):");
  console.table(finalStats);

  const roleStats = await prisma.roleHasPermission.groupBy({
    by: ["roleName"],
    _count: true,
    where: { isActive: true },
  });

  console.log("\n📊 Rol-Permission İstatistikleri (Aktif):");
  console.table(roleStats);

  // 6. Config doğrulama
  const dbPermissionCount = await prisma.permission.count({
    where: { isActive: true },
  });
  const configPermissionCount = ALL_PERMISSIONS.length;

  if (dbPermissionCount >= configPermissionCount) {
    console.log("\n✅ Config-DB sync başarılı!");
    console.log(`   • Config: ${configPermissionCount} permission`);
    console.log(`   • DB (aktif): ${dbPermissionCount} permission`);
  } else {
    console.log("\n⚠️  Config-DB sync uyarısı!");
    console.log(`   • Config: ${configPermissionCount} permission`);
    console.log(`   • DB (aktif): ${dbPermissionCount} permission`);
    console.log("   • DB'de config'den daha az permission var, kontrol edin.");
  }

  console.log("\n🎉 Safe Permission sistem sync tamamlandı!");
  console.log("✨ Permission ID'leri korundu, mevcut rol atamaları bozulmadı!");
  console.log("📖 Detaylı bilgi: lib/permissions.config.ts");
  console.log(
    "🔧 Yeni permission eklemek için config dosyasını düzenleyin ve bu script'i çalıştırın"
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Safe sync hatası:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
