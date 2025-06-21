import { NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/lib";
import { prisma } from "@/lib/prisma";
import { hashPasswordPbkdf2 } from "@/lib";

export async function GET(_request: Request) {
  const user = await getCurrentUser();

  // Oturum yoksa veya kullanıcı admin değilse yetkisiz hatası döndür
  if (!user || !(await hasPermission(user, "users.list"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Tüm kullanıcıları veritabanından çek, şifreyi hariç tut
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Yönetici tarafından kullanıcı eklemek için POST handler
export async function POST(req: Request) {
  const user = await getCurrentUser();

  // Yetkilendirme kontrolü: Sadece Admin'ler ekleyebilir
  if (!user || !(await hasPermission(user, "users.create"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, password } = await req.json();

    // Gerekli alanları kontrol et
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ve şifre alanları zorunludur." },
        { status: 400 }
      );
    }

    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi giriniz." },
        { status: 400 }
      );
    }

    // Şifre uzunluğunu kontrol et
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    // E-posta adresi zaten kullanılıyor mu kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Bu e-posta adresi zaten kullanılıyor." },
        { status: 409 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await hashPasswordPbkdf2(password);

    // Yeni kullanıcı oluştur
    const newUser = await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
      },
    });

    // Hassas bilgileri (şifre) yanıttan çıkar
    const { password: _, ...safeUser } = newUser;

    return NextResponse.json(safeUser, { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
