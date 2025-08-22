import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, prisma } from "@/lib";

// POST /api/auth/logout
export async function POST(request: NextRequest) {
  try {

    // Request body'den logout türünü al
    const body = await request.json().catch(() => ({}));
    const { logoutAllSessions = false } = body;

    // Session token'ı al
    const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (sessionToken) {
      if (logoutAllSessions) {
        // Kullanıcının tüm session'larını deaktif et
        const session = await prisma.session.findFirst({
          where: { sessionToken, isActive: true },
        });

        if (session) {
          await prisma.session.updateMany({
            where: { userId: session.userId },
            data: { isActive: false },
          });
       
        }
      } else {
        // Sadece mevcut session'ı deaktif et
        await prisma.session.updateMany({
          where: { sessionToken },
          data: { isActive: false },
        });
   
      }
    }

    const message = logoutAllSessions
      ? "Tüm cihazlardan başarıyla çıkış yapıldı"
      : "Bu cihazdan başarıyla çıkış yapıldı";

   

    const response = NextResponse.json({
      success: true,
      message,
      logoutAllSessions,
    });

    // Agresif cookie temizleme - birden fazla yöntemle
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
      sameSite: "lax",
    });

    // Alternatif cookie temizleme yöntemleri
    response.cookies.delete(AUTH_COOKIE_NAME);

    // Geçmişe tarih vererek expire etme
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // 1970-01-01
      path: "/",
      sameSite: "lax",
    });


    return response;
  } catch (error) {
    console.error("❌ Logout error:", error);

    return NextResponse.json(
      { success: false, error: "Çıkış yaparken bir hata oluştu" },
      { status: 500 }
    );
  }
}

// OPTIONS /api/auth/logout - CORS support
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
