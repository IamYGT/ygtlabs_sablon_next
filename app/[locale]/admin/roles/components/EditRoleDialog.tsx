'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Crown,
    Users,
    ShieldCheck,
    AlertTriangle,
    Edit,
    Settings,
    Save,
    Shield,
    ChevronLeft,
    ChevronRight,
    FileText,
    Activity,
    Search,
    Plus,
    X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Role {
    id: string;
    name: string;
    displayName: string;
    description: string | null;
    color: string | null;
    layoutType: string;
    isActive: boolean;
    isSystemDefault: boolean;
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

interface EditRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role;
    onRoleUpdated: () => void;
}

// Utility fonksiyonlar
function parseJSONField(value: string | Record<string, string> | null | undefined, locale: string = 'tr'): string {
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value) as Record<string, string>;
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

function formatPermission(permission: Permission): Permission {
    // displayName formatla
    let displayName = permission.displayName;
    if (typeof permission.displayName === 'string' && permission.displayName !== permission.name) {
        displayName = permission.displayName;
    } else {
        const parsed = parseJSONField(permission.displayName);
        if (parsed && parsed.trim() !== '') {
            displayName = parsed;
        } else {
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

            displayName = `${categoryName} - ${resourceName} ${actionName}`;
        }
    }

    // description formatla
    let description = permission.description;
    if (typeof permission.description === 'string' && permission.description !== permission.name) {
        description = permission.description;
    } else {
        const parsed = parseJSONField(permission.description);
        if (parsed && parsed.trim() !== '') {
            description = parsed;
        } else {
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

            description = `${permission.resourcePath} için ${categoryName} ${actionName} yetkisi`;
        }
    }

    return {
        ...permission,
        displayName,
        description
    };
}

// Popüler renk paleti
const COLOR_PALETTE = [
    '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981',
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#d946ef', '#ec4899', '#f43f5e', '#64748b', '#374151'
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

// Wizard adımları
const WIZARD_STEPS = [
    { id: 'details', title: 'Rol Bilgileri', description: 'Temel rol bilgilerini düzenleyin' },
    { id: 'permissions', title: 'Yetkiler', description: 'Rol yetkilerini yönetin' },
    { id: 'review', title: 'Önizleme', description: 'Değişiklikleri gözden geçirin' }
];

export default function EditRoleDialog({
    open,
    onOpenChange,
    role,
    onRoleUpdated
}: EditRoleDialogProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [searchTerm, setSearchTerm] = useState('');

    // Form data
    const [formData, setFormData] = useState({
        displayName: role.displayName,
        description: role.description || '',
        color: role.color || '#6366f1',
        layoutType: role.layoutType || 'user',
        isActive: role.isActive,
    });

    // Permissions data
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

    const isProtectedRole = role.name === 'super_admin' || role.name === 'user';
    const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

    // Load permissions - prevent infinite loops with ref
    const loadingRef = useRef(false);
    const loadPermissions = useCallback(async () => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setLoadingPermissions(true);

        try {
            console.log('🔄 Loading permissions for role:', role.id);

            // Load all permissions
            const permissionsResponse = await fetch('/api/admin/permissions?limit=1000');
            if (!permissionsResponse.ok) {
                throw new Error('Yetkiler yüklenemedi');
            }
            const permissionsData = await permissionsResponse.json();
            console.log('📋 All permissions loaded:', permissionsData.permissions?.length || 0);

            const formattedPermissions = (permissionsData.permissions || []).map(formatPermission);

            // Load role permissions
            const roleResponse = await fetch(`/api/admin/roles/${role.id}/permissions`);
            if (!roleResponse.ok) {
                throw new Error('Rol yetkileri yüklenemedi');
            }
            const roleData = await roleResponse.json();
            console.log('🎯 Role permissions loaded:', roleData.permissions?.length || 0);
            console.log('🎯 Role permissions data:', roleData.permissions);

            // Set selected permissions
            const selectedIds = new Set<string>();
            (roleData.permissions || []).forEach((perm: Record<string, string>) => {
                console.log('🔍 Looking for permission:', perm);
                const permission = formattedPermissions.find((p: Permission) =>
                    p.category === perm.category &&
                    p.resourcePath === perm.resourcePath &&
                    p.action === perm.action
                );
                if (permission) {
                    console.log('✅ Found matching permission:', permission.id, permission.displayName);
                    selectedIds.add(permission.id);
                } else {
                    console.log('❌ No matching permission found for:', perm);
                }
            });

            console.log('🎯 Selected permissions count:', selectedIds.size);

            // State'leri aynı anda set et
            setPermissions(formattedPermissions);
            setSelectedPermissions(selectedIds);

        } catch (error) {
            console.error('Data loading error:', error);
            toast.error('Veriler yüklenirken hata oluştu');
        } finally {
            setLoadingPermissions(false);
            loadingRef.current = false;
        }
    }, [role.id]);

    // Form validation
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.displayName.trim()) {
            newErrors.displayName = 'Rol adı gereklidir';
        }
        if (formData.displayName.length > 50) {
            newErrors.displayName = 'Rol adı 50 karakterden fazla olamaz';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Reset form when dialog opens
    useEffect(() => {
        if (open) {
            setCurrentStep(0);
            setErrors({});
            setSearchTerm('');
            setFormData({
                displayName: role.displayName,
                description: role.description || '',
                color: role.color || '#6366f1',
                layoutType: role.layoutType || 'user',
                isActive: role.isActive,
            });

            // Her açılışta permissions'ı yükle
            loadPermissions();
        }
    }, [open, role.id, role.displayName, role.description, role.color, role.layoutType, role.isActive, loadPermissions]);

    // Navigation
    const nextStep = () => {
        if (currentStep === 0 && !validateForm()) return;
        setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    // Permission helpers - removed unused functions

    // Group permissions by category with filtering
    const groupedPermissions = useMemo(() => {
        console.log('🔍 Filtering permissions for accessType:', formData.layoutType);
        console.log('📋 Total permissions before filtering:', permissions.length);

        let filtered = permissions;

        // ASLA layout yetkilerini gösterme - bunlar sistem tarafından otomatik yönetiliyor
        const beforeLayoutFilter = filtered.length;
        filtered = filtered.filter(permission =>
            permission.category !== 'layout'
        );
        console.log(`🚫 Layout permissions filtered out: ${beforeLayoutFilter - filtered.length}`);

        // Erişim tipine göre filtrele
        const beforeAccessFilter = filtered.length;
        filtered = filtered.filter(permission => {
            const permissionType = permission.permissionType || 'user';
            return permissionType === formData.layoutType;
        });
        console.log(`🎯 Access type filter (${formData.layoutType}): ${beforeAccessFilter} → ${filtered.length}`);

        // Arama terimine göre filtrele
        if (searchTerm) {
            const beforeSearchFilter = filtered.length;
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(permission =>
                permission.displayName.toLowerCase().includes(term) ||
                permission.description.toLowerCase().includes(term) ||
                permission.category.toLowerCase().includes(term) ||
                permission.action.toLowerCase().includes(term)
            );
            console.log(`🔍 Search filter: ${beforeSearchFilter} → ${filtered.length}`);
        }

        console.log('✅ Final filtered permissions:', filtered.length);

        return filtered.reduce((acc, permission) => {
            const category = permission.category || 'other';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(permission);
            return acc;
        }, {} as Record<string, Permission[]>);
    }, [permissions, searchTerm, formData.layoutType]);

    // Category helpers
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'layout': return <Settings className="w-4 h-4" />;
            case 'view': return <FileText className="w-4 h-4" />;
            case 'function': return <Activity className="w-4 h-4" />;
            default: return <Shield className="w-4 h-4" />;
        }
    };

    // Submit form
    const handleSubmit = async () => {
        if (!validateForm()) return;

        if (isProtectedRole) {
            toast.error(role.name === 'super_admin' ? 'Super Admin rolü düzenlenemez' : 'Korumalı rol düzenlenemez');
            return;
        }

        setLoading(true);
        try {
            const roleCode = generateRoleCode(formData.displayName);

            // Update role details
            const roleUpdateData = {
                ...formData,
                name: roleCode,
            };

            const roleResponse = await fetch(`/api/admin/roles/${role.id}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roleUpdateData),
            });

            if (!roleResponse.ok) {
                const error = await roleResponse.json();
                throw new Error(error.message || 'Rol güncellenemedi');
            }

            // Update permissions - API permission name'leri bekliyor
            const permissionNames: string[] = [];

            selectedPermissions.forEach(permissionId => {
                const permission = permissions.find(p => p.id === permissionId);
                if (permission) {
                    console.log('🔍 Processing permission for API:', {
                        id: permission.id,
                        category: permission.category,
                        resourcePath: permission.resourcePath,
                        action: permission.action,
                        displayName: permission.displayName
                    });

                    // Permission name formatı: category.resourcePath.action (veritabanındaki format)
                    const permissionName = `${permission.category}.${permission.resourcePath}.${permission.action}`;
                    permissionNames.push(permissionName);
                } else {
                    console.log('❌ Permission not found for ID:', permissionId);
                }
            });

            console.log('🔄 Sending permissions to API:', permissionNames);

            const permissionsResponse = await fetch(`/api/admin/roles/${role.id}/permissions`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ permissions: permissionNames }),
            });

            if (!permissionsResponse.ok) {
                const error = await permissionsResponse.json();
                throw new Error(error.error || 'Yetkiler güncellenemedi');
            }

            toast.success('Rol başarıyla güncellendi');
            onRoleUpdated();
            onOpenChange(false);

        } catch (error) {
            console.error('Update error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Rol güncellenirken bir hata oluştu';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Render steps
    const renderDetailsStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Rol Bilgileri</h3>
                <p className="text-muted-foreground text-sm">
                    Rolün temel bilgilerini düzenleyin
                </p>
            </div>

            {/* Protected Role Warning */}
            {isProtectedRole && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-orange-800 mb-1">Korumalı Rol</h4>
                        <p className="text-sm text-orange-700">
                            {role.name === 'super_admin'
                                ? 'Super Admin rolü sistem güvenliği için korunmaktadır ve düzenlenemez.'
                                : 'Bu rol sistem tarafından korunmaktadır ve düzenlenemez.'
                            }
                        </p>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="displayName">Rol Adı *</Label>
                    <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder="Rol adını girin"
                        disabled={isProtectedRole}
                        className={errors.displayName ? 'border-red-500' : ''}
                    />
                    {errors.displayName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {errors.displayName}
                        </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Sistem kodu: <code className="bg-muted px-1 rounded">
                            {generateRoleCode(formData.displayName) || 'rol_adi'}
                        </code>
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Açıklama</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Rol açıklaması"
                        disabled={isProtectedRole}
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Erişim Tipi</Label>
                        <Select
                            value={formData.layoutType}
                            onValueChange={(value) => {
                                console.log('🔄 Access type changed to:', value);
                                setFormData(prev => ({ ...prev, layoutType: value }));

                                // Erişim tipi değiştiğinde uyumsuz yetkileri kaldır ve uygun layout access yetkisi ekle
                                const newSelectedPermissions = new Set<string>();
                                let removedCount = 0;
                                let keptCount = 0;

                                selectedPermissions.forEach(permissionId => {
                                    const permission = permissions.find(p => p.id === permissionId);
                                    if (permission) {
                                        const permissionType = permission.permissionType || 'user';
                                        // Layout yetkileri hariç, sadece erişim tipine uygun olanları koru
                                        if (permission.category !== 'layout' && permissionType === value) {
                                            newSelectedPermissions.add(permissionId);
                                            keptCount++;
                                        } else {
                                            removedCount++;
                                        }
                                    }
                                });

                                // Erişim tipine göre otomatik layout access yetkisi ekle
                                const requiredLayoutPermission = value === 'admin' ? 'layout.admin.access' : 'layout.user.access';
                                const layoutPermission = permissions.find(p =>
                                    p.category === 'layout' &&
                                    p.resourcePath === value &&
                                    p.action === 'access'
                                );

                                if (layoutPermission) {
                                    newSelectedPermissions.add(layoutPermission.id);
                                    console.log(`✅ Auto-added layout permission: ${requiredLayoutPermission}`);
                                } else {
                                    console.warn(`⚠️ Layout permission not found: ${requiredLayoutPermission}`);
                                }

                                console.log(`🎯 Permissions updated: ${keptCount} kept, ${removedCount} removed, layout access auto-added`);
                                setSelectedPermissions(newSelectedPermissions);
                            }}
                            disabled={isProtectedRole}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                        <Crown className="w-4 h-4" />
                                        Admin Erişimi
                                    </div>
                                </SelectItem>
                                <SelectItem value="user">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        User Erişimi
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Admin erişimi yönetici paneline, User erişimi ise kullanıcı arayüzüne izin verir
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Renk</Label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                className="w-8 h-8 rounded border cursor-pointer"
                                disabled={isProtectedRole}
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
                                    disabled={isProtectedRole}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    <div>
                        <p className="font-medium">Rol Aktif</p>
                        <p className="text-sm text-muted-foreground">
                            Pasif roller kullanıcılara atanamaz
                        </p>
                    </div>
                    <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        disabled={isProtectedRole}
                    />
                </div>
            </div>
        </div>
    );

    const renderPermissionsStep = () => {
        const filteredPermissions = Object.values(groupedPermissions).flat();

        // Mevcut yetkileri al
        const currentPermissions = filteredPermissions.filter(p => selectedPermissions.has(p.id));

        // Mevcut olmayan yetkileri al
        const availablePermissions = filteredPermissions.filter(p => !selectedPermissions.has(p.id));

        console.log('🎯 Rendering permissions step:');
        console.log('- Access type:', formData.layoutType);
        console.log('- Current permissions:', currentPermissions.length);
        console.log('- Available permissions:', availablePermissions.length);

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
            <div className="space-y-3">
                <div className="text-center">
                    <h3 className="text-base font-semibold mb-1">Yetki Yönetimi</h3>
                    <p className="text-muted-foreground text-xs mb-2">
                        Yetki ekleyin/çıkarın ve erişim tipini belirleyin
                    </p>
                    <Badge variant="outline" className="text-xs">
                        <strong>{formData.layoutType === 'admin' ? 'Admin' : 'User'}</strong> erişimi
                    </Badge>
                </div>

                {loadingPermissions ? (
                    <div className="flex items-center justify-center py-6">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto mb-1"></div>
                            <p className="text-xs text-muted-foreground">Yükleniyor...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Erişim Tipi ve Özet */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                                    {formData.layoutType === 'admin' ? (
                                        <Crown className="w-6 h-6 text-amber-600" />
                                    ) : (
                                        <Users className="w-6 h-6 text-blue-600" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">
                                        {formData.layoutType === 'admin' ? 'Admin Rolü' : 'User Rolü'}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {currentPermissions.length} yetki seçili
                                    </p>
                                </div>
                            </div>
                            <Select
                                value={formData.layoutType}
                                onValueChange={(value) => {
                                    console.log('🔄 Access type changed to:', value);
                                    setFormData(prev => ({ ...prev, layoutType: value }));

                                    // Erişim tipi değiştiğinde uyumsuz yetkileri kaldır
                                    const newSelectedPermissions = new Set<string>();
                                    let removedCount = 0;
                                    let keptCount = 0;

                                    selectedPermissions.forEach(permissionId => {
                                        const permission = permissions.find(p => p.id === permissionId);
                                        if (permission) {
                                            const permissionType = permission.permissionType || 'user';
                                            // Layout access yetkilerini koru
                                            if (permission.category === 'layout') {
                                                newSelectedPermissions.add(permissionId);
                                                keptCount++;
                                            }
                                            // Uyumlu yetkileri koru
                                            else if (
                                                (value === 'admin' && permissionType === 'admin') ||
                                                (value === 'user' && permissionType === 'user')
                                            ) {
                                                newSelectedPermissions.add(permissionId);
                                                keptCount++;
                                            } else {
                                                removedCount++;
                                            }
                                        }
                                    });

                                    // Otomatik layout access yetkisi ekle
                                    const layoutAccessName = value === 'admin' ? 'layout.admin.access' : 'layout.user.access';
                                    const layoutPermission = permissions.find(p => p.name === layoutAccessName);
                                    if (layoutPermission && !newSelectedPermissions.has(layoutPermission.id)) {
                                        newSelectedPermissions.add(layoutPermission.id);
                                        console.log('✅ Auto-added layout access:', layoutAccessName);
                                    }

                                    setSelectedPermissions(newSelectedPermissions);

                                    if (removedCount > 0) {
                                        toast.success(`${removedCount} uyumsuz yetki kaldırıldı, ${keptCount} yetki korundu`);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            User
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="admin">
                                        <div className="flex items-center gap-2">
                                            <Crown className="w-4 h-4" />
                                            Admin
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Arama */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Yetki ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11 text-base"
                            />
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
                            {availablePermissions.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Plus className="w-5 h-5 text-blue-600" />
                                        <h4 className="font-semibold text-base">Eklenebilir Yetkiler</h4>
                                        <Badge variant="outline">{availablePermissions.length}</Badge>
                                    </div>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {availablePermissions.map((permission) => (
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
                            {currentPermissions.length === 0 && availablePermissions.length === 0 && (
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
                <h3 className="text-lg font-semibold mb-2">Değişiklikleri Gözden Geçirin</h3>
                <p className="text-muted-foreground text-sm">
                    Rol güncellemeden önce tüm değişiklikleri kontrol edin
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
                            <div className="flex gap-2 ml-auto">
                                <Badge variant={formData.isActive ? "default" : "secondary"}>
                                    {formData.isActive ? 'Aktif' : 'Pasif'}
                                </Badge>
                                <Badge variant="outline">
                                    {formData.layoutType === 'admin' ? 'Admin Erişimi' : 'User Erişimi'}
                                </Badge>
                            </div>
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
                                    const permission = permissions.find(p => p.id === permId);
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
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-base">
                        <div
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{ backgroundColor: role.color || '#6366f1' }}
                        >
                            <Edit className="w-3 h-3 text-white" />
                        </div>
                        {role.displayName} Düzenle
                        {isProtectedRole && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">
                                <ShieldCheck className="w-2 h-2 mr-1" />
                                {role.name === 'super_admin' ? 'Super' : 'Korumalı'}
                            </Badge>
                        )}
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
                            <span
                                key={step.id}
                                className={`cursor-pointer transition-colors ${index <= currentStep ? 'text-primary font-medium' : ''
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
                <div className="max-h-[55vh] overflow-y-auto">
                    {currentStep === 0 && renderDetailsStep()}
                    {currentStep === 1 && renderPermissionsStep()}
                    {currentStep === 2 && renderReviewStep()}
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
                                disabled={loading || isProtectedRole}
                            >
                                Devam Et
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || !formData.displayName.trim() || isProtectedRole}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Güncelleniyor...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Rol Güncelle
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

