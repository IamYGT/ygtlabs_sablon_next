import type { UserWithPermissions } from "@/lib/permissions";
import { withPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface IParams {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: IParams) {
  return withPermission(
    "about.update",
    async (req: NextRequest, user: UserWithPermissions) => {
      try {
        const { id } = params;
        const body = await req.json();
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
  )(request);
}

export async function DELETE(request: NextRequest, { params }: IParams) {
  return withPermission("about.delete", async () => {
    try {
      const { id } = params;
      await prisma.about.delete({
        where: { id },
      });
      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error("Error deleting about data", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  })(request);
}
