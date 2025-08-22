// Server-only utilities for Next.js 15.5
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { cacheManager } from "./cache-manager";
import type { SimpleUser } from "./types";

// Session constants
export const AUTH_COOKIE_NAME = "ecu_session";

/**
 * Get current user from request (server-side only)
 */
export async function getCurrentUser(req?: NextRequest): Promise<SimpleUser | null> {
  try {
    let sessionToken: string | undefined;

    if (req) {
      sessionToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    } else {
      const cookieStore = await cookies();
      sessionToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    }

    if (!sessionToken || sessionToken.trim().length === 0) return null;

    // Check cache first
    const cachedUser = cacheManager.getSession(sessionToken);
    if (cachedUser) return cachedUser;

    // Query database with optimized select
    const session = await prisma.session.findFirst({
      where: {
        sessionToken,
        isActive: true,
        expires: { gt: new Date() },
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
            isActive: true,
            roleId: true,
            roleAssignedAt: true,
            createdAt: true,
            lastLoginAt: true,
            role: {
              select: {
                name: true,
                rolePermissions: {
                  where: { isAllowed: true, isActive: true },
                  select: {
                    permission: { select: { name: true } }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!session?.user || !session.user.isActive) return null;

    const permissions = session.user.role?.rolePermissions.map(
      rp => rp.permission.name
    ) ?? [];

    const simpleUser: SimpleUser = {
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

    // Cache user
    cacheManager.setSession(sessionToken, simpleUser);
    return simpleUser;
  } catch (_error) {
    return null;
  }
}

/**
 * Check if request has valid session token
 */
export function hasValidSessionToken(request: NextRequest): boolean {
  const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  return !!(sessionToken && sessionToken.trim().length > 0);
}

// Re-export for backward compatibility
export { getCurrentUser as getCurrentUserFromToken };
export { getCurrentUser as getServerSession };
