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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import QuickRoleAssignModal from './QuickRoleAssignModal';
import CreateUserModal from './CreateUserModal';
import DeleteUserModal from './DeleteUserModal';
import UserEditModal from './UserEditModal';
import UserStatsCards from './UserStatsCards';
import SearchAndFilters from './SearchAndFilters';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

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
        if (selectedUsers.length === 0) {
            toast.error('Lütfen en az bir kullanıcı seçin');
            return;
        }

        try {
            switch (action) {
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
                    toast.success(`${selectedUsers.length} kullanıcı aktif edildi`);
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
                    toast.success(`${selectedUsers.length} kullanıcı devre dışı bırakıldı`);
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
            toast.error('Bir hata oluştu');
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
                toast.success(result.message || 'İşlem başarılı');
                if (result.warnings && result.warnings.length > 0) {
                    result.warnings.forEach((warning: string) => {
                        toast.error(warning);
                    });
                }
                setSelectedUsers([]);
                setBulkDeleteModalOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || 'Silme işlemi başarısız oldu');
                if (result.details && result.details.length > 0) {
                    result.details.forEach((detail: string) => {
                        toast.error(detail);
                    });
                }
            }
        } catch (_error) {
            toast.error('Bir hata oluştu');
        }
    };

    // Excel/CSV export
    const exportUsers = () => {
        const selectedUserData = users.filter(u => selectedUsers.includes(u.id));
        const csvContent = [
            ['Ad', 'Email', 'Durum', 'Roller', 'Kayıt Tarihi'].join(','),
            ...selectedUserData.map(user => [
                user.name || '',
                user.email || '',
                user.isActive ? 'Aktif' : 'Pasif',
                user.currentRole ? user.currentRole.displayName : 'Rol Atanmamış',
                format(new Date(user.createdAt), 'dd/MM/yyyy')
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `kullanicilar_${format(new Date(), 'yyyyMMdd')}.csv`;
        link.click();

        toast.success('Kullanıcı verileri dışa aktarıldı');
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
                toast.success(`Kullanıcı ${newStatus ? 'aktif' : 'pasif'} edildi`);
                router.refresh();
            } else {
                toast.error('Durum güncellenemedi');
            }
        } catch (_error) {
            toast.error('Bir hata oluştu');
        }
    };

    return (
        <div className="space-y-6">
            <Toaster />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Kullanıcı Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Kullanıcıları yönetin, roller atayın ve sistem erişimlerini kontrol edin
                    </p>
                </div>
                <Button onClick={() => handleQuickAction('new-user')}>
                    <Users className="h-4 w-4 mr-2" />
                    Yeni Kullanıcı
                </Button>
            </div>

            {/* Stats Cards */}
            <UserStatsCards users={users} roles={roles} />

            {/* Search and Filters */}
            <SearchAndFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedUsers={selectedUsers}
                onBulkAction={handleBulkAction}
            />

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Kullanıcılar</h3>
                        <div className="text-sm text-muted-foreground">
                            {filteredUsers.length} kullanıcı bulundu
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Kullanıcı</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead>Kayıt Tarihi</TableHead>
                                <TableHead className="text-right">İşlemler</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onCheckedChange={() => handleUserSelect(user.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-muted">
                                                {user.profileImage ? (
                                                    <Image
                                                        src={user.profileImage}
                                                        alt={user.name || 'Kullanıcı'}
                                                        width={32}
                                                        height={32}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-medium text-white">
                                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium">{user.name || 'İsimsiz Kullanıcı'}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                            {user.email || 'Email yok'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.currentRole ? (
                                            <Badge
                                                variant="secondary"
                                                style={{ backgroundColor: user.currentRole.color || undefined }}
                                                className={!user.currentRole.color ? 'bg-blue-100 text-blue-800' : 'text-white'}
                                            >
                                                {user.currentRole.displayName}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">Rol Atanmamış</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {user.isActive ? (
                                                <>
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span className="text-green-600">Aktif</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                    <span className="text-red-600">Pasif</span>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: tr })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    onClick={() => handleQuickAction('edit-user', user.id)}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Düzenle
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleQuickAction('assign-role', user.id)}
                                                >
                                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                                    Rol Ata
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => toggleUserStatus(user.id, user.isActive)}
                                                >
                                                    {user.isActive ? (
                                                        <>
                                                            <XCircle className="mr-2 h-4 w-4" />
                                                            Pasif Et
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="mr-2 h-4 w-4" />
                                                            Aktif Et
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Sil
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-6">
                            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-sm font-medium text-muted-foreground">Kullanıcı bulunamadı</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Arama kriterlerinizi değiştirmeyi deneyin.
                            </p>
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
                        <DialogTitle>Kullanıcıları Sil</DialogTitle>
                        <DialogDescription>
                            {selectedUsers.length} kullanıcıyı silmek istediğinize emin misiniz?
                            Bu işlem geri alınamaz.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBulkDeleteModalOpen(false)}>
                            İptal
                        </Button>
                        <Button variant="destructive" onClick={handleBulkDelete}>
                            Sil
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
