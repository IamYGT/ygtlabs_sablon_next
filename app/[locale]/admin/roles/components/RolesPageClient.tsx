'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Plus, Search, Filter, Eye, Edit2, MoreHorizontal, Trash2, Settings, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Toaster } from 'react-hot-toast';
import { useTranslations } from 'next-intl';

import { useAuth } from '@/lib/hooks/useAuth';
import CreateRoleDialog from './CreateRoleDialog';
import RoleDetailsDialog from './RoleDetailsDialog';
import EditRoleDialog from './EditRoleDialog';
import DeleteRoleDialog from './DeleteRoleDialog';

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

interface Permission {
    id: string;
    name: string;
    displayName: string;
    category: string;
    description: string | null;
}


interface RolesPageClientProps {
    initialRoles?: Role[];
    availablePermissions?: Permission[];
    currentUserPermissions?: string[];
}

export default function RolesPageClient({
    initialRoles = [],
    availablePermissions = [],
    currentUserPermissions = []
}: RolesPageClientProps) {
    const { user: currentUser } = useAuth();
    const t = useTranslations('AdminRoles');
    const [roles, setRoles] = useState<Role[]>(initialRoles);
    const [permissions, setPermissions] = useState<Permission[]>(availablePermissions);
    const [userPermissions, setUserPermissions] = useState<string[]>(currentUserPermissions);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    // Rol silme için state'ler
    const [deleteRoleModalOpen, setDeleteRoleModalOpen] = useState(false);
    const [selectedRoleForDelete, setSelectedRoleForDelete] = useState<Role | null>(null);

    const loadInitialData = useCallback(async () => {
        if (!currentUser) return;

        setLoading(true);
        try {
            // Rolleri ve permissions'ları paralel olarak yükle
            const [rolesResponse, permissionsResponse] = await Promise.all([
                fetch('/api/admin/roles'),
                fetch('/api/admin/permissions?limit=1000')
            ]);

            if (rolesResponse.ok) {
                const rolesData = await rolesResponse.json();
                setRoles(rolesData.roles || []);
            }

            if (permissionsResponse.ok) {
                const permissionsData = await permissionsResponse.json();
                setPermissions(permissionsData.permissions || []);
            }

            // User permissions'ları currentUser'dan al
            setUserPermissions(currentUser.permissions || []);
        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    // Client-side data fetching
    useEffect(() => {
        if (currentUser && initialRoles.length === 0) {
            loadInitialData();
        }
    }, [currentUser, initialRoles.length, loadInitialData]);



    // Filtreleme fonksiyonu
    const filteredRoles = roles.filter(role => {
        const matchesSearch =
            role.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && role.isActive) ||
            (statusFilter === 'inactive' && !role.isActive);

        return matchesSearch && matchesStatus;
    });

    // İstatistikleri hesapla
    const totalRoles = roles.length;
    const activeRoles = roles.filter(role => role.isActive).length;
    const totalUsers = roles.reduce((sum, role) => sum + (role._count?.users || 0), 0);
    const totalPermissions = permissions.length;

    // Rol tipi etiketi
    const getRoleTypeInfo = (role: Role) => {
        if (role.name === 'super_admin') return { label: t('superAdmin'), variant: 'destructive' as const, icon: Crown };
        if (role.name === 'admin') return { label: t('admin'), variant: 'default' as const, icon: Shield };
        if (role.name === 'user') return { label: t('user'), variant: 'secondary' as const, icon: Users };
        return { label: t('custom'), variant: 'outline' as const, icon: Settings };
    };

    // Kategori bazında yetkileri grupla
    const _getPermissionsByCategory = () => {
        // Placeholder function
        return {};
    };

    // Rolleri yeniden yükle - sadece gerekli yetkiye sahipse API çağrısı yap
    const loadRoles = async () => {
        // Rol görüntüleme yetkisi yoksa API çağrısı yapma
        const hasViewPermission = userPermissions.some(perm =>
            perm.includes('function.roles.view') || perm.includes('view./admin/roles')
        );

        if (!hasViewPermission) {
            console.log('🚫 Rol listesi API çağrısı yapılmadı - yetki yok');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/admin/roles');
            if (response.ok) {
                const data = await response.json();
                setRoles(data.roles || []);
            } else {
                console.error('Failed to load roles:', response.status);
            }
        } catch (error) {
            console.error('Error loading roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        // Yetki yoksa API çağrısı yerine sayfayı refresh et
        const hasViewPermission = userPermissions.some(perm =>
            perm.includes('function.roles.view') || perm.includes('view./admin/roles')
        );

        if (!hasViewPermission) {
            console.log('🔄 Yetki olmadığı için sayfa refresh edilecek');
            window.location.reload();
            return;
        }

        loadRoles();
    };

    const handleRoleAction = (action: string, role: Role) => {
        setSelectedRole(role);
        switch (action) {
            case 'details':
                setShowDetailsDialog(true);
                break;
            case 'edit':
                setShowEditDialog(true);
                break;
            case 'users':
                // Users dialog removed - show details instead
                setShowDetailsDialog(true);
                break;
            case 'permissions':
                // Permissions dialog removed - show details instead
                setShowDetailsDialog(true);
                break;
            case 'edit-permissions':
                setShowEditDialog(true);
                break;
            case 'delete':
                setSelectedRoleForDelete(role);
                setDeleteRoleModalOpen(true);
                break;
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="space-y-6">
                {/* Debug - Kullanıcı Yetkileri */}
                {currentUser && process.env.NODE_ENV === 'development' && (
                    <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">{t('debug.title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <p>{t('debug.userLabel')}: {currentUser.email}</p>
                                <p>{t('debug.rolesLabel')}: {currentUser.userRoles?.join(", ") || t('debug.noRole')}</p>
                                <p className="font-medium">
                                    {t('debug.permissionLabel')}:
                                    <span className={userPermissions.includes("roles.edit") ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                                        {userPermissions.includes("roles.edit") ? t('debug.hasPermission') : t('debug.noPermission')}
                                    </span>
                                </p>
                                {!userPermissions.includes("roles.edit") && (
                                    <div className="mt-3">
                                        <Button
                                            size="sm"
                                            variant="default"
                                            onClick={async () => {
                                                try {
                                                    const response = await fetch('/api/admin/users/fix-permissions', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        }
                                                    });
                                                    const data = await response.json();
                                                    if (response.ok) {
                                                        alert('Permissions updated! Please refresh the page.');
                                                        window.location.reload();
                                                    } else {
                                                        alert('Error: ' + (data.error || 'Unknown error'));
                                                    }
                                                } catch (error) {
                                                    alert('Error: ' + error);
                                                }
                                            }}
                                        >
                                            {t('debug.fixPermissions')}
                                        </Button>
                                        <p className="text-xs text-gray-600 mt-1">
                                            {t('debug.fixDescription')}
                                        </p>
                                    </div>
                                )}
                                <details className="mt-2">
                                    <summary className="cursor-pointer text-blue-600">
                                        {t('debug.allPermissions', { count: userPermissions.length })}
                                    </summary>
                                    <div className="mt-2 space-y-1 text-xs">
                                        {userPermissions.map((perm: string) => (
                                            <div key={perm} className="text-gray-600">
                                                • {perm}
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                        <p className="text-muted-foreground">
                            {t('subtitle')}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                            {loading ? t('loading') : t('refresh')}
                        </Button>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('newRole')}
                        </Button>
                    </div>
                </div>

                {/* İstatistikler */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Shield className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium">{t('totalRoles')}</p>
                                    <p className="text-2xl font-bold">{totalRoles}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="text-sm font-medium">{t('users')}</p>
                                    <p className="text-2xl font-bold">{totalUsers}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Settings className="h-5 w-5 text-purple-500" />
                                <div>
                                    <p className="text-sm font-medium">{t('activeRoles')}</p>
                                    <p className="text-2xl font-bold">{activeRoles}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Filter className="h-5 w-5 text-orange-500" />
                                <div>
                                    <p className="text-sm font-medium">{t('permissions')}</p>
                                    <p className="text-2xl font-bold">{totalPermissions}</p>
                                </div>
                            </div>
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
                                        placeholder={t('searchRoles')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('all')}</SelectItem>
                                    <SelectItem value="active">{t('active')}</SelectItem>
                                    <SelectItem value="inactive">{t('inactive')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            {filteredRoles.length} {t('rolesShowing')}
                        </p>
                    </CardContent>
                </Card>

                {/* Roller Grid */}
                {loading ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">{t('rolesLoading')}</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredRoles.map((role) => {
                            const roleTypeInfo = getRoleTypeInfo(role);
                            const IconComponent = roleTypeInfo.icon;
                            const isProtected = role.name === 'super_admin' || role.name === 'user';

                            return (
                                <Card key={role.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: role.color || '#6366f1' }}
                                                >
                                                    <IconComponent className="h-4 w-4 text-white" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{role.displayName}</CardTitle>
                                                    <p className="text-xs text-muted-foreground">{role.name}</p>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleRoleAction('details', role)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        {t('details')}
                                                    </DropdownMenuItem>
                                                    {!isProtected && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleRoleAction('edit', role)}>
                                                                <Edit2 className="mr-2 h-4 w-4" />
                                                                {t('edit')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleRoleAction('edit-permissions', role)}>
                                                                <Settings className="mr-2 h-4 w-4" />
                                                                {t('editPermissions')}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => handleRoleAction('delete', role)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                {t('delete')}
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Badge variant={roleTypeInfo.variant}>
                                                {roleTypeInfo.label}
                                            </Badge>
                                            <Badge variant={role.isActive ? "default" : "secondary"}>
                                                {role.isActive ? t('active') : t('inactive')}
                                            </Badge>
                                            {isProtected && (
                                                <Badge variant="outline" className="text-red-600 border-red-200">
                                                    {t('protected')}
                                                </Badge>
                                            )}
                                        </div>

                                        {role.description && (
                                            <CardDescription className="text-sm line-clamp-2">
                                                {role.description}
                                            </CardDescription>
                                        )}

                                        <div className="flex justify-between text-sm">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                <span>{role._count.users} {t('usersCount')}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Shield className="h-3 w-3" />
                                                <span>{role.permissions?.length || 0} {t('permissionsCount')}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => handleRoleAction('details', role)}
                                            >
                                                <Eye className="mr-1 h-3 w-3" />
                                                {t('view')}
                                            </Button>
                                            {!isProtected && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => handleRoleAction('edit', role)}
                                                >
                                                    <Edit2 className="mr-1 h-3 w-3" />
                                                    {t('edit')}
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {!loading && filteredRoles.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">{t('noRolesFound')}</h3>
                            <p className="text-muted-foreground">
                                {t('noRolesMatchCriteria')}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Dialog'lar */}
                <CreateRoleDialog
                    open={showCreateDialog}
                    onOpenChange={setShowCreateDialog}
                    onRoleCreated={handleRefresh}
                />

                {selectedRole && (
                    <>
                        <RoleDetailsDialog
                            open={showDetailsDialog}
                            onOpenChange={setShowDetailsDialog}
                            role={selectedRole}
                        />
                        <EditRoleDialog
                            open={showEditDialog}
                            onOpenChange={setShowEditDialog}
                            role={selectedRole}
                            onRoleUpdated={handleRefresh}
                        />
                    </>
                )}

                <DeleteRoleDialog
                    open={deleteRoleModalOpen}
                    onOpenChange={setDeleteRoleModalOpen}
                    role={selectedRoleForDelete}
                    availableRoles={roles.filter(r => r.isActive)}
                    onRoleDeleted={handleRefresh}
                />
            </div>
        </>
    );
} 