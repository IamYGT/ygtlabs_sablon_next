"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlagWrapper } from "@/components/ui/flag-wrapper";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface CreateRouteDialogProps {
  locales: string[];
  onSuccess: () => void;
}

export function CreateRouteDialog({ locales, onSuccess }: CreateRouteDialogProps) {
  const t = useTranslations("AdminI18n");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    translations: {} as Record<string, string>,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error("Route name is required");
      return;
    }

    // En az bir çeviri olmalı
    const hasTranslations = Object.values(formData.translations).some(v => v);
    if (!hasTranslations) {
      toast.error("At least one translation is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/i18n/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create route");
      }

      toast.success("Route created successfully");
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        translations: {},
      });
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        {t("addRoute")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("addNewRoute")}</DialogTitle>
            <DialogDescription>
              {t("addNewRouteDescription")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Route Name</Label>
              <Input
                id="name"
                placeholder="/landing/example"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <p className="text-xs text-muted-foreground">
                Internal route name (e.g., /landing/contact)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Contact page route"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Translations</Label>
              <div className="space-y-3">
                {locales.map((locale) => (
                  <div key={locale} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 w-24">
                      <FlagWrapper
                        locale={locale}
                        className="w-5 h-4 rounded-[2px]"
                      />
                      <span className="text-sm font-medium">{locale}</span>
                    </div>
                    <Input
                      placeholder={`/${locale === 'tr' ? 'iletisim' : 'contact'}`}
                      value={formData.translations[locale] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          translations: {
                            ...formData.translations,
                            [locale]: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                URL paths for each language (e.g., /contact, /iletisim)
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t("saving") : t("save")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
