import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Aktif hero slider'ları getir (public API)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    const sliders = await prisma.heroSlider.findMany({
      where: {
        isActive: true,
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
      },
    });

    return NextResponse.json(
      {
        sliders,
        count: sliders.length,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Public hero slider fetch error:", error);
    return NextResponse.json(
      { error: "Hero slider'lar getirilemedi" },
      { status: 500 }
    );
  }
}
