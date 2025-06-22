import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session-utils";

// GET - Tek hero slider getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slider = await prisma.heroSlider.findUnique({
      where: { id },
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
    });

    if (!slider) {
      return NextResponse.json(
        { error: "Hero slider bulunamadı" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { slider },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Hero slider fetch error:", error);
    return NextResponse.json(
      { error: "Hero slider getirilemedi" },
      { status: 500 }
    );
  }
}

// PUT - Hero slider güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      isActive,
      order,
    } = body;

    // Mevcut slider'ı kontrol et
    const existingSlider = await prisma.heroSlider.findUnique({
      where: { id },
    });

    if (!existingSlider) {
      return NextResponse.json(
        { error: "Hero slider bulunamadı" },
        { status: 404 }
      );
    }

    // Güncelleme verilerini hazırla
    const updateData: Record<string, unknown> = {
      updatedById: currentUser.id,
    };

    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (description !== undefined) updateData.description = description;
    if (badge !== undefined) updateData.badge = badge;
    if (backgroundImage !== undefined)
      updateData.backgroundImage = backgroundImage;
    if (primaryButton !== undefined) updateData.primaryButton = primaryButton;
    if (secondaryButton !== undefined)
      updateData.secondaryButton = secondaryButton;
    if (statistics !== undefined) updateData.statistics = statistics;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;

    const slider = await prisma.heroSlider.update({
      where: { id },
      data: updateData,
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
    });

    return NextResponse.json({
      message: "Hero slider başarıyla güncellendi",
      slider,
    });
  } catch (error) {
    console.error("Hero slider update error:", error);
    return NextResponse.json(
      { error: "Hero slider güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE - Hero slider sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mevcut slider'ı kontrol et
    const existingSlider = await prisma.heroSlider.findUnique({
      where: { id },
    });

    if (!existingSlider) {
      return NextResponse.json(
        { error: "Hero slider bulunamadı" },
        { status: 404 }
      );
    }

    await prisma.heroSlider.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Hero slider başarıyla silindi",
    });
  } catch (error) {
    console.error("Hero slider delete error:", error);
    return NextResponse.json(
      { error: "Hero slider silinemedi" },
      { status: 500 }
    );
  }
}
