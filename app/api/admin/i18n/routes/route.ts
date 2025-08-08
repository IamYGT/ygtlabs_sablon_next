import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const routes = await prisma.i18nRoute.findMany({
    orderBy: { name: "asc" },
    include: { translations: { select: { localeCode: true, path: true } } },
  });
  return NextResponse.json({ routes });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description, translations } = (body ?? {}) as {
    name?: string;
    description?: string | null;
    translations?: { localeCode: string; path: string }[];
  };
  if (!name)
    return NextResponse.json({ error: "name required" }, { status: 400 });
  try {
    await prisma.$transaction(async (tx) => {
      await tx.i18nRoute.upsert({
        where: { name },
        update: { description: description ?? undefined },
        create: { name, description: description ?? undefined },
      });
      if (Array.isArray(translations)) {
        for (const t of translations) {
          if (!t?.localeCode || !t?.path) continue;
          await tx.i18nRouteTranslation.upsert({
            where: {
              routeName_localeCode: {
                routeName: name,
                localeCode: t.localeCode,
              },
            },
            update: { path: t.path },
            create: { routeName: name, localeCode: t.localeCode, path: t.path },
          });
        }
      }
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


