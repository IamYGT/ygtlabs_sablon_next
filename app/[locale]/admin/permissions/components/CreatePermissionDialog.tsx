"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface CreatePermissionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}



const resourceTypeOptions = [
    { value: "layout", label: "Layout" },
    { value: "page", label: "Page" },
    { value: "function", label: "Function" },
];

export function CreatePermissionDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreatePermissionDialogProps) {
    const t = useTranslations('AdminPermissions.createDialog');
    const [loading, setLoading] = useState(false);
    
    const actionOptions = [
        { value: "access", label: t('actions.access') },
        { value: "view", label: t('actions.view') },
        { value: "create", label: t('actions.create') },
        { value: "edit", label: t('actions.edit') },
        { value: "delete", label: t('actions.delete') },
    ];

    const permissionTypeOptions = [
        { value: "admin", label: t('permissionTypes.admin') },
        { value: "user", label: t('permissionTypes.user') },
    ];
    const [formData, setFormData] = useState({
        category: "layout",
        resourcePath: "",
        action: "",
        displayName: "",
        description: "",
        permissionType: "user",
        isActive: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.category || !formData.resourcePath || !formData.action) {
            toast.error(t('validation.fieldsRequired'));
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/admin/permissions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || t('error'));
            }

            const result = await response.json();
            toast.success(result.message || t('success'));

            // Form'u temizle
            setFormData({
                category: "layout",
                resourcePath: "",
                action: "",
                displayName: "",
                description: "",
                permissionType: "user",
                isActive: true,
            });

            onSuccess();
            onOpenChange(false);
        } catch (error: unknown) {
            console.error("Yetki oluşturma hatası:", error);
            const errorMessage = error && typeof error === "object" && "message" in error
                ? String(error.message)
                : t('error');
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: unknown) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>
                        {t('description')}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">{t('category')} *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleInputChange("category", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t('categoryPlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {resourceTypeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="action">Eylem *</Label>
                            <Select
                                value={formData.action}
                                onValueChange={(value) => handleInputChange("action", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Eylem seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {actionOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="resourcePath">{t('permissionName')} *</Label>
                        <Input
                            id="resourcePath"
                            value={formData.resourcePath}
                            onChange={(e) => handleInputChange("resourcePath", e.target.value)}
                            placeholder={t('permissionNamePlaceholder')}
                        />
                        <p className="text-sm text-muted-foreground">{t('permissionNameDescription')}</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="displayName">{t('displayName')}</Label>
                        <Input
                            id="displayName"
                            value={formData.displayName}
                            onChange={(e) => handleInputChange("displayName", e.target.value)}
                            placeholder={t('displayNamePlaceholder')}
                        />
                        <p className="text-sm text-muted-foreground">{t('displayNameDescription')}</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t('descriptionLabel')}</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder={t('descriptionPlaceholder')}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="permissionType">Yetki Türü</Label>
                        <Select
                            value={formData.permissionType}
                            onValueChange={(value) => handleInputChange("permissionType", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Yetki türü seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {permissionTypeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>



                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                        />
                        <Label htmlFor="isActive">{t('active')}</Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            {t('cancel')}
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? t('creating') : t('create')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 