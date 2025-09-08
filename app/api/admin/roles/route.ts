import { getCurrentUser } from "@/lib";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

// Tüm rolleri getir
export async function GET(request: NextRequest) {
  const t = await getTranslations("ApiMessages");
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: t("common.unauthorized") },
        { status: 401 }
      );
    }

    // Yetki kontrolü - admin.roles.view yetkisi gerekli
    if (!currentUser.permissions.includes("admin.roles.view")) {
      return NextResponse.json(
        { error: t("common.forbidden") },
        { status: 403 }
      );
    }

    if (typeof currentUser.power !== "number") {
      const response = NextResponse.json({
        roles: [],
        totalCount: 0,
      });
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }

    const roles = await prisma.authRole.findMany({
      where: {
        name: {
          not: "super_admin",
        },
        power: {
          lte: currentUser.power,
        },
      },
      include: {
        rolePermissions: {
          where: { isActive: true },
          include: {
            permission: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Format roles for frontend compatibility
    const formattedRoles = roles.map((role) => ({
      id: role.id,
      name: role.name,
      displayName: role.displayName,
      description: role.description,
      color: role.color,
      layoutType: role.layoutType,
      isActive: role.isActive,
      isSystemDefault: role.isSystemDefault,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      permissions: role.rolePermissions.map((rp) => ({
        permission: {
          id: rp.permission.id,
          name: rp.permission.name,
          displayName: rp.permission.displayName,
          category: rp.permission.category,
          resourcePath: rp.permission.resourcePath,
          action: rp.permission.action,
          permissionType: rp.permission.permissionType,
        },
      })),
      users: role.users,
      _count: role._count,
    }));

    // Response'a cache control header'ları ekle
    const response = NextResponse.json({
      roles: formattedRoles,
      totalCount: formattedRoles.length,
    });
    
    // Cache'i disable et - her zaman güncel veri döndür
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error("Roller getirme hatası:", error);
    return NextResponse.json({ error: t("roles.get.error") }, { status: 500 });
  }
}

// Yeni rol oluştur
export async function POST(request: NextRequest) {
  const t = await getTranslations("ApiMessages");
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: t("common.unauthorized") }, { status: 401 });
    }

    if (!currentUser.permissions.includes("roles.create")) {
      return NextResponse.json({ error: t("common.forbidden") }, { status: 403 });
    }
    
    const body = await request.json();
    const { name, displayName, description, color, layoutType, power } = body;

    if (!name || !displayName) {
      return NextResponse.json({ error: t("roles.create.missingFields") }, { status: 400 });
    }

    // Power değeri kontrolü
    if (typeof power !== 'number' || power < 0) {
        return NextResponse.json({ error: t("roles.create.invalidPower") }, { status: 400 });
    }
    
    // Hiyerarşi kontrolü: super_admin hariç kimse kendinden güçlü veya eşit rol oluşturamaz
    if (currentUser.primaryRole !== 'super_admin') {
        if (typeof currentUser.power !== 'number' || power >= currentUser.power) {
            return NextResponse.json({ error: t("roles.create.powerTooHigh") }, { status: 403 });
        }
    }

    const existingRole = await prisma.authRole.findFirst({
      where: { OR: [{ name }, { displayName }] },
    });

    if (existingRole) {
      return NextResponse.json({ error: t("roles.create.roleExists") }, { status: 409 });
    }

    const newRole = await prisma.authRole.create({
      data: {
        name,
        displayName,
        description,
        color: color || '#64748b',
        layoutType: layoutType || 'customer',
        power,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
    });

    return NextResponse.json({ message: t("roles.create.success"), role: newRole }, { status: 201 });
  } catch (error) {
    console.error("Rol oluşturma hatası:", error);
    return NextResponse.json({ error: t("roles.create.error") }, { status: 500 });
  }
}
