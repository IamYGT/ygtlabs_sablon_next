import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Basit permission kontrolü
    const hasAdminAccess = currentUser.permissions.includes("admin.access");
    const hasUserAccess = currentUser.permissions.includes("user.access");

    // Basit landing page belirleme
    let landingPage = "/auth/forbidden";
    let reason = "No access permissions";

    if (hasAdminAccess) {
      landingPage = "/admin/dashboard";
      reason = "Has admin.access permission";
    } else if (hasUserAccess) {
      landingPage = "/users/dashboard";
      reason = "Has user.access permission";
    }

    return NextResponse.json({
      success: true,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        roleId: currentUser.roleId,
        permissions: currentUser.permissions,
        primaryRole: currentUser.primaryRole,
      },
      accessInfo: {
        hasAdminAccess,
        hasUserAccess,
        landingPage,
        reason,
      },
      navigationResult: {
        landingPage,
        reason,
        isSimpleSystem: true,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Simple navigation debug error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
