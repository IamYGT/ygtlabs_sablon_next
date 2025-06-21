"use client";

import { useState } from "react";
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

const actionOptions = [
    { value: "access", label: "Erişim" },
    { value: "view", label: "Görüntüleme" },
    { value: "create", label: "Oluşturma" },
    { value: "edit", label: "Düzenleme" },
    { value: "delete", label: "Silme" },
];

const permissionTypeOptions = [
    { value: "admin", label: "Admin Yetkisi" },
    { value: "user", label: "Kullanıcı Yetkisi" },
];

export function CreatePermissionDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreatePermissionDialogProps) {
    const [loading, setLoading] = useState(false);
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
            toast.error("Kategori, kaynak yolu ve eylem alanları zorunludur");
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
                throw new Error(error.error || "Yetki oluşturulamadı");
            }

            const result = await response.json();
            toast.success(result.message || "Yetki başarıyla oluşturuldu");

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
                : "Yetki oluşturulurken bir hata oluştu";
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
                    <DialogTitle>Yeni Yetki Oluştur</DialogTitle>
                    <DialogDescription>
                        Yeni bir sistem yetkisi oluşturun. Bu yetki otomatik olarak super_admin rolüne atanacaktır.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleInputChange("category", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Kategori seçin" />
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
                        <Label htmlFor="resourcePath">Kaynak Yolu *</Label>
                        <Input
                            id="resourcePath"
                            value={formData.resourcePath}
                            onChange={(e) => handleInputChange("resourcePath", e.target.value)}
                            placeholder="Örn: /admin/users, admin, users"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="displayName">Görünen Ad</Label>
                        <Input
                            id="displayName"
                            value={formData.displayName}
                            onChange={(e) => handleInputChange("displayName", e.target.value)}
                            placeholder="Yetkinin görünen adı"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Açıklama</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Yetkinin açıklaması"
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
                        <Label htmlFor="isActive">Aktif</Label>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            İptal
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Oluşturuluyor..." : "Oluştur"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 