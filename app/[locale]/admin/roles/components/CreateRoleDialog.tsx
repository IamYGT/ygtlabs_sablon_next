'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from 'react-hot-toast';
import {
    Crown,
    Users,
    Plus,
    Shield,
    Settings,
    FileText,
    Activity,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Check,
    AlertCircle,
    X
} from 'lucide-react';
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
    // Eğer displayName zaten string ise (API'den formatlanmış geliyorsa) direkt kullan
    if (typeof permission.displayName === 'string' && permission.displayName !== permission.name) {
        return permission.displayName;
    }

    const displayName = parseJSONField(permission.displayName, locale);

    if (displayName && displayName !== permission.displayName && displayName.trim() !== '') {
        return displayName;
    }

    // Fallback: Daha okunabilir format
    const categoryMap: Record<string, string> = {
        layout: 'Layout',
        view: 'Görüntüleme',
        function: 'İşlev'
    };

    const actionMap: Record<string, string> = {
        access: 'Erişimi',
        view: 'Görüntüleme',
        create: 'Oluşturma',
        edit: 'Düzenleme',
        delete: 'Silme'
    };

    const categoryName = categoryMap[permission.category] || permission.category;
    const actionName = actionMap[permission.action] || permission.action;
    const resourceName = permission.resourcePath.replace(/^\//, '').replace(/\//g, ' ');

    return `${categoryName} - ${resourceName} ${actionName}`;
}

function formatPermissionDescription(permission: Permission, locale: string = 'tr'): string {
    // Eğer description zaten string ise (API'den formatlanmış geliyorsa) direkt kullan
    if (typeof permission.description === 'string' && permission.description !== permission.name) {
        return permission.description;
    }

    const description = parseJSONField(permission.description, locale);

    if (description && description !== permission.description && description.trim() !== '') {
        return description;
    }

    // Fallback: Daha açıklayıcı format
    const categoryMap: Record<string, string> = {
        layout: 'layout erişim',
        view: 'görüntüleme',
        function: 'işlev'
    };

    const actionMap: Record<string, string> = {
        access: 'erişim',
        view: 'görüntüleme',
        create: 'oluşturma',
        edit: 'düzenleme',
        delete: 'silme'
    };

    const categoryName = categoryMap[permission.category] || permission.category;
    const actionName = actionMap[permission.action] || permission.action;

    return `${permission.resourcePath} için ${categoryName} ${actionName} yetkisi`;
}

function formatPermissionsList(permissions: Permission[], locale: string = 'tr'): Permission[] {
    return permissions.map(permission => ({
        ...permission,
        displayName: formatPermissionDisplayName(permission, locale),
        description: formatPermissionDescription(permission, locale),
    }));
}



interface Permission {
    id: string;
    name: string;
    category: string;
    resourcePath: string;
    action: string;
    displayName: string;
    description: string;
    permissionType?: string;
}

interface CreateRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRoleCreated: () => void;
}

// Önceden tanımlı rol şablonları
const ROLE_TEMPLATES = {
    admin: {
        name: 'Sistem Yöneticisi',
        description: 'Tüm sistem yetkilerine sahip ana yönetici',
        accessType: 'admin' as const,
        color: '#ef4444',
        icon: Crown,
        permissions: ['function.users.edit', 'function.roles.edit', 'function.permissions.view']
    },
    moderator: {
        name: 'Moderatör',
        description: 'Sınırlı admin yetkilerine sahip içerik yöneticisi',
        accessType: 'admin' as const,
        color: '#f59e0b',
        icon: Shield,
        permissions: ['function.users.view', 'view.users.list']
    },

    member: {
        name: 'Üye',
        description: 'Temel kullanıcı yetkilerine sahip standart üye',
        accessType: 'user' as const,
        color: '#06b6d4',
        icon: Users,
        permissions: []
    },
    vip: {
        name: 'VIP Üye',
        description: 'Gelişmiş özelliklere erişimi olan premium üye',
        accessType: 'user' as const,
        color: '#10b981',
        icon: Sparkles,
        permissions: ['view.premium.access', 'function.premium.features']
    }
};

// Popüler renk paleti
const COLOR_PALETTE = [
    '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981',
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#d946ef', '#ec4899', '#f43f5e', '#64748b', '#374151'
];

// Wizard adımları
const WIZARD_STEPS = [
    { id: 'template', title: 'Şablon Seç', description: 'Hızlı başlangıç için şablon seçin' },
    { id: 'details', title: 'Rol Detayları', description: 'Rol bilgilerini girin' },
    { id: 'permissions', title: 'Yetkiler', description: 'Rol yetkilerini belirleyin' },
    { id: 'review', title: 'Önizleme', description: 'Ayarları gözden geçirin' }
];

// Rol adından kod oluşturma fonksiyonu
const generateRoleCode = (displayName: string): string => {
    return displayName
        .toLowerCase()
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ş/g, 's')
        .replace(/ü/g, 'u')
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
};

export default function CreateRoleDialog({
    open,
    onOpenChange,
    onRoleCreated,
}: CreateRoleDialogProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
    const [formData, setFormData] = useState({
        displayName: '',
        description: '',
        accessType: 'user' as 'admin' | 'user',
        color: '#6366f1',
    });

    // Form validation
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Yetkileri yükle - useCallback ile stable hale getir
    const loadPermissions = useCallback(async () => {
        if (loadingPermissions || availablePermissions.length > 0) return; // Zaten yüklenmişse tekrar yükleme

        setLoadingPermissions(true);
        try {
            console.log('🔄 Loading permissions from API...');
            const response = await fetch('/api/admin/permissions?limit=1000');
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Permissions loaded:', data.permissions?.length || 0);

                // Permission verilerini formatla
                const formattedPermissions = formatPermissionsList(data.permissions || []);
                setAvailablePermissions(formattedPermissions);
            } else {
                console.error('❌ Failed to load permissions:', response.status);
                toast.error('Yetkiler yüklenirken hata oluştu');
            }
        } catch (error) {
            console.error('❌ Permission loading error:', error);
            toast.error('Yetkiler yüklenirken bir hata oluştu');
        } finally {
            setLoadingPermissions(false);
        }
    }, [loadingPermissions, availablePermissions.length]);

    // Dialog açıldığında sıfırla
    useEffect(() => {
        if (open) {
            setCurrentStep(0);
            setSelectedTemplate('');
            setFormData({
                displayName: '',
                description: '',
                accessType: 'user',
                color: '#6366f1',
            });
            setSelectedPermissions(new Set());
            setErrors({});
            // Permissions'ları sadece bir kez yükle
            if (availablePermissions.length === 0) {
                loadPermissions();
            }
        }
    }, [open, availablePermissions.length, loadPermissions]);

    // Template seçildiğinde form'u doldur
    const handleTemplateSelect = (templateKey: string) => {
        const wasSelected = selectedTemplate === templateKey;

        if (wasSelected) {
            // Aynı template tekrar seçilirse temizle
            setSelectedTemplate('');
            setFormData({
                displayName: '',
                description: '',
                accessType: 'user',
                color: '#6366f1',
            });
            setSelectedPermissions(new Set());
        } else {
            // Yeni template seç
            setSelectedTemplate(templateKey);
            if (ROLE_TEMPLATES[templateKey as keyof typeof ROLE_TEMPLATES]) {
                const template = ROLE_TEMPLATES[templateKey as keyof typeof ROLE_TEMPLATES];
                setFormData({
                    displayName: template.name,
                    description: template.description,
                    accessType: template.accessType,
                    color: template.color,
                });

                // Template yetkilerini seç - permissions yüklenmişse
                if (availablePermissions.length > 0) {
                    applyTemplatePermissions(template);
                }
            }
        }
    };

    // Template yetkilerini uygula
    const applyTemplatePermissions = (template: typeof ROLE_TEMPLATES[keyof typeof ROLE_TEMPLATES]) => {
        const templatePermissions = new Set<string>();

        // Sadece template'e özel yetkileri ekle (layout hariç)
        template.permissions.forEach(permName => {
            const permission = availablePermissions.find(p =>
                `${p.category}.${p.resourcePath}.${p.action}` === permName
            );
            if (permission) {
                templatePermissions.add(permission.id);
            }
        });

        setSelectedPermissions(templatePermissions);
    };

    // Form validation
    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) { // Details step
            if (!formData.displayName.trim()) {
                newErrors.displayName = 'Rol adı gereklidir';
            }
            if (formData.displayName.length > 50) {
                newErrors.displayName = 'Rol adı 50 karakterden fazla olamaz';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Sonraki adıma geç
    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1));
        }
    };

    // Önceki adıma dön
    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    // Erişim tipine göre yetkileri filtrele (layout hariç) - useMemo ile optimize et

    // Yetkileri kategoriye göre grupla - useMemo ile optimize et

    // Progress hesapla
    const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

    // Yetki seçimini değiştir

    // Kategori bazında yetki seçimi

    // Kategori ikonu
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'layout': return <Settings className="w-4 h-4" />;
            case 'view': return <FileText className="w-4 h-4" />;
            case 'function': return <Activity className="w-4 h-4" />;
            default: return <Shield className="w-4 h-4" />;
        }
    };

    // Kategori rengi

    // Form submit
    const handleSubmit = async () => {
        if (!validateStep(1)) return;

        setLoading(true);
        try {
            const permissions = Array.from(selectedPermissions);

            // Layout permission'ını otomatik ekle
            const layoutPermission = availablePermissions.find(p =>
                p.category === 'layout' &&
                p.resourcePath === formData.accessType &&
                p.action === 'access'
            );
            if (layoutPermission && !permissions.includes(layoutPermission.id)) {
                permissions.push(layoutPermission.id);
            }

            const response = await fetch('/api/admin/roles/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: generateRoleCode(formData.displayName),
                    displayName: formData.displayName,
                    description: formData.description,
                    layoutType: formData.accessType,
                    color: formData.color,
                    permissions,
                }),
            });

            if (response.ok) {
                toast.success('Rol başarıyla oluşturuldu');
                onRoleCreated();
                onOpenChange(false);
            } else {
                const error = await response.json();
                toast.error(error.error || 'Rol oluşturulamadı');
            }
        } catch (error) {
            console.error('Role creation error:', error);
            toast.error('Rol oluşturulurken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const renderTemplateStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Rol Şablonu Seçin</h3>
                <p className="text-muted-foreground text-sm">
                    Hızlı başlangıç için önceden tanımlı şablonlardan birini seçin veya boş başlayın
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(ROLE_TEMPLATES).map(([key, template]) => {
                    const Icon = template.icon;
                    const isSelected = selectedTemplate === key;

                    return (
                        <Card
                            key={key}
                            className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'ring-2 ring-primary border-primary' : ''
                                }`}
                            onClick={() => handleTemplateSelect(key)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="p-2 rounded-lg"
                                        style={{ backgroundColor: `${template.color}20`, color: template.color }}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-base">{template.name}</CardTitle>
                                        <Badge
                                            variant="outline"
                                            className="mt-1"
                                        >
                                            {template.accessType === 'admin' ? 'Admin' : 'User'}
                                        </Badge>
                                    </div>
                                    {isSelected && (
                                        <Check className="w-5 h-5 text-primary" />
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="text-sm text-muted-foreground">
                                    {template.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="text-center">
                <Button
                    variant="outline"
                    onClick={() => {
                        setSelectedTemplate('');
                        setFormData({
                            displayName: '',
                            description: '',
                            accessType: 'user',
                            color: '#6366f1',
                        });
                        setSelectedPermissions(new Set());
                        // Direkt 2. adıma geç
                        setCurrentStep(1);
                    }}
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Şablon kullanmadan devam et
                </Button>
            </div>
        </div>
    );

    const renderDetailsStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Rol Detayları</h3>
                <p className="text-muted-foreground text-sm">
                    Rolün temel bilgilerini girin
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="displayName">Rol Adı *</Label>
                    <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder="Rol adını girin"
                        className={errors.displayName ? 'border-red-500' : ''}
                    />
                    {errors.displayName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.displayName}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Sistem kodu: {generateRoleCode(formData.displayName || 'ornek_rol')}
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Rol açıklaması"
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Erişim Tipi</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={formData.accessType === 'user' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                    console.log('🔄 Access type changed to: user');
                                    setFormData(prev => ({ ...prev, accessType: 'user' }));

                                    // Erişim tipi değiştiğinde uyumsuz yetkileri kaldır ve uygun layout access yetkisi ekle
                                    const newSelectedPermissions = new Set<string>();
                                    let keptCount = 0;
                                    let removedCount = 0;

                                    selectedPermissions.forEach(permissionId => {
                                        const permission = availablePermissions.find(p => p.id === permissionId);
                                        if (permission) {
                                            const permissionType = permission.permissionType || 'user';
                                            // Layout yetkileri hariç, sadece user tipindeki yetkileri koru
                                            if (permission.category !== 'layout' && permissionType === 'user') {
                                                newSelectedPermissions.add(permissionId);
                                                keptCount++;
                                            } else {
                                                removedCount++;
                                            }
                                        }
                                    });

                                    // Otomatik layout.user.access yetkisi ekle
                                    const layoutPermission = availablePermissions.find(p =>
                                        p.category === 'layout' &&
                                        p.resourcePath === 'user' &&
                                        p.action === 'access'
                                    );

                                    if (layoutPermission) {
                                        newSelectedPermissions.add(layoutPermission.id);
                                        console.log('✅ Auto-added layout.user.access permission');
                                    } else {
                                        console.warn('⚠️ layout.user.access permission not found');
                                    }

                                    console.log(`🎯 User permissions updated: ${keptCount} kept, ${removedCount} removed, layout access auto-added`);
                                    setSelectedPermissions(newSelectedPermissions);
                                }}
                                className="flex-1"
                            >
                                <Users className="w-4 h-4 mr-1" />
                                User
                            </Button>
                            <Button
                                type="button"
                                variant={formData.accessType === 'admin' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                    console.log('🔄 Access type changed to: admin');
                                    setFormData(prev => ({ ...prev, accessType: 'admin' }));

                                    // Erişim tipi değiştiğinde uyumsuz yetkileri kaldır ve uygun layout access yetkisi ekle
                                    const newSelectedPermissions = new Set<string>();
                                    let keptCount = 0;
                                    let removedCount = 0;

                                    selectedPermissions.forEach(permissionId => {
                                        const permission = availablePermissions.find(p => p.id === permissionId);
                                        if (permission) {
                                            const permissionType = permission.permissionType || 'user';
                                            // Layout yetkileri hariç, sadece admin tipindeki yetkileri koru
                                            if (permission.category !== 'layout' && permissionType === 'admin') {
                                                newSelectedPermissions.add(permissionId);
                                                keptCount++;
                                            } else {
                                                removedCount++;
                                            }
                                        }
                                    });

                                    // Otomatik layout.admin.access yetkisi ekle
                                    const layoutPermission = availablePermissions.find(p =>
                                        p.category === 'layout' &&
                                        p.resourcePath === 'admin' &&
                                        p.action === 'access'
                                    );

                                    if (layoutPermission) {
                                        newSelectedPermissions.add(layoutPermission.id);
                                        console.log('✅ Auto-added layout.admin.access permission');
                                    } else {
                                        console.warn('⚠️ layout.admin.access permission not found');
                                    }

                                    console.log(`🎯 Admin permissions updated: ${keptCount} kept, ${removedCount} removed, layout access auto-added`);
                                    setSelectedPermissions(newSelectedPermissions);
                                }}
                                className="flex-1"
                            >
                                <Crown className="w-4 h-4 mr-1" />
                                Admin
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="color">Renk</Label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <input
                                    id="color"
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    className="w-8 h-8 rounded border"
                                    title="Rol rengi seçin"
                                />
                                <span className="text-sm text-muted-foreground">{formData.color}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {COLOR_PALETTE.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className="w-6 h-6 rounded border-2 border-transparent hover:border-gray-300"
                                        style={{ backgroundColor: color }}
                                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPermissionsStep = () => {
        // Mevcut yetkileri al
        const currentPermissions = availablePermissions.filter(p => selectedPermissions.has(p.id));

        // Mevcut olmayan yetkileri al
        const availablePermissionsFiltered = availablePermissions.filter(p => !selectedPermissions.has(p.id));

        // Yetki ekleme fonksiyonu
        const addPermission = (permission: Permission) => {
            const newSelected = new Set(selectedPermissions);
            newSelected.add(permission.id);
            setSelectedPermissions(newSelected);
        };

        // Yetki çıkarma fonksiyonu
        const removePermission = (permission: Permission) => {
            const newSelected = new Set(selectedPermissions);
            newSelected.delete(permission.id);
            setSelectedPermissions(newSelected);
        };



        return (
            <div className="space-y-4">
                <div className="text-center">
                    <h3 className="text-base font-semibold mb-2">Yetki Yönetimi</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                        Rolün yetkilerini belirleyin ve erişim tipini seçin
                    </p>
                </div>

                {loadingPermissions ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">Yetkiler yükleniyor...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Erişim Tipi ve Özet */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                    {formData.accessType === 'admin' ? (
                                        <Crown className="w-6 h-6 text-amber-600" />
                                    ) : (
                                        <Users className="w-6 h-6 text-blue-600" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {formData.accessType === 'admin' ? 'Admin Rolü' : 'User Rolü'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {currentPermissions.length} yetki seçili
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={formData.accessType === 'user' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => {
                                        console.log('🔄 Access type changed to: user');
                                        setFormData(prev => ({ ...prev, accessType: 'user' }));

                                        // Erişim tipi değiştiğinde uyumsuz yetkileri kaldır
                                        const newSelectedPermissions = new Set<string>();
                                        let removedCount = 0;
                                        let keptCount = 0;

                                        selectedPermissions.forEach(permissionId => {
                                            const permission = availablePermissions.find(p => p.id === permissionId);
                                            if (permission) {
                                                const permissionType = permission.permissionType || 'user';
                                                // Layout access yetkilerini koru
                                                if (permission.category === 'layout') {
                                                    newSelectedPermissions.add(permissionId);
                                                    keptCount++;
                                                }
                                                // User yetkileri koru
                                                else if (permissionType === 'user') {
                                                    newSelectedPermissions.add(permissionId);
                                                    keptCount++;
                                                } else {
                                                    removedCount++;
                                                }
                                            }
                                        });

                                        // Otomatik layout access yetkisi ekle
                                        const layoutPermission = availablePermissions.find(p => p.name === 'layout.user.access');
                                        if (layoutPermission && !newSelectedPermissions.has(layoutPermission.id)) {
                                            newSelectedPermissions.add(layoutPermission.id);
                                            console.log('✅ Auto-added layout.user.access');
                                        }

                                        setSelectedPermissions(newSelectedPermissions);

                                        if (removedCount > 0) {
                                            toast.success(`${removedCount} uyumsuz yetki kaldırıldı, ${keptCount} yetki korundu`);
                                        }
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Users className="w-4 h-4" />
                                    User
                                </Button>
                                <Button
                                    variant={formData.accessType === 'admin' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => {
                                        console.log('🔄 Access type changed to: admin');
                                        setFormData(prev => ({ ...prev, accessType: 'admin' }));

                                        // Erişim tipi değiştiğinde uyumsuz yetkileri kaldır
                                        const newSelectedPermissions = new Set<string>();
                                        let removedCount = 0;
                                        let keptCount = 0;

                                        selectedPermissions.forEach(permissionId => {
                                            const permission = availablePermissions.find(p => p.id === permissionId);
                                            if (permission) {
                                                const permissionType = permission.permissionType || 'user';
                                                // Layout access yetkilerini koru
                                                if (permission.category === 'layout') {
                                                    newSelectedPermissions.add(permissionId);
                                                    keptCount++;
                                                }
                                                // Admin yetkileri koru
                                                else if (permissionType === 'admin') {
                                                    newSelectedPermissions.add(permissionId);
                                                    keptCount++;
                                                } else {
                                                    removedCount++;
                                                }
                                            }
                                        });

                                        // Otomatik layout access yetkisi ekle
                                        const layoutPermission = availablePermissions.find(p => p.name === 'layout.admin.access');
                                        if (layoutPermission && !newSelectedPermissions.has(layoutPermission.id)) {
                                            newSelectedPermissions.add(layoutPermission.id);
                                            console.log('✅ Auto-added layout.admin.access');
                                        }

                                        setSelectedPermissions(newSelectedPermissions);

                                        if (removedCount > 0) {
                                            toast.success(`${removedCount} uyumsuz yetki kaldırıldı, ${keptCount} yetki korundu`);
                                        }
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <Crown className="w-4 h-4" />
                                    Admin
                                </Button>
                            </div>
                        </div>

                        {/* Yetki Listesi */}
                        <div className="space-y-4">
                            {/* Seçili Yetkiler */}
                            {currentPermissions.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Shield className="w-5 h-5 text-green-600" />
                                        <h4 className="font-semibold text-base">Seçili Yetkiler</h4>
                                        <Badge variant="default">{currentPermissions.length}</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        {currentPermissions.map((permission) => (
                                            <div key={permission.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                        {getCategoryIcon(permission.category)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">{permission.displayName}</div>
                                                        <div className="text-xs text-muted-foreground">{permission.description}</div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removePermission(permission)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Eklenebilir Yetkiler */}
                            {availablePermissionsFiltered.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Plus className="w-5 h-5 text-blue-600" />
                                        <h4 className="font-semibold text-base">Eklenebilir Yetkiler</h4>
                                        <Badge variant="outline">{availablePermissionsFiltered.length}</Badge>
                                    </div>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {availablePermissionsFiltered.map((permission) => (
                                            <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                        {getCategoryIcon(permission.category)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-sm">{permission.displayName}</div>
                                                        <div className="text-xs text-muted-foreground">{permission.description}</div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => addPermission(permission)}
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Boş Durum */}
                            {currentPermissions.length === 0 && availablePermissionsFiltered.length === 0 && (
                                <div className="text-center py-12">
                                    <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-lg text-muted-foreground mb-2">Tüm yetkiler yüklendi</p>
                                    <p className="text-sm text-muted-foreground">Yukarıdan yetki seçebilirsiniz</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderReviewStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Ayarları Gözden Geçirin</h3>
                <p className="text-muted-foreground text-sm">
                    Rol oluşturulmadan önce tüm ayarları kontrol edin
                </p>
            </div>

            <div className="space-y-4">
                {/* Rol Bilgileri */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Rol Bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: formData.color }}
                            />
                            <div>
                                <h4 className="font-semibold">{formData.displayName}</h4>
                                <p className="text-sm text-muted-foreground">
                                    Sistem kodu: {generateRoleCode(formData.displayName)}
                                </p>
                            </div>
                            <Badge variant="outline" className="ml-auto">
                                {formData.accessType === 'admin' ? 'Admin Erişimi' : 'User Erişimi'}
                            </Badge>
                        </div>
                        {formData.description && (
                            <p className="text-sm text-muted-foreground">
                                {formData.description}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Yetkiler Özeti */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Seçilen Yetkiler ({selectedPermissions.size})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-32">
                            <div className="space-y-2">
                                {Array.from(selectedPermissions).map(permId => {
                                    const permission = availablePermissions.find(p => p.id === permId);
                                    return permission ? (
                                        <div key={permId} className="flex items-center justify-between text-sm">
                                            <span>{permission.displayName}</span>
                                            <Badge variant="secondary" className="text-xs">
                                                {permission.category}
                                            </Badge>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Şablon Bilgisi */}
                {selectedTemplate && (
                    <Card className="border-primary/20 bg-primary/5">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-primary font-medium">
                                    {ROLE_TEMPLATES[selectedTemplate as keyof typeof ROLE_TEMPLATES].name} şablonu kullanıldı
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <Plus className="w-4 h-4" />
                        Yeni Rol Oluştur
                    </DialogTitle>
                    <DialogDescription className="text-xs">
                        {WIZARD_STEPS[currentStep].description}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="space-y-1">
                    <Progress value={progress} className="h-1" />
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                        {WIZARD_STEPS.map((step, index) => (
                            <span key={step.id} className={index <= currentStep ? 'text-primary font-medium' : ''}>
                                {step.title}
                            </span>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Step Content */}
                <div className="max-h-[55vh] overflow-y-auto">
                    {currentStep === 0 && renderTemplateStep()}
                    {currentStep === 1 && renderDetailsStep()}
                    {currentStep === 2 && renderPermissionsStep()}
                    {currentStep === 3 && renderReviewStep()}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
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
                                disabled={loading || !formData.displayName.trim()}
                            >
                                {loading ? 'Oluşturuluyor...' : 'Rol Oluştur'}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 