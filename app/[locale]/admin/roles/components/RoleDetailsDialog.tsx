'use client';

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
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

function formatPermissionDisplayName(permission: Permission, locale: string = 'tr', t: (key: string) => string): string {
    // Eğer displayName zaten string ise (API'den formatlanmış geliyorsa) direkt kullan
    if (typeof permission.displayName === 'string' && permission.displayName !== permission.name) {
        return permission.displayName;
    }

    const displayName = parseJSONField(permission.displayName, locale);

    if (displayName && displayName !== permission.displayName && displayName.trim() !== '') {
        return displayName;
    }

    // Fallback: Daha okunabilir format
    const categoryName = t(`categories.${permission.category}`) || permission.category;
    const actionName = t(`actions.${permission.action}`) || permission.action;
    const resourceName = permission.resourcePath.replace(/^\//, '').replace(/\//g, ' ');

    return `${categoryName} - ${resourceName} ${actionName}`;
}

function formatPermissionDescription(permission: Permission, locale: string = 'tr', t: (key: string) => string): string {
    // Eğer description zaten string ise (API'den formatlanmış geliyorsa) direkt kullan
    if (typeof permission.description === 'string' && permission.description !== permission.name) {
        return permission.description;
    }

    const description = parseJSONField(permission.description, locale);

    if (description && description !== permission.description && description.trim() !== '') {
        return description;
    }

    // Fallback: Daha açıklayıcı format
    const categoryName = t(`categories.${permission.category}`) || permission.category;
    const actionName = t(`actions.${permission.action}`) || permission.action;

    return `${permission.resourcePath} için ${categoryName} ${actionName} yetkisi`;
}

function formatPermissionsList(permissions: Permission[], _locale: string = 'tr', t: (key: string) => string): Permission[] {
    return permissions.map(permission => ({
        ...permission,
        displayName: formatPermissionDisplayName(permission, _locale, t),
        description: formatPermissionDescription(permission, _locale, t),
    }));
}

function formatCategoryDisplayName(category: string, _locale: string = 'tr', t: (key: string) => string): string {
    return t(`categories.${category}`) || category;
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

export default function RoleDetailsDialog({
    role,
    open,
    onOpenChange,
}: RoleDetailsDialogProps) {
    const t = useTranslations('AdminRoles.detailsDialog');
    const tCommon = useTranslations('AdminCommon');
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Dialog adımları
    const DIALOG_STEPS = [
        { id: 'overview', title: t('steps.overview'), description: t('overviewDescription') },
        { id: 'permissions', title: t('steps.permissions'), description: t('permissionsDescription') },
        { id: 'users', title: t('steps.users'), description: t('usersDescription') },
        { id: 'activity', title: t('steps.activity'), description: t('activityHeaderDescription') }
    ];

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
                const formattedPermissions = formatPermissionsList(data.permissions || [], undefined, t);

                setPermissions(formattedPermissions);
            }
        } catch (error) {
            console.error(t('error.loadingPermissions'), error);
        } finally {
            setLoading(false);
        }
    }, [role, t]);

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
                <h3 className="text-lg font-semibold mb-2">{t('title')}</h3>
                <p className="text-muted-foreground text-sm">
                    {role.displayName} {t('headerDescription')}
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
                                {t('systemCode')}: <code className="bg-muted px-1 rounded text-xs">{role.name}</code>
                            </p>
                        </div>
                        <div className="flex gap-2 ml-auto">
                            <Badge variant={role.isActive ? "default" : "secondary"}>
                                {role.isActive ? (
                                    <>
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        {tCommon('active')}
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-3 h-3 mr-1" />
                                        {tCommon('inactive')}
                                    </>
                                )}
                            </Badge>
                            <Badge variant="outline">
                                {role.layoutType === 'admin' ? t('adminAccess') : t('userAccess')}
                            </Badge>
                            {role.isSystemDefault && (
                                <Badge variant="secondary">{t('systemRole')}</Badge>
                            )}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {role.description && (
                        <div>
                            <p className="text-sm font-medium mb-1">{t('description')}</p>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <UserCheck className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                            <p className="text-2xl font-bold">{role._count.users}</p>
                            <p className="text-xs text-muted-foreground">{tCommon('users')}</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <Shield className="w-6 h-6 mx-auto mb-2 text-green-500" />
                            <p className="text-2xl font-bold">{permissions.length}</p>
                            <p className="text-xs text-muted-foreground">{t('permissions')}</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                            <p className="text-sm font-bold">
                                {new Date(role.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                            <p className="text-xs text-muted-foreground">{t('creationDate')}</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <Settings className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                            <p className="text-sm font-bold">{categories.length}</p>
                            <p className="text-xs text-muted-foreground">{tCommon('category')}</p>
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
                <h3 className="text-lg font-semibold mb-2">{t('rolePermissions')}</h3>
                <p className="text-muted-foreground text-sm">
                    {t('rolePermissionsDescription', { count: permissions.length })}
                </p>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">{t('permissionsLoading')}</p>
                </div>
            ) : permissions.length === 0 ? (
                <div className="text-center py-8">
                    <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t('noPermissions')}</p>
                </div>
            ) : (
                <ScrollArea className="h-96">
                    <div className="space-y-4">
                        {categories.map((category) => (
                            <Card key={category}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        {getCategoryIcon(category)}
                                        {formatCategoryDisplayName(category, undefined, t)}
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
                <h3 className="text-lg font-semibold mb-2">{t('roleUsers')}</h3>
                <p className="text-muted-foreground text-sm">
                    {t('roleUsersDescription', { count: role._count.users })}
                </p>
            </div>

            {role.users.length === 0 ? (
                <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t('noUsers')}</p>
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
                                        <p className="font-medium">{user.name || t('unnamed')}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <Badge variant="outline">{tCommon('active')}</Badge>
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
                <h3 className="text-lg font-semibold mb-2">{t('roleActivity')}</h3>
                <p className="text-muted-foreground text-sm">
                    {t('roleActivityHeaderDescription')}
                </p>
            </div>

            <div className="grid gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Info className="w-4 h-4" />
                            {t('generalInfo')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">{t('creationDate')}:</span>
                            <span className="text-sm font-medium">
                                {new Date(role.createdAt).toLocaleString('tr-TR')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">{t('accessType')}:</span>
                            <span className="text-sm font-medium">
                                {role.layoutType === 'admin' ? t('adminAccess') : t('userAccess')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">{t('systemRole')}:</span>
                            <span className="text-sm font-medium">
                                {role.isSystemDefault ? t('yes') : t('no')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">{t('status')}:</span>
                            <Badge variant={role.isActive ? "default" : "secondary"}>
                                {role.isActive ? tCommon('active') : tCommon('inactive')}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Activity className="w-4 h-4" />
                            {t('usageStats')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                                <p className="text-2xl font-bold text-blue-600">{role._count.users}</p>
                                <p className="text-xs text-blue-500">{t('activeUser')}</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <Shield className="w-6 h-6 mx-auto mb-2 text-green-500" />
                                <p className="text-2xl font-bold text-green-600">{permissions.length}</p>
                                <p className="text-xs text-green-500">{t('totalPermissions')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl flex flex-col overflow-hidden p-0">
                <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 p-6 rounded-t-lg">
                    <DialogTitle className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        {role.displayName} - {t('title')}
                    </DialogTitle>
                    <DialogDescription>
                        {DIALOG_STEPS[currentStep].description}
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4 space-y-4 border-b dark:border-gray-700">
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
                </div>

                {/* Step Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {currentStep === 0 && renderOverviewStep()}
                    {currentStep === 1 && renderPermissionsStep()}
                    {currentStep === 2 && renderUsersStep()}
                    {currentStep === 3 && renderActivityStep()}
                </div>

                {/* Footer */}
                <DialogFooter className="bg-gray-100/80 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700 p-3 mt-auto rounded-b-lg">
                    <Button
                        variant="outline"
                        onClick={() => currentStep === 0 ? onOpenChange(false) : prevStep()}
                    >
                        {currentStep === 0 ? (
                            t('close')
                        ) : (
                            <>
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                {t('back')}
                            </>
                        )}
                    </Button>

                    <div className="flex items-center gap-2">
                        {currentStep < DIALOG_STEPS.length - 1 ? (
                            <Button onClick={nextStep}>
                                {t('continue')}
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button onClick={() => onOpenChange(false)}>
                                {t('finish')}
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 