"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface RoutesClientProps {
  title: string;
}

export default function RoutesClient({ title }: RoutesClientProps) {
  const t = useTranslations("AdminI18n");
  const { data, mutate, isLoading } = useSWR(`/api/admin/i18n/routes`, fetcher);
  const { data: langs } = useSWR(`/api/admin/i18n/languages`, fetcher);

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

  const localeOptions: string[] = (langs?.languages ?? []).map(
    (l: { code: string }) => l.code
  );

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
        <CardHeader className="pb-2 flex-row items-center justify-between">
          <CardTitle className="text-base md:text-lg">
            {t("existingRoutes")}
          </CardTitle>
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
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">{t("loading")}</div>
          ) : (
            <div className="space-y-2">
              {(data?.routes ?? []).map((r: Route) => (
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
                            className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center"
                          >
                            <div className="md:col-span-2">
                              <Select
                                value={tr.localeCode}
                                onValueChange={(val) => {
                                  setEditedByRoute((prev) => {
                                    const current = prev[r.name] ?? [];
                                    const next = current.map((item, i) =>
                                      i === idx
                                        ? { ...item, localeCode: val }
                                        : item
                                    );
                                    return { ...prev, [r.name]: next };
                                  });
                                }}
                              >
                                <SelectTrigger className="h-8 w-full text-xs">
                                  <SelectValue placeholder={t("form.locale")} />
                                </SelectTrigger>
                                <SelectContent className="text-xs">
                                  {localeOptions.map((l) => (
                                    <SelectItem key={l} value={l} className="text-xs">
                                      {l}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="md:col-span-3">
                              <Input
                                value={tr.suffix}
                                onChange={(e) =>
                                  handleChangeSuffix(
                                    r.name,
                                    idx,
                                    e.target.value
                                  )
                                }
                                placeholder="slug"
                              />
                            </div>
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
