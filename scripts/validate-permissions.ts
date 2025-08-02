import {
  ALL_PERMISSIONS,
  FUNCTION_PERMISSIONS,
} from "../lib/permissions.config";

function validatePermissions(): boolean {
  console.log("✅ Permission Config Validation\n");

  let isValid = true;
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Unique name kontrolü
  const names = ALL_PERMISSIONS.map((p) => p.name);
  const duplicateNames = names.filter(
    (name, index) => names.indexOf(name) !== index
  );
  if (duplicateNames.length > 0) {
    errors.push(
      `Duplicate permission names: ${[...new Set(duplicateNames)].join(", ")}`
    );
    isValid = false;
  }

  // 2. Naming convention kontrolü
  ALL_PERMISSIONS.forEach((p) => {
    // Layout naming: should be {type}.layout
    if (p.category === "layout" && !p.name.endsWith(".layout")) {
      errors.push(`Layout permission should end with .layout: ${p.name}`);
      isValid = false;
    }

    // View naming: should be {module}.{resource}.view
    if (p.category === "view" && !p.name.endsWith(".view")) {
      errors.push(`View permission should end with .view: ${p.name}`);
      isValid = false;
    }

    // Function naming: should be {resource}.{action}
    if (
      p.category === "function" &&
      (p.name.includes(".view") || p.name.includes(".layout"))
    ) {
      errors.push(
        `Function permission should not contain .view or .layout: ${p.name}`
      );
      isValid = false;
    }
  });

  // 3. Category vs Action uyumu kontrolü
  ALL_PERMISSIONS.forEach((p) => {
    if (p.category === "layout" && p.action !== "access") {
      errors.push(
        `Layout permissions should use 'access' action: ${p.name} uses '${p.action}'`
      );
      isValid = false;
    }

    if (p.category === "view" && p.action !== "view") {
      errors.push(
        `View permissions should use 'view' action: ${p.name} uses '${p.action}'`
      );
      isValid = false;
    }

    if (p.category === "function" && p.action === "view") {
      errors.push(
        `Function permissions should not use 'view' action: ${p.name}`
      );
      isValid = false;
    }
  });

  // 4. Required fields kontrolü
  ALL_PERMISSIONS.forEach((p) => {
    if (
      !p.name ||
      !p.category ||
      !p.resourcePath ||
      !p.action ||
      !p.permissionType
    ) {
      errors.push(
        `Missing required fields in permission: ${p.name || "unnamed"}`
      );
      isValid = false;
    }

    if (!p.displayName?.tr || !p.displayName?.en) {
      errors.push(`Missing display name translations: ${p.name}`);
      isValid = false;
    }

    if (!p.description?.tr || !p.description?.en) {
      errors.push(`Missing description translations: ${p.name}`);
      isValid = false;
    }
  });

  // 5. Dependencies kontrolü
  ALL_PERMISSIONS.forEach((p) => {
    if (p.dependencies) {
      p.dependencies.forEach((dep) => {
        const depExists = ALL_PERMISSIONS.some((dp) => dp.name === dep);
        if (!depExists) {
          errors.push(`Dependency not found: ${p.name} depends on ${dep}`);
          isValid = false;
        }
      });
    }
  });

  // 6. Permission Type kontrolü
  ALL_PERMISSIONS.forEach((p) => {
    if (!["admin", "user"].includes(p.permissionType)) {
      errors.push(
        `Invalid permission type: ${p.name} has type '${p.permissionType}'`
      );
      isValid = false;
    }
  });

  // 7. Action Type kontrolü
  const validActions = [
    "access",
    "view",
    "create",
    "read",
    "update",
    "delete",
    "manage",
  ];
  ALL_PERMISSIONS.forEach((p) => {
    if (!validActions.includes(p.action)) {
      errors.push(`Invalid action type: ${p.name} has action '${p.action}'`);
      isValid = false;
    }
  });

  // 8. Resource Path kontrolü
  ALL_PERMISSIONS.forEach((p) => {
    if (p.resourcePath.includes(" ") || p.resourcePath.includes("/")) {
      warnings.push(
        `Resource path should be clean (no spaces/slashes): ${p.name} has '${p.resourcePath}'`
      );
    }
  });

  // 9. Dev Notes eksik olan function permission'lar
  FUNCTION_PERMISSIONS.forEach((p) => {
    if (!p.devNotes) {
      warnings.push(`Function permission missing dev notes: ${p.name}`);
    }

    if (!p.usedIn || p.usedIn.length === 0) {
      warnings.push(`Permission not documenting usage: ${p.name}`);
    }
  });

  // Sonuçları yazdır
  if (errors.length > 0) {
    console.log("❌ ERRORS:");
    errors.forEach((error) => console.log(`   • ${error}`));
    console.log("");
  }

  if (warnings.length > 0) {
    console.log("⚠️  WARNINGS:");
    warnings.forEach((warning) => console.log(`   • ${warning}`));
    console.log("");
  }

  // İstatistikler
  console.log("📊 Validation Statistics:");
  console.log(`   • Total permissions: ${ALL_PERMISSIONS.length}`);
  console.log(`   • Errors: ${errors.length}`);
  console.log(`   • Warnings: ${warnings.length}`);
  console.log(
    `   • Layout permissions: ${
      ALL_PERMISSIONS.filter((p) => p.category === "layout").length
    }`
  );
  console.log(
    `   • View permissions: ${
      ALL_PERMISSIONS.filter((p) => p.category === "view").length
    }`
  );
  console.log(
    `   • Function permissions: ${
      ALL_PERMISSIONS.filter((p) => p.category === "function").length
    }`
  );
  console.log("");

  // Öneriler
  if (isValid) {
    console.log("✅ All validations passed!");
    console.log("🚀 Config is ready for sync: npm run permissions:sync");
  } else {
    console.log("❌ Validation failed!");
    console.log(
      "🔧 Fix errors in lib/permissions.config.ts and run validation again"
    );
  }

  return isValid;
}

function main() {
  const isValid = validatePermissions();
  process.exit(isValid ? 0 : 1);
}

main();
