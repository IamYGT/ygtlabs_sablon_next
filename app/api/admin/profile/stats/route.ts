import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-utils";

// Profile stats API
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: currentUser.email },
      include: {
        UserStats: true,
        sessions: {
          where: {
            isActive: true,
            expires: {
              gt: new Date(),
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate account age in days
    const accountAge = Math.floor(
      (new Date().getTime() - new Date(user.createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const stats = {
      totalLogins: user.UserStats?.totalLogins || 0,
      accountAge,
      activeSessions: user.sessions.length,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
