import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Access Token kontrolü
function validateAccessToken(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  // Environment'dan token kontrolü (production'da .env dosyasından okunacak)
  const validToken = process.env.PUBLIC_API_TOKEN || 'crm-api-token-2025';

  return token === validToken;
}

// GET - Public Tek Müşteri Getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const item = await prisma.customer.findUnique({ where: { id } });

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: "Müşteri bulunamadı",
          message: "Customer not found"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error("Public customer fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Müşteri getirilemedi",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// PUT - Public Müşteri Güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, company, notes, isActive } = body;

    // Önce müşterinin var olup olmadığını kontrol et
    const existingCustomer = await prisma.customer.findUnique({ where: { id } });
    if (!existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: "Müşteri bulunamadı",
          message: "Customer not found"
        },
        { status: 404 }
      );
    }

    const dataToUpdate: Record<string, unknown> = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (email !== undefined) dataToUpdate.email = email;
    if (phone !== undefined) dataToUpdate.phone = phone;
    if (company !== undefined) dataToUpdate.company = company;
    if (notes !== undefined) dataToUpdate.notes = notes;
    if (isActive !== undefined) dataToUpdate.isActive = isActive;

    const updated = await prisma.customer.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      message: "Müşteri güncellendi",
      data: updated
    });
  } catch (error) {
    console.error("Public customer update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Müşteri güncellenemedi",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// DELETE - Public Müşteri Sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Önce müşterinin var olup olmadığını kontrol et
    const existingCustomer = await prisma.customer.findUnique({ where: { id } });
    if (!existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: "Müşteri bulunamadı",
          message: "Customer not found"
        },
        { status: 404 }
      );
    }

    await prisma.customer.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Müşteri silindi"
    });
  } catch (error) {
    console.error("Public customer delete error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Müşteri silinemedi",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}