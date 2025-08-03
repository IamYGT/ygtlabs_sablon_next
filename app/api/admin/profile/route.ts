import { withPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/admin/profile - Kendi admin profilini getir
export const GET = withPermission(
  "admin.profile.view",
  async (_request, user) => {
    try {
      const userData = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!userData) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json(userData);
    } catch (error) {
      console.error("Profile fetch error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);

// PUT /api/admin/profile - Kendi admin profilini güncelle
export const PUT = withPermission(
  "admin.profile.update",
  async (request, user) => {
    try {
      const { name, email } = await request.json();

      // Validation
      if (!name || !email) {
        return NextResponse.json(
          { error: "Name and email are required" },
          { status: 400 }
        );
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }

      // Check if email is already taken by another user
      if (email !== user.email) {
        const existingUser = await prisma.user.findFirst({
          where: {
            email,
            NOT: { id: user.id },
          },
        });

        if (existingUser) {
          return NextResponse.json(
            { error: "Email already in use" },
            { status: 400 }
          );
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          email,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Profile update error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);
