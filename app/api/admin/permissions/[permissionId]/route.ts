import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, prisma } from "@/lib";

// Tek yetki getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ permissionId: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Yetki kontrolü - view./admin/permissions.view yetkisi gerekli
    if (!currentUser.permissions.includes("view./admin/permissions.view")) {
      return NextResponse.json(
        { error: "Bu işlem için gerekli yetkiye sahip değilsiniz" },
        { status: 403 }
      );
    }

    const { permissionId } = await params;
    const permission = await prisma.permission.findUnique({
      where: { id: permissionId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!permission) {
      return NextResponse.json({ error: "Yetki bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ permission });
  } catch (error) {
    console.error("Yetki getirme hatası:", error);
    return NextResponse.json(
      { error: "Yetki getirilirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yetki güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ permissionId: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Yetki kontrolü - function.permissions.edit yetkisi gerekli
    if (!currentUser.permissions.includes("function.permissions.edit")) {
      return NextResponse.json(
        { error: "Bu işlem için yetki düzenleme yetkisi gereklidir" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { displayName, description, category, resourcePath, action, permissionType, isActive } = body;

    const { permissionId } = await params;

    // Mevcut yetkiyi kontrol et
    const existingPermission = await prisma.permission.findUnique({
      where: { id: permissionId },
    });

    if (!existingPermission) {
      return NextResponse.json({ error: "Yetki bulunamadı" }, { status: 404 });
    }

    // Permission type kontrolü - admin tipindeki yetkiler sadece admin permission type'ı olan kullanıcılar düzenleyebilir
    if (existingPermission.permissionType === "admin") {
      const hasAdminPermissions = currentUser.permissions.some(
        (p) =>
          p.startsWith("layout.admin.") ||
          p.startsWith("function.") ||
          p.startsWith("view./admin/")
      );
      if (!hasAdminPermissions) {
        return NextResponse.json(
          {
            error:
              "Admin tipindeki yetkileri düzenlemek için admin yetkilerine sahip olmanız gerekir",
          },
          { status: 403 }
        );
      }
    }

    // Yetki güncelle
    const updatedPermission = await prisma.permission.update({
      where: { id: permissionId },
      data: {
        displayName: displayName ? JSON.stringify(displayName) : undefined,
        description: description ? JSON.stringify(description) : undefined,
        category,
        resourcePath,
        action,
        ...(permissionType && { permissionType }),
        isActive,
        updatedById: currentUser.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      permission: updatedPermission,
      message: "Yetki başarıyla güncellendi",
    });
  } catch (error) {
    console.error("Yetki güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Yetki güncellenirken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// Yetki sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ permissionId: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Yetki kontrolü - function.permissions.delete yetkisi gerekli
    if (!currentUser.permissions.includes("function.permissions.delete")) {
      return NextResponse.json(
        { error: "Bu işlem için yetki silme yetkisi gereklidir" },
        { status: 403 }
      );
    }

    const { permissionId } = await params;

    // Mevcut yetkiyi kontrol et
    const existingPermission = await prisma.permission.findUnique({
      where: { id: permissionId },
    });

    if (!existingPermission) {
      return NextResponse.json({ error: "Yetki bulunamadı" }, { status: 404 });
    }

    // Permission type kontrolü - admin tipindeki yetkiler sadece admin permission type'ı olan kullanıcılar silebilir
    if (existingPermission.permissionType === "admin") {
      const hasAdminPermissions = currentUser.permissions.some(
        (p) =>
          p.startsWith("layout.admin.") ||
          p.startsWith("function.") ||
          p.startsWith("view./admin/")
      );
      if (!hasAdminPermissions) {
        return NextResponse.json(
          {
            error:
              "Admin tipindeki yetkileri silmek için admin yetkilerine sahip olmanız gerekir",
          },
          { status: 403 }
        );
      }
    }

    // İlişkili RoleHasPermission kayıtlarını sil
    await prisma.roleHasPermission.deleteMany({
      where: { permissionName: existingPermission.name },
    });

    // Yetki sil
    await prisma.permission.delete({
      where: { id: permissionId },
    });

    return NextResponse.json({
      message: "Yetki başarıyla silindi",
    });
  } catch (error) {
    console.error("Yetki silme hatası:", error);
    return NextResponse.json(
      { error: "Yetki silinirken bir hata oluştu" },
      { status: 500 }
    );
  }
} 