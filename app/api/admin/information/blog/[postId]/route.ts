import type { UserWithPermissions } from "@/lib/permissions";
import { withPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET - Tek bir blog yazısını getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  return withPermission(
    "admin.information.view",
    async (_request: NextRequest, _user: UserWithPermissions) => {
      try {
        const { postId } = await params;
        const item = await prisma.blogPost.findUnique({
          where: { id: postId },
        });
        if (!item)
          return NextResponse.json(
            { error: "Kayıt bulunamadı" },
            { status: 404 }
          );
        return NextResponse.json(item, {
          headers: { "Content-Type": "application/json; charset=utf-8" },
        });
      } catch (error) {
        console.error("Blog fetch error:", error);
        return NextResponse.json(
          { error: "Blog getirilemedi" },
          { status: 500 }
        );
      }
    }
  )(request);
}

// PUT - Blog yazısını güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  return withPermission(
    "information.update",
    async (request: NextRequest, user: UserWithPermissions) => {
      try {
        const { postId } = await params;
        const body = await request.json();
        const {
          title,
          content,
          excerpt,
          coverImage,
          isActive,
          order,
          publishedAt,
        } = body;

        const dataToUpdate: Record<string, unknown> = {};
        if (title !== undefined) dataToUpdate.title = title;
        if (content !== undefined) dataToUpdate.content = content;
        if (excerpt !== undefined) dataToUpdate.excerpt = excerpt;
        if (coverImage !== undefined) dataToUpdate.coverImage = coverImage;
        if (isActive !== undefined) dataToUpdate.isActive = isActive;
        if (order !== undefined) dataToUpdate.order = order;
        if (publishedAt !== undefined)
          dataToUpdate.publishedAt = publishedAt ? new Date(publishedAt) : null;
        dataToUpdate.updatedById = user.id;

        const updated = await prisma.blogPost.update({
          where: { id: postId },
          data: dataToUpdate,
        });

        return NextResponse.json(
          { message: "Blog güncellendi", data: updated },
          { headers: { "Content-Type": "application/json; charset=utf-8" } }
        );
      } catch (error) {
        console.error("Blog update error:", error);
        return NextResponse.json(
          { error: "Blog güncellenemedi" },
          { status: 500 }
        );
      }
    }
  )(request);
}

// DELETE - Blog yazısını sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  return withPermission(
    "information.delete",
    async (_request: NextRequest, _user: UserWithPermissions) => {
      try {
        const { postId } = await params;
        await prisma.blogPost.delete({ where: { id: postId } });
        return NextResponse.json(
          { message: "Blog silindi" },
          {
            headers: { "Content-Type": "application/json; charset=utf-8" },
          }
        );
      } catch (error) {
        console.error("Blog delete error:", error);
        return NextResponse.json({ error: "Blog silinemedi" }, { status: 500 });
      }
    }
  )(request);
}
