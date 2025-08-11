import type { UserWithPermissions } from "@/lib/permissions";
import { withPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Tek bir bilgi içeriğini getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission(
    "admin.information.view",
    async (_request: NextRequest, _user: UserWithPermissions) => {
      try {
        const { id } = await params;
        const item = await prisma.infoArticle.findUnique({ where: { id } });
        if (!item)
          return NextResponse.json(
            { error: "Kayıt bulunamadı" },
            { status: 404 }
          );
        return NextResponse.json(item, {
          headers: { "Content-Type": "application/json; charset=utf-8" },
        });
      } catch (error) {
        console.error("Information fetch error:", error);
        return NextResponse.json(
          { error: "Kayıt getirilemedi" },
          { status: 500 }
        );
      }
    }
  )(request);
}

// PUT - Bilgi içeriğini güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission(
    "information.update",
    async (request: NextRequest, user: UserWithPermissions) => {
      try {
        const { id } = await params;
        const body = await request.json();
        const { title, content, isActive, order } = body;

        const dataToUpdate: Record<string, unknown> = {};
        if (title !== undefined) dataToUpdate.title = title;
        if (content !== undefined) dataToUpdate.content = content;
        if (isActive !== undefined) dataToUpdate.isActive = isActive;
        if (order !== undefined) dataToUpdate.order = order;
        dataToUpdate.updatedById = user.id;

        const updated = await prisma.infoArticle.update({
          where: { id },
          data: dataToUpdate,
        });
        return NextResponse.json(
          { message: "Kayıt güncellendi", data: updated },
          {
            headers: { "Content-Type": "application/json; charset=utf-8" },
          }
        );
      } catch (error) {
        console.error("Information update error:", error);
        return NextResponse.json(
          { error: "Kayıt güncellenemedi" },
          { status: 500 }
        );
      }
    }
  )(request);
}

// DELETE - Bilgi içeriğini sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPermission(
    "information.delete",
    async (_request: NextRequest, _user: UserWithPermissions) => {
      try {
        const { id } = await params;
        await prisma.infoArticle.delete({ where: { id } });
        return NextResponse.json(
          { message: "Kayıt silindi" },
          {
            headers: { "Content-Type": "application/json; charset=utf-8" },
          }
        );
      } catch (error) {
        console.error("Information delete error:", error);
        return NextResponse.json(
          { error: "Kayıt silinemedi" },
          { status: 500 }
        );
      }
    }
  )(request);
}
