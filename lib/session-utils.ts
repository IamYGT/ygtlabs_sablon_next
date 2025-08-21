// ============================================================================
// SESSION UTILITIES - Minimal Server-Side Session Management
// For API routes and server components only
// ============================================================================

import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import type { SimpleUser } from "./types";

// Constants
export const AUTH_COOKIE_NAME = "ecu_session";

// ============================================================================
// MINIMAL SESSION FUNCTIONS FOR SERVER-SIDE USE
// ============================================================================

/**
 * Get current user from request (server-side only)
 */
export async function getCurrentUser(
  req?: NextRequest
): Promise<SimpleUser | null> {
  try {
    let sessionToken: string | undefined;

    if (req) {
      sessionToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    } else {
      const cookieStore = await cookies();
      sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    }

    if (!sessionToken) return null;

    return await getCurrentUserFromToken(sessionToken);
  } catch (error) {
    console.error("❌ getCurrentUser error:", error);
    return null;
  }
}

/**
 * Get user from session token (server-side only)
 */
export async function getCurrentUserFromToken(
  token: string
): Promise<SimpleUser | null> {
  // Token formatını katı doğrulama ile kısıtlamayın.
  // Geçersiz bir token DB'de eşleşmeyeceği için doğal olarak null döner.
  if (!isValidSessionToken(token)) {
    return null;
  }

  try {
    const session = await prisma.session.findFirst({
      where: {
        sessionToken: token,
        isActive: true,
        expires: { gt: new Date() },
      },
      include: {
        user: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  where: { isAllowed: true, isActive: true },
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session?.user || !session.user.isActive) {
      return null;
    }

    // Get user permissions from the single optimized query
    const permissions =
      session.user.role?.rolePermissions.map((rp) => rp.permission.name) ?? [];

    console.log(
      `📋 Role "${session.user.role?.name}" has ${permissions.length} permissions from DB`
    );
    if (permissions.length > 0) {
      console.log("   Permissions found:");
      permissions.forEach((pName) => {
        console.log(`     • ${pName}`);
      });
    } else {
      console.log(
        `❌ User role "${session.user.role?.name}" has no active permissions!`
      );
    }

    // Update last active (fire and forget)
    prisma.session
      .update({
        where: { id: session.id },
        data: { lastActive: new Date() },
      })
      .catch(() => {});

    const simpleUser = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      profileImage: session.user.profileImage,
      isActive: session.user.isActive,
      roleId: session.user.roleId,
      roleAssignedAt: session.user.roleAssignedAt,
      permissions,
      userRoles: session.user.role ? [session.user.role.name] : [],
      primaryRole: session.user.role?.name,
      createdAt: session.user.createdAt,
      lastLoginAt: session.user.lastLoginAt,
    };

    console.log("🔐 getCurrentUserFromToken returning:");
    console.log(`   • Email: ${simpleUser.email}`);
    console.log(`   • Primary Role: ${simpleUser.primaryRole}`);
    console.log(`   • Permissions: ${simpleUser.permissions.length}`);
    console.log(`   • User Roles: ${simpleUser.userRoles.join(", ")}`);

    return simpleUser;
  } catch (error) {
    console.error("❌ getCurrentUserFromToken error:", error);
    return null;
  }
}

/**
 * Validate session token format
 */
function isValidSessionToken(token: string): boolean {
  // Minimum kontrol: boş olmayan string kabul edilir
  return typeof token === "string" && token.trim().length > 0;
}

/**
 * Check if user has valid session token (for middleware)
 */
export function hasValidSessionToken(request: NextRequest): boolean {
  const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  return !!(sessionToken && isValidSessionToken(sessionToken));
}

/**
 * Get server session - alias for getCurrentUser to match common naming
 * Used in API routes
 */
export async function getServerSession(
  req?: NextRequest
): Promise<{ user: SimpleUser } | null> {
  const user = await getCurrentUser(req);
  return user ? { user } : null;
}
