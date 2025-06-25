"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Layout,
    FileText,
    Zap,
    Shield,
    AlertCircle
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

function formatPermissionDisplayName(permission: RolePermission, locale: string = 'tr'): string {
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

function formatPermissionDescription(permission: RolePermission, locale: string = 'tr'): string {
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

function formatPermissionsList(permissions: RolePermission[], locale: string = 'tr'): RolePermission[] {
    return permissions.map(permission => ({
        ...permission,
        displayName: formatPermissionDisplayName(permission, locale),
        description: formatPermissionDescription(permission, locale),
    }));
}

interface RolePermission {
    id: string;
    name: string;
    category: string;
    resourcePath: string;
    action: string;
    displayName?: string;
    description?: string;
    permissionType?: string;
}

interface RolePermissionsDisplayProps {
    roleName: string;
    roleDisplayName: string;
    roleId: string;
}

// Removed unused getResourceTypeIcon function

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

const getCategoryDisplayName = (category: string) => {
    switch (category) {
        case 'layout':
            return 'Layout';
        case 'view':
            return 'Görüntüleme';
        case 'function':
            return 'İşlevler';
        default:
            return category;
    }
};

export default function RolePermissionsDisplay({
    roleName: _roleName,
    roleDisplayName,
    roleId
}: RolePermissionsDisplayProps) {
    const t = useTranslations('AdminCommon');
    const tRoles = useTranslations('AdminRoles.permissionsDisplay');
    const [permissions, setPermissions] = useState<RolePermission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/admin/roles/${roleId}/permissions`);

                if (!response.ok) {
                    throw new Error(`${tRoles('loadError')}: ${response.status}`);
                }

                const data = await response.json();

                // API'den gelen yetkileri formatla
                const formattedPermissions = formatPermissionsList(data.permissions || []);

                setPermissions(formattedPermissions);
            } catch (err) {
                console.error("Yetkiler yüklenirken hata:", err);
                setError(err instanceof Error ? err.message : t('unknownError'));
            } finally {
                setLoading(false);
            }
        };

        if (roleId) {
            fetchPermissions();
        }
    }, [roleId, t, tRoles]);

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                            <p className="text-sm text-muted-foreground">{tRoles('permissionsLoading')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center text-center">
                        <div>
                            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (permissions.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{tRoles('noPermissions')}</h3>
                    <p className="text-muted-foreground">
                        {roleDisplayName} {tRoles('noPermissionsDescription')}
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Yetkileri kategoriye göre grupla
    const categorizedPermissions = permissions.reduce((acc, perm) => {
        const category = perm.category || 'other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(perm);
        return acc;
    }, {} as Record<string, RolePermission[]>);

    const categories = Object.keys(categorizedPermissions);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {roleDisplayName} {tRoles('title')}
                </h3>
                <Badge variant="secondary">
                    {permissions.length} {tRoles('permissionCount')}
                </Badge>
            </div>

            {categories.map((category) => {
                const categoryPermissions = categorizedPermissions[category];

                return (
                    <Card key={category}>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getCategoryIcon(category)}
                                    <span>{tRoles(`categories.${category}`) || getCategoryDisplayName(category)}</span>
                                    <Badge className={getCategoryColor(category)}>
                                        {categoryPermissions.length} {tRoles('permissionCount')}
                                    </Badge>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[200px]">
                                <div className="space-y-2">
                                    {categoryPermissions.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-2">
                                                {getCategoryIcon(permission.category)}
                                                <div>
                                                    <span className="text-sm font-medium">
                                                        {permission.displayName}
                                                    </span>
                                                    {permission.description && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {permission.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {permission.category}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {permission.action}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
} 