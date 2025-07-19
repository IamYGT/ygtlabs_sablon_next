'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Users,
    MoreHorizontal,
    Edit,
    Trash,
    ShieldCheck,
    CheckCircle,
    XCircle,
    Mail,
    Calendar,
    User,
    Activity,
    Settings,
    Search,
    Filter,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { useTranslations, useLocale } from 'next-intl';
import QuickRoleAssignModal from './QuickRoleAssignModal';
import CreateUserModal from './CreateUserModal';
import DeleteUserModal from './DeleteUserModal';
import UserEditModal from './UserEditModal';
import UserStatsCards from './UserStatsCards';
import BulkActionsDropdown from './BulkActionsDropdown';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface User {
    id: string;
    name: string | null;
    email: string | null;
    profileImage: string | null;
    isActive: boolean;
    createdAt: string;
    roleId?: string | null;
    roleAssignedAt?: string | null;
    currentRole?: {
        id: string;
        name: string;
        displayName: string;
        color: string | null;
    } | null;
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
    permissions: Array<{
        id: string;
        name: string;
        displayName: string;
    }>;
}

interface UsersPageClientProps {
    users: User[];
    roles: Role[];
}

export default function UsersPageClient({ users, roles }: UsersPageClientProps) {
    const router = useRouter();
    const t = useTranslations('AdminUsers');
    const tCommon = useTranslations('AdminCommon');
    const locale = useLocale();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const dateLocale = locale === 'tr' ? tr : enUS;

    // Modal states
    const [roleAssignModalOpen, setRoleAssignModalOpen] = useState(false);
    const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(null);
    const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
    const [selectedUserForDelete, setSelectedUserForDelete] = useState<User | null>(null);
    const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
    const [editUserModalOpen, setEditUserModalOpen] = useState(false);
    const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);

    // Filter users based on search
    const filteredUsers = users.filter(user => {
        const term = searchTerm.toLowerCase();
        return (
            user.name?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term) ||
            user.currentRole?.displayName.toLowerCase().includes(term)
        );
    });

    // Kullanıcı seçimi
    const handleUserSelect = (userId: string) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(u => u.id));
        }
    };

    // Toplu işlemler
    const handleBulkAction = async (action: string) => {
        if (selectedUsers.length === 0 && action !== 'export' && action !== 'clear') {
            toast.error(t('selectAtLeastOne'));
            return;
        }

        try {
            switch (action) {
                case 'clear': {
                    setSelectedUsers([]);
                    return;
                }
                case 'activate': {
                    await Promise.all(
                        selectedUsers.map(userId =>
                            fetch('/api/admin/users/toggle-status', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId, isActive: true }),
                            })
                        )
                    );
                    toast.success(t('messages.bulkActivateSuccess', { count: selectedUsers.length }));
                    break;
                }
                case 'deactivate': {
                    await Promise.all(
                        selectedUsers.map(userId =>
                            fetch('/api/admin/users/toggle-status', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId, isActive: false }),
                            })
                        )
                    );
                    toast.success(t('messages.bulkDeactivateSuccess', { count: selectedUsers.length }));
                    break;
                }
                case 'export': {
                    exportUsers();
                    return;
                }
                case 'delete': {
                    setBulkDeleteModalOpen(true);
                    return;
                }
                default:
                    break;
            }

            setSelectedUsers([]);
            router.refresh();
        } catch (_error) {
            toast.error(t('errorOccurred'));
        }
    };

    // Toplu silme işlemi
    const handleBulkDelete = async () => {
        try {
            const response = await fetch('/api/admin/users/bulk-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIds: selectedUsers }),
            });

            const result: {
                success?: boolean;
                message?: string;
                warnings?: string[];
                error?: string;
                details?: string[];
            } = await response.json();

            if (response.ok) {
                toast.success(result.message || t('operationSuccessful'));
                if (result.warnings && result.warnings.length > 0) {
                    result.warnings.forEach((warning: string) => {
                        toast.error(warning);
                    });
                }
                setSelectedUsers([]);
                setBulkDeleteModalOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || t('deleteOperationFailed'));
                if (result.details && result.details.length > 0) {
                    result.details.forEach((detail: string) => {
                        toast.error(detail);
                    });
                }
            }
        } catch (_error) {
            toast.error(t('errorOccurred'));
        }
    };

    // Excel/CSV export
    const exportUsers = () => {
        const selectedUserData = users.filter(u => selectedUsers.includes(u.id));
        const csvContent = [
            [t('name'), t('email'), t('status'), t('roles'), t('registrationDate')].join(','),
            ...selectedUserData.map(user => [
                (user.name || '').replace(/,/g, ''),
                (user.email || '').replace(/,/g, ''),
                user.isActive ? t('active') : t('inactive'),
                user.currentRole ? user.currentRole.displayName.replace(/,/g, '') : t('noRoleAssigned'),
                format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: dateLocale })
            ].join(','))
        ].join('\n');

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `users_${format(new Date(), 'yyyyMMdd')}.csv`;
        link.click();

        toast.success(t('userDataExported'));
    };

    // Hızlı işlemler
    const handleQuickAction = (action: string, id?: string) => {
        switch (action) {
            case 'new-user':
                setCreateUserModalOpen(true);
                break;
            case 'edit-user': {
                const user = users.find(u => u.id === id);
                setSelectedUserForEdit(user || null);
                setEditUserModalOpen(true);
                break;
            }
            case 'assign-role': {
                const user = users.find(u => u.id === id);
                setSelectedUserForRole(user || null);
                setRoleAssignModalOpen(true);
                break;
            }
            default:
                break;
        }
    };

    const handleDeleteUser = (user: User) => {
        setSelectedUserForDelete(user);
        setDeleteUserModalOpen(true);
    };

    const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
        try {
            const response = await fetch('/api/admin/users/toggle-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, isActive: !currentStatus }),
            });

            if (response.ok) {
                const newStatus = !currentStatus;
                toast.success(newStatus ? t('userActivated') : t('userDeactivated'));
                router.refresh();
            } else {
                toast.error(t('statusNotUpdated'));
            }
        } catch (_error) {
            toast.error(t('errorOccurred'));
        }
    };

    return (
        <div className="space-y-8">
            <Toaster />
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{t('title')}</h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={() => handleQuickAction('new-user')}
                    className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
                >
                    <Users className="h-4 w-4 mr-2" />
                    {t('newUser')}
                </Button>
            </div>

            {/* Stats Cards */}
            <UserStatsCards users={users} roles={roles} />

            {/* Users Table */}
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="p-2 sm:p-4 bg-blue-600 rounded-lg sm:rounded-xl shadow-lg">
                                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t('userList')}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{t('description')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end w-full sm:w-auto">
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{filteredUsers.length}</span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-500 uppercase tracking-wide font-medium">
                                    {filteredUsers.length === 1 ? t('user') : t('users')}
                                </span>
                            </div>
                            <div className="h-12 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span className="text-base sm:text-lg font-semibold text-green-600 dark:text-green-400">
                                        {users.filter(u => u.isActive).length}
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
                                        {users.filter(u => !u.isActive).length}
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
                                    <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="font-medium">{users.filter(u => u.currentRole).length} {t('rolesAssigned')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded">
                                    <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="font-medium">{t('last30Days')}: {users.filter(u => {
                                    const thirtyDaysAgo = new Date();
                                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                    return new Date(u.createdAt) >= thirtyDaysAgo;
                                }).length} {t('new')}</span>
                            </div>
                        </div>
                        {selectedUsers.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                                    <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                        {selectedUsers.length} {t('selected')}
                                    </span>
                                </div>
                                <div
                                    className="flex items-center gap-2 bg-red-100 dark:bg-red-900/20 px-3 py-1.5 rounded-full cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                                    onClick={() => handleBulkAction('clear')}
                                >
                                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                                        {t('search.clearSelection')}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Search and Filters */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="relative w-full sm:max-w-lg">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                </div>
                                <Input
                                    placeholder={t('search.placeholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-base"
                                />
                            </div>
                            <div className="flex items-center justify-start sm:justify-end gap-3 w-full sm:w-auto">
                                <Button
                                    variant="outline"
                                    className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    {t('search.filters')}
                                </Button>
                                <BulkActionsDropdown
                                    selectedCount={selectedUsers.length}
                                    onBulkAction={handleBulkAction}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50/70 dark:hover:bg-gray-800/70">
                                <TableHead className="w-[50px] pl-6">
                                    <Checkbox
                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                        onCheckedChange={handleSelectAll}
                                        className="border-gray-300 dark:border-gray-600"
                                    />
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        {t('name')}
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        {t('email')}
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        {t('roles')}
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        {t('status')}
                                    </div>
                                </TableHead>
                                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        {t('registrationDate')}
                                    </div>
                                </TableHead>
                                <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300 pr-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                        {t('actions')}
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/50 transition-all duration-200 border-b border-gray-100 dark:border-gray-800 group"
                                >
                                    <TableCell className="pl-6">
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onCheckedChange={() => handleUserSelect(user.id)}
                                            className="border-gray-300 dark:border-gray-600"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-md transition-all duration-200">
                                                {user.profileImage ? (
                                                    <Image
                                                        src={user.profileImage}
                                                        alt={user.name || t('name')}
                                                        width={48}
                                                        height={48}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 to-blue-600 text-base font-semibold text-white">
                                                        {(user.name ? user.name.charAt(0).toUpperCase() : t('userChar'))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900 dark:text-gray-100 text-base">{user.name || t('noName')}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">ID: {user.id.slice(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded">
                                                <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300 text-sm">{user.email || t('noEmail')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.currentRole ? (
                                            <Badge
                                                variant="secondary"
                                                style={{ backgroundColor: user.currentRole.color || undefined }}
                                                className={!user.currentRole.color ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 px-3 py-1.5 text-sm font-medium' : 'text-white px-3 py-1.5 text-sm font-medium shadow-sm'}
                                            >
                                                <ShieldCheck className="h-3 w-3 mr-1.5" />
                                                {user.currentRole.displayName}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 px-3 py-1.5 text-sm">
                                                <XCircle className="h-3 w-3 mr-1.5" />
                                                {t('noRoleAssigned')}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {user.isActive ? (
                                                <>
                                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
                                                        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm">{t('active')}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                                                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-red-700 dark:text-red-400 font-semibold text-sm">{t('inactive')}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">Offline</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/20 rounded">
                                                <Calendar className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{format(new Date(user.createdAt), 'PPP', { locale: dateLocale })}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(user.createdAt), 'p', { locale: dateLocale })}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-9 w-9 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group-hover:shadow-sm"
                                                >
                                                    <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg w-56">
                                                <DropdownMenuLabel className="text-gray-700 dark:text-gray-300 font-semibold">{t('actions')}</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => handleQuickAction('edit-user', user.id)}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded mr-3">
                                                            <Edit className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <span className="text-gray-700 dark:text-gray-300 font-medium">{tCommon('edit')}</span>
                                                    </div>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleQuickAction('assign-role', user.id)}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/20 rounded mr-3">
                                                            <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                                        </div>
                                                        <span className="text-gray-700 dark:text-gray-300 font-medium">{t('assignRole')}</span>
                                                    </div>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => toggleUserStatus(user.id, user.isActive)}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                                                >
                                                    {user.isActive ? (
                                                        <div className="flex items-center">
                                                            <div className="p-1.5 bg-red-100 dark:bg-red-900/20 rounded mr-3">
                                                                <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                                                            </div>
                                                            <span className="text-red-700 dark:text-red-400 font-medium">{t('deactivateUser')}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center">
                                                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/20 rounded mr-3">
                                                                <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                                            </div>
                                                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">{t('activateUser')}</span>
                                                        </div>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 cursor-pointer"
                                                >
                                                    <div className="flex items-center">
                                                        <div className="p-1.5 bg-red-100 dark:bg-red-900/20 rounded mr-3">
                                                            <Trash className="h-3 w-3 text-red-600 dark:text-red-400" />
                                                        </div>
                                                        <span className="font-semibold">{tCommon('delete')}</span>
                                                    </div>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12 bg-gray-50/30 dark:bg-gray-800/30">
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                                    <Users className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{t('userNotFound')}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm">
                                    {t('tryDifferentCriteria')}
                                </p>
                                <Button
                                    onClick={() => setSearchTerm('')}
                                    variant="outline"
                                    className="mt-4 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Filtreleri Temizle
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modals */}
            <QuickRoleAssignModal
                open={roleAssignModalOpen}
                onOpenChange={setRoleAssignModalOpen}
                user={selectedUserForRole}
                roles={roles}
                onRoleAssigned={() => router.refresh()}
            />

            <CreateUserModal
                open={createUserModalOpen}
                onOpenChange={setCreateUserModalOpen}
                roles={roles}
                onUserCreated={() => router.refresh()}
            />

            <UserEditModal
                open={editUserModalOpen}
                onOpenChange={setEditUserModalOpen}
                user={selectedUserForEdit}
                roles={roles}
                onUserUpdated={() => router.refresh()}
            />

            <DeleteUserModal
                open={deleteUserModalOpen}
                onOpenChange={setDeleteUserModalOpen}
                user={selectedUserForDelete}
                onUserDeleted={() => router.refresh()}
            />

            {/* Bulk Delete Confirmation */}
            <Dialog open={bulkDeleteModalOpen} onOpenChange={setBulkDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('messages.bulkDeleteConfirmTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('messages.bulkDeleteConfirmText', { count: selectedUsers.length })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBulkDeleteModalOpen(false)}>
                            {tCommon('cancel')}
                        </Button>
                        <Button variant="destructive" onClick={handleBulkDelete}>
                            {tCommon('delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
