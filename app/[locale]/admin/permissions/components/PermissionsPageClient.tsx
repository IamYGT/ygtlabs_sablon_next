"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Filter,
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

function formatPermissionDisplayName(permission: PermissionItem, locale: string = 'tr'): string {
    const displayName = parseJSONField(permission.displayName, locale);

    if (displayName && displayName !== permission.displayName) {
        return displayName;
    }

    return `${permission.resourceType}:${permission.resourcePath}:${permission.action}`;
}

function formatPermissionDescription(permission: PermissionItem, locale: string = 'tr'): string {
    const description = parseJSONField(permission.description, locale);

    if (description && description !== permission.description) {
        return description;
    }

    return `${permission.resourceType} ${permission.action} yetkisi`;
}
import { CreatePermissionDialog } from "./CreatePermissionDialog";
import { EditPermissionDialog } from "./EditPermissionDialog";

interface PermissionItem {
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
}

interface PermissionsResponse {
    permissions: PermissionItem[];
    categorizedPermissions: Record<string, PermissionItem[]>;
    stats: Array<{
        category: string;
        _count: { id: number };
    }>;
    pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
    };
}

export function PermissionsPageClient() {
    const t = useTranslations("AdminPermissions");
    const [permissions, setPermissions] = useState<PermissionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedResourcePath, setSelectedResourcePath] = useState<string>("all");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<PermissionItem | null>(null);

    const fetchPermissions = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            params.append("limit", "1000");

            const response = await fetch(`/api/admin/permissions?${params}`);

            if (!response.ok) {
                throw new Error(t("fetchError"));
            }

            const data: PermissionsResponse = await response.json();
            setPermissions(data.permissions || []);
        } catch (error) {
            console.error("Yetkiler getirme hatası:", error);
            toast.error(t("fetchError"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    const handleDeletePermission = async (permissionId: string) => {
        if (!confirm(t("deleteConfirm"))) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/permissions/${permissionId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || t("deleteError"));
            }

            toast.success(t("deleteSuccess"));
            fetchPermissions();
        } catch (error: unknown) {
            console.error("Yetki silme hatası:", error);
            const errorMessage = error && typeof error === "object" && "message" in error
                ? String(error.message)
                : t("deleteError");
            toast.error(errorMessage);
        }
    };

    const handleEditPermission = (permission: PermissionItem) => {
        setSelectedPermission(permission);
        setEditDialogOpen(true);
    };

    // Filtreleme - useMemo ile optimize et
    const filteredPermissions = useMemo(() => {
        return permissions.filter(permission => {
            const matchesCategory = selectedCategory === "all" ||
                (permission.category || permission.resourceType) === selectedCategory;

            const matchesResourcePath = selectedResourcePath === "all" ||
                permission.resourcePath === selectedResourcePath;

            const matchesSearch = !searchTerm ||
                permission.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                permission.resourcePath?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                permission.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                permission.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (permission.category || permission.resourceType)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                permission.roleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                permission.role?.displayName?.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesCategory && matchesResourcePath && matchesSearch;
        });
    }, [permissions, selectedCategory, selectedResourcePath, searchTerm]);

    // Unique kategoriler ve kaynak yolları
    const categories = Array.from(new Set(permissions.map(p => p.category || p.resourceType).filter(Boolean))).sort();
    const resourcePaths = Array.from(new Set(permissions.map(p => p.resourcePath).filter(Boolean))).sort();

    // İstatistikler
    const stats = {
        total: filteredPermissions.length,
        active: filteredPermissions.filter(p => p.isActive).length,
        byCategory: categories.reduce((acc, cat) => {
            acc[cat] = filteredPermissions.filter(p => (p.category || p.resourceType) === cat).length;
            return acc;
        }, {} as Record<string, number>),
        byResourcePath: resourcePaths.reduce((acc, path) => {
            acc[path] = filteredPermissions.filter(p => p.resourcePath === path).length;
            return acc;
        }, {} as Record<string, number>)
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>{t("permissionsLoading")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t("title")}</h1>
                    <p className="text-muted-foreground">
                        {t("subtitle")}
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("newPermission")}
                </Button>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{t("totalPermissions")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{t("activePermissions")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Layout</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.byCategory.layout || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Function</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.byCategory.function || 0}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtreler */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t("searchPermissions")}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder={t("filterByCategory")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t("allCategories")}</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category} ({stats.byCategory[category] || 0})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedResourcePath} onValueChange={setSelectedResourcePath}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Kaynak yolu seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tüm Kaynak Yolları</SelectItem>
                                {resourcePaths.map((path) => (
                                    <SelectItem key={path} value={path}>
                                        {path} ({stats.byResourcePath[path] || 0})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tablo */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("permissions")} ({filteredPermissions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("permissionDetails")}</TableHead>
                                <TableHead>{t("category")}</TableHead>
                                <TableHead>Kaynak Yolu</TableHead>
                                <TableHead>Eylem</TableHead>
                                <TableHead>Tür</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPermissions.map((permission) => (
                                <TableRow key={permission.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {formatPermissionDisplayName(permission)}
                                            </div>
                                            {permission.description && (
                                                <div className="text-sm text-muted-foreground">
                                                    {formatPermissionDescription(permission)}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {permission.category || permission.resourceType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {permission.resourcePath}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {permission.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={permission.permissionType === 'admin' ? 'destructive' : 'default'}
                                        >
                                            {permission.permissionType === 'admin' ? 'Admin' : 'User'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={permission.isActive ? "default" : "secondary"}
                                        >
                                            {permission.isActive ? t("active") : t("inactive")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditPermission(permission)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    {t("edit")}
                                                </DropdownMenuItem>
                                                {!permission.isSystemPermission && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeletePermission(permission.id)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        {t("delete")}
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredPermissions.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">{t("noPermissionsFound")}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialogs */}
            <CreatePermissionDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={fetchPermissions}
            />

            {selectedPermission && (
                <EditPermissionDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    permission={selectedPermission}
                    onSuccess={fetchPermissions}
                />
            )}
        </div>
    );
} 