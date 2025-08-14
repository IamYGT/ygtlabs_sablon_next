import type { UserWithPermissions } from "@/lib/permissions";
import { withPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Tek müşteri
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission(
    "admin.customers.view",
    async (_request: NextRequest, _user: UserWithPermissions) => {
      try {
        const { id } = await params;
        const item = await prisma.customer.findUnique({ where: { id } });
        if (!item)
          return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
        return NextResponse.json(item);
      } catch (error) {
        console.error("Customer fetch error:", error);
        return NextResponse.json(
          { error: "Müşteri getirilemedi" },
          { status: 500 }
        );
      }
    }
  )(request);
}

// PUT - Güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission(
    "customers.update",
    async (request: NextRequest, user: UserWithPermissions) => {
      try {
        const { id } = await params;
        const body = await request.json();
        const { name, email, phone, company, notes, isActive } = body;

        const dataToUpdate: Record<string, unknown> = {};
        if (name !== undefined) dataToUpdate.name = name;
        if (email !== undefined) dataToUpdate.email = email;
        if (phone !== undefined) dataToUpdate.phone = phone;
        if (company !== undefined) dataToUpdate.company = company;
        if (notes !== undefined) dataToUpdate.notes = notes;
        if (isActive !== undefined) dataToUpdate.isActive = isActive;
        dataToUpdate.updatedById = user.id;

        const updated = await prisma.customer.update({
          where: { id },
          data: dataToUpdate,
        });
        return NextResponse.json({
          message: "Müşteri güncellendi",
          data: updated,
        });
      } catch (error) {
        console.error("Customer update error:", error);
        return NextResponse.json(
          { error: "Müşteri güncellenemedi" },
          { status: 500 }
        );
      }
    }
  )(request);
}

// DELETE - Sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission(
    "customers.delete",
    async (_request: NextRequest, _user: UserWithPermissions) => {
      try {
        const { id } = await params;
        await prisma.customer.delete({ where: { id } });
        return NextResponse.json({ message: "Müşteri silindi" });
      } catch (error) {
        console.error("Customer delete error:", error);
        return NextResponse.json(
          { error: "Müşteri silinemedi" },
          { status: 500 }
        );
      }
    }
  )(request);
}

