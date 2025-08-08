"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface RoutesClientProps { title: string }

export default function RoutesClient({ title }: RoutesClientProps) {
  const t = useTranslations("AdminI18n");
  const { data: langs } = useSWR(`/api/admin/i18n/languages`, fetcher);
  const { data, mutate, isLoading } = useSWR(`/api/admin/i18n/routes`, fetcher);

  type Lang = { code: string };
  type Route = { name: string; translations: { localeCode: string; path: string }[] };
  const localeOptions = useMemo(() => (langs?.languages ?? []).map((l: Lang) => l.code), [langs]);

  const [routeName, setRouteName] = useState("");
  const [description, setDescription] = useState("");
  const [localeA, setLocaleA] = useState<string | undefined>(undefined);
  const [localeB, setLocaleB] = useState<string | undefined>(undefined);
  const [localeC, setLocaleC] = useState<string | undefined>(undefined);
  const [pathA, setPathA] = useState("");
  const [pathB, setPathB] = useState("");
  const [pathC, setPathC] = useState("");

  // Varsayılan 3 dili aktif dillerin ilk üçünden seç
  useEffect(() => {
    if (!localeA && localeOptions[0]) setLocaleA(localeOptions[0]);
    if (!localeB && localeOptions[1]) setLocaleB(localeOptions[1]);
    if (!localeC && localeOptions[2]) setLocaleC(localeOptions[2]);
  }, [localeOptions, localeA, localeB, localeC]);

  const onSave = async () => {
    try {
      const translations = [
        { localeCode: localeA, path: pathA },
        { localeCode: localeB, path: pathB },
        { localeCode: localeC, path: pathC },
      ].filter((x) => x.path && x.localeCode);
      const res = await fetch(`/api/admin/i18n/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: routeName, description, translations }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(t("saved"));
      mutate();
      setRouteName(""); setDescription(""); setPathA(""); setPathB(""); setPathC("");
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => fetch(`/api/admin/i18n/routing`, { method: "POST" }).then(() => toast.success(t("routingGenerated")))}
          className="hidden md:inline-flex"
        >
          {t("generateRouting")}
        </Button>
      </div>

      {/* Form kartı */}
      <Card className="bg-blue-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base md:text-lg">{t("routesEditor")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="md:col-span-3">
              <label className="text-sm">{t("form.routeName")}</label>
              <Input value={routeName} onChange={(e) => setRouteName(e.target.value)} placeholder={t("placeholders.routeNameExample")} />
            </div>
            <div className="md:col-span-3">
              <label className="text-sm">{t("form.description")}</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("placeholders.optional")} />
            </div>
          </div>

          {/* 3 dil alanı: dropdown-style grup kutuları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-3 space-y-2">
              <label className="text-xs text-muted-foreground">{t("form.localeA")}</label>
              <Select value={localeA} onValueChange={setLocaleA}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("form.locale")} />
                </SelectTrigger>
                <SelectContent>
                  {localeOptions.map((l: string) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={pathA} onChange={(e) => setPathA(e.target.value)} placeholder={t("placeholders.contactPath")} />
            </div>

            <div className="rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-3 space-y-2">
              <label className="text-xs text-muted-foreground">{t("form.localeB")}</label>
              <Select value={localeB} onValueChange={setLocaleB}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("form.locale")} />
                </SelectTrigger>
                <SelectContent>
                  {localeOptions.map((l: string) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={pathB} onChange={(e) => setPathB(e.target.value)} placeholder={t("placeholders.contactPathTr")} />
            </div>

            <div className="rounded-xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-3 space-y-2">
              <label className="text-xs text-muted-foreground">{t("form.localeC")}</label>
              <Select value={localeC} onValueChange={setLocaleC}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("form.locale")} />
                </SelectTrigger>
                <SelectContent>
                  {localeOptions.map((l: string) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={pathC} onChange={(e) => setPathC(e.target.value)} placeholder={t("placeholders.contactPathMe")} />
            </div>
          </div>

          <div className="pt-2">
            <Button onClick={onSave} className="shadow h-9 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm px-4">
              {t("save")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Var olan rotalar */}
      <Card className="bg-blue-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2 flex-row items-center justify-between">
          <CardTitle className="text-base md:text-lg">{t("existingRoutes")}</CardTitle>
          <Button
            variant="outline"
            onClick={() => fetch(`/api/admin/i18n/routing`, { method: "POST" }).then(() => toast.success(t("routingGenerated")))}
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
                <div key={r.name} className="border rounded-md p-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                  <div className="font-mono text-sm">{r.name}</div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                    {r.translations.map((t: { localeCode: string; path: string }) => (
                      <span key={t.localeCode} className="px-2 py-0.5 rounded bg-muted">{t.localeCode}: {t.path}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


