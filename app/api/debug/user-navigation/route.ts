import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "No current user found",
        },
        { status: 401 }
      );
    }

    // Basit permission kontrolü
    const hasAdminAccess = currentUser.permissions.includes("admin.access");
    const hasUserAccess = currentUser.permissions.includes("user.access");

    // User'in role ve permission bilgilerini detaylı göster
    const userDetails = {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      roleId: currentUser.roleId,
      permissions: currentUser.permissions,
      userRoles: currentUser.userRoles,
      primaryRole: currentUser.primaryRole,
      isActive: currentUser.isActive,
    };

    // Basit landing page belirleme
    let expectedLandingPage = "/auth/forbidden";
    let accessReason = "No access permissions";

    if (hasAdminAccess) {
      expectedLandingPage = "/admin/dashboard";
      accessReason = "Has admin.access permission";
    } else if (hasUserAccess) {
      expectedLandingPage = "/users/dashboard";
      accessReason = "Has user.access permission";
    }

    // Role kontrolü
    let roleName = "No Role";
    let roleDisplayName = "No Role";

    if (currentUser.roleId) {
      try {
        const { prisma } = await import("@/lib/prisma");
        const role = await prisma.authRole.findUnique({
          where: { id: currentUser.roleId },
          select: {
            name: true,
            displayName: true,
            isActive: true,
          },
        });

        if (role) {
          roleName = role.name;
          roleDisplayName = role.displayName;
        }
      } catch (error) {
        console.error("Role fetch error:", error);
      }
    }

    return NextResponse.json({
      success: true,
      userDetails,
      roleInfo: {
        name: roleName,
        displayName: roleDisplayName,
        expectedLandingPage,
      },
      accessInfo: {
        hasAdminAccess,
        hasUserAccess,
        accessReason,
      },
      navigationResult: {
        landingPage: expectedLandingPage,
        reason: accessReason,
        isSimpleSystem: true,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("User navigation debug error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
