import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

export async function POST() {
  const languages = await prisma.language.findMany({
    where: { isActive: true },
    orderBy: [{ isDefault: "desc" }, { code: "asc" }],
    select: { code: true, isDefault: true, urlPrefix: true },
  });

  if (!languages.length) {
    return NextResponse.json({ error: "No active languages" }, { status: 400 });
  }

  const locales = languages.map((l) => l.code);
  const defaultLocale = languages.find((l) => l.isDefault)?.code ?? locales[0]!;
  const prefixes: Record<string, string> = {};
  for (const l of languages) {
    if (l.code !== defaultLocale && l.urlPrefix) {
      prefixes[l.code] = `/${l.urlPrefix.replace(/^\//, "")}`;
    }
  }

  const routes = await prisma.i18nRoute.findMany({
    include: { translations: { select: { localeCode: true, path: true } } },
  });

  const pathnames: Record<string, string | Record<string, string>> = {};
  for (const r of routes) {
    const map: Record<string, string> = {};
    for (const t of r.translations) map[t.localeCode] = t.path;
    pathnames[r.name] = Object.keys(map).length > 0 ? map : r.name;
  }

  const outPath = path.join(
    process.cwd(),
    "src",
    "i18n",
    "routing.generated.ts"
  );
  const contents = `// Auto-generated from DB. Do not edit manually.\nexport const locales = ${JSON.stringify(
    locales
  )} as const;\nexport const defaultLocale = ${JSON.stringify(
    defaultLocale
  )} as const;\nexport const prefixes = ${JSON.stringify(
    prefixes
  )} as const;\nexport const pathnames = ${JSON.stringify(
    pathnames
  )} as const;\n`;
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, contents, "utf8");
  return NextResponse.json({
    ok: true,
    locales,
    defaultLocale,
    routes: routes.length,
  });
}


