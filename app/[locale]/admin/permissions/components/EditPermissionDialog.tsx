"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    Edit,
    Shield,
    Info,
    Settings,
    Eye,
    ChevronLeft,
    ChevronRight,
    Calendar,
    User,
    Check,
    AlertTriangle,
    Layout,
    Zap
} from "lucide-react";

// Utility fonksiyonları
interface LocalizedValue {
    tr?: string;
    en?: string;
    [key: string]: string | undefined;
}

function parseJSONField(value: string | LocalizedValue | null | undefined, locale: string = 'tr'): string {
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value) as LocalizedValue;
            return parsed?.[locale] || value;
        } catch {
            return value;
        }
    }
    
    if (typeof value === 'object' && value !== null) {
        return value[locale] || value.en || Object.values(value)[0] || '';
    }
    
    return value || '';
}

function formatPermissionDisplayName(permission: Permission, locale: string = 'tr'): string {
    const displayName = parseJSONField(permission.displayName, locale);
    
    if (displayName && displayName !== permission.displayName) {
        return displayName;
    }
    
    return `${permission.resourceType}:${permission.resourcePath}:${permission.action}`;
}

function formatPermissionDescription(permission: Permission, locale: string = 'tr'): string {
    const description = parseJSONField(permission.description, locale);
    
    if (description && description !== permission.description) {
        return description;
    }
    
    return `${permission.resourceType} ${permission.action} yetkisi`;
}

interface Permission {
    id: string;
    roleName: string;
    resourceType: string;
    resourcePath: string;
    action: string;
    displayName?: string;
    description?: string;
    category?: string;
    permissionType?: string;
    isActive: boolean;
    isSystemPermission: boolean;
    createdAt: string;
    updatedAt: string;
    role?: {
        name: string;
        displayName: string;
        color?: string | null;
    };
    createdBy?: {
        id: string;
        name?: string;
        email?: string;
    };
    updatedBy?: {
        id: string;
        name?: string;
        email?: string;
    };
}

interface EditPermissionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    permission: Permission;
    onSuccess: () => void;
}

// Wizard adımları
const WIZARD_STEPS = [
    { id: 'overview', title: 'Genel Bakış', description: 'Yetki bilgileri ve özeti' },
    { id: 'details', title: 'Düzenleme', description: 'Yetki detaylarını güncelleyin' },
    { id: 'settings', title: 'Ayarlar', description: 'Kategori ve durum ayarları' },
    { id: 'review', title: 'Önizleme', description: 'Değişiklikleri gözden geçirin' }
];

const categoryOptions = [
    { value: "layout", label: "Layout", icon: Layout, color: "bg-blue-100 text-blue-800" },
    { value: "view", label: "Görüntüleme", icon: Eye, color: "bg-green-100 text-green-800" },
    { value: "function", label: "İşlevler", icon: Zap, color: "bg-purple-100 text-purple-800" },
];

const permissionTypeOptions = [
    { value: "admin", label: "Admin Yetkisi", color: "bg-red-100 text-red-800" },
    { value: "user", label: "Kullanıcı Yetkisi", color: "bg-blue-100 text-blue-800" },
];

export function EditPermissionDialog({
    open,
    onOpenChange,
    permission,
    onSuccess,
}: EditPermissionDialogProps) {
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        displayName: "",
        description: "",
        category: "layout",
        permissionType: "user",
        isActive: true,
    });

    // Progress hesaplama
    const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

    useEffect(() => {
        if (permission && open) {
            setCurrentStep(0);
            setFormData({
                displayName: formatPermissionDisplayName(permission),
                description: formatPermissionDescription(permission),
                category: permission.category || permission.resourceType || "layout",
                permissionType: permission.permissionType || "user",
                isActive: permission.isActive,
            });
        }
    }, [permission, open]);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // JSON formatına çevir
            const requestData = {
                displayName: JSON.stringify({ tr: formData.displayName }),
                description: JSON.stringify({ tr: formData.description }),
                category: formData.category,
                permissionType: formData.permissionType,
                isActive: formData.isActive,
            };

            const response = await fetch(`/api/admin/permissions/${permission.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Yetki güncellenemedi");
            }

            const result = await response.json();
            toast.success(result.message || "Yetki başarıyla güncellendi");

            onSuccess();
            onOpenChange(false);
        } catch (error: unknown) {
            console.error("Yetki güncelleme hatası:", error);
            const errorMessage = error && typeof error === "object" && "message" in error
                ? String(error.message)
                : "Yetki güncellenirken bir hata oluştu";
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

    // Sonraki adıma geç
    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1));
    };

    // Önceki adıma dön
    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    // Resource type ikonu
    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'layout':
                return <Layout className="h-4 w-4" />;
            case 'view':
                return <Eye className="h-4 w-4" />;
            case 'function':
                return <Zap className="h-4 w-4" />;
            default:
                return <Shield className="h-4 w-4" />;
        }
    };

    // Genel Bakış adımı
    const renderOverviewStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Yetki Bilgileri</h3>
                <p className="text-muted-foreground text-sm">
                    Düzenlemek istediğiniz yetkinin mevcut bilgileri
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        {getResourceIcon(permission.resourceType)}
                        <div>
                            <h4 className="text-lg font-semibold">
                                {formatPermissionDisplayName(permission)}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {permission.resourceType}:{permission.resourcePath}:{permission.action}
                            </p>
                        </div>
                        <div className="flex gap-2 ml-auto">
                            <Badge variant={permission.isActive ? "default" : "secondary"}>
                                {permission.isActive ? (
                                    <>
                                        <Check className="w-3 h-3 mr-1" />
                                        Aktif
                                    </>
                                ) : (
                                    <>
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Pasif
                                    </>
                                )}
                            </Badge>
                            <Badge variant="outline">
                                {permission.permissionType === 'admin' ? 'Admin' : 'User'}
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm font-medium mb-1">Açıklama</p>
                        <p className="text-sm text-muted-foreground">
                            {formatPermissionDescription(permission)}
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <Shield className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                            <p className="text-sm font-bold">{permission.category}</p>
                            <p className="text-xs text-muted-foreground">Kategori</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <User className="w-6 h-6 mx-auto mb-2 text-green-500" />
                            <p className="text-sm font-bold">{permission.permissionType || 'user'}</p>
                            <p className="text-xs text-muted-foreground">Tür</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                            <p className="text-xs font-bold">
                                {new Date(permission.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                            <p className="text-xs text-muted-foreground">Oluşturma</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <Badge variant="outline" className="w-full">
                                {permission.role?.displayName || permission.roleName || 'Bilinmeyen'}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">Rol</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // Düzenleme adımı
    const renderDetailsStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Yetki Detayları</h3>
                <p className="text-muted-foreground text-sm">
                    Yetkinin görünen adını ve açıklamasını güncelleyin
                </p>
            </div>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Edit className="w-4 h-4" />
                            Temel Bilgiler
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Görünen Ad</Label>
                            <Input
                                id="displayName"
                                value={formData.displayName}
                                onChange={(e) => handleInputChange("displayName", e.target.value)}
                                placeholder="Yetkinin Türkçe adı"
                            />
                            <p className="text-xs text-muted-foreground">
                                Bu ad kullanıcı arayüzünde görüntülenecek
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Yetkinin ne işe yaradığını açıklayın"
                                rows={3}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Değiştirilemez bilgiler */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Info className="w-4 h-4" />
                            Sistem Bilgileri (Değiştirilemez)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Kaynak Türü:</span>
                                <Badge variant="outline">{permission.resourceType}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Eylem:</span>
                                <Badge variant="outline">{permission.action}</Badge>
                            </div>
                            <div className="col-span-2 flex justify-between">
                                <span className="text-muted-foreground">Kaynak Yolu:</span>
                                <code className="bg-muted px-2 py-1 rounded text-xs">
                                    {permission.resourcePath}
                                </code>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    // Ayarlar adımı
    const renderSettingsStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Yetki Ayarları</h3>
                <p className="text-muted-foreground text-sm">
                    Kategori ve yetki türü ayarlarını yapın
                </p>
            </div>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Settings className="w-4 h-4" />
                            Kategori
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Select
                            value={formData.category}
                            onValueChange={(value) => handleInputChange("category", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Kategori seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-4 h-4" />
                                                {option.label}
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Shield className="w-4 h-4" />
                            Yetki Türü
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                        <div className="flex items-center gap-2">
                                            <div className={`w-3 h-3 rounded-full ${option.color}`} />
                                            {option.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                            Admin yetkisi sadece yöneticiler tarafından kullanılabilir
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Check className="w-4 h-4" />
                            Durum
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Yetki Aktif</p>
                                <p className="text-sm text-muted-foreground">
                                    Pasif yetkiler sistemde kullanılamaz
                                </p>
                            </div>
                            <Switch
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    // Önizleme adımı
    const renderReviewStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Değişiklik Önizlemesi</h3>
                <p className="text-muted-foreground text-sm">
                    Yetki güncellenmeden önce değişiklikleri kontrol edin
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        {getResourceIcon(permission.resourceType)}
                        <div>
                            <h4 className="text-lg font-semibold">{formData.displayName}</h4>
                            <p className="text-sm text-muted-foreground">
                                {permission.resourceType}:{permission.resourcePath}:{permission.action}
                            </p>
                        </div>
                        <div className="flex gap-2 ml-auto">
                            <Badge variant={formData.isActive ? "default" : "secondary"}>
                                {formData.isActive ? (
                                    <>
                                        <Check className="w-3 h-3 mr-1" />
                                        Aktif
                                    </>
                                ) : (
                                    <>
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Pasif
                                    </>
                                )}
                            </Badge>
                            <Badge variant="outline">
                                {formData.permissionType === 'admin' ? 'Admin' : 'User'}
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm font-medium mb-1">Açıklama</p>
                        <p className="text-sm text-muted-foreground">{formData.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Önceki Değerler</p>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Ad:</span> {formatPermissionDisplayName(permission)}</p>
                                <p><span className="font-medium">Açıklama:</span> {formatPermissionDescription(permission)}</p>
                                <p><span className="font-medium">Kategori:</span> {permission.category}</p>
                                <p><span className="font-medium">Tür:</span> {permission.permissionType}</p>
                                <p><span className="font-medium">Durum:</span> {permission.isActive ? 'Aktif' : 'Pasif'}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-primary">Yeni Değerler</p>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Ad:</span> {formData.displayName}</p>
                                <p><span className="font-medium">Açıklama:</span> {formData.description}</p>
                                <p><span className="font-medium">Kategori:</span> {formData.category}</p>
                                <p><span className="font-medium">Tür:</span> {formData.permissionType}</p>
                                <p><span className="font-medium">Durum:</span> {formData.isActive ? 'Aktif' : 'Pasif'}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Audit bilgileri */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Calendar className="w-4 h-4" />
                        Geçmiş Bilgileri
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Oluşturulma:</span>
                            <div className="mt-1">
                                <p className="font-mono text-xs">
                                    {new Date(permission.createdAt).toLocaleString("tr-TR")}
                                </p>
                                {permission.createdBy && (
                                    <p className="text-xs text-muted-foreground">
                                        {permission.createdBy.name || permission.createdBy.email}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Son Güncelleme:</span>
                            <div className="mt-1">
                                <p className="font-mono text-xs">
                                    {new Date(permission.updatedAt).toLocaleString("tr-TR")}
                                </p>
                                {permission.updatedBy && (
                                    <p className="text-xs text-muted-foreground">
                                        {permission.updatedBy.name || permission.updatedBy.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="w-5 h-5" />
                        Yetki Düzenle - {formatPermissionDisplayName(permission)}
                    </DialogTitle>
                    <DialogDescription>
                        {WIZARD_STEPS[currentStep].description}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        {WIZARD_STEPS.map((step, index) => (
                            <span 
                                key={step.id} 
                                className={`cursor-pointer transition-colors ${
                                    index <= currentStep ? 'text-primary font-medium' : ''
                                }`}
                                onClick={() => setCurrentStep(index)}
                            >
                                {step.title}
                            </span>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Step Content */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {currentStep === 0 && renderOverviewStep()}
                    {currentStep === 1 && renderDetailsStep()}
                    {currentStep === 2 && renderSettingsStep()}
                    {currentStep === 3 && renderReviewStep()}
                </div>

                {/* Footer */}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => currentStep === 0 ? onOpenChange(false) : prevStep()}
                        disabled={loading}
                    >
                        {currentStep === 0 ? (
                            'İptal'
                        ) : (
                            <>
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Geri
                            </>
                        )}
                    </Button>

                    <div className="flex items-center gap-2">
                        {currentStep < WIZARD_STEPS.length - 1 ? (
                            <Button
                                onClick={nextStep}
                                disabled={loading}
                            >
                                Devam Et
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Güncelleniyor...' : 'Yetki Güncelle'}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 