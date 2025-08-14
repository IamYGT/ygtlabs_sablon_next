import { withPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Müşterileri listele (pagination + filtreler)
export const GET = withPermission("admin.customers.view", async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const q = searchParams.get("q");
    const isActive = searchParams.get("isActive");

    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
      ];
    }
    if (isActive !== null && isActive !== undefined && isActive !== "all") {
      where.isActive = isActive === "true";
    }

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Customers fetch error:", error);
    return NextResponse.json(
      { error: "Müşteri listesi getirilemedi" },
      { status: 500 }
    );
  }
});

// POST - Yeni müşteri oluştur
export const POST = withPermission(
  "customers.create",
  async (request, user) => {
    try {
      const body = await request.json();
      const { name, email, phone, company, notes, isActive = true } = body;

      if (!name) {
        return NextResponse.json({ error: "İsim gereklidir" }, { status: 400 });
      }

      const customer = await prisma.customer.create({
        data: {
          name,
          email,
          phone,
          company,
          notes,
          isActive,
          createdById: user.id,
        },
      });

      return NextResponse.json(
        { message: "Müşteri oluşturuldu", data: customer },
        { status: 201 }
      );
    } catch (error) {
      console.error("Customer create error:", error);
      return NextResponse.json(
        { error: "Müşteri oluşturulamadı" },
        { status: 500 }
      );
    }
  }
);

