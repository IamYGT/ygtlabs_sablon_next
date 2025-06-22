import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, prisma } from "@/lib";

// Tüm yetkileri getir
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Yetki kontrolü - view./admin/permissions.view yetkisi gerekli
    const hasPermission = currentUser.permissions.includes(
      "view./admin/permissions.view"
    );

    if (!hasPermission) {
      return NextResponse.json(
        { error: "Bu işlem için gerekli yetkiye sahip değilsiniz" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "1000");
    const search = searchParams.get("search");

    // Yeni Permission tablosundan yetkileri getir
    const permissions = await prisma.permission.findMany({
      where: {
        isActive: true,
        ...(category && { category }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { resourcePath: { contains: search, mode: "insensitive" } },
            { action: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: [
        { category: "asc" },
        { resourcePath: "asc" },
        { action: "asc" },
      ],
    });

    // Format permissions for frontend compatibility
    const formattedPermissions = permissions.map((perm) => ({
      id: perm.id,
      name: perm.name,
      category: perm.category,
      resourcePath: perm.resourcePath,
      action: perm.action,
      permissionType: perm.permissionType,
      displayName: perm.displayName
        ? typeof perm.displayName === "string"
          ? JSON.parse(perm.displayName)?.tr || perm.displayName
          : (perm.displayName as Record<string, string>)?.tr ||
            "Unknown Permission"
        : `${perm.category}:${perm.resourcePath}:${perm.action}`,
      description: perm.description
        ? typeof perm.description === "string"
          ? JSON.parse(perm.description)?.tr || perm.description
          : (perm.description as Record<string, string>)?.tr ||
            "Unknown Description"
        : `${perm.category} ${perm.action} yetkisi`,
      isActive: perm.isActive,
      createdAt: perm.createdAt,
      updatedAt: perm.updatedAt,
    }));

    // Kategoriye göre grupla
    const categorizedPermissions = formattedPermissions.reduce((acc, perm) => {
      const category = perm.category || "general";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(perm);
      return acc;
    }, {} as Record<string, typeof formattedPermissions>);

    // İstatistikler
    const stats = await prisma.permission.groupBy({
      by: ["category"],
      _count: {
        id: true,
      },
      where: { isActive: true },
    });

    return NextResponse.json({
      permissions: formattedPermissions,
      categorizedPermissions,
      stats,
      pagination: {
        page,
        limit,
        totalCount: formattedPermissions.length,
        totalPages: Math.ceil(formattedPermissions.length / limit),
      },
    });
  } catch (error) {
    console.error("Yetkiler getirme hatası:", error);
    return NextResponse.json(
      { error: "Yetkiler getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yeni yetki oluştur
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Yetki kontrolü - function.permissions.create yetkisi gerekli
    const hasPermission = currentUser.permissions.includes(
      "function.permissions.create"
    );

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

    // Validasyon
    if (!name || !category || !resourcePath || !action) {
      return NextResponse.json(
        { error: "name, category, resourcePath ve action alanları zorunludur" },
        { status: 400 }
      );
    }

    // Aynı isimde permission var mı kontrol et
    const existingPermission = await prisma.permission.findUnique({
      where: { name },
    });

    if (existingPermission) {
      return NextResponse.json(
        { error: "Bu isimde bir yetki zaten mevcut" },
        { status: 400 }
      );
    }

    // Yeni permission oluştur
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
