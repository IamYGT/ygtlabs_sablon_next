import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session-utils";

// GET - Tüm hero slider'ları listele
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isActive = searchParams.get("isActive");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (isActive !== null && isActive !== undefined && isActive !== "all") {
      where.isActive = isActive === "true";
    }

    const [sliders, totalCount] = await Promise.all([
      prisma.heroSlider.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          updatedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.heroSlider.count({ where }),
    ]);

    return NextResponse.json(
      {
        sliders,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Hero slider fetch error:", error);
    return NextResponse.json(
      { error: "Hero slider'lar getirilemedi" },
      { status: 500 }
    );
  }
}

// POST - Yeni hero slider oluştur
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      description,
      badge,
      backgroundImage,
      primaryButton,
      secondaryButton,
      statistics,
      isActive = true,
      order = 0,
    } = body;

    // Validasyon
    if (!title || !description || !backgroundImage || !primaryButton) {
      return NextResponse.json(
        { error: "Gerekli alanlar eksik" },
        { status: 400 }
      );
    }

    // Yeni slider oluştur
    const slider = await prisma.heroSlider.create({
      data: {
        title,
        subtitle,
        description,
        badge,
        backgroundImage,
        primaryButton,
        secondaryButton,
        statistics,
        isActive,
        order,
        createdById: currentUser.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Hero slider başarıyla oluşturuldu",
        slider,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Hero slider creation error:", error);
    return NextResponse.json(
      { error: "Hero slider oluşturulamadı" },
      { status: 500 }
    );
  }
}
