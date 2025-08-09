"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Globe, Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface RoutesClientProps {
  title: string;
}

export default function RoutesClient({ title }: RoutesClientProps) {
  const t = useTranslations("AdminI18n");
  const { data, mutate, isLoading } = useSWR(`/api/admin/i18n/routes`, fetcher);

  type Route = {
    name: string;
    translations: { localeCode: string; path: string }[];
  };

  type EditableTranslation = {
    localeCode: string;
    base: string;
    suffix: string;
  };
  const [openRouteName, setOpenRouteName] = useState<string | null>(null);
  const [editedByRoute, setEditedByRoute] = useState<
    Record<string, EditableTranslation[]>
  >({});


  const splitPath = (path: string): { base: string; suffix: string } => {
    if (!path || path === "/") return { base: "/", suffix: "" };
    const lastSlash = path.lastIndexOf("/");
    if (lastSlash <= 0) return { base: "/", suffix: path.replace(/^\//, "") };
    return {
      base: path.slice(0, lastSlash) || "/",
      suffix: path.slice(lastSlash + 1),
    };
  };

  const toggleOpen = (route: Route) => {
    const isOpening = openRouteName !== route.name;
    setOpenRouteName(isOpening ? route.name : null);
    if (isOpening && !editedByRoute[route.name]) {
      const prepared: EditableTranslation[] = route.translations.map((tr) => {
        const { base, suffix } = splitPath(tr.path);
        return { localeCode: tr.localeCode, base, suffix };
      });
      setEditedByRoute((prev) => ({ ...prev, [route.name]: prepared }));
    }
  };

  const handleChangeSuffix = (
    routeName: string,
    index: number,
    newSuffix: string
  ) => {
    setEditedByRoute((prev) => {
      const current = prev[routeName] ?? [];
      const next = current.map((item, i) =>
        i === index ? { ...item, suffix: newSuffix.replace(/^\//, "") } : item
      );
      return { ...prev, [routeName]: next };
    });
  };


  const handleSave = async (routeName: string) => {
    const items = editedByRoute[routeName] ?? [];
    const translations = items
      .map((it) => {
        const base = it.base === "/" ? "" : it.base;
        const suffix = it.suffix.replace(/^\//, "");
        const path = `${base}/${suffix}`.replace(/\/+/g, "/");
        return { localeCode: it.localeCode, path };
      })
      .filter((x) => x.path && x.localeCode);
    try {
      const res = await fetch(`/api/admin/i18n/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: routeName, translations }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(t("saved"));
      setOpenRouteName(null);
      await mutate();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : t("failed");
      toast.error(message);
    }
  };

  // Search & Filter
  const [search, setSearch] = useState("");
  const [selectedLocales, setSelectedLocales] = useState<string[]>([]);
  const availableLocales = useMemo(() => {
    const set = new Set<string>();
    for (const r of (data?.routes ?? []) as Route[]) {
      for (const tr of r.translations) set.add(tr.localeCode);
    }
    return Array.from(set).sort();
  }, [data]);
  const filteredRoutes: Route[] = useMemo(() => {
    const routes: Route[] = (data?.routes ?? []) as Route[];
    return routes.filter((r) => {
      const matchesSearch = search
        ? r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.translations.some((tr) =>
            tr.path.toLowerCase().includes(search.toLowerCase())
          )
        : true;
      const matchesLocale = selectedLocales.length
        ? r.translations.some((tr) => selectedLocales.includes(tr.localeCode))
        : true;
      return matchesSearch && matchesLocale;
    });
  }, [data, search, selectedLocales]);

  return (
    <div className="space-y-6">
      {/* Header tarzı blok */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {title}
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            fetch(`/api/admin/i18n/routing`, { method: "POST" }).then(() => {
              toast.success(t("routingGenerated"));
              mutate();
            })
          }
          className="hidden md:inline-flex"
        >
          {t("generateRouting")}
        </Button>
      </div>

      {/* Var olan rotalar */}
      <Card className="bg-blue-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CardTitle className="text-base md:text-lg">
              {t("existingRoutes")}
            </CardTitle>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search")}
                className="h-9 w-full md:w-64"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-4 w-4 mr-2" /> {t("filter")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {availableLocales.map((lc) => {
                    const checked = selectedLocales.includes(lc);
                    return (
                      <DropdownMenuCheckboxItem
                        key={lc}
                        checked={checked}
                        onCheckedChange={(val) => {
                          setSelectedLocales((prev) =>
                            val ? [...prev, lc] : prev.filter((x) => x !== lc)
                          );
                        }}
                      >
                        {lc}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                onClick={() =>
                  fetch(`/api/admin/i18n/routing`, { method: "POST" }).then(() => {
                    toast.success(t("routingGenerated"));
                    mutate();
                  })
                }
                className="md:hidden"
              >
                {t("generateRouting")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">{t("loading")}</div>
          ) : (
            <div className="space-y-2">
              {filteredRoutes.map((r: Route) => (
                <Collapsible key={r.name} open={openRouteName === r.name}>
                  <div
                    onClick={() => toggleOpen(r)}
                    className="border rounded-md p-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  >
                    <div className="font-mono text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                      {r.translations.map(
                        (t: { localeCode: string; path: string }) => (
                          <span
                            key={t.localeCode}
                            className="px-2 py-0.5 rounded bg-muted"
                          >
                            {t.localeCode}: {t.path}
                          </span>
                        )
                      )}
                    </div>

                    <CollapsibleContent
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 space-y-3"
                    >
                      <div className="space-y-2">
                        {(editedByRoute[r.name] ?? []).map((tr, idx) => (
                          <div
                            key={`${tr.localeCode}-${idx}`}
                            className="flex items-center gap-2"
                          >
                            <div className="w-20 text-xs font-medium">
                              {tr.localeCode}
                            </div>
                            <Input
                              className="flex-1 h-8"
                              value={tr.suffix}
                              onChange={(e) =>
                                handleChangeSuffix(r.name, idx, e.target.value)
                              }
                              placeholder="slug"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          variant="outline"
                          onClick={() => setOpenRouteName(null)}
                        >
                          {t("cancel")}
                        </Button>
                        <Button onClick={() => handleSave(r.name)}>
                          {t("save")}
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
