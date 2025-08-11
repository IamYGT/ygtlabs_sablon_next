import { withPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Blog yazılarını listele
export const GET = withPermission("admin.information.view", async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const isActive = searchParams.get("isActive");

    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (isActive !== null && isActive !== undefined && isActive !== "all") {
      where.isActive = isActive === "true";
    }

    const [items, totalCount] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
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
    console.error("Blog fetch error:", error);
    return NextResponse.json(
      { error: "Blog listesi getirilemedi" },
      { status: 500 }
    );
  }
});

// POST - Yeni blog yazısı oluştur
export const POST = withPermission(
  "information.create",
  async (request, user) => {
    try {
      const body = await request.json();
      const {
        title,
        content,
        excerpt,
        coverImage,
        isActive = true,
        order = 0,
        publishedAt,
      } = body;

      if (!title || !content) {
        return NextResponse.json(
          { error: "Gerekli alanlar eksik" },
          { status: 400 }
        );
      }

      const item = await prisma.blogPost.create({
        data: {
          title,
          content,
          excerpt,
          coverImage,
          isActive,
          order,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
          createdById: user.id,
        },
      });

      return NextResponse.json(
        { message: "Blog yazısı oluşturuldu", data: item },
        { status: 201 }
      );
    } catch (error) {
      console.error("Blog create error:", error);
      return NextResponse.json(
        { error: "Blog yazısı oluşturulamadı" },
        { status: 500 }
      );
    }
  }
);
