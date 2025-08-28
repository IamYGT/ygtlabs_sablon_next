import {
  canEditUser,
  getCurrentUser,
  hashPasswordPbkdf2,
} from "@/lib";
import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

// Kullanıcı güncelleme işlemi için PUT metodu
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    // Yetki kontrolü - users.update yetkisi gerekli
    if (!currentUser.permissions.includes("users.update")) {
      return NextResponse.json(
        {
          error: "Bu işlem için gerekli yetkiye sahip değilsiniz",
        },
        { status: 403 }
      );
    }

    const { id, name, email, password, roleId, isActive, profileImage } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Kullanıcı ID'si gereklidir" },
        { status: 400 }
      );
    }

    // Güvenlik kontrolü: Kullanıcının hedef kullanıcıyı düzenleyip düzenleyemeyeceğini kontrol et
    const targetUserData = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!targetUserData) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // SimpleUser formatına dönüştür
    const targetUser = {
      id: targetUserData.id,
      name: targetUserData.name,
      email: targetUserData.email,
      profileImage: targetUserData.profileImage,
      isActive: targetUserData.isActive,
      roleId: targetUserData.roleId,
      roleAssignedAt: targetUserData.roleAssignedAt,
      permissions: [], // Permissions gerekirse yüklenebilir
      userRoles: targetUserData.role ? [targetUserData.role.name] : [],
      primaryRole: targetUserData.role?.name,
      createdAt: targetUserData.createdAt,
      lastLoginAt: targetUserData.lastLoginAt,
    };

    const canEdit = await canEditUser(currentUser, targetUser);
    if (!canEdit) {
      return NextResponse.json(
        { error: "Bu kullanıcıyı düzenleme yetkiniz yok" },
        { status: 403 }
      );
    }

    const updateData: {
      name?: string;
      email?: string;
      password?: string;
      isActive?: boolean;
      roleId?: string | null;
      roleAssignedAt?: Date | null;
      roleAssignedById?: string | null;
      profileImage?: string | null;
      tokenVersion?: { increment: number };
    } = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (profileImage !== undefined) updateData.profileImage = profileImage;

    // Eğer yeni bir şifre gönderildiyse, hash'le
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Yeni şifre en az 6 karakter olmalıdır" },
          { status: 400 }
        );
      }
      updateData.password = await hashPasswordPbkdf2(password);
      // Şifre değiştiğinde token'ları geçersiz kıl
      updateData.tokenVersion = { increment: 1 };
    }

    // E-posta benzersizliğini kontrol et (kendisi hariç)
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id },
        },
      });
      if (existingUser) {
        return NextResponse.json(
          {
            error:
              "Bu e-posta zaten başka bir kullanıcı tarafından kullanılıyor",
          },
          { status: 409 }
        );
      }
    }

    // Tek rol sistemi: Rol güncelleme
    if (roleId !== undefined) {
      // Rol atama permission kontrolü

      if (roleId === null || roleId === "") {
        // Rolü kaldır - Rol kaldırma için de yetki kontrolü
        const hasRoleAssignPermission = 
          currentUser.permissions.includes("admin.roles.assign") || 
          currentUser.permissions.includes("roles.assign") ||
          currentUser.primaryRole === "super_admin";
        
        if (!hasRoleAssignPermission) {
          return NextResponse.json(
            { error: "Rol atama/kaldırma yetkiniz bulunmamaktadır" },
            { status: 403 }
          );
        }
        
        // Super admin can remove any role
        if (currentUser.primaryRole !== "super_admin" && targetUser.primaryRole) {
          // Hedef kullanıcının rolü super_admin ise kaldırılamaz
          if(targetUser.primaryRole === "super_admin") {
            return NextResponse.json(
              { error: "super_admin rolünü sadece başka bir super_admin kaldırabilir." },
              { status: 403 }
            );
          }
        }
        
        updateData.roleId = null;
        updateData.roleAssignedAt = null;
        updateData.roleAssignedById = null;
      } else {
        // Yeni rol ata - önce rolün var olduğunu ve atanabilir olduğunu kontrol et
        const role = await prisma.authRole.findFirst({
          where: { id: roleId, isActive: true },
        });

        if (!role) {
          return NextResponse.json(
            { error: "Geçersiz rol ID'si" },
            { status: 400 }
          );
        }

        // Rol atama yetkisi kontrolü
        const hasRoleAssignPermission =
          currentUser.permissions.includes("admin.roles.assign") ||
          currentUser.permissions.includes("roles.assign") ||
          currentUser.primaryRole === "super_admin";

        if (!hasRoleAssignPermission) {
          return NextResponse.json(
            { error: "Rol atama yetkiniz bulunmamaktadır" },
            { status: 403 }
          );
        }

        // Super admin her rolü atayabilir, diğerleri için yetki sayısı kontrolü
        if (currentUser.primaryRole !== "super_admin") {
            const targetRolePermissionCount = await prisma.roleHasPermission.count({
                where: { roleName: role.name, isActive: true, isAllowed: true },
            });

            if (currentUser.permissions.length <= targetRolePermissionCount) {
                return NextResponse.json(
                    { error: "Bu rolü atamak için yeterli yetkiniz yok." },
                    { status: 403 }
                );
            }
        }
        
        updateData.roleId = roleId;
        updateData.roleAssignedAt = new Date();
        updateData.roleAssignedById = currentUser.id;
      }
    }

    // Kullanıcıyı güncelle
    await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Kullanıcı güncellendi - client-side refresh'i tetikleyebilir

    return NextResponse.json({
      success: true,
      message: "Kullanıcı başarıyla güncellendi",
    });
  } catch (error) {
    console.error("Kullanıcı güncelleme hatası:", error);
    if (error instanceof Error && error.message.includes("does not exist")) {
      return NextResponse.json(
        { error: "Güncellenmek istenen kullanıcı bulunamadı" },
        { status: 404 }
      );
    }
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

