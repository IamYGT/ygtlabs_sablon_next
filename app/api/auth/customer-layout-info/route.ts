import { getCurrentUser } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
    }

    const layoutInfo = {
      hasAdminAccess:
        currentUser.permissions?.includes("admin.layout") || false,
      hasCustomerAccess: currentUser.permissions?.includes("customer.layout") || false,
      permissions: currentUser.permissions || [],
    };

    return NextResponse.json(layoutInfo);
  } catch (error) {
    console.error("Layout info error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
