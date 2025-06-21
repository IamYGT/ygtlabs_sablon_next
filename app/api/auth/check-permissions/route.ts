import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserFromToken } from "@/lib/session-utils";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const authorization = headersList.get("authorization") || "";
    const currentUser = await getCurrentUserFromToken(authorization);

    if (!currentUser) {
      return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await request.json();
    const { permissions } = body;

    if (!permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: "Geçersiz izin listesi" },
        { status: 400 }
      );
    }

    // Her bir izin için kontrol yap
    const results: { [key: string]: boolean } = {};

    for (const permission of permissions) {
      results[permission] = currentUser.permissions.some(
        (userPerm) =>
          userPerm.includes(permission) || userPerm.includes("admin")
      );
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
    console.error("İzin kontrolü hatası:", error);
    return NextResponse.json(
      { error: "İzin kontrolü sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
