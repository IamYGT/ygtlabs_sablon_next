import { getCurrentUser } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const currentUser = await getCurrentUser(request);

    if (body.action === "LAYOUT_DENIED") {
      console.log("❌❌❌ LAYOUT ACCESS DENIED ❌❌❌");
      console.log(`   • User: ${body.userEmail}`);
      console.log(`   • Required Layout: ${body.requireLayout}`);
      console.log(
        `   • Required Permission: ${body.requiredPermission || "None"}`
      );
      console.log(`   • Redirecting to: /forbidden`);
      return NextResponse.json({ success: true });
    }

    if (body.action === "VIEW_DENIED") {
      console.log("❌❌❌ VIEW ACCESS DENIED ❌❌❌");
      console.log(`   • User: ${body.userEmail}`);
      console.log(`   • Required Layout: ${body.requireLayout}`);
      console.log(`   • Required Permission: ${body.requiredPermission}`);
      console.log(`   • Redirecting to: /forbidden`);
      return NextResponse.json({ success: true });
    }

    console.log("🛡️ AdminPageGuard Debug:");
    console.log(`   • User: ${currentUser?.email || "None"}`);
    console.log(`   • Primary Role: ${currentUser?.primaryRole || "None"}`);
    console.log(
      `   • Is Super Admin: ${
        currentUser?.primaryRole === "super_admin" ? "✅" : "❌"
      }`
    );
    console.log(
      `   • User Permissions: ${currentUser?.permissions?.length || 0}`
    );
    console.log(`   • Required Layout: ${body.requireLayout || "None"}`);
    console.log(
      `   • Required Permission: ${body.requiredPermission || "None"}`
    );
    console.log(
      `   • Has Admin Layout: ${
        currentUser?.permissions?.includes("admin.layout") ? "✅" : "❌"
      }`
    );
    console.log(
      `   • Has Dashboard View: ${
        currentUser?.permissions?.includes("admin.dashboard.view") ? "✅" : "❌"
      }`
    );

    if (currentUser?.permissions && currentUser.permissions.length > 0) {
      console.log("🔐 User's Permissions:");
      currentUser.permissions.forEach((perm) => {
        console.log(`     • ${perm}`);
      });
    } else {
      console.log("❌ NO PERMISSIONS FOUND FOR USER!");
    }

    return NextResponse.json({
      success: true,
      debug: {
        user: currentUser?.email,
        primaryRole: currentUser?.primaryRole,
        permissionCount: currentUser?.permissions?.length || 0,
        hasAdminLayout: currentUser?.permissions?.includes("admin.layout"),
        hasDashboardView: currentUser?.permissions?.includes(
          "admin.dashboard.view"
        ),
      },
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json({ error: "Debug error" }, { status: 500 });
  }
}
