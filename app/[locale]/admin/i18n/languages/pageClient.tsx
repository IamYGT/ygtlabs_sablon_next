"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface LanguagesClientProps { title: string }

export default function LanguagesClient({ title }: LanguagesClientProps) {
  const t = useTranslations("AdminI18n");
  const { data, isLoading, mutate } = useSWR(`/api/admin/i18n/languages`, fetcher);
  const [creating, setCreating] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [nativeName, setNativeName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isDefault, setIsDefault] = useState(false);
  const [urlPrefix, setUrlPrefix] = useState("");

  const onCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch(`/api/admin/i18n/languages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, nativeName, isActive, isDefault, urlPrefix }),
      });
      if (!res.ok) throw new Error(await res.text());
      await fetch(`/api/admin/i18n/locales`, { method: "POST" });
      toast.success(t("languageCreated"));
      mutate();
      setCode("");
      setName("");
      setNativeName("");
      setIsActive(true);
      setIsDefault(false);
      setUrlPrefix("");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed";
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const onAutoTranslateME = async () => {
    try {
      const res = await fetch(`/api/admin/i18n/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceLocale: "en", targetLocale: "me", ns: "base" }),
      });
      if (!res.ok) throw new Error(await res.text());
      const res2 = await fetch(`/api/admin/i18n/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceLocale: "en", targetLocale: "me", ns: "admin" }),
      });
      if (!res2.ok) throw new Error(await res2.text());
      toast.success(t("translatedME"));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed";
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
          <div className="col-span-1">
            <label className="text-sm">{t("form.code")}</label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder={t("placeholders.codeExample")} />
          </div>
          <div className="col-span-2">
            <label className="text-sm">{t("form.name")}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("placeholders.nameExample")} />
          </div>
          <div className="col-span-2">
            <label className="text-sm">{t("form.nativeName")}</label>
            <Input value={nativeName} onChange={(e) => setNativeName(e.target.value)} placeholder={t("placeholders.nativeNameExample")} />
          </div>
          <div className="col-span-2">
            <label className="text-sm">{t("form.urlPrefix")}</label>
            <Input value={urlPrefix} onChange={(e) => setUrlPrefix(e.target.value)} placeholder={t("placeholders.urlPrefixExample")} />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <span className="text-sm">{t("form.active")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isDefault} onCheckedChange={setIsDefault} />
            <span className="text-sm">{t("form.default")}</span>
          </div>
          <div className="col-span-2 md:col-span-1">
            <Button disabled={creating} onClick={onCreate} className="w-full">{creating ? t("saving") : t("create")}</Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium">{t("activeLanguages")}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => fetch(`/api/admin/i18n/locales`, { method: "POST" }).then(() => toast.success(t("localesGenerated")))}>
              {t("regenerateLocalesFile")}
            </Button>
            <Button variant="outline" onClick={() => fetch(`/api/admin/i18n/routing`, { method: "POST" }).then(() => toast.success(t("routingGenerated")))}>
              {t("generateRouting")}
            </Button>
          </div>
        </div>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">{t("loading")}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.isArray(data?.languages) && data.languages.map((lng: { code: string; name: string; nativeName?: string; isDefault?: boolean; urlPrefix?: string | null }) => (
              <div key={lng.code} className="flex items-center justify-between border rounded-md p-3">
                <div className="space-y-1">
                  <div className="font-medium">{lng.code} — {lng.name}</div>
                  <div className="text-xs text-muted-foreground">{lng.nativeName} {lng.urlPrefix ? `(/${lng.urlPrefix})` : null}</div>
                </div>
                {lng.isDefault && <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">{t("default")}</span>}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">{t("autoTranslateME")}</h2>
          <Button onClick={onAutoTranslateME}>{t("run")}</Button>
        </div>
        <p className="text-sm text-muted-foreground">{t("autoTranslateMEDesc")}</p>
      </Card>
    </div>
  );
}


