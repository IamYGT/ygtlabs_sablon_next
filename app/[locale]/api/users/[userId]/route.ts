import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/lib";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { hashPasswordPbkdf2 } from "@/lib";

// Tip güvenliği için beklenen istek gövdesi
interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const user = await getCurrentUser();
  const { userId: userIdToUpdate } = await params;

  // 1. Yetki Kontrolü: Sadece giriş yapmış adminler bu işlemi yapabilir
  if (!user || !(await hasPermission(user, "users.edit"))) {
    return NextResponse.json({ message: "Yetkisiz Erişim" }, { status: 403 });
  }

  // Kendi hesabını düzenlemesini engelle (opsiyonel ama önerilir)
  if (user.id === userIdToUpdate) {
    return NextResponse.json(
      { message: "Kendi hesabınızı buradan düzenleyemezsiniz." },
      { status: 400 }
    );
  }

  try {
    const body: UpdateUserPayload = await request.json();
    const { name, email, password } = body;

    // 2. Veri Doğrulama: En az bir alan güncellenmeli
    if (name === undefined && email === undefined && password === undefined) {
      return NextResponse.json(
        { message: "Güncellenecek bir alan belirtilmedi." },
        { status: 400 }
      );
    }

    // name kontrolü
    if (name !== undefined && name.trim().length === 0) {
      return NextResponse.json(
        { message: "İsim boş olamaz." },
        { status: 400 }
      );
    }

    // email kontrolü
    if (email !== undefined) {
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { message: "Geçersiz email formatı." },
          { status: 400 }
        );
      }
      // Email benzersizliği
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id: userIdToUpdate } },
        select: { id: true },
      });
      if (existing) {
        return NextResponse.json(
          { message: "Bu email başka bir kullanıcıya ait." },
          { status: 400 }
        );
      }
    }

    // Şifre kontrolü (isteğe bağlı ama önerilir - frontend zaten yapıyor)
    if (password !== undefined && password.length < 6) {
      return NextResponse.json(
        { message: "Yeni şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    // 3. Veritabanı Güncelleme
    const dataToUpdate: Prisma.UserUpdateInput = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (email !== undefined) dataToUpdate.email = email;

    // Eğer yeni şifre gönderildiyse hash'le ve güncelleme verisine ekle
    if (password !== undefined) {
      const hashedPassword = await hashPasswordPbkdf2(password);
      dataToUpdate.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userIdToUpdate },
      data: dataToUpdate,
      select: {
        // Sadece güncellenen ve gerekli alanları döndür
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(`Kullanıcı ${userIdToUpdate} güncelleme hatası:`, error);

    // Tip kontrolü ekle
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Kullanıcı bulunamadı hatası (P2025)
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Güncellenecek kullanıcı bulunamadı." },
          { status: 404 }
        );
      }
    } else if (error instanceof Error) {
      // Diğer genel Error tipleri için mesajı kullan
      return NextResponse.json(
        { message: error.message || "Bir hata oluştu." },
        { status: 500 }
      );
    }

    // Bilinmeyen hata türü
    return NextResponse.json(
      { message: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const user = await getCurrentUser();
  const { userId: userIdToDelete } = await params;

  // 1. Yetki Kontrolü: Sadece giriş yapmış adminler bu işlemi yapabilir
  if (!user || !(await hasPermission(user, "users.delete"))) {
    return NextResponse.json({ message: "Yetkisiz Erişim" }, { status: 403 });
  }

  // 2. Kendi Hesabını Silme Engeli
  if (user.id === userIdToDelete) {
    return NextResponse.json(
      { message: "Kendi hesabınızı silemezsiniz." },
      { status: 400 }
    );
  }

  try {
    // 3. Veritabanından Silme
    await prisma.user.delete({
      where: { id: userIdToDelete },
    });

    // Başarılı silme sonrası genelde 204 No Content veya bir mesaj döndürülür
    return NextResponse.json(
      { message: "Kullanıcı başarıyla silindi." },
      { status: 200 } // Veya 204 kullanılıp body gönderilmez
    );
  } catch (error) {
    console.error(`Kullanıcı ${userIdToDelete} silme hatası:`, error);

    // Tip kontrolü ekle
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Kullanıcı bulunamadı hatası (P2025)
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "Silinecek kullanıcı bulunamadı." },
          { status: 404 }
        );
      }
    } else if (error instanceof Error) {
      // Diğer genel Error tipleri için mesajı kullan
      return NextResponse.json(
        { message: error.message || "Bir hata oluştu." },
        { status: 500 }
      );
    }

    // Bilinmeyen hata türü
    return NextResponse.json(
      { message: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
