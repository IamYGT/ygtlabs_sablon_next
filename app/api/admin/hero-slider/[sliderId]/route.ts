import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session-utils";

// GET - Tek bir hero slider'ı getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sliderId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sliderId } = await params;

    const slider = await prisma.heroSlider.findUnique({
      where: { id: sliderId },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!slider) {
      return NextResponse.json({ error: "Slider not found" }, { status: 404 });
    }

    return NextResponse.json(slider, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    console.error("Hero slider fetch error:", error);
    return NextResponse.json(
      { error: "Hero slider getirilemedi" },
      { status: 500 }
    );
  }
}

// PUT - Hero slider'ı güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sliderId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sliderId } = await params;
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

    const dataToUpdate: Record<string, unknown> = {};

    if (title !== undefined) dataToUpdate.title = title;
    if (subtitle !== undefined) dataToUpdate.subtitle = subtitle;
    if (description !== undefined) dataToUpdate.description = description;
    if (badge !== undefined) dataToUpdate.badge = badge;
    if (backgroundImage !== undefined)
      dataToUpdate.backgroundImage = backgroundImage;
    if (primaryButton !== undefined) dataToUpdate.primaryButton = primaryButton;
    if (secondaryButton !== undefined)
      dataToUpdate.secondaryButton = secondaryButton;
    if (statistics !== undefined) dataToUpdate.statistics = statistics;
    if (isActive !== undefined) dataToUpdate.isActive = isActive;
    if (order !== undefined) dataToUpdate.order = order;

    dataToUpdate.updatedById = currentUser.id;

    const updatedSlider = await prisma.heroSlider.update({
      where: { id: sliderId },
      data: dataToUpdate,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(
      {
        message: "Hero slider başarıyla güncellendi",
        slider: updatedSlider,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Hero slider update error:", error);
    return NextResponse.json(
      { error: "Hero slider güncellenemedi" },
      { status: 500 }
    );
  }
}

// DELETE - Hero slider'ı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sliderId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sliderId } = await params;

    await prisma.heroSlider.delete({
      where: { id: sliderId },
    });

    return NextResponse.json(
      { message: "Hero slider başarıyla silindi" },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Hero slider delete error:", error);
    return NextResponse.json(
      { error: "Hero slider silinemedi" },
      { status: 500 }
    );
  }
}
