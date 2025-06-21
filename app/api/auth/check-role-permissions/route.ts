import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session-utils";

export async function POST(request: NextRequest) {
  try {
    // Cookie'den kullanıcıyı al (HttpOnly cookie kullanımı)
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { roleNames } = body;

    if (!roleNames || !Array.isArray(roleNames)) {
      return NextResponse.json(
        { error: "Geçersiz rol listesi" },
        { status: 400 }
      );
    }

    // Dinamik rol yetki kontrolü
    const results: { [key: string]: boolean } = {};

    for (const roleName of roleNames) {
      // Bu kullanıcının bu rolü atayabileceğini kontrol et
      // Admin yetkisi veya yüksek priority kontrolü
      const canManageRole = currentUser.permissions.some(
        (p) => p.includes("role.assign") || p.includes("admin")
      );

      results[roleName] = canManageRole;
    }

    return NextResponse.json({
      user: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      },
      results,
    });
  } catch (error) {
    console.error("Rol yetki kontrolü hatası:", error);
    return NextResponse.json(
      { error: "Rol yetki kontrolü sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
