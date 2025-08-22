// ============================================================================
// OPTIMIZED SESSION UTILITIES - Performance Enhanced Version
// ============================================================================

import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";
import { sessionCache } from "./session-cache";
import type { SimpleUser } from "./types";

// Constants
export const AUTH_COOKIE_NAME = "ecu_session";
const LAST_ACTIVE_UPDATE_INTERVAL = 60 * 1000; // 1 minute - debounce lastActive updates

// Track last update times to debounce
const lastActiveUpdateMap = new Map<string, number>();

/**
 * Get current user from request (server-side only) - OPTIMIZED
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
 * Get user from session token - OPTIMIZED VERSION
 */
export async function getCurrentUserFromToken(
  token: string
): Promise<SimpleUser | null> {
  if (!isValidSessionToken(token)) {
    return null;
  }

  // Check cache first - OPTIMIZED
  const cachedUser = sessionCache.get(token);
  if (cachedUser) {
    // Debounce lastActive updates
    const lastUpdate = lastActiveUpdateMap.get(token) || 0;
    const now = Date.now();
    
    if (now - lastUpdate > LAST_ACTIVE_UPDATE_INTERVAL) {
      lastActiveUpdateMap.set(token, now);
      
      // Update last active in background (non-blocking)
      setImmediate(() => {
        prisma.session
          .update({
            where: { sessionToken: token },
            data: { lastActive: new Date() },
          })
          .catch(() => {
            // Clean up on error
            lastActiveUpdateMap.delete(token);
          });
      });
    }
    
    return cachedUser;
  }

  try {
    // OPTIMIZED QUERY - Single query with selective loading
    const session = await prisma.session.findFirst({
      where: {
        sessionToken: token,
        isActive: true,
        expires: { gt: new Date() },
      },
      select: {
        id: true,
        lastActive: true,
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
                  where: { 
                    isAllowed: true, 
                    isActive: true 
                  },
                  select: {
                    permission: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!session?.user || !session.user.isActive) {
      return null;
    }

    // Extract permissions efficiently
    const permissions = session.user.role?.rolePermissions.map(
      rp => rp.permission.name
    ) ?? [];

    // Create SimpleUser object
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

    // Cache with shorter TTL for better freshness
    sessionCache.set(token, simpleUser, 2 * 60 * 1000); // 2 minutes

    // Set initial lastActive tracking
    lastActiveUpdateMap.set(token, Date.now());

    // Update last active once (non-blocking)
    setImmediate(() => {
      prisma.session
        .update({
          where: { id: session.id },
          data: { lastActive: new Date() },
        })
        .catch(() => {});
    });

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
 * Get server session - alias for getCurrentUser
 */
export async function getServerSession(
  req?: NextRequest
): Promise<{ user: SimpleUser } | null> {
  const user = await getCurrentUser(req);
  return user ? { user } : null;
}

// Cleanup function for server shutdown
if (typeof process !== "undefined") {
  process.on("SIGINT", () => {
    lastActiveUpdateMap.clear();
  });
  
  process.on("SIGTERM", () => {
    lastActiveUpdateMap.clear();
  });
}
