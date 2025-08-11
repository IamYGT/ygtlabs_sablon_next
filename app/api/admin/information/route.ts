import { withPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Bilgi Merkezi içeriklerini listele
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
      prisma.infoArticle.findMany({
        where,
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.infoArticle.count({ where }),
    ]);

    return NextResponse.json({ items, pagination: { page, limit, total: totalCount, totalPages: Math.ceil(totalCount / limit) } });
  } catch (error) {
    console.error("Information fetch error:", error);
    return NextResponse.json({ error: "Bilgi listesi getirilemedi" }, { status: 500 });
  }
});

// POST - Yeni içerik oluştur
export const POST = withPermission("information.create", async (request, user) => {
  try {
    const body = await request.json();
    const { title, content, isActive = true, order = 0 } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
    }

    const item = await prisma.infoArticle.create({
      data: {
        title,
        content,
        isActive,
        order,
        createdById: user.id,
      },
    });

    return NextResponse.json({ message: "Kayıt oluşturuldu", data: item }, { status: 201 });
  } catch (error) {
    console.error("Information create error:", error);
    return NextResponse.json({ error: "Kayıt oluşturulamadı" }, { status: 500 });
  }
});


