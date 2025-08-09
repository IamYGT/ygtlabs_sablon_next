"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  type Route = {
    name: string;
    translations: { localeCode: string; path: string }[];
  };

  const [editOpen, setEditOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [editedTranslations, setEditedTranslations] = useState<
    { localeCode: string; path: string }[]
  >([]);

  const handleEditClick = (route: Route) => {
    setEditingRoute(route);
    setEditedTranslations(route.translations.map((t) => ({ ...t })));
    setEditOpen(true);
  };

  const handleChangePath = (idx: number, newPath: string) => {
    setEditedTranslations((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, path: newPath } : item))
    );
  };

  const handleSave = async () => {
    if (!editingRoute) return;
    try {
      const res = await fetch(`/api/admin/i18n/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingRoute.name,
          translations: editedTranslations.filter((t) => t.path && t.localeCode),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(t("saved"));
      setEditOpen(false);
      setEditingRoute(null);
      mutate();
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
                <div
                  key={r.name}
                  className="border rounded-md p-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm">{r.name}</div>
                    <Button size="sm" variant="outline" onClick={() => handleEditClick(r)}>
                      {t("edit")}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-2">
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("edit")} – {editingRoute?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {editedTranslations.map((tr, idx) => (
              <div key={tr.localeCode} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                <div className="md:col-span-2 text-xs font-medium">
                  {tr.localeCode}
                </div>
                <div className="md:col-span-3">
                  <Input
                    value={tr.path}
                    onChange={(e) => handleChangePath(idx, e.target.value)}
                    placeholder="/some-path"
                  />
                </div>
              </div>
            ))}
            {editedTranslations.length === 0 && (
              <div className="text-sm text-muted-foreground">{t("noData")}</div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSave}>{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
