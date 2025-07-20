'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

// Popüler renk paleti
const COLOR_PALETTE = [
    '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981',
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#d946ef', '#ec4899', '#f43f5e', '#64748b', '#374151'
];

export default function CreateRoleDialog({
    open,
    onOpenChange,
    onRoleCreated,
}: CreateRoleDialogProps) {
    const t = useTranslations('AdminRoles.createDialog');
    const tCommon = useTranslations('AdminCommon');

    // Önceden tanımlı rol şablonları
    const ROLE_TEMPLATES = {
        admin: {
            name: t('templates.systemAdmin'),
            description: t('templates.systemAdminDesc'),
            accessType: 'admin' as const,
            color: '#ef4444',
            icon: Crown,
            permissions: ['function.users.edit', 'function.roles.edit', 'function.permissions.view']
        },
        moderator: {
            name: t('templates.moderator'),
            description: t('templates.moderatorDesc'),
            accessType: 'admin' as const,
            color: '#f59e0b',
            icon: Shield,
            permissions: ['function.users.view', 'view.users.list']
        },
        member: {
            name: t('templates.member'),
            description: t('templates.memberDesc'),
            accessType: 'user' as const,
            color: '#06b6d4',
            icon: Users,
            permissions: []
        },
        vip: {
            name: t('templates.vipMember'),
            description: t('templates.vipMemberDesc'),
            accessType: 'user' as const,
            color: '#10b981',
            icon: Sparkles,
            permissions: ['view.premium.access', 'function.premium.features']
        }
    };

    // Wizard adımları
    const WIZARD_STEPS = [
        { id: 'template', title: t('templateSelect'), description: t('description') },
        { id: 'details', title: t('roleDetails'), description: t('roleDetailsDescription') },
        { id: 'permissions', title: t('permissionsStep'), description: t('permissionManagementDescription') },
        { id: 'review', title: t('reviewStep'), description: t('reviewDescription') }
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
                toast.error(t('notifications.loadError'));
            }
        } catch (error) {
            console.error('❌ Permission loading error:', error);
            toast.error(t('notifications.loadErrorGeneric'));
        } finally {
            setLoadingPermissions(false);
        }
    }, [loadingPermissions, availablePermissions.length, t]);

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
                newErrors.displayName = t('roleNameRequired');
            }
            if (formData.displayName.length > 50) {
                newErrors.displayName = t('roleNameTooLong');
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
                toast.success(t('notifications.createSuccess'));
                onRoleCreated();
                onOpenChange(false);
            } else {
                const error = await response.json();
                toast.error(error.error || t('notifications.createError'));
            }
        } catch (error) {
            console.error('Role creation error:', error);
            toast.error(t('notifications.createErrorGeneric'));
        } finally {
            setLoading(false);
        }
    };

    const renderTemplateStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{t('selectTemplate')}</h3>
                <p className="text-muted-foreground text-sm">
                    {t('templateDescription')}
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
                                            {template.accessType === 'admin' ? t('adminAccess') : t('userAccess')}
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
                    {t('continueWithoutTemplate')}
                </Button>
            </div>
        </div>
    );

    const renderDetailsStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">{t('roleDetails')}</h3>
                <p className="text-muted-foreground text-sm">
                    {t('roleDetailsDescription')}
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="displayName">{t('roleName')} *</Label>
                    <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder={t('roleNamePlaceholder')}
                        className={errors.displayName ? 'border-red-500' : ''}
                    />
                    {errors.displayName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.displayName}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        {t('systemCode')}: {generateRoleCode(formData.displayName || 'ornek_rol')}
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">{t('descriptionLabel')}</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder={t('descriptionPlaceholder')}
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>{t('layout')}</Label>
                        <Select
                            value={formData.accessType}
                            onValueChange={(value: 'user' | 'admin') => {
                                console.log(`🔄 Access type changed to: ${value}`);
                                setFormData(prev => ({ ...prev, accessType: value }));

                                const newSelectedPermissions = new Set<string>();
                                let keptCount = 0;
                                let removedCount = 0;

                                selectedPermissions.forEach(permissionId => {
                                    const permission = availablePermissions.find(p => p.id === permissionId);
                                    if (permission) {
                                        const permissionType = permission.permissionType || 'user';
                                        if (permission.category !== 'layout' && permissionType === value) {
                                            newSelectedPermissions.add(permissionId);
                                            keptCount++;
                                        } else {
                                            removedCount++;
                                        }
                                    }
                                });

                                const layoutPermission = availablePermissions.find(p =>
                                    p.category === 'layout' &&
                                    p.resourcePath === value &&
                                    p.action === 'access'
                                );

                                if (layoutPermission) {
                                    newSelectedPermissions.add(layoutPermission.id);
                                    console.log(`✅ Auto-added layout.${value}.access permission`);
                                } else {
                                    console.warn(`⚠️ layout.${value}.access permission not found`);
                                }

                                console.log(`🎯 ${value} permissions updated: ${keptCount} kept, ${removedCount} removed, layout access auto-added`);
                                setSelectedPermissions(newSelectedPermissions);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('layoutPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        <span>{t('user')}</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                        <Crown className="w-4 h-4" />
                                        <span>{t('admin')}</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="color">{t('color')}</Label>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <input
                                    id="color"
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    className="w-8 h-8 rounded border"
                                    title={t('color')}
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
                    <h3 className="text-base font-semibold mb-2">{t('permissionManagement')}</h3>
                    <p className="text-muted-foreground text-sm mb-3">
                        {t('permissionManagementDesc')}
                    </p>
                </div>

                {loadingPermissions ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">{t('permissionsLoading')}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Erişim Tipi ve Özet */}
                        <div className="flex items-center justify-between p-4 bg-card rounded-xl border shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                    {formData.accessType === 'admin' ? (
                                        <Crown className="w-6 h-6 text-amber-600" />
                                    ) : (
                                        <Users className="w-6 h-6 text-blue-600" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {formData.accessType === 'admin' ? t('adminAccess') : t('userAccess')}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {currentPermissions.length} {t('permissionCount')}
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
                        <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border p-6 shadow-sm">
                            {/* Seçili Yetkiler */}
                            {currentPermissions.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Shield className="w-5 h-5 text-green-600" />
                                        <h4 className="font-semibold text-base">{t('selectedPermissions')}</h4>
                                        <Badge variant="default">{currentPermissions.length}</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        {currentPermissions.map((permission) => (
                                            <div key={permission.id} className="flex items-center justify-between p-3 bg-card border rounded-xl shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
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
                                        <h4 className="font-semibold text-base">{t('availablePermissions')}</h4>
                                        <Badge variant="outline">{availablePermissionsFiltered.length}</Badge>
                                    </div>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {availablePermissionsFiltered.map((permission) => (
                                            <div key={permission.id} className="flex items-center justify-between p-3 bg-card border rounded-xl shadow-sm hover:bg-accent transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
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
                                    <p className="text-lg text-muted-foreground mb-2">{t('noPermissionsLoaded')}</p>
                                    <p className="text-sm text-muted-foreground">{t('noPermissionsDesc')}</p>
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
                <h3 className="text-lg font-semibold mb-2">{t('reviewSettings')}</h3>
                <p className="text-muted-foreground text-sm">
                    {t('reviewSettingsDesc')}
                </p>
            </div>

            <div className="space-y-4">
                {/* Rol Bilgileri */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t('roleInfo')}</CardTitle>
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
                                    {t('systemCode')}: {generateRoleCode(formData.displayName)}
                                </p>
                            </div>
                            <Badge variant="outline" className="ml-auto">
                                {formData.accessType === 'admin' ? t('adminAccess') : t('userAccess')}
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
                            {t('permissionsSummary', { count: selectedPermissions.size })}
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
                                    {t('templateUsed', { template: ROLE_TEMPLATES[selectedTemplate as keyof typeof ROLE_TEMPLATES].name })}
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
            <DialogContent className="max-w-4xl max-h-[95vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl flex flex-col overflow-hidden p-0">
                <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 p-6 rounded-t-lg">
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-gray-100">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <span>{t('title')}</span>
                            <p className="text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
                                {WIZARD_STEPS[currentStep].description}
                            </p>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        {WIZARD_STEPS[currentStep].description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6">
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

                    <Separator className="my-6" />

                    {/* Step Content */}
                        {currentStep === 0 && renderTemplateStep()}
                        {currentStep === 1 && renderDetailsStep()}
                        {currentStep === 2 && renderPermissionsStep()}
                        {currentStep === 3 && renderReviewStep()}
                </div>


                {/* Footer */}
                <div className="flex items-center justify-between p-6 bg-gray-100/80 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700 mt-auto rounded-b-lg">
                    <Button
                        variant="outline"
                        onClick={() => currentStep === 0 ? onOpenChange(false) : prevStep()}
                        disabled={loading}
                    >
                        {currentStep === 0 ? (
                            t('cancel')
                        ) : (
                            <>
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                {tCommon('back')}
                            </>
                        )}
                    </Button>

                    <div className="flex items-center gap-2">
                        {currentStep < WIZARD_STEPS.length - 1 ? (
                            <Button
                                onClick={nextStep}
                                disabled={loading}
                            >
                                {tCommon('continue')}
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || !formData.displayName.trim()}
                            >
                                {loading ? t('creating') : t('create')}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}