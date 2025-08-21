import fs from "node:fs/promises";
import path from "node:path";
import prisma from "../prisma";

async function main() {
  const rows = await prisma.language.findMany({
    where: { isActive: true },
    orderBy: [{ isDefault: "desc" }, { code: "asc" }],
    select: { code: true, isDefault: true },
  });

  if (!rows || rows.length === 0) {
    throw new Error("No active languages found in DB. Seed languages first.");
  }

  const locales = rows.map((r) => r.code);
  const def = rows.find((r) => r.isDefault) ?? rows[0];
  const defaultLocale = def.code;

  const outPath = path.join(
    process.cwd(),
    "lib",
    "i18n",
    "locales.generated.ts"
  );
  const contents = `// Auto-generated. Do not edit manually.\nexport const locales: readonly string[] = ${JSON.stringify(
    locales
  )} as const;\nexport const defaultLocale: string = ${JSON.stringify(
    defaultLocale
  )};\nexport default locales;\n`;
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, contents, "utf8");
  console.log(
    `Generated locales file with locales: ${locales.join(
      ", "
    )}, default: ${defaultLocale}`
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
