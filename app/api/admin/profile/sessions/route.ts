import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-utils";

// Sessions API - Updated for custom session management
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: currentUser.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        isActive: true,
        expires: {
          gt: new Date(),
        },
      },
      orderBy: {
        lastActive: "desc",
      },
    });

    // Get current session token from cookies
    const cookies = request.headers.get("cookie") || "";
    const currentSessionToken = cookies
      .split(";")
      .find((c) => c.trim().startsWith("ecu_session="))
      ?.split("=")[1];

    const formattedSessions = sessions.map((sess) => ({
      id: sess.id,
      deviceInfo: sess.userAgent || "Unknown Device",
      ipAddress: sess.ipAddress || "Unknown IP",
      location: sess.location || "Unknown Location",
      lastActive: sess.lastActive.toISOString(),
      isActive: sess.isActive,
      isCurrent: sess.sessionToken === currentSessionToken,
    }));

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error("Sessions fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
