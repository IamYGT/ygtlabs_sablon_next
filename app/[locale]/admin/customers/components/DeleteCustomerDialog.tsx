"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { Customer } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSuccess: () => void;
};

export function DeleteCustomerDialog({
  open,
  onOpenChange,
  customer,
  onSuccess,
}: Props) {
  const t = useTranslations("Customers");

  async function handleDelete() {
    if (!customer) return;
    const res = await fetch(`/api/admin/customers/${customer.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error(t("messages.deleteError"));
      return;
    }
    toast.success(t("messages.deleteSuccess"));
    onSuccess();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-6 bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-950/30 dark:to-rose-950/30 -m-6 mb-0 p-6 rounded-t-lg">
          <DialogTitle>{t("dialogs.delete.title")}</DialogTitle>
          <DialogDescription>
            {t("dialogs.delete.description")}
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">
          {customer ? `"${customer.name}" ` : ""}
          {t("actions.delete")}?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("dialogs.delete.cancel")}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            {t("dialogs.delete.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

