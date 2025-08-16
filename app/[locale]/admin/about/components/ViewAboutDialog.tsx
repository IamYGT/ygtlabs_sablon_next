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
import { useTranslations } from "next-intl";

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
  aboutData: About | null;
  locale: "tr" | "en";
};

function parseJSONField(
  value: string | unknown,
  locale: string = "tr"
): string {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed?.[locale] || value;
    } catch {
      return value;
    }
  }
  return String(value || "");
}

export function ViewAboutDialog({
  open,
  onOpenChange,
  aboutData,
  locale,
}: Props) {
  const t = useTranslations("About");

  if (!aboutData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{t("dialogs.view.title")}</DialogTitle>
          <DialogDescription>{t("dialogs.view.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-semibold">{t("about")}</h3>
            <p>{parseJSONField(aboutData.about, locale)}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t("mission")}</h3>
            <p>{parseJSONField(aboutData.mission, locale)}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t("vision")}</h3>
            <p>{parseJSONField(aboutData.vision, locale)}</p>
          </div>
          <div>
            <h3 className="font-semibold">{t("roadmap")}</h3>
            <p>{parseJSONField(aboutData.roadmap, locale)}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {t("actions.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
