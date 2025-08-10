"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface MessagesClientProps {
  title: string;
}

// UI config (data scope) – panel ile uyumlu görsel ayarlar
const ui = {
  select: {
    trigger:
      "h-9 bg-blue-50 dark:bg-slate-900/50 border border-gray-200 dark:border-gray-700",
    content:
      "bg-blue-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700",
    item: "focus:bg-blue-100 dark:focus:bg-slate-700 focus:text-inherit",
  },
};

function flatten(
  obj: Record<string, unknown>,
  prefix = ""
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flatten(v as Record<string, unknown>, key));
    } else {
      out[key] = String(v ?? "");
    }
  }
  return out;
}

function unflatten(obj: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const parts = k.split(".");
    let current: Record<string, unknown> = result;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]!;
      if (i === parts.length - 1) {
        current[p] = v;
      } else {
        current[p] = (current[p] as Record<string, unknown>) ?? {};
        current = current[p] as Record<string, unknown>;
      }
    }
  }
  return result;
}

export default function MessagesClient({ title }: MessagesClientProps) {
  const t = useTranslations("AdminI18n");
  const [locale, setLocale] = useState("en");
  const [ns, setNs] = useState<"base" | "admin">("base");
  const [kv, setKv] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState("");
  const { data: langs } = useSWR(`/api/admin/i18n/languages`, fetcher);
  const { data, mutate } = useSWR(
    () => `/api/admin/i18n/messages?locale=${locale}&ns=${ns}`,
    fetcher
  );

  useEffect(() => {
    if (data?.messages) setKv(flatten(data.messages));
  }, [data]);

  const filtered = useMemo(() => {
    if (!filter) return kv;
    const f = filter.toLowerCase();
    return Object.fromEntries(
      Object.entries(kv).filter(
        ([k, v]) => k.toLowerCase().includes(f) || v.toLowerCase().includes(f)
      )
    );
  }, [kv, filter]);

  const onSave = async () => {
    try {
      const res = await fetch(
        `/api/admin/i18n/messages?locale=${locale}&ns=${ns}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: unflatten(kv) }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      toast.success(t("saved"));
      mutate();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : t("failed");
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Users sayfası ile uyumlu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Üst Form Kartı */}
      <Card className="bg-blue-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div className="col-span-2">
              <label className="text-sm">{t("form.locale")}</label>
              <Select value={locale} onValueChange={setLocale}>
                <SelectTrigger className={ui.select.trigger}>
                  <SelectValue placeholder={t("form.selectLocale")} />
                </SelectTrigger>
                <SelectContent className={ui.select.content}>
                  {Array.isArray(langs?.languages) &&
                    langs.languages
                      .filter((l: { isActive: boolean }) => l.isActive)
                      .map((l: { code: string; name: string }) => (
                        <SelectItem
                          key={l.code}
                          value={l.code}
                          className={ui.select.item}
                        >
                          {l.code} — {l.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="text-sm">{t("form.namespace")}</label>
              <Select
                value={ns}
                onValueChange={(v) => setNs(v as "base" | "admin")}
              >
                <SelectTrigger className={ui.select.trigger}>
                  <SelectValue placeholder={t("form.namespace")} />
                </SelectTrigger>
                <SelectContent className={ui.select.content}>
                  <SelectItem value="base" className={ui.select.item}>
                    base
                  </SelectItem>
                  <SelectItem value="admin" className={ui.select.item}>
                    admin
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="text-sm">{t("search")}</label>
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="key or text"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mesajlar Kartı */}
      <Card className="bg-blue-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <CardHeader className="pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base md:text-lg">
              {t("messages")}
            </CardTitle>
            <Button
              onClick={onSave}
              className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
            >
              {t("save")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
            {Object.entries(filtered).map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center border rounded-md p-3"
              >
                <div className="md:col-span-2 text-sm font-semibold text-gray-700 dark:text-gray-300 break-all">
                  {k}
                </div>
                <div className="md:col-span-3">
                  <Textarea
                    value={v}
                    onChange={(e) =>
                      setKv((prev) => ({ ...prev, [k]: e.target.value }))
                    }
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
