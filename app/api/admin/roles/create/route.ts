import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib";

export async function POST(request: NextRequest) {
  try {
    // Kimlik doğrulama ve yetki kontrolü
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Yetki kontrolü - function.roles.create yetkisi gerekli
    if (!currentUser.permissions.includes("function.roles.create")) {
      return NextResponse.json(
        { error: "Bu işlem için gerekli yetkiye sahip değilsiniz" },
        { status: 403 }
      );
    }

    const {
      name,
      displayName,
      description,
      color,
      layoutType,
      permissions = [],
    } = await request.json();

    // Validasyonlar
    if (!name || !displayName) {
      return NextResponse.json(
        { error: "Rol adı ve görünen ad zorunludur" },
        { status: 400 }
      );
    }

    if (displayName.length < 2) {
      return NextResponse.json(
        { error: "Rol adı en az 2 karakter olmalıdır" },
        { status: 400 }
      );
    }

    if (!["admin", "user"].includes(layoutType)) {
      return NextResponse.json(
        { error: "Geçerli layout tipi gereklidir (admin veya user)" },
        { status: 400 }
      );
    }

    // Rol adı çakışması kontrolü
    const existingRole = await prisma.authRole.findFirst({
      where: {
        OR: [{ name: name }, { displayName: displayName }],
      },
    });

    if (existingRole) {
      return NextResponse.json(
        { error: "Bu rol adı veya görünen ad zaten kullanılıyor" },
        { status: 400 }
      );
    }

    // Rolü oluştur
    const newRole = await prisma.authRole.create({
      data: {
        name,
        displayName,
        description: description || null,
        color: color || "#6366f1",
        layoutType,
        isSystemDefault: false,
        isActive: true,
        createdById: currentUser.id,
      },
    });

    // Seçilen yetkileri veritabanından al (ID'ler UUID formatında)
    const permissionsToAdd: string[] = [];

    if (permissions.length > 0) {
      // Permission ID'lerini kullanarak veritabanından permission name'lerini al
      const permissionRecords = await prisma.permission.findMany({
        where: {
          id: {
            in: permissions
          }
        },
        select: {
          category: true,
          resourcePath: true,
          action: true
        }
      });

      // Permission name'lerini oluştur
      for (const permission of permissionRecords) {
        const permissionName = `${permission.category}.${permission.resourcePath}.${permission.action}`;
        permissionsToAdd.push(permissionName);
      }
    }

    // Layout tipine göre otomatik yetki ekleme
    if (layoutType === "admin") {
      // Admin layout seçilmişse layout.admin.access yetkisini otomatik ekle (eğer zaten seçilmemişse)
      const adminAccessPermission = "layout.admin.access";
      if (!permissionsToAdd.includes(adminAccessPermission)) {
        permissionsToAdd.push(adminAccessPermission);
      }
    } else if (layoutType === "user") {
      // User layout seçilmişse layout.user.access yetkisini otomatik ekle (eğer zaten seçilmemişse)
      const userAccessPermission = "layout.user.access";
      if (!permissionsToAdd.includes(userAccessPermission)) {
        permissionsToAdd.push(userAccessPermission);
      }
    }

    // Yetkileri toplu olarak ekle
    if (permissionsToAdd.length > 0) {
      await prisma.roleHasPermission.createMany({
        data: permissionsToAdd.map((permissionName: string) => ({
          roleName: name,
          permissionName: permissionName,
          isAllowed: true,
          grantedById: currentUser.id,
        })),
      });
    }

    return NextResponse.json({
      message: "Rol başarıyla oluşturuldu",
      role: newRole,
    });
  } catch (error) {
    console.error("Rol oluşturma hatası:", error);
    return NextResponse.json(
      { error: "Rol oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}
