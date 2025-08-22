import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server-utils";
import { z } from "zod";

// Kategori oluşturma şeması
const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0)
});

// Kategori güncelleme şeması
const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().optional()
});

// Kategorileri getir
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";
    const isAdmin = user.permissions?.includes("admin.support.manage");

    // Müşteri için sadece aktif kategorileri göster
    const where = !isAdmin || !includeInactive ? { isActive: true } : {};

    const categories = await prisma.supportCategory.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        color: true,
        isActive: true,
        order: true,
        _count: {
          select: {
            tickets: true
          }
        }
      },
      orderBy: [
        { order: "desc" }
      ]
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Yeni kategori oluştur (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.permissions?.includes("admin.support.manage");
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = createCategorySchema.parse(body);

    const category = await prisma.supportCategory.create({
      data: validatedData,
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        color: true,
        isActive: true,
        order: true
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Kategori güncelle (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.permissions?.includes("admin.support.manage");
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("id");
    
    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = updateCategorySchema.parse(body);

    const category = await prisma.supportCategory.update({
      where: { id: categoryId },
      data: validatedData,
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        color: true,
        isActive: true,
        order: true,
        _count: {
          select: {
            tickets: true
          }
        }
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Kategori sil (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = user.permissions?.includes("admin.support.manage");
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("id");
    
    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Kategoriyi kullanmakta olan ticket var mı kontrol et
    const ticketCount = await prisma.supportTicket.count({
      where: { categoryId }
    });

    if (ticketCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing tickets" },
        { status: 400 }
      );
    }

    await prisma.supportCategory.delete({
      where: { id: categoryId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
