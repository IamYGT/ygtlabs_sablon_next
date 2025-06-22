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
            role: true,
          },
        },
      },
    });

    if (!session?.user || !session.user.isActive) {
      return null;
    }

    // Get user permissions
    let permissions: string[] = [];
    if (session.user.role) {
      const rolePermissions = await prisma.roleHasPermission.findMany({
        where: {
          roleName: session.user.role.name,
          isAllowed: true,
          isActive: true,
        },
        include: {
          permission: true,
        },
      });

      permissions = rolePermissions.map((rp) => rp.permission.name);
    }

    // Update last active (fire and forget)
    prisma.session
      .update({
        where: { id: session.id },
        data: { lastActive: new Date() },
      })
      .catch(() => {});

    return {
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
  } catch (error) {
    console.error("❌ getCurrentUserFromToken error:", error);
    return null;
  }
}

/**
 * Validate session token format
 */
function isValidSessionToken(token: string): boolean {
  if (typeof token !== "string" || !token) return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(token);
}

/**
 * Check if user has valid session token (for middleware)
 */
export function hasValidSessionToken(request: NextRequest): boolean {
  const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  return !!(sessionToken && isValidSessionToken(sessionToken));
}
