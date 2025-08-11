import { withPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - SSS maddelerini listele
export const GET = withPermission("admin.information.view", async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const isActive = searchParams.get("isActive");
    const category = searchParams.get("category");

    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (isActive !== null && isActive !== undefined && isActive !== "all") {
      where.isActive = isActive === "true";
    }
    if (category) where.category = category;

    const [items, totalCount] = await Promise.all([
      prisma.faqItem.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.faqItem.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("FAQ fetch error:", error);
    return NextResponse.json(
      { error: "SSS listesi getirilemedi" },
      { status: 500 }
    );
  }
});

// POST - Yeni SSS maddesi oluştur
export const POST = withPermission(
  "information.create",
  async (request, user) => {
    try {
      const body = await request.json();
      const { question, answer, category, isActive = true, order = 0 } = body;

      if (!question || !answer) {
        return NextResponse.json(
          { error: "Gerekli alanlar eksik" },
          { status: 400 }
        );
      }

      const item = await prisma.faqItem.create({
        data: {
          question,
          answer,
          category,
          isActive,
          order,
          createdById: user.id,
        },
      });

      return NextResponse.json(
        { message: "SSS maddesi oluşturuldu", data: item },
        { status: 201 }
      );
    } catch (error) {
      console.error("FAQ create error:", error);
      return NextResponse.json(
        { error: "SSS maddesi oluşturulamadı" },
        { status: 500 }
      );
    }
  }
);
