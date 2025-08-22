import { getCurrentUser, prisma } from "@/lib";
import { cacheManager } from "@/lib/cache-manager";
import {
  PermissionAction,
  PermissionCategory,
} from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Helper function for JSON parsing
const parseLocalizedField = (
  field: unknown,
  locale: string,
  fallback: string
): string => {
  if (!field) return fallback;
  
  // If already an object, use it directly
  if (typeof field === "object" && field !== null && !Array.isArray(field)) {
    const obj = field as Record<string, string>;
    return obj[locale] || obj.en || obj.tr || fallback;
  }
  
  // If string, try to parse once
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      return parsed[locale] || parsed.en || parsed.tr || field;
    } catch {
      return field;
    }
  }
  
  return fallback;
};

// OPTIMIZED GET endpoint
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 500); // Max 500
    const search = searchParams.get("search");
    const locale = searchParams.get("locale") || "tr";
    const useCache = searchParams.get("cache") !== "false"; // Allow cache bypass

    // Check cache first
    if (useCache) {
      const cachedData = cacheManager.get({
        category,
        page,
        limit,
        search,
        locale,
      });

      if (cachedData) {
        // Add cache headers
        const response = NextResponse.json(cachedData);
        response.headers.set("X-Cache", "HIT");
        response.headers.set("X-Response-Time", `${Date.now() - startTime}ms`);
        return response;
      }
    }

    // Build query filters
    const categoryEnum: PermissionCategory | undefined =
      category && ["layout", "view", "function"].includes(category)
        ? (category as PermissionCategory)
        : undefined;

    const searchValue = search?.toLowerCase().trim();
    const actionEnum: PermissionAction | undefined =
      searchValue &&
      [
        "access",
        "view",
        "create",
        "read",
        "update",
        "delete",
        "manage",
        "edit",
      ].includes(searchValue)
        ? (searchValue as PermissionAction)
        : undefined;

    // Get total count for pagination
    const totalCount = await prisma.permission.count({
      where: {
        isActive: true,
        ...(categoryEnum && { category: categoryEnum }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { resourcePath: { contains: search, mode: "insensitive" } },
            ...(actionEnum ? ([{ action: actionEnum }] as const) : []),
          ],
        }),
      },
    });

    // Paginated query with selective fields
    const skip = (page - 1) * limit;
    
    const permissions = await prisma.permission.findMany({
      where: {
        isActive: true,
        ...(categoryEnum && { category: categoryEnum }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { resourcePath: { contains: search, mode: "insensitive" } },
            ...(actionEnum ? ([{ action: actionEnum }] as const) : []),
          ],
        }),
      },
      select: {
        id: true,
        name: true,
        category: true,
        resourcePath: true,
        action: true,
        permissionType: true,
        displayName: true,
        description: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { category: "asc" },
        { resourcePath: "asc" },
        { action: "asc" },
      ],
      skip,
      take: limit,
    });

    // Efficient formatting with memoization
    const formattedPermissions = permissions.map((perm) => ({
      id: perm.id,
      name: perm.name,
      category: perm.category,
      resourcePath: perm.resourcePath,
      action: perm.action,
      permissionType: perm.permissionType,
      displayName: parseLocalizedField(
        perm.displayName,
        locale,
        `${perm.category}:${perm.resourcePath}:${perm.action}`
      ),
      description: parseLocalizedField(
        perm.description,
        locale,
        `${perm.category} ${perm.action} yetkisi`
      ),
      isActive: perm.isActive,
      createdAt: perm.createdAt,
      updatedAt: perm.updatedAt,
    }));

    // Simple categorization (frontend can handle complex grouping)
    const categorizedPermissions = categoryEnum
      ? { [categoryEnum]: formattedPermissions }
      : formattedPermissions.reduce(
          (acc, perm) => {
            const cat = perm.category || "general";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(perm);
            return acc;
          },
          {} as Record<string, typeof formattedPermissions>
        );

    // Lightweight stats
    const stats = categoryEnum
      ? [{ category: categoryEnum, _count: { id: totalCount } }]
      : await prisma.permission.groupBy({
          by: ["category"],
          _count: { id: true },
          where: { isActive: true },
        });

    const responseData = {
      permissions: formattedPermissions,
      categorizedPermissions,
      stats,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
    };

    // Cache the response
    if (useCache) {
      cacheManager.set(
        { category, page, limit, search, locale },
        responseData
      );
    }

    // Add performance headers
    const response = NextResponse.json(responseData);
    response.headers.set("X-Cache", "MISS");
    response.headers.set("X-Response-Time", `${Date.now() - startTime}ms`);
    response.headers.set("X-Total-Count", totalCount.toString());
    
    return response;
  } catch (error) {
    console.error("Yetkiler getirme hatası:", error);
    
    const response = NextResponse.json(
      { error: "Yetkiler getirilirken bir hata oluştu" },
      { status: 500 }
    );
    response.headers.set("X-Response-Time", `${Date.now() - startTime}ms`);
    
    return response;
  }
}

// POST endpoint remains similar but invalidates cache
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const hasPermission =
      currentUser.permissions.includes("permissions.create");

    if (!hasPermission) {
      return NextResponse.json(
        { error: "Bu işlem için super admin yetkisi gereklidir" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      category,
      resourcePath,
      action,
      displayName,
      description,
      permissionType = "user",
      isActive = true,
    } = body;

    // Validation
    if (!name || !category || !resourcePath || !action) {
      return NextResponse.json(
        { error: "name, category, resourcePath ve action alanları zorunludur" },
        { status: 400 }
      );
    }

    // Check for existing permission
    const existingPermission = await prisma.permission.findUnique({
      where: { name },
    });

    if (existingPermission) {
      return NextResponse.json(
        { error: "Bu isimde bir yetki zaten mevcut" },
        { status: 400 }
      );
    }

    // Create new permission
    const newPermission = await prisma.permission.create({
      data: {
        name,
        category,
        resourcePath,
        action,
        permissionType,
        displayName: displayName ? JSON.stringify(displayName) : undefined,
        description: description ? JSON.stringify(description) : undefined,
        isActive,
        createdById: currentUser.id,
      },
    });

    // Invalidate cache after creating new permission
    cacheManager.invalidateAll();

    return NextResponse.json({
      message: "Yetki başarıyla oluşturuldu",
      permission: newPermission,
    });
  } catch (error) {
    console.error("Yetki oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Yetki oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

