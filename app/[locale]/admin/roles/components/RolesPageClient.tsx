'use client';

import { AdminPageGuard } from '@/components/panel/AdminPageGuard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { CheckCircle, Crown, Edit2, Eye, Filter, MoreHorizontal, Plus, Search, Settings, Shield, Trash2, Users, X, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { useAuth } from '@/lib/hooks/useAuth';
import CreateRoleDialogV3 from './CreateRoleDialog';
import DeleteRoleDialog from './DeleteRoleDialog';
import EditRoleDialog from './EditRoleDialog';
import RoleDetailsDialog from './RoleDetailsDialog';

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
            // Force fresh data with proper cache-busting
            const timestamp = Date.now();
            const random = Math.random();
            
            const [rolesResponse, permissionsResponse] = await Promise.all([
                fetch(`/api/admin/roles?t=${timestamp}&_=${random}`, {
                    method: 'GET',
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                }),
                fetch(`/api/admin/permissions?limit=1000&t=${timestamp}&_=${random}`, {
                    method: 'GET',
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                })
            ]);

            if (rolesResponse.ok) {
                const rolesData = await rolesResponse.json();
                setRoles(rolesData.roles || []);
                console.log('Initial roles loaded:', rolesData.roles?.length || 0);
            }

            if (permissionsResponse.ok) {
                const permissionsData = await permissionsResponse.json();
                setPermissions(permissionsData.permissions || []);
                console.log('Initial permissions loaded:', permissionsData.permissions?.length || 0);
            }

            // User permissions'ları currentUser'dan al
            setUserPermissions(currentUser.permissions || []);
        } catch (error) {
            console.error(t('error.errorLoadingInitial'), error);
            toast.error(t('error.errorLoadingInitial'));
        } finally {
            setLoading(false);
        }
    }, [currentUser, t]);

    // Rolleri yeniden yükle - sadece gerekli yetkiye sahipse API çağrısı yap
    const loadRoles = useCallback(async () => {
        // Rol görüntüleme yetkisi yoksa API çağrısı yapma
        const hasViewPermission = userPermissions.some(perm =>
            perm.includes('function.roles.view') || perm.includes('view./admin/roles')
        );

        if (!hasViewPermission) {
            console.log(t('info.noViewPermission'));
            return;
        }

        setLoading(true);
        try {
            // Force fresh data by adding timestamp and proper headers
            const response = await fetch(`/api/admin/roles?t=${Date.now()}&_=${Math.random()}`, {
                method: 'GET',
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Always set fresh data, don't merge with existing
                setRoles(data.roles || []);
                console.log('Roles refreshed:', data.roles?.length || 0, 'roles loaded');
            } else {
                console.error(t('error.failedToLoad'), response.status);
                toast.error(t('error.failedToLoad'));
            }
        } catch (error) {
            console.error(t('error.errorLoading'), error);
            toast.error(t('error.errorLoading'));
        } finally {
            setLoading(false);
        }
    }, [userPermissions, t]);

    // Client-side data fetching - always fetch fresh data on mount
    useEffect(() => {
        if (currentUser) {
            // Always load fresh data regardless of initial roles
            loadInitialData();
        }
    }, [currentUser, loadInitialData]);

    // Add interval to refresh data periodically (optional)
    useEffect(() => {
        if (!currentUser) return;
        
        // Refresh data every 30 seconds to ensure real-time updates
        const intervalId = setInterval(() => {
            loadRoles();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [currentUser, loadRoles]);



    // Helper function to check if user can view/interact with a role
    const canUserAccessRole = (role: Role) => {
        if (!currentUser) return false;
        
        // Super admin can access all roles
        if (currentUser.primaryRole === 'super_admin') {
            return true;
        }
        
        // Protected roles check
        const isProtectedRole = role.name === 'super_admin' || role.name === 'customer' || role.name === 'admin';
        
        // Get role permissions from the role data
        const rolePermissionNames = role.permissions?.map(p => p.permission.name) || [];
        const userPermissionCount = currentUser.permissions?.length || 0;
        const targetRolePermissionCount = rolePermissionNames.length;
        
        // Check if user has all permissions that the role has
        const userHasAllRolePermissions = rolePermissionNames.every(
            (permName: string) => currentUser.permissions?.includes(permName) || false
        );
        
        // Access rules:
        // 1. Can view protected roles (but not edit them)
        // 2. Cannot view roles with more permissions than user has
        // 3. Cannot view roles that have permissions user doesn't have
        // 4. Can view their own role (but cannot edit it unless super admin)
        
        if (isProtectedRole) {
            // Can view protected roles but with limited interaction
            return true;
        }
        
        if (targetRolePermissionCount > userPermissionCount) {
            // Cannot access roles with more permissions
            return false;
        }
        
        if (!userHasAllRolePermissions) {
            // Cannot access roles that have permissions user doesn't have
            return false;
        }
        
        return true;
    };

    // Filtreleme fonksiyonu with access control
    const filteredRoles = roles.filter(role => {
        // First check if user can access this role
        if (!canUserAccessRole(role)) {
            return false;
        }
        
        const matchesSearch =
            role.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'active' && role.isActive) ||
            (statusFilter === 'inactive' && !role.isActive);

        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        // Korumalı roller her zaman en üstte
        const aIsProtected = a.name === 'super_admin' || a.name === 'admin' || a.name === 'customer';
        const bIsProtected = b.name === 'super_admin' || b.name === 'admin' || b.name === 'customer';

        // Korumalı roller önce gelir
        if (aIsProtected && !bIsProtected) return -1;
        if (!aIsProtected && bIsProtected) return 1;

        // Her ikisi korumalı veya korumalı değilse alfabetik sırala
        return a.displayName.localeCompare(b.displayName);
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
        if (role.name === 'customer') return { label: t('customer'), variant: 'secondary' as const, icon: Users };
        return { label: t('admin'), variant: 'default' as const, icon: Shield }; // Custom roles as admin
    };

    // Kategori bazında yetkileri grupla
    const _getPermissionsByCategory = () => {
        // Placeholder function
        return {};
    };

    const handleRefresh = () => {
        // Yetki yoksa API çağrısı yerine sayfayı refresh et
        const hasViewPermission = userPermissions.some(perm =>
            perm.includes('function.roles.view') || perm.includes('view./admin/roles')
        );

        if (!hasViewPermission) {
            console.log(t('info.refreshingPage'));
            window.location.reload();
            return;
        }

        loadRoles();
    };

    const handleToggleRoleStatus = async (role: Role) => {
        const newStatus = !role.isActive;

        try {
            const response = await fetch(`/api/admin/roles/${role.id}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: newStatus }),
            });

            if (response.ok) {
                toast.success(newStatus ? t('success.roleActivated') : t('success.roleDeactivated'));
                await loadRoles();
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || t('error.statusUpdateFailed'));
            }
        } catch (error) {
            console.error('Role status update error:', error);
            toast.error(t('error.statusUpdateFailed'));
        }
    };

    const handleRoleAction = (action: string, role: Role) => {
        // First check if user can access this role at all
        if (!canUserAccessRole(role)) {
            toast.error('Bu rolü görüntüleme yetkiniz bulunmamaktadır.');
            return;
        }
        
        // Güvenlik kontrolü - kullanıcı kendi rolünü düzenleyemez (süper admin hariç)
        if (action === 'edit' || action === 'delete' || action === 'edit-permissions') {
            const isSystemProtected = role.name === 'super_admin' || role.name === 'customer' || role.name === 'admin';
            const isCurrentUserRole = currentUser?.primaryRole === role.name;
            const isSuperAdmin = currentUser?.primaryRole === 'super_admin';
            
            if (isSystemProtected || (isCurrentUserRole && !isSuperAdmin)) {
                const message = action === 'delete' ? 
                    'Bu rol korumalı ve silinemez' : 
                    'Kendi rolünüzü düzenleyemezsiniz';
                toast.error(message);
                return;
            }
        }

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
        <AdminPageGuard requiredPermission="admin.roles.view">
            <Toaster position="top-right" />
            <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 min-h-full">


                {/* Header */}
                <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                    {t('title')}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    {t('subtitle')}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-4 overflow-hidden">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300 truncate">{t('totalRoles')}</p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalRoles}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-4 overflow-hidden">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-500 rounded-lg flex-shrink-0">
                                    <Users className="h-5 w-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300 truncate">{t('users')}</p>
                                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">{totalUsers}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-4 overflow-hidden">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-orange-500 rounded-lg flex-shrink-0">
                                    <Filter className="h-5 w-5 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300 truncate">{t('permissions')}</p>
                                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{totalPermissions}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Roles Table */}
                <Card className="bg-blue-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="p-2 sm:p-4 bg-blue-600 rounded-lg sm:rounded-xl shadow-lg">
                                        <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                        {t('rolesList')}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('description')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end w-full sm:w-auto">
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                        <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            {filteredRoles.length}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide font-medium">
                                        {filteredRoles.length === 1 ? t('role') : t('roles')}
                                    </span>
                                </div>
                                <div className="h-12 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span className="text-base sm:text-lg font-semibold text-green-600 dark:text-green-400">
                                            {activeRoles}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide font-medium">
                                        {t('active')}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                        <span className="text-base sm:text-lg font-semibold text-red-600 dark:text-red-400">
                                            {totalRoles - activeRoles}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide font-medium">
                                        {t('inactive')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Info Bar */}
                        <div className="mt-4 border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-6 flex-wrap">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/20 rounded">
                                        <Users className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="font-medium">
                                        {totalUsers} {t('usersAssigned')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded">
                                        <Settings className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="font-medium">
                                        {totalPermissions} {t('totalPermissions')}
                                    </span>
                                </div>
                            </div>
                            {searchTerm && (
                                <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                                    <Search className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                        &ldquo;{searchTerm}&rdquo;
                                    </span>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="ml-2 hover:bg-emerald-200 dark:hover:bg-emerald-900/40 rounded-full p-0.5 transition-colors duration-150"
                                    >
                                        <X className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Enhanced Search and Filters */}
                        <div className="mt-6 pt-6 border-t-2 border-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800 dark:to-indigo-800">
                            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                                    {/* Search Section */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-500 rounded-lg">
                                                <Search className="h-4 w-4 text-white" />
                                            </div>
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                {t('search.placeholder')}
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                                <Search className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <Input
                                                placeholder={t('searchRoles')}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-base rounded-xl shadow-sm hover:shadow-md"
                                            />
                                        </div>
                                    </div>

                                    {/* Filters Section */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 lg:w-auto">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-purple-500 rounded-lg">
                                                    <Filter className="h-4 w-4 text-white" />
                                                </div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                {t('filterByStatus')}
                                            </label>
                                            </div>
                                            <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                                                <SelectTrigger className="w-[160px] h-11 bg-white dark:bg-gray-900 border-2 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">{t('all')}</SelectItem>
                                                    <SelectItem value="active">{t('active')}</SelectItem>
                                                    <SelectItem value="inactive">{t('inactive')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            onClick={() => setShowCreateDialog(true)}
                                            className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm px-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 border-0"
                                        >
                                            <Plus className="h-5 w-5 mr-2" />
                                            {t('newRole')}
                                        </Button>
                                    </div>
                                </div>

                                {/* Active Search Info */}
                                {searchTerm && (
                                    <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                                        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
                                            <Search className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                                                &ldquo;{searchTerm}&rdquo; için arama yapılıyor
                                            </span>
                                            <button
                                                onClick={() => setSearchTerm('')}
                                                className="ml-auto p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded-lg transition-colors duration-150"
                                            >
                                                <X className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="text-center py-12 bg-gray-50/30 dark:bg-gray-800/30">
                                <div className="flex flex-col items-center">
                                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                                        <Shield className="h-8 w-8 text-gray-400 dark:text-gray-500 animate-spin" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        {t('rolesLoading')}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        {t('pleaseWait')}
                                    </p>
                                </div>
                            </div>
                        ) : filteredRoles.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50/30 dark:bg-gray-800/30">
                                <div className="flex flex-col items-center">
                                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                                        <Shield className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        {t('noRolesFound')}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm">
                                        {t('tryDifferentCriteria')}
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setStatusFilter('all');
                                        }}
                                        variant="outline"
                                        className="mt-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
                                    >
                                        <Filter className="h-4 w-4 mr-2" />
                                        {t('clearFilters')}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                {filteredRoles.map((role) => {
                                    const roleTypeInfo = getRoleTypeInfo(role);
                                    const IconComponent = roleTypeInfo.icon;
                                    
                                    // Role koruması: sistem rolleri + kullanıcının kendi rolü (süper admin hariç)
                                    const isSystemProtected = role.name === 'super_admin' || role.name === 'customer' || role.name === 'admin';
                                    const isCurrentUserRole = currentUser?.primaryRole === role.name;
                                    const isSuperAdmin = currentUser?.primaryRole === 'super_admin';
                                    
                                    // Permission kontrolü - sadece roles.delete yetkisi
                                    const hasDeletePermission = currentUser?.permissions?.includes('roles.delete') || isSuperAdmin;
                                    
                                    // Süper admin değilse kendi rolünü düzenleyemez + permission kontrolü
                                    const isProtected = isSystemProtected || (isCurrentUserRole && !isSuperAdmin);
                                    const canDelete = hasDeletePermission && !isProtected;

                                    return (
                                        <Card key={role.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200 group overflow-hidden">
                                            <CardHeader className="pb-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                                        <div
                                                            className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md flex-shrink-0"
                                                            style={{ backgroundColor: role.color || '#6366f1' }}
                                                        >
                                                            <IconComponent className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate" title={role.displayName}>{role.displayName}</CardTitle>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium truncate" title={role.name}>{role.name}</p>
                                                        </div>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 rounded-lg"
                                                            >
                                                                <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg w-56"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() => handleRoleAction('details', role)}
                                                                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                                                            >
                                                                <div className="flex items-center">
                                                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded mr-3">
                                                                        <Eye className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                                    </div>
                                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                                        {t('details')}
                                                                    </span>
                                                                </div>
                                                            </DropdownMenuItem>
                                                            {!isProtected && (
                                                                <>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleRoleAction('edit', role)}
                                                                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                                                                    >
                                                                        <div className="flex items-center">
                                                                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/20 rounded mr-3">
                                                                                <Edit2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                                                            </div>
                                                                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                                                {t('edit')}
                                                                            </span>
                                                                        </div>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleToggleRoleStatus(role)}
                                                                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                                                                    >
                                                                        {role.isActive ? (
                                                                            <div className="flex items-center">
                                                                                <div className="p-1.5 bg-red-100 dark:bg-red-900/20 rounded mr-3">
                                                                                    <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                                                                                </div>
                                                                                <span className="text-red-700 dark:text-red-400 font-medium">
                                                                                    {t('deactivate')}
                                                                                </span>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex items-center">
                                                                                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/20 rounded mr-3">
                                                                                    <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                                                                </div>
                                                                                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                                                                                    {t('activate')}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                    {canDelete && (
                                                                        <>
                                                                            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                                                                            <DropdownMenuItem
                                                                                onClick={() => handleRoleAction('delete', role)}
                                                                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 cursor-pointer"
                                                                            >
                                                                                <div className="flex items-center">
                                                                                    <div className="p-1.5 bg-red-100 dark:bg-red-900/20 rounded mr-3">
                                                                                        <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
                                                                                    </div>
                                                                                    <span className="font-semibold">
                                                                                        {t('delete')}
                                                                                    </span>
                                                                                </div>
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    )}
                                                                </>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex flex-wrap items-center gap-2 overflow-hidden">
                                                    {/* Korumalı Badge */}
                                                    {role.name === 'super_admin' || role.name === 'admin' || role.name === 'customer' ? (
                                                        <Badge variant="destructive" className="text-xs px-2 py-0.5 flex-shrink-0">
                                                            Korumalı
                                                        </Badge>
                                                    ) : null}

                                                    {/* Layout Badge */}
                                                    <Badge variant="outline" className="text-xs px-2 py-0.5 flex-shrink-0 border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300">
                                                        {role.layoutType}
                                                    </Badge>

                                                    {/* Aktif/Pasif Badge */}
                                                    <Badge variant={role.isActive ? "default" : "secondary"} className="text-xs px-2 py-0.5 flex-shrink-0">
                                                        {role.isActive ? t('active') : t('inactive')}
                                                    </Badge>
                                                </div>

                                                {role.description && (
                                                    <CardDescription className="text-sm line-clamp-2 text-gray-600 dark:text-gray-400 leading-relaxed overflow-hidden">
                                                        {role.description}
                                                    </CardDescription>
                                                )}

                                                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-md">
                                                            <Users className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{role._count.users}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('usersCount')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded-md">
                                                            <Shield className="h-4 w-4 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{role.permissions?.length || 0}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('permissionsCount')}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    {!isProtected ? (
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md transition-all duration-200 hover:shadow-lg"
                                                            onClick={() => handleRoleAction('edit', role)}
                                                        >
                                                            <Edit2 className="mr-2 h-4 w-4" />
                                                            {t('edit')}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-150"
                                                            onClick={() => handleRoleAction('details', role)}
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            {t('view')}
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dialog'lar */}
                <CreateRoleDialogV3
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
        </AdminPageGuard>
    );
} 