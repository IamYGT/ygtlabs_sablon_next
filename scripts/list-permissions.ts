import {
  ALL_PERMISSIONS,
  FUNCTION_PERMISSIONS,
  LAYOUT_PERMISSIONS,
  PERMISSION_STATS,
  VIEW_PERMISSIONS,
} from "../lib/permissions.config";

function main() {
  console.log("📋 Permission System Overview\n");

  console.log("📊 İstatistikler:");
  console.log(`   • Toplam: ${PERMISSION_STATS.total} permission`);
  console.log(`   • Layout: ${PERMISSION_STATS.layout}`);
  console.log(`   • View: ${PERMISSION_STATS.view}`);
  console.log(`   • Function: ${PERMISSION_STATS.function}`);
  console.log(`   • Admin: ${PERMISSION_STATS.admin}`);
  console.log(`   • User: ${PERMISSION_STATS.user}`);
  console.log("");

  // Layout Permissions
  console.log("🏠 LAYOUT PERMISSIONS");
  console.log("─".repeat(50));
  LAYOUT_PERMISSIONS.forEach((p) => {
    console.log(`📌 ${p.name}`);
    console.log(`   Type: ${p.permissionType} | Action: ${p.action}`);
    console.log(`   Resource: ${p.resourcePath}`);
    console.log(`   TR: ${p.displayName.tr}`);
    if (p.usedIn) {
      console.log(`   Used in: ${p.usedIn.join(", ")}`);
    }
    console.log("");
  });

  // View Permissions
  console.log("👁️ VIEW PERMISSIONS");
  console.log("─".repeat(50));
  VIEW_PERMISSIONS.forEach((p) => {
    console.log(`📌 ${p.name}`);
    console.log(`   Type: ${p.permissionType} | Action: ${p.action}`);
    console.log(`   Resource: ${p.resourcePath}`);
    console.log(`   TR: ${p.displayName.tr}`);
    if (p.dependencies && p.dependencies.length > 0) {
      console.log(`   Dependencies: ${p.dependencies.join(", ")}`);
    }
    if (p.usedIn) {
      console.log(`   Used in: ${p.usedIn.join(", ")}`);
    }
    if (p.devNotes) {
      console.log(`   Dev Notes: ${p.devNotes}`);
    }
    console.log("");
  });

  // Function Permissions - Grouped by resource
  console.log("⚙️ FUNCTION PERMISSIONS");
  console.log("─".repeat(50));

  const functionByResource = FUNCTION_PERMISSIONS.reduce((acc, p) => {
    if (!acc[p.resourcePath]) {
      acc[p.resourcePath] = [];
    }
    acc[p.resourcePath].push(p);
    return acc;
  }, {} as { [key: string]: typeof FUNCTION_PERMISSIONS });

  Object.entries(functionByResource).forEach(([resource, permissions]) => {
    console.log(
      `🔧 ${resource.toUpperCase()} (${permissions.length} permissions)`
    );
    permissions.forEach((p) => {
      console.log(`   📌 ${p.name}`);
      console.log(`      Action: ${p.action} | Type: ${p.permissionType}`);
      console.log(`      TR: ${p.displayName.tr}`);
      if (p.dependencies && p.dependencies.length > 0) {
        console.log(`      Dependencies: ${p.dependencies.join(", ")}`);
      }
      if (p.usedIn) {
        console.log(`      Used in: ${p.usedIn.join(", ")}`);
      }
      if (p.devNotes) {
        console.log(`      Dev Notes: ${p.devNotes}`);
      }
      console.log("");
    });
  });

  // Quick Reference
  console.log("🚀 QUICK REFERENCE");
  console.log("─".repeat(50));
  console.log("Permission isimleri (kopyalama için):");
  ALL_PERMISSIONS.forEach((p) => {
    console.log(`"${p.name}"`);
  });
  console.log("");

  console.log("📖 Daha fazla bilgi:");
  console.log("   • Config dosyası: lib/permissions.config.ts");
  console.log("   • Dokümantasyon: PERMISSION_SYSTEM.md");
  console.log("   • Sync komutu: npm run permissions:sync");
}

main();
