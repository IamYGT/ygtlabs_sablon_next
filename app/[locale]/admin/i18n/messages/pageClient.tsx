"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface MessagesClientProps { title: string }

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
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
  const { data, mutate } = useSWR(() => `/api/admin/i18n/messages?locale=${locale}&ns=${ns}`, fetcher);

  useEffect(() => {
    if (data?.messages) setKv(flatten(data.messages));
  }, [data]);

  const filtered = useMemo(() => {
    if (!filter) return kv;
    const f = filter.toLowerCase();
    return Object.fromEntries(Object.entries(kv).filter(([k, v]) => k.toLowerCase().includes(f) || v.toLowerCase().includes(f)));
  }, [kv, filter]);

  const onSave = async () => {
    try {
      const res = await fetch(`/api/admin/i18n/messages?locale=${locale}&ns=${ns}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: unflatten(kv) }),
      });
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
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="col-span-2">
            <label className="text-sm">{t("form.locale")}</label>
            <Select value={locale} onValueChange={setLocale}>
              <SelectTrigger><SelectValue placeholder={t("form.selectLocale")} /></SelectTrigger>
              <SelectContent>
                {Array.isArray(langs?.languages) && langs.languages.filter((l: { isActive: boolean }) => l.isActive).map((l: { code: string; name: string }) => (
                  <SelectItem key={l.code} value={l.code}>{l.code} — {l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <label className="text-sm">{t("form.namespace")}</label>
            <Select value={ns} onValueChange={(v) => setNs(v as "base" | "admin")}>
              <SelectTrigger><SelectValue placeholder={t("form.namespace")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="base">base</SelectItem>
                <SelectItem value="admin">admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <label className="text-sm">{t("search")}</label>
            <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="key or text" />
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-medium">{t("messages")}</h2>
          <Button onClick={onSave}>{t("save")}</Button>
        </div>
        <div className="space-y-2 max-h-[60vh] overflow-auto pr-1">
          {Object.entries(filtered).map(([k, v]) => (
            <div key={k} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center border rounded-md p-3">
              <div className="md:col-span-2 text-xs font-mono break-all">{k}</div>
              <div className="md:col-span-3">
                <Textarea value={v} onChange={(e) => setKv((prev) => ({ ...prev, [k]: e.target.value }))} rows={2} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


