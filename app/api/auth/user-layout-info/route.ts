import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session-utils";

export async function GET(_request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
    }

    const layoutInfo = {
      hasAdminAccess:
        currentUser.permissions?.includes("layout.admin.access") || false,
      hasUserAccess:
        currentUser.permissions?.includes("layout.user.access") || false,
      permissions: currentUser.permissions || [],
    };

    return NextResponse.json(layoutInfo);
  } catch (error) {
    console.error("Layout info error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
