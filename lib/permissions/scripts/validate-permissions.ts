import { ALL_PERMISSIONS, FUNCTION_PERMISSIONS } from "../config";

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

  // 3. Required fields kontrolü
  ALL_PERMISSIONS.forEach((p) => {
    if (!p.name || typeof p.name !== "string") {
      errors.push(`Permission missing or invalid name: ${JSON.stringify(p)}`);
      isValid = false;
    }

    if (!p.category || !["layout", "view", "function"].includes(p.category)) {
      errors.push(`Invalid category for permission: ${p.name}`);
      isValid = false;
    }

    if (!p.permissionType || !["admin", "user"].includes(p.permissionType)) {
      errors.push(`Invalid permissionType for permission: ${p.name}`);
      isValid = false;
    }

    if (!p.displayName || !p.displayName.tr || !p.displayName.en) {
      errors.push(`Missing displayName for permission: ${p.name}`);
      isValid = false;
    }

    if (!p.description || !p.description.tr || !p.description.en) {
      errors.push(`Missing description for permission: ${p.name}`);
      isValid = false;
    }
  });

  // 4. Dependency validation
  ALL_PERMISSIONS.forEach((p) => {
    if (p.dependencies) {
      p.dependencies.forEach((dep) => {
        const dependencyExists = ALL_PERMISSIONS.some((dp) => dp.name === dep);
        if (!dependencyExists) {
          errors.push(`Permission ${p.name} has invalid dependency: ${dep}`);
          isValid = false;
        }
      });
    }
  });

  // 5. Resource path validation
  ALL_PERMISSIONS.forEach((p) => {
    if (!p.resourcePath || typeof p.resourcePath !== "string") {
      errors.push(`Missing or invalid resourcePath for permission: ${p.name}`);
      isValid = false;
    }

    // Resource path should not contain spaces or special chars
    if (p.resourcePath && !/^[a-z-]+$/.test(p.resourcePath)) {
      warnings.push(
        `Resource path should only contain lowercase letters and hyphens: ${p.name} -> ${p.resourcePath}`
      );
    }
  });

  // 6. Action validation
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
      errors.push(`Invalid action for permission: ${p.name} -> ${p.action}`);
      isValid = false;
    }
  });

  // 7. Category consistency checks
  ALL_PERMISSIONS.forEach((p) => {
    // Layout permissions should have "access" action
    if (p.category === "layout" && p.action !== "access") {
      warnings.push(
        `Layout permission should typically use "access" action: ${p.name}`
      );
    }

    // View permissions should have "view" action
    if (p.category === "view" && p.action !== "view") {
      warnings.push(
        `View permission should typically use "view" action: ${p.name}`
      );
    }
  });

  // 8. Function permission specific checks
  FUNCTION_PERMISSIONS.forEach((p) => {
    // Function permissions should have dependencies on view permissions
    if (!p.dependencies || p.dependencies.length === 0) {
      warnings.push(
        `Function permission might need dependencies on view permissions: ${p.name}`
      );
    }

    // CRUD operations should follow naming pattern
    const crudActions = ["create", "read", "update", "delete"];
    if (crudActions.includes(p.action)) {
      const expectedPattern = `${p.resourcePath}.${p.action}`;
      if (p.name !== expectedPattern) {
        warnings.push(
          `CRUD permission naming could be improved: ${p.name} -> suggested: ${expectedPattern}`
        );
      }
    }
  });

  // 9. Display name consistency
  ALL_PERMISSIONS.forEach((p) => {
    if (p.displayName.tr === p.displayName.en) {
      warnings.push(
        `Turkish and English display names are identical: ${p.name}`
      );
    }

    if (p.description.tr === p.description.en) {
      warnings.push(
        `Turkish and English descriptions are identical: ${p.name}`
      );
    }
  });

  // 10. UsedIn field validation
  ALL_PERMISSIONS.forEach((p) => {
    if (p.usedIn && p.usedIn.length === 0) {
      warnings.push(`Empty usedIn array for permission: ${p.name}`);
    }
  });

  // Sonuçları yazdır
  console.log("📊 Validation Results:");
  console.log(`   • Total permissions: ${ALL_PERMISSIONS.length}`);
  console.log(`   • Errors: ${errors.length}`);
  console.log(`   • Warnings: ${warnings.length}`);
  console.log("");

  if (errors.length > 0) {
    console.log("❌ ERRORS:");
    errors.forEach((error) => console.log(`   • ${error}`));
    console.log("");
  }

  if (warnings.length > 0) {
    console.log("⚠️ WARNINGS:");
    warnings.forEach((warning) => console.log(`   • ${warning}`));
    console.log("");
  }

  if (isValid) {
    console.log("✅ Permission configuration is valid!");
  } else {
    console.log("❌ Permission configuration has errors!");
    console.log("\n🔧 Please fix the errors above before proceeding.");
  }

  return isValid;
}

function main() {
  const isValid = validatePermissions();

  if (!isValid) {
    process.exit(1);
  }
}

main();
