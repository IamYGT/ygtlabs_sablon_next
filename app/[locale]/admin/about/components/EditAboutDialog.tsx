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
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface About {
  id: string;
  about: string;
  mission: string;
  vision: string;
  roadmap: string;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  aboutData: About | null;
};

export function EditAboutDialog({
  open,
  onOpenChange,
  onSuccess,
  aboutData,
}: Props) {
  const t = useTranslations("About");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    about: '{"tr":"","en":""}',
    mission: '{"tr":"","en":""}',
    vision: '{"tr":"","en":""}',
    roadmap: '{"tr":"","en":""}',
  });

  useEffect(() => {
    if (aboutData) {
      setFormData({
        about: aboutData.about,
        mission: aboutData.mission,
        vision: aboutData.vision,
        roadmap: aboutData.roadmap,
      });
    }
  }, [aboutData]);

  const handleFieldChange = (
    field: string,
    lang: "tr" | "en",
    value: string
  ) => {
    setFormData((prev) => {
      const parsed = JSON.parse(prev[field as keyof typeof prev] || "{}");
      parsed[lang] = value;
      return { ...prev, [field]: JSON.stringify(parsed) };
    });
  };

  async function handleSubmit() {
    if (!aboutData) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/about/${aboutData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        toast.error(t("messages.updateError"));
        return;
      }
      toast.success(t("messages.updateSuccess"));
      onSuccess();
      onOpenChange(false);
    } catch (_e) {
      console.error("Update about error:", _e);
      toast.error(t("messages.updateError"));
    } finally {
      setLoading(false);
    }
  }

  const getFieldValue = (field: string, lang: "tr" | "en") => {
    try {
      const parsed = JSON.parse(
        formData[field as keyof typeof formData] || "{}"
      );
      return parsed[lang] || "";
    } catch (_e) {
      return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("dialogs.edit.title")}</DialogTitle>
          <DialogDescription>{t("dialogs.edit.description")}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {Object.keys(formData).map((field) => (
            <div key={field} className="col-span-2 grid grid-cols-2 gap-4">
              <h3 className="col-span-2 font-semibold">{t(field)}</h3>
              <div>
                <Label htmlFor={`${field}-tr-edit`}>Türkçe</Label>
                <Textarea
                  id={`${field}-tr-edit`}
                  value={getFieldValue(field, "tr")}
                  onChange={(e) =>
                    handleFieldChange(field, "tr", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor={`${field}-en-edit`}>English</Label>
                <Textarea
                  id={`${field}-en-edit`}
                  value={getFieldValue(field, "en")}
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
            {loading ? t("actions.updating") : t("actions.update")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
