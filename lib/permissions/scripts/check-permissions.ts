import { PrismaClient } from "@prisma/client";
import { ALL_PERMISSIONS, PERMISSION_STATS } from "../config";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Permission Config vs Database Karşılaştırması\n");

  // Config'deki permission'ları al
  const configPermissions = ALL_PERMISSIONS.map((p) => p.name);

  // DB'deki permission'ları al
  const dbPermissions = await prisma.permission.findMany({
    select: { name: true, isActive: true },
  });
  const dbPermissionNames = dbPermissions.map((p) => p.name);

  console.log("📊 İstatistikler:");
  console.log(`   • Config'de: ${configPermissions.length} permission`);
  console.log(`   • DB'de: ${dbPermissionNames.length} permission`);
  console.log("");

  // Config'de olup DB'de olmayan
  const missingInDb = configPermissions.filter(
    (p) => !dbPermissionNames.includes(p)
  );
  if (missingInDb.length > 0) {
    console.log("❌ Config'de var, DB'de yok:");
    missingInDb.forEach((p) => console.log(`   • ${p}`));
    console.log("");
  }

  // DB'de olup config'de olmayan
  const extraInDb = dbPermissionNames.filter(
    (p) => !configPermissions.includes(p)
  );
  if (extraInDb.length > 0) {
    console.log("⚠️  DB'de var, config'de yok:");
    extraInDb.forEach((p) => console.log(`   • ${p}`));
    console.log("");
  }

  // Kategoriler karşılaştırması
  const dbStats = await prisma.permission.groupBy({
    by: ["category", "permissionType"],
    _count: true,
  });

  console.log("📈 Kategori Karşılaştırması:");
  console.log("Config:");
  console.log(`   • Layout: ${PERMISSION_STATS.layout}`);
  console.log(`   • View: ${PERMISSION_STATS.view}`);
  console.log(`   • Function: ${PERMISSION_STATS.function}`);
  console.log(`   • Admin: ${PERMISSION_STATS.admin}`);
  console.log(`   • User: ${PERMISSION_STATS.user}`);

  console.log("Database:");
  dbStats.forEach((stat) => {
    console.log(
      `   • ${stat.category} (${stat.permissionType}): ${stat._count}`
    );
  });

  // Sonuç
  if (missingInDb.length === 0 && extraInDb.length === 0) {
    console.log("\n✅ Config ve DB senkronize!");
  } else {
    console.log(
      `\n❌ ${missingInDb.length + extraInDb.length} farklılık tespit edildi!`
    );
    console.log("🔧 Düzeltmek için: npm run permissions:sync");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Kontrol hatası:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
