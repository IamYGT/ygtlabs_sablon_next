import type { UserWithPermissions } from "@/lib/permissions";
import { withPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return withPermission(
    "about.create",
    async (req: NextRequest, user: UserWithPermissions) => {
      try {
        const existingAbout = await prisma.about.findFirst();
        if (existingAbout) {
          return new NextResponse("About content already exists", {
            status: 409,
          });
        }

        const body = await req.json();
        const { about, mission, vision, roadmap } = body;

        const newAbout = await prisma.about.create({
          data: {
            about,
            mission,
            vision,
            roadmap,
            createdById: user.id,
          },
        });

        return NextResponse.json(newAbout, { status: 201 });
      } catch (error) {
        console.error("Error creating about data", error);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    }
  )(request);
}

export async function GET(request: NextRequest) {
  return withPermission("admin.about.view", async () => {
    try {
      const about = await prisma.about.findFirst();
      return NextResponse.json({ about });
    } catch (error) {
      console.error("Error fetching about data", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  })(request);
}
