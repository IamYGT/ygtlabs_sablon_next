'use client';

import React, { useState, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
    Shield,
    Users,
    Crown,
    Layout,
    FileText,
    Settings,
    Zap,
    User,
    Activity,
    Eye,
    ChevronLeft,
    ChevronRight,
    Calendar,
    CheckCircle,
    XCircle,
    UserCheck,
    Info
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

function formatCategoryDisplayName(category: string, locale: string = 'tr'): string {
    const categoryMap: Record<string, Record<string, string>> = {
        layout: { tr: 'Layout', en: 'Layout' },
        view: { tr: 'Görüntüleme', en: 'View' },
        function: { tr: 'İşlevler', en: 'Function' },
    };

    return categoryMap[category]?.[locale] || category;
}

interface Permission {
    id: string;
    name: string;
    category: string;
    resourcePath: string;
    action: string;
    displayName?: string;
    description?: string;
    permissionType?: string;
}

interface Role {
    id: string;
    name: string;
    displayName: string;
    description: string | null;
    color: string | null;
    layoutType: string;
    isActive: boolean;
    isSystemDefault: boolean;
    createdAt: Date;
    permissions: Array<{
        permission: {
            id: string;
            name: string;
            displayName: string;
            category: string;
        };
    }>;
    users: Array<{
        id: string;
        name: string | null;
        email: string | null;
    }>;
    _count: {
        users: number;
    };
}

interface RoleDetailsDialogProps {
    role: Role | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Dialog adımları
const DIALOG_STEPS = [
    { id: 'overview', title: 'Genel Bakış', description: 'Rol bilgileri ve özeti' },
    { id: 'permissions', title: 'Yetkiler', description: 'Rol yetkileri detayları' },
    { id: 'users', title: 'Kullanıcılar', description: 'Bu rolü kullanan kullanıcılar' },
    { id: 'activity', title: 'Aktivite', description: 'Rol kullanım bilgileri' }
];

export default function RoleDetailsDialog({
    role,
    open,
    onOpenChange,
}: RoleDetailsDialogProps) {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Progress hesaplama
    const progress = ((currentStep + 1) / DIALOG_STEPS.length) * 100;

    // Rol açıldığında yetkileri yükle
    const loadPermissions = useCallback(async () => {
        if (!role) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/admin/roles/${role.id}/permissions`);
            if (response.ok) {
                const data = await response.json();
                const formattedPermissions = formatPermissionsList(data.permissions || []);

                setPermissions(formattedPermissions);
            }
        } catch (error) {
            console.error('Yetki yükleme hatası:', error);
        } finally {
            setLoading(false);
        }
    }, [role]);

    React.useEffect(() => {
        if (open && role) {
            loadPermissions();
            setCurrentStep(0); // Reset to first step when opening
        }
    }, [open, role, loadPermissions]);

    if (!role) return null;

    // Sonraki adıma geç
    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, DIALOG_STEPS.length - 1));
    };

    // Önceki adıma dön
    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };



    // Kategori iconları
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'layout':
                return <Layout className="h-4 w-4" />;
            case 'view':
                return <FileText className="h-4 w-4" />;
            case 'function':
                return <Zap className="h-4 w-4" />;
            default:
                return <Shield className="h-4 w-4" />;
        }
    };

    // Kategori renkleri
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'layout':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'view':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'function':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };



    // Yetkileri kategoriye göre grupla
    const categorizedPermissions = permissions.reduce((acc, perm) => {
        const category = perm.category || 'other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(perm);
        return acc;
    }, {} as Record<string, Permission[]>);

    const categories = Object.keys(categorizedPermissions);

    // Genel Bakış adımı
    const renderOverviewStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Rol Detayları</h3>
                <p className="text-muted-foreground text-sm">
                    {role.displayName} rolünün genel bilgileri
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: role.color || '#6366f1' }}
                        >
                            {role.layoutType === 'admin' ? (
                                <Crown className="w-4 h-4 text-white" />
                            ) : (
                                <User className="w-4 h-4 text-white" />
                            )}
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold">{role.displayName}</h4>
                            <p className="text-sm text-muted-foreground">
                                Sistem kodu: <code className="bg-muted px-1 rounded text-xs">{role.name}</code>
                            </p>
                        </div>
                        <div className="flex gap-2 ml-auto">
                            <Badge variant={role.isActive ? "default" : "secondary"}>
                                {role.isActive ? (
                                    <>
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Aktif
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-3 h-3 mr-1" />
                                        Pasif
                                    </>
                                )}
                            </Badge>
                            <Badge variant="outline">
                                {role.layoutType === 'admin' ? 'Admin Erişimi' : 'User Erişimi'}
                            </Badge>
                            {role.isSystemDefault && (
                                <Badge variant="secondary">Sistem Rolü</Badge>
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {role.description && (
                        <div>
                            <p className="text-sm font-medium mb-1">Açıklama</p>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <UserCheck className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                            <p className="text-2xl font-bold">{role._count.users}</p>
                            <p className="text-xs text-muted-foreground">Kullanıcı</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <Shield className="w-6 h-6 mx-auto mb-2 text-green-500" />
                            <p className="text-2xl font-bold">{permissions.length}</p>
                            <p className="text-xs text-muted-foreground">Yetki</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                            <p className="text-sm font-bold">
                                {new Date(role.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                            <p className="text-xs text-muted-foreground">Oluşturma</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <Settings className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                            <p className="text-sm font-bold">{categories.length}</p>
                            <p className="text-xs text-muted-foreground">Kategori</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    // Yetkiler adımı
    const renderPermissionsStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Rol Yetkileri</h3>
                <p className="text-muted-foreground text-sm">
                    Bu rolün sahip olduğu yetkiler ({permissions.length} adet)
                </p>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Yetkiler yükleniyor...</p>
                </div>
            ) : permissions.length === 0 ? (
                <div className="text-center py-8">
                    <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Bu rolün henüz yetkisi bulunmuyor</p>
                </div>
            ) : (
                <ScrollArea className="h-96">
                    <div className="space-y-4">
                        {categories.map((category) => (
                            <Card key={category}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        {getCategoryIcon(category)}
                                        {formatCategoryDisplayName(category)}
                                        <Badge variant="secondary" className="ml-auto">
                                            {categorizedPermissions[category].length}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-2">
                                        {categorizedPermissions[category].map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {getCategoryIcon(permission.category)}
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {permission.displayName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {permission.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={getCategoryColor(permission.category)}
                                                >
                                                    {permission.category}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );

    // Kullanıcılar adımı
    const renderUsersStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Rol Kullanıcıları</h3>
                <p className="text-muted-foreground text-sm">
                    Bu rolü kullanan kullanıcılar ({role._count.users} kişi)
                </p>
            </div>

            {role.users.length === 0 ? (
                <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Bu rolü kullanan kullanıcı bulunmuyor</p>
                </div>
            ) : (
                <ScrollArea className="h-96">
                    <div className="space-y-2">
                        {role.users.map((user) => (
                            <Card key={user.id}>
                                <CardContent className="flex items-center gap-3 p-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{user.name || 'İsimsiz Kullanıcı'}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <Badge variant="outline">Aktif</Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            )}
        </div>
    );

    // Aktivite adımı
    const renderActivityStep = () => (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Rol Aktivitesi</h3>
                <p className="text-muted-foreground text-sm">
                    Rol kullanım istatistikleri ve bilgileri
                </p>
            </div>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Info className="w-4 h-4" />
                            Genel Bilgiler
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Oluşturma Tarihi:</span>
                            <span className="text-sm font-medium">
                                {new Date(role.createdAt).toLocaleString('tr-TR')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Erişim Tipi:</span>
                            <span className="text-sm font-medium">
                                {role.layoutType === 'admin' ? 'Admin Erişimi' : 'User Erişimi'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Sistem Rolü:</span>
                            <span className="text-sm font-medium">
                                {role.isSystemDefault ? 'Evet' : 'Hayır'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Durum:</span>
                            <Badge variant={role.isActive ? "default" : "secondary"}>
                                {role.isActive ? 'Aktif' : 'Pasif'}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Activity className="w-4 h-4" />
                            Kullanım İstatistikleri
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                                <p className="text-2xl font-bold text-blue-600">{role._count.users}</p>
                                <p className="text-xs text-blue-500">Aktif Kullanıcı</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <Shield className="w-6 h-6 mx-auto mb-2 text-green-500" />
                                <p className="text-2xl font-bold text-green-600">{permissions.length}</p>
                                <p className="text-xs text-green-500">Toplam Yetki</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        {role.displayName} - Rol Detayları
                    </DialogTitle>
                    <DialogDescription>
                        {DIALOG_STEPS[currentStep].description}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                        {DIALOG_STEPS.map((step, index) => (
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
                <div className="max-h-[60vh] overflow-y-auto">
                    {currentStep === 0 && renderOverviewStep()}
                    {currentStep === 1 && renderPermissionsStep()}
                    {currentStep === 2 && renderUsersStep()}
                    {currentStep === 3 && renderActivityStep()}
                </div>

                {/* Footer */}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => currentStep === 0 ? onOpenChange(false) : prevStep()}
                    >
                        {currentStep === 0 ? (
                            'Kapat'
                        ) : (
                            <>
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Geri
                            </>
                        )}
                    </Button>

                    <div className="flex items-center gap-2">
                        {currentStep < DIALOG_STEPS.length - 1 ? (
                            <Button onClick={nextStep}>
                                Devam Et
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button onClick={() => onOpenChange(false)}>
                                Tamamla
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 