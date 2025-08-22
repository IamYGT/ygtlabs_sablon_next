import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if session belongs to user
    const sessionToDelete = await prisma.session.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!sessionToDelete) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get current session token from cookies
    const cookies = request.headers.get("cookie") || "";
    const currentSessionToken = cookies
      .split(";")
      .find((c) => c.trim().startsWith("ecu_session="))
      ?.split("=")[1];

    // Prevent deleting current session
    if (sessionToDelete.sessionToken === currentSessionToken) {
      return NextResponse.json(
        { error: "Cannot delete current session" },
        { status: 400 }
      );
    }

    // Mark session as inactive
    await prisma.session.update({
      where: { id },
      data: {
        isActive: false,
        revokedAt: new Date(),
        revokedBy: user.id,
        revokedReason: "User terminated",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Session terminated successfully",
    });
  } catch (error) {
    console.error("Session termination error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
