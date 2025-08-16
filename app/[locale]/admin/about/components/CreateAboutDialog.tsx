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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export function CreateAboutDialog({ open, onOpenChange, onSuccess }: Props) {
  const t = useTranslations("About");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    about: '{"tr":"","en":""}',
    mission: '{"tr":"","en":""}',
    vision: '{"tr":"","en":""}',
    roadmap: '{"tr":"","en":""}',
  });

  const handleFieldChange = (
    field: string,
    lang: "tr" | "en",
    value: string
  ) => {
    setFormData((prev) => {
      const parsed = JSON.parse(prev[field as keyof typeof prev]);
      parsed[lang] = value;
      return { ...prev, [field]: JSON.stringify(parsed) };
    });
  };

  const resetForm = () => {
    setFormData({
      about: '{"tr":"","en":""}',
      mission: '{"tr":"","en":""}',
      vision: '{"tr":"","en":""}',
      roadmap: '{"tr":"","en":""}',
    });
  };

  async function handleSubmit() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        toast.error(t("messages.createError"));
        return;
      }
      toast.success(t("messages.createSuccess"));
      resetForm();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Create about error:", error);
      toast.error(t("messages.createError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("dialogs.create.title")}</DialogTitle>
          <DialogDescription>
            {t("dialogs.create.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {Object.keys(formData).map((field) => (
            <div key={field} className="col-span-2 grid grid-cols-2 gap-4">
              <h3 className="col-span-2 font-semibold">{t(field)}</h3>
              <div>
                <Label htmlFor={`${field}-tr`}>Türkçe</Label>
                <Textarea
                  id={`${field}-tr`}
                  onChange={(e) =>
                    handleFieldChange(field, "tr", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={`${field}-en`}>English</Label>
                <Textarea
                  id={`${field}-en`}
                  onChange={(e) =>
                    handleFieldChange(field, "en", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            {t("actions.cancel")}
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? t("actions.creating") : t("actions.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
