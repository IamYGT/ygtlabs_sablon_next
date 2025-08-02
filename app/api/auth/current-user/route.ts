import { AUTH_COOKIE_NAME, getCurrentUser } from "@/lib/session-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("ecu_session")?.value;
    console.log(`🔍 Current user check - Token exists: ${!!sessionToken}`);

    const user = await getCurrentUser(request);

    if (!user) {
      console.log("❌ No current user found or session invalid");

      // Session token varsa ama user yoksa, cookie'yi temizle
      const response = NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

      if (sessionToken) {
        console.log("🧹 Clearing invalid session cookie from API");

        // Agresif cookie temizleme
        response.cookies.set({
          name: AUTH_COOKIE_NAME,
          value: "",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 0,
          path: "/",
          sameSite: "lax",
        });

        // Alternatif temizleme yöntemleri
        response.cookies.delete(AUTH_COOKIE_NAME);

        response.cookies.set({
          name: AUTH_COOKIE_NAME,
          value: "",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expires: new Date(0),
          path: "/",
          sameSite: "lax",
        });
      }

      return response;
    }

    console.log(`✅ Current user found: ${user.email} (${user.id})`);
    console.log(
      `🔐 User permissions: ${user.permissions?.length || 0} permissions`
    );
    console.log(`👑 Primary role: ${user.primaryRole || "None"}`);
    console.log(`📋 User roles: ${user.userRoles?.join(", ") || "None"}`);

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Current user API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
