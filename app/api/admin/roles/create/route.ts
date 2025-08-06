import { getCurrentUser } from "@/lib";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const t = await getTranslations("ApiMessages");

  try {
    // Kimlik doğrulama ve yetki kontrolü
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json(
        { error: t("common.unauthorized") },
        { status: 401 }
      );
    }

    // Yetki kontrolü - roles.create yetkisi gerekli
    if (!currentUser.permissions.includes("roles.create")) {
      return NextResponse.json(
        { error: t("common.forbidden") },
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
        { error: t("roles.create.nameRequired") },
        { status: 400 }
      );
    }

    if (displayName.length < 2) {
      return NextResponse.json(
        { error: t("roles.create.nameMinLength") },
        { status: 400 }
      );
    }

    if (!["admin", "user"].includes(layoutType)) {
      return NextResponse.json(
        { error: t("roles.create.invalidLayout") },
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
        { error: t("roles.create.nameConflict") },
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

    // Seçilen yetkileri ve potansiyel layout yetkilerini topla
    const permissionsToAdd = new Set<string>();

    if (permissions.length > 0) {
      const permissionRecords = await prisma.permission.findMany({
        where: {
          id: {
            in: permissions,
          },
        },
        select: {
          name: true,
        },
      });
      permissionRecords.forEach((p) => permissionsToAdd.add(p.name));
    }

    // Layout tipine göre otomatik yetki ekleme (VERİTABANI KONTROLÜ İLE)
    const layoutPermissionName =
      layoutType === "admin" ? "admin.layout" : "user.layout";

    // Layout yetkisinin veritabanında var olup olmadığını kontrol et
    const layoutPermissionExists = await prisma.permission.findUnique({
      where: { name: layoutPermissionName },
    });

    if (layoutPermissionExists) {
      permissionsToAdd.add(layoutPermissionName);
    } else {
      // Bu kritik bir konfigürasyon hatasıdır. Loglanmalı.
      console.warn(
        `[Role Create] DİKKAT: Otomatik eklenmesi gereken '${layoutPermissionName}' yetkisi veritabanında bulunamadı ve role eklenemedi.`
      );
    }

    // Yetkileri toplu olarak ekle
    const permissionsArray = Array.from(permissionsToAdd);
    if (permissionsArray.length > 0) {
      await prisma.roleHasPermission.createMany({
        data: permissionsArray.map((permissionName: string) => ({
          roleName: name,
          permissionName: permissionName,
          isAllowed: true,
          grantedById: currentUser.id,
        })),
        skipDuplicates: true, // Olası çakışmaları önle
      });
    }

    return NextResponse.json({
      message: t("roles.create.success"),
      role: newRole,
    });
  } catch (error) {
    console.error("Rol oluşturma hatası:", error);
    return NextResponse.json(
      { error: t("roles.create.error") },
      { status: 500 }
    );
  }
}
