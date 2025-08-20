import prisma from "@/lib/prisma";
import { LRUCache } from "lru-cache";

type RoutingData = {
  locales: string[];
  defaultLocale: string;
  prefixes: Record<string, string>;
  pathnames: Record<string, string | Record<string, string>>;
};

const cache = new LRUCache<string, RoutingData>({ max: 1, ttl: 60_000 });

export async function getRoutingFromDB(): Promise<RoutingData> {
  const cached = cache.get("routing");
  if (cached) return cached;

  const languages = await prisma.language.findMany({
    where: { isActive: true },
    orderBy: [{ isDefault: "desc" }, { code: "asc" }],
    select: { code: true, isDefault: true, urlPrefix: true },
  });
  if (!languages.length) {
    // Fallback
    const fallback: RoutingData = {
      locales: ["en"],
      defaultLocale: "en",
      prefixes: {},
      pathnames: {},
    };
    cache.set("routing", fallback);
    return fallback;
  }
  const locales = languages.map((l) => l.code);
  const defaultLocale = languages.find((l) => l.isDefault)?.code ?? locales[0]!;
  const prefixes: Record<string, string> = {};
  for (const l of languages) {
    if (l.code !== defaultLocale && l.urlPrefix)
      prefixes[l.code] = `/${l.urlPrefix.replace(/^\//, "")}`;
  }

  const routes = await prisma.i18nRoute.findMany({
    include: { translations: { select: { localeCode: true, path: true } } },
  });
  const pathnames: RoutingData["pathnames"] = {};
  for (const r of routes) {
    const map: Record<string, string> = {};
    for (const t of r.translations) map[t.localeCode] = t.path;
    pathnames[r.name] = Object.keys(map).length > 0 ? map : r.name;
  }

  const data: RoutingData = { locales, defaultLocale, prefixes, pathnames };
  cache.set("routing", data);
  return data;
}

export function invalidateRoutingCache() {
  cache.delete("routing");
}
