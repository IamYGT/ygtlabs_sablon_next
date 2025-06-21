import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPasswordPbkdf2 } from "@/lib";
import { getCurrentUser } from "@/lib";

export async function POST(request: NextRequest) {
  try {
    // Yetki kontrolü - yeni permission sistemi
    const currentUser = await getCurrentUser(request);
    if (
      !currentUser ||
      !currentUser.permissions.includes("function.users.create")
    ) {
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
    }

    // Şifreyi PBKDF2 ile hash'le
    const hashedPassword = await hashPasswordPbkdf2(password);

    // Eğer rol belirtilmemişse varsayılan 'user' rolünü al
    let finalRoleId = cleanRoleId;
    if (!finalRoleId) {
      const defaultUserRole = await prisma.authRole.findFirst({
        where: { name: "user", isActive: true },
      });
      if (defaultUserRole) {
        finalRoleId = defaultUserRole.id;
      }
    }

    // Kullanıcıyı oluştur - her zaman bir rol ata
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
