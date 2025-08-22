import { AUTH_COOKIE_NAME, getCurrentUser } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const sessionToken = request.cookies.get("ecu_session")?.value;
    const user = await getCurrentUser(request);

    if (!user) {
      // Session token varsa ama user yoksa, cookie'yi temizle
      const response = NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

      if (sessionToken) {
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

    const duration = Date.now() - startTime;
    const response = NextResponse.json({ user });
    response.headers.set("X-Response-Time", `${duration}ms`);
    return response;
  } catch (error) {
    console.error("Current user API error:", error);
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
