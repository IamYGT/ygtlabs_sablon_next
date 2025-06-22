'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MoreHorizontal,
    Eye,
    Shield,
    UserMinus,
    UserPlus,
    Trash2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';

interface UserWithRoles {
    id: string;
    name: string | null;
    email: string | null;
    isActive: boolean;
    createdAt: Date;
    lastLoginAt: Date | null;
    roleAssignments: Array<{
        id: string;
        isActive: boolean;
        assignedAt: Date;
        role: {
            id: string;
            name: string;
            displayName: string;
            color: string | null;
            priority: number;
        };
    }>;
}

interface Role {
    id: string;
    name: string;
    displayName: string;
    color: string | null;
    priority: number;
}

interface UserActionsCellProps {
    user: UserWithRoles;
    availableRoles: Role[];
    onUserUpdate: () => void;
}

export default function UserActionsCell({ user, availableRoles, onUserUpdate }: UserActionsCellProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [showRoleManagement, setShowRoleManagement] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>('');

    const handleAssignRole = async () => {
        if (!selectedRole) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/users/assign-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    roleId: selectedRole,
                }),
            });

            if (response.ok) {
                toast.success('Rol başarıyla atandı');
                setSelectedRole('');
                setShowRoleManagement(false);
                onUserUpdate();
            } else {
                toast.error('Rol atanırken hata oluştu');
            }
        } catch (_error) {
            toast.error('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveRole = async (assignmentId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/users/remove-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignmentId }),
            });

            if (response.ok) {
                toast.success('Rol başarıyla kaldırıldı');
                onUserUpdate();
            } else {
                toast.error('Rol kaldırılırken hata oluştu');
            }
        } catch (_error) {
            toast.error('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleUserStatus = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/users/toggle-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    isActive: !user.isActive
                }),
            });

            if (response.ok) {
                toast.success(user.isActive ? 'Kullanıcı pasifleştirildi' : 'Kullanıcı aktifleştirildi');
                onUserUpdate();
            } else {
                toast.error('Kullanıcı durumu güncellenirken hata oluştu');
            }
        } catch (_error) {
            toast.error('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    // Kullanıcının sahip olmadığı rolleri filtrele
    const assignedRoleIds = user.roleAssignments.map(ra => ra.role.id);
    const unassignedRoles = availableRoles.filter(role => !assignedRoleIds.includes(role.id));

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={isLoading}>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowDetails(true)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Detayları Görüntüle
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowRoleManagement(true)}>
                        <Shield className="mr-2 h-4 w-4" />
                        Rol Yönetimi
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleToggleUserStatus}>
                        {user.isActive ? (
                            <>
                                <UserMinus className="mr-2 h-4 w-4" />
                                Kullanıcıyı Pasifleştir
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Kullanıcıyı Aktifleştir
                            </>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Kullanıcı Detayları Dialog */}
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Kullanıcı Detayları</DialogTitle>
                        <DialogDescription>
                            {user.name || 'İsimsiz Kullanıcı'} ({user.email})
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        {/* Temel Bilgiler */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Ad</label>
                                <p className="text-sm text-muted-foreground">
                                    {user.name || 'Belirtilmemiş'}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">E-posta</label>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Kayıt Tarihi</label>
                                <p className="text-sm text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Son Giriş</label>
                                <p className="text-sm text-muted-foreground">
                                    {user.lastLoginAt
                                        ? new Date(user.lastLoginAt).toLocaleDateString('tr-TR')
                                        : 'Hiç giriş yapmamış'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Roller */}
                        <div>
                            <label className="text-sm font-medium">Atanmış Roller</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {user.roleAssignments.length > 0 ? (
                                    user.roleAssignments.map((assignment) => (
                                        <Badge
                                            key={assignment.id}
                                            style={{
                                                backgroundColor: assignment.role.color || '#6366f1',
                                                color: 'white',
                                            }}
                                        >
                                            {assignment.role.displayName}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">Hiç rol atanmamış</p>
                                )}
                            </div>
                        </div>

                        {/* Durum */}
                        <div>
                            <label className="text-sm font-medium">Hesap Durumu</label>
                            <div className="mt-2">
                                <Badge variant={user.isActive ? "default" : "destructive"}>
                                    {user.isActive ? 'Aktif' : 'Pasif'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Rol Yönetimi Dialog */}
            <Dialog open={showRoleManagement} onOpenChange={setShowRoleManagement}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rol Yönetimi</DialogTitle>
                        <DialogDescription>
                            {user.name || user.email} için rol atama/kaldırma işlemleri
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        {/* Mevcut Roller */}
                        <div>
                            <label className="text-sm font-medium">Mevcut Roller</label>
                            <div className="space-y-2 mt-2">
                                {user.roleAssignments.length > 0 ? (
                                    user.roleAssignments.map((assignment) => (
                                        <div key={assignment.id} className="flex items-center justify-between p-2 border rounded-lg">
                                            <Badge
                                                style={{
                                                    backgroundColor: assignment.role.color || '#6366f1',
                                                    color: 'white',
                                                }}
                                            >
                                                {assignment.role.displayName}
                                            </Badge>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveRole(assignment.id)}
                                                disabled={isLoading}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">Hiç rol atanmamış</p>
                                )}
                            </div>
                        </div>

                        {/* Yeni Rol Atama */}
                        {unassignedRoles.length > 0 && (
                            <div>
                                <label className="text-sm font-medium">Yeni Rol Ata</label>
                                <div className="flex gap-2 mt-2">
                                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue placeholder="Rol seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {unassignedRoles.map((role) => (
                                                <SelectItem key={role.id} value={role.id}>
                                                    {role.displayName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={handleAssignRole}
                                        disabled={!selectedRole || isLoading}
                                    >
                                        Ata
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
} 