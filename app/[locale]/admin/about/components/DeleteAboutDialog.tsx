"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

interface About {
  id: string;
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  aboutData: About | null;
};

export function DeleteAboutDialog({
  open,
  onOpenChange,
  onSuccess,
  aboutData,
}: Props) {
  const t = useTranslations("About");
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!aboutData) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/about/${aboutData.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error(t("messages.deleteError"));
        return;
      }
      toast.success(t("messages.deleteSuccess"));
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Delete about error:", error);
      toast.error(t("messages.deleteError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("dialogs.delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("dialogs.delete.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {t("actions.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? t("actions.deleting") : t("actions.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
