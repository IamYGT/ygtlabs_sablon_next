import { getCurrentUser } from "@/lib";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check permission - yeni permission sistemi
    if (!currentUser.permissions.includes("admin.users.view")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    // Get users with their single role
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          role: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        roles: user.role
          ? [
              {
                id: user.role.id,
                name: user.role.name,
                displayName: user.role.displayName,
              },
            ]
          : [],
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
