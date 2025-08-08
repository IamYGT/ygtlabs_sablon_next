import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const languages = await prisma.$queryRawUnsafe<
    {
      id: string;
      code: string;
      name: string;
      nativeName: string | null;
      isActive: boolean;
      isDefault: boolean;
      direction: string | null;
      urlPrefix: string | null;
    }[]
  >(
    'SELECT id, code, name, "nativeName", "isActive", "isDefault", direction, COALESCE("urlPrefix", NULL) AS "urlPrefix" FROM "public"."Language" WHERE "isActive" = true ORDER BY "isDefault" DESC, code ASC'
  );
  return NextResponse.json({ languages });
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    code,
    name,
    nativeName,
    isActive = true,
    isDefault = false,
    direction,
    urlPrefix,
  } = (body ?? {}) as {
    code?: string;
    name?: string;
    nativeName?: string | null;
    isActive?: boolean;
    isDefault?: boolean;
    direction?: string | null;
    urlPrefix?: string | null;
  };
  if (!code || !name) {
    return NextResponse.json(
      { error: "code and name required" },
      { status: 400 }
    );
  }
  try {
    const created = await prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.language.updateMany({ data: { isDefault: false }, where: {} });
      }
      const rec = await tx.language.create({
        data: {
          code,
          name,
          nativeName: nativeName ?? null,
          isActive: Boolean(isActive),
          isDefault: Boolean(isDefault),
          direction: direction ?? null,
        },
        select: { id: true },
      });
      if (urlPrefix && urlPrefix.trim() !== "") {
        await tx.$executeRawUnsafe(
          'UPDATE "public"."Language" SET "urlPrefix" = $1, "updatedAt" = NOW() WHERE code = $2',
          urlPrefix.replace(/^\//, ""),
          code
        );
      }
      return rec;
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    if (message.includes("Unique") || message.includes("unique")) {
      return NextResponse.json(
        { error: "Language already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
