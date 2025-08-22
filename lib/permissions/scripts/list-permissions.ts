import {
  ALL_PERMISSIONS,
  FUNCTION_PERMISSIONS,
  LAYOUT_PERMISSIONS,
  PERMISSION_STATS,
  VIEW_PERMISSIONS,
} from "../config";

function main() {
  console.log("📋 Permission System Overview\n");

  console.log("📊 İstatistikler:");
  console.log(`   • Toplam: ${PERMISSION_STATS.total} permission`);
  console.log(`   • Layout: ${PERMISSION_STATS.layout}`);
  console.log(`   • View: ${PERMISSION_STATS.view}`);
  console.log(`   • Function: ${PERMISSION_STATS.function}`);
  console.log(`   • Admin: ${PERMISSION_STATS.admin}`);
  console.log(`   • Customer: ${PERMISSION_STATS.customer}`);
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

  // Function Permissions
  console.log("⚙️ FUNCTION PERMISSIONS");
  console.log("─".repeat(50));

  // Group by resource for better organization
  const groupedFunctions = FUNCTION_PERMISSIONS.reduce((acc, p) => {
    if (!acc[p.resourcePath]) {
      acc[p.resourcePath] = [];
    }
    acc[p.resourcePath].push(p);
    return acc;
  }, {} as Record<string, typeof FUNCTION_PERMISSIONS>);

  Object.entries(groupedFunctions).forEach(([resource, permissions]) => {
    console.log(`\n🎯 ${resource.toUpperCase()} FUNCTIONS:`);
    permissions.forEach((p) => {
      console.log(`📌 ${p.name}`);
      console.log(`   Type: ${p.permissionType} | Action: ${p.action}`);
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
  });

  // Permission dependency tree
  console.log("🌳 DEPENDENCY TREE");
  console.log("─".repeat(50));
  const withDependencies = ALL_PERMISSIONS.filter(
    (p) => p.dependencies && p.dependencies.length > 0
  );

  if (withDependencies.length > 0) {
    withDependencies.forEach((p) => {
      console.log(`📌 ${p.name}`);
      p.dependencies?.forEach((dep) => {
        console.log(`   └── requires: ${dep}`);
      });
      console.log("");
    });
  } else {
    console.log("No dependencies found");
  }

  console.log("✅ Permission listing completed!");
}

main();
