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
import { Edit, Save, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CustomerForm } from "./CustomerForm";
import type { Customer } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSuccess: () => void;
};

export function EditCustomerDialog({
  open,
  onOpenChange,
  customer,
  onSuccess,
}: Props) {
  const t = useTranslations("Customers");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
    isActive: true,
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        company: customer.company || "",
        notes:
          typeof customer.notes === "string"
            ? customer.notes
            : JSON.stringify(customer.notes, null, 2) || "",
        isActive: customer.isActive,
      });
    }
  }, [customer]);

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit() {
    if (!customer) return;
    if (!formData.name) {
      toast.error(t("form.validation.nameRequired"));
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        isActive: formData.isActive,
        notes: formData.notes || undefined,
      };
      const res = await fetch(`/api/admin/customers/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        toast.error(t("messages.updateError"));
        return;
      }
      toast.success(t("messages.updateSuccess"));
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Update customer error:", error);
      toast.error(t("messages.updateError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-blue-50 dark:bg-slate-900 backdrop-blur-sm p-0 border border-gray-200 dark:border-gray-800">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 p-3 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
              <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {t("dialogs.edit.title")}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {t("dialogs.edit.description")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="p-6">
          {customer && (
            <CustomerForm
              formData={formData}
              onFieldChange={handleFieldChange}
            />
          )}
        </div>
        <DialogFooter className="p-3 bg-gray-100/80 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            {t("actions.cancel")}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                {t("actions.saving")}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {t("actions.save")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
