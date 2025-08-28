import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Public endpoint for landing page hero sliders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "1");
    const isActive = searchParams.get("isActive") !== "false"; // Default to true

    const sliders = await prisma.heroSlider.findMany({
      where: {
        isActive: isActive,
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take: limit,
      select: {
        id: true,
        title: true,
        subtitle: true,
        description: true,
        badge: true,
        backgroundImage: true,
        primaryButton: true,
        secondaryButton: true,
        statistics: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        sliders,
        total: sliders.length,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=300", // Cache for 5 minutes
        },
      }
    );
  } catch (error) {
    console.error("Public hero slider fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch hero sliders",
        sliders: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}
