import fs from "node:fs/promises";
import path from "node:path";
import prisma from "../prisma";

async function main() {
  const languages = await prisma.$queryRawUnsafe<
    { code: string; isDefault: boolean; urlPrefix: string | null }[]
  >(
    'SELECT code, "isDefault", COALESCE("urlPrefix", NULL) AS "urlPrefix" FROM "public"."Language" WHERE "isActive" = true ORDER BY "isDefault" DESC, code ASC'
  );

  if (!languages.length) {
    throw new Error("No active languages found. Seed languages first.");
  }

  const locales = languages.map((l) => l.code);
  const defaultLocale = languages.find((l) => l.isDefault)?.code ?? locales[0]!;
  const prefixes: Record<string, string> = {};
  for (const l of languages) {
    if (l.code === defaultLocale) continue;
    const p = (l.urlPrefix ?? l.code).replace(/^\//, "");
    prefixes[l.code] = `/${p}`;
  }

  const routes = await prisma.i18nRoute.findMany({
    include: { translations: { select: { localeCode: true, path: true } } },
  });

  const pathnames: Record<string, string | Record<string, string>> = {};
  for (const r of routes) {
    const map: Record<string, string> = {};
    for (const t of r.translations) {
      map[t.localeCode] = t.path;
    }
    pathnames[r.name] = Object.keys(map).length > 0 ? map : r.name;
  }

  const outPath = path.join(
    process.cwd(),
    "lib",
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
  console.log(
    `Generated routing file with locales: ${locales.join(
      ", "
    )}, default: ${defaultLocale}, routes: ${routes.length}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
