import type { UserWithPermissions } from "@/lib/permissions";
import { withPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Tek bir SSS maddesini getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ faqId: string }> }
) {
  return withPermission(
    "admin.information.view",
    async (_request: NextRequest, _user: UserWithPermissions) => {
      try {
        const { faqId } = await params;
        const item = await prisma.faqItem.findUnique({ where: { id: faqId } });
        if (!item)
          return NextResponse.json(
            { error: "Kayıt bulunamadı" },
            { status: 404 }
          );
        return NextResponse.json(item, {
          headers: { "Content-Type": "application/json; charset=utf-8" },
        });
      } catch (error) {
        console.error("FAQ fetch error:", error);
        return NextResponse.json(
          { error: "SSS getirilemedi" },
          { status: 500 }
        );
      }
    }
  )(request);
}

// PUT - SSS maddesini güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ faqId: string }> }
) {
  return withPermission(
    "information.update",
    async (request: NextRequest, user: UserWithPermissions) => {
      try {
        const { faqId } = await params;
        const body = await request.json();
        const { question, answer, category, isActive, order } = body;

        const dataToUpdate: Record<string, unknown> = {};
        if (question !== undefined) dataToUpdate.question = question;
        if (answer !== undefined) dataToUpdate.answer = answer;
        if (category !== undefined) dataToUpdate.category = category;
        if (isActive !== undefined) dataToUpdate.isActive = isActive;
        if (order !== undefined) dataToUpdate.order = order;
        dataToUpdate.updatedById = user.id;

        const updated = await prisma.faqItem.update({
          where: { id: faqId },
          data: dataToUpdate,
        });

        return NextResponse.json(
          { message: "SSS maddesi güncellendi", data: updated },
          { headers: { "Content-Type": "application/json; charset=utf-8" } }
        );
      } catch (error) {
        console.error("FAQ update error:", error);
        return NextResponse.json(
          { error: "SSS güncellenemedi" },
          { status: 500 }
        );
      }
    }
  )(request);
}

// DELETE - SSS maddesini sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ faqId: string }> }
) {
  return withPermission(
    "information.delete",
    async (_request: NextRequest, _user: UserWithPermissions) => {
      try {
        const { faqId } = await params;
        await prisma.faqItem.delete({ where: { id: faqId } });
        return NextResponse.json(
          { message: "SSS maddesi silindi" },
          {
            headers: { "Content-Type": "application/json; charset=utf-8" },
          }
        );
      } catch (error) {
        console.error("FAQ delete error:", error);
        return NextResponse.json(
          { error: "SSS maddesi silinemedi" },
          { status: 500 }
        );
      }
    }
  )(request);
}
