import { createPermissionChecker } from "@/lib/permissions/helpers";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session-utils";
import { NextRequest, NextResponse } from "next/server";

interface IParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: IParams) {
  try {
    // Session validation
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !currentUser.isActive) {
      return NextResponse.json(
        { error: "Unauthorized", code: "INVALID_SESSION" },
        { status: 401 }
      );
    }

    // UserWithPermissions formatına dönüştür
    const user = {
      id: currentUser.id,
      email: currentUser.email || "",
      primaryRole: currentUser.primaryRole || "user",
      permissions: currentUser.permissions || [],
      isActive: currentUser.isActive,
    };

    // Permission kontrolü
    const hasPermission = await createPermissionChecker("about.update")(user);
    if (!hasPermission) {
      return NextResponse.json(
        {
          error: "Forbidden",
          code: "INSUFFICIENT_PERMISSIONS",
          required: "about.update",
          user_permissions: user.permissions,
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { about, mission, vision, roadmap } = body;

    const updatedAbout = await prisma.about.update({
      where: { id },
      data: {
        about,
        mission,
        vision,
        roadmap,
        updatedById: user.id,
      },
    });

    return NextResponse.json(updatedAbout);
  } catch (error) {
    console.error("Error updating about data", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: IParams) {
  try {
    // Session validation
    const currentUser = await getCurrentUser(request);
    if (!currentUser || !currentUser.isActive) {
      return NextResponse.json(
        { error: "Unauthorized", code: "INVALID_SESSION" },
        { status: 401 }
      );
    }

    // UserWithPermissions formatına dönüştür
    const user = {
      id: currentUser.id,
      email: currentUser.email || "",
      primaryRole: currentUser.primaryRole || "user",
      permissions: currentUser.permissions || [],
      isActive: currentUser.isActive,
    };

    // Permission kontrolü
    const hasPermission = await createPermissionChecker("about.delete")(user);
    if (!hasPermission) {
      return NextResponse.json(
        {
          error: "Forbidden",
          code: "INSUFFICIENT_PERMISSIONS",
          required: "about.delete",
          user_permissions: user.permissions,
        },
        { status: 403 }
      );
    }

    const { id } = await params;
    await prisma.about.delete({
      where: { id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting about data", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
