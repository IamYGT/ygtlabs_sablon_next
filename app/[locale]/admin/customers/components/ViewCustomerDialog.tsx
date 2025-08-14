"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";
import type { Customer } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
};

export function ViewCustomerDialog({ open, onOpenChange, customer }: Props) {
  const t = useTranslations("Customers");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-6 bg-gradient-to-r from-gray-50/80 to-slate-50/80 dark:from-gray-800/80 dark:to-slate-800/80 -m-6 mb-0 p-6 rounded-t-lg">
          <DialogTitle>{t("dialogs.view.title")}</DialogTitle>
          <DialogDescription>{t("dialogs.view.description")}</DialogDescription>
        </DialogHeader>

        {customer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t("table.name")}</Label>
                <div className="mt-1 text-sm font-medium">{customer.name}</div>
              </div>
              <div>
                <Label>{t("table.status")}</Label>
                <div className="mt-1">
                  <Badge variant={customer.isActive ? "default" : "secondary"}>
                    {customer.isActive
                      ? t("status.active")
                      : t("status.inactive")}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>{t("table.email")}</Label>
                <div className="mt-1 text-sm">{customer.email || "-"}</div>
              </div>
              <div>
                <Label>{t("table.phone")}</Label>
                <div className="mt-1 text-sm">{customer.phone || "-"}</div>
              </div>
              <div>
                <Label>{t("table.company")}</Label>
                <div className="mt-1 text-sm">{customer.company || "-"}</div>
              </div>
              <div>
                <Label>{t("fields.createdAt")}</Label>
                <div className="mt-1 text-sm">
                  {new Date(customer.createdAt).toLocaleString("tr-TR")}
                </div>
              </div>
              <div>
                <Label>{t("fields.updatedAt")}</Label>
                <div className="mt-1 text-sm">
                  {new Date(customer.updatedAt).toLocaleString("tr-TR")}
                </div>
              </div>
            </div>
            <div>
              <Label>{t("form.basicInfo.notes")}</Label>
              <Textarea
                readOnly
                value={
                  customer.notes ? JSON.stringify(customer.notes, null, 2) : "-"
                }
                className="mt-1 text-sm"
                rows={4}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
