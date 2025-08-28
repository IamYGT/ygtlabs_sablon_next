import { getCurrentUser, hashPasswordPbkdf2 } from "@/lib";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Yetki kontrolü - yeni permission sistemi
    const currentUser = await getCurrentUser(request);

    if (!currentUser || !currentUser.permissions.includes("users.create")) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });
    }

    const { name, email, password, roleId, isActive, profileImage } =
      await request.json();

    // Temel alanların validasyonu (roller hariç)
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "İsim, e-posta ve şifre alanları gereklidir" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      );
    }

    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta zaten kullanılıyor" },
        { status: 409 }
      );
    }

    // Rol ID'sini temizle ve doğrula
    const cleanRoleId = roleId ? String(roleId).trim() : null;

    let finalRoleId = null;

    // Rolün varlığını ve aktifliğini kontrol et, eğer roleId gönderilmişse
    if (cleanRoleId) {
      const validRole = await prisma.authRole.findFirst({
        where: {
          id: cleanRoleId,
          isActive: true,
        },
      });

      if (!validRole) {
        return NextResponse.json(
          { error: "Geçersiz veya pasif rol ID'si" },
          { status: 400 }
        );
      }

      // Super admin can assign any role, otherwise check permission count
      if (currentUser.primaryRole !== "super_admin") {
        const targetRolePermissionCount = await prisma.roleHasPermission.count({
          where: { roleName: validRole.name, isActive: true, isAllowed: true },
        });

        if (currentUser.permissions.length <= targetRolePermissionCount) {
          return NextResponse.json(
            { error: "Bu rolü atamak için yeterli yetkiniz yok." },
            { status: 403 }
          );
        }
      }
      finalRoleId = validRole.id;
    }

    // Şifreyi PBKDF2 ile hash'le
    const hashedPassword = await hashPasswordPbkdf2(password);

    // Eğer rol belirtilmemişse varsayılan 'user' rolünü ata (eğer yetki varsa)
    if (!finalRoleId) {
      // `roles.assign` kontrolü burada da gereksiz.
      // Eğer kullanıcı `users.create` yetkisine sahipse,
      // varsayılan rolü atayabilmelidir.
      const defaultUserRole = await prisma.authRole.findFirst({
        where: { name: "user", isActive: true },
      });
      if (defaultUserRole) {
        finalRoleId = defaultUserRole.id;
      }
    }

    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActive: isActive ?? true,
        profileImage: profileImage || null,
        ...(finalRoleId && {
          roleId: finalRoleId,
          roleAssignedAt: new Date(),
          roleAssignedById: currentUser.id,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Kullanıcı başarıyla oluşturuldu",
      userId: user.id,
    });
  } catch (error) {
    console.error("Kullanıcı oluşturma hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
