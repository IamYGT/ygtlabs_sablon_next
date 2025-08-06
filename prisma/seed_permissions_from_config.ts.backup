import { PrismaClient } from "@prisma/client";
import { ALL_PERMISSIONS, PERMISSION_STATS } from "../lib/permissions/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Permission Config System - DB Sync başlıyor...");
  console.log(`📊 Toplam ${PERMISSION_STATS.total} permission sync edilecek:`);
  console.log(`   • Layout: ${PERMISSION_STATS.layout}`);
  console.log(`   • View: ${PERMISSION_STATS.view}`);
  console.log(`   • Function: ${PERMISSION_STATS.function}`);
  console.log(`   • Admin: ${PERMISSION_STATS.admin}`);
  console.log(`   • User: ${PERMISSION_STATS.user}`);

  // 1. Mevcut role-permission ilişkilerini sil
  console.log("🗑️ Mevcut role-permission ilişkileri temizleniyor...");
  await prisma.roleHasPermission.deleteMany();

  // 2. Mevcut permissionları sil
  console.log("🗑️ Mevcut permissionlar temizleniyor...");
  await prisma.permission.deleteMany();

  console.log("✅ Eski veriler temizlendi");

  // 3. Config'den permission'ları oluştur
  console.log("📝 Config dosyasından permission'lar oluşturuluyor...");

  for (const permConfig of ALL_PERMISSIONS) {
    await prisma.permission.create({
      data: {
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

    console.log(
      `   ✓ ${permConfig.name} (${permConfig.category}/${permConfig.action})`
    );
  }

  console.log("✅ Tüm permissionlar config'den oluşturuldu");

  // 4. Admin rolüne tüm admin permission'larını ata
  console.log("👑 Admin rolüne permission'lar atanıyor...");
  const adminPermissions = await prisma.permission.findMany({
    where: { permissionType: "admin" },
  });

  for (const perm of adminPermissions) {
    await prisma.roleHasPermission.create({
      data: {
        roleName: "admin",
        permissionName: perm.name,
        isAllowed: true,
        isActive: true,
      },
    });
  }

  console.log(`   ✓ ${adminPermissions.length} admin permission atandı`);

  // 5. User rolüne user permission'larını ata
  console.log("👤 User rolüne permission'lar atanıyor...");
  const userPermissions = await prisma.permission.findMany({
    where: { permissionType: "user" },
  });

  for (const perm of userPermissions) {
    await prisma.roleHasPermission.create({
      data: {
        roleName: "user",
        permissionName: perm.name,
        isAllowed: true,
        isActive: true,
      },
    });
  }

  console.log(`   ✓ ${userPermissions.length} user permission atandı`);

  // 6. Özet rapor
  const finalStats = await prisma.permission.groupBy({
    by: ["category", "permissionType"],
    _count: true,
  });

  console.log("\n📊 Final Permission İstatistikleri:");
  console.table(finalStats);

  const roleStats = await prisma.roleHasPermission.groupBy({
    by: ["roleName"],
    _count: true,
  });

  console.log("\n📊 Rol-Permission İstatistikleri:");
  console.table(roleStats);

  // 7. Config doğrulama
  const dbPermissionCount = await prisma.permission.count();
  const configPermissionCount = ALL_PERMISSIONS.length;

  if (dbPermissionCount === configPermissionCount) {
    console.log("\n✅ Config-DB sync başarılı!");
    console.log(`   • Config: ${configPermissionCount} permission`);
    console.log(`   • DB: ${dbPermissionCount} permission`);
  } else {
    console.log("\n❌ Config-DB sync hatası!");
    console.log(`   • Config: ${configPermissionCount} permission`);
    console.log(`   • DB: ${dbPermissionCount} permission`);
    throw new Error("Permission count mismatch!");
  }

  console.log("\n🎉 Permission sistem sync tamamlandı!");
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
    console.error("❌ Migration hatası:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
