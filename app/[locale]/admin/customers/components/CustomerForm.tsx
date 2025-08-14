"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

interface CustomerFormFieldsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    company: string;
    notes: string;
    isActive: boolean;
  };
  onFieldChange: (field: string, value: string | boolean) => void;
}

export function CustomerForm({
  formData,
  onFieldChange,
}: CustomerFormFieldsProps) {
  const t = useTranslations("Customers");

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle>{t("form.basicInfo.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>{t("form.basicInfo.name")}</Label>
              <Input
                value={formData.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
              />
            </div>
            <div>
              <Label>{t("form.basicInfo.email")}</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => onFieldChange("email", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>{t("form.basicInfo.phone")}</Label>
              <Input
                value={formData.phone}
                onChange={(e) => onFieldChange("phone", e.target.value)}
              />
            </div>
            <div>
              <Label>{t("form.basicInfo.company")}</Label>
              <Input
                value={formData.company}
                onChange={(e) => onFieldChange("company", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>{t("form.basicInfo.notes")}</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => onFieldChange("notes", e.target.value)}
              placeholder={t("form.basicInfo.notesPlaceholder") || undefined}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle>{t("form.settings.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>{t("form.settings.publishStatus")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("form.settings.publishStatusDesc")}
              </p>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) => onFieldChange("isActive", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
