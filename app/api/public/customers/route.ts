import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Access Token kontrolü
function validateAccessToken(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  // Environment'dan token kontrolü (production'da .env dosyasından okunacak)
  const validToken = process.env.PUBLIC_API_TOKEN || 'crm-api-token-2025';

  return token === validToken;
}

// GET - Public Müşteri Listeleme (pagination + filtreler)
export async function GET(request: Request) {
  try {
    // Access token kontrolü
    if (!validateAccessToken(request)) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz access token",
          message: "Invalid access token"
        },
        { status: 401 }
      );
    }

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
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Public customers fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Müşteri listesi getirilemedi",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// POST - Public Yeni Müşteri Oluştur
export async function POST(request: Request) {
  try {
    // Access token kontrolü
    if (!validateAccessToken(request)) {
      return NextResponse.json(
        {
          success: false,
          error: "Geçersiz access token",
          message: "Invalid access token"
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, email, phone, company, notes, isActive = true } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "İsim gereklidir",
          message: "Customer name is required"
        },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        company,
        notes,
        isActive,
        // Public API için createdById null kalabilir
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Müşteri oluşturuldu",
        data: customer
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Public customer create error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Müşteri oluşturulamadı",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}