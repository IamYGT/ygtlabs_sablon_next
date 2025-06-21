'use client';

import React, { useState, useEffect } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Trash2,
    AlertTriangle,
    Users,
    ArrowRight,
    UserX
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface User {
    id: string;
    name: string | null;
    email: string | null;
}

interface Role {
    id: string;
    name: string;
    displayName: string;
    description: string | null;
    color: string | null;
    isActive: boolean;
    users: User[];
    _count: {
        users: number;
    };
}

interface DeleteRoleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role: Role | null;
    availableRoles: Role[];
    onRoleDeleted: () => void;
}

export default function DeleteRoleDialog({
    open,
    onOpenChange,
    role,
    availableRoles,
    onRoleDeleted
}: DeleteRoleDialogProps) {
    const [targetRoleId, setTargetRoleId] = useState<string>('');
    const [transferUsers, setTransferUsers] = useState(true);
    const [loading, setLoading] = useState(false);

    // Default user rolünü bul
    const defaultUserRole = availableRoles.find(r => r.name === 'user');

    // Modal açıldığında default role'ü set et
    useEffect(() => {
        if (open && defaultUserRole && (role?.users?.length || 0) > 0) {
            setTargetRoleId(defaultUserRole.id);
            setTransferUsers(true);
        }
    }, [open, defaultUserRole, role]);

    // Modal kapatıldığında state'leri sıfırla
    useEffect(() => {
        if (!open) {
            setTargetRoleId('');
            setTransferUsers(true);
        }
    }, [open]);

    if (!role) return null;

    const hasUsers = (role._count?.users || 0) > 0;

    // Kullanılabilir hedef roller (silinecek rol hariç, aktif olanlar)
    const targetRoles = availableRoles.filter(r =>
        r.id !== role.id &&
        r.isActive &&
        r.name !== 'super_admin' // Super admin'e transfer etmeyelim
    );

    const handleConfirmDelete = async () => {
        setLoading(true);
        try {
            const userTransfers = transferUsers && hasUsers ?
                (role.users || []).map(user => ({
                    userId: user.id,
                    targetRoleId: targetRoleId || defaultUserRole?.id
                })) : [];

            const response = await fetch(`/api/admin/roles/${role.id}/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    transferUsers: transferUsers,
                    userTransfers: userTransfers
                })
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || 'Rol başarıyla silindi');
                onOpenChange(false);
                onRoleDeleted();
            } else {
                toast.error(result.error || 'Rol silinirken hata oluştu');
            }
        } catch (error) {
            console.error('Role deletion error:', error);
            toast.error('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const selectedTargetRole = targetRoles.find(r => r.id === targetRoleId);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-red-600" />
                        Rol Silme Onayı
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-4">
                            <div>
                                <strong>{role.displayName}</strong> rolünü silmek istediğinizden emin misiniz?
                            </div>

                            {/* Rol bilgileri */}
                            <Card>
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: role.color || '#6366f1' }}
                                        />
                                        <div>
                                            <div className="font-medium">{role.displayName}</div>
                                            <div className="text-sm text-muted-foreground">{role.name}</div>
                                        </div>
                                        <div className="ml-auto flex items-center gap-2">
                                            <Badge variant="outline" className="text-xs">
                                                <Users className="h-3 w-3 mr-1" />
                                                {role._count.users} kullanıcı
                                            </Badge>
                                        </div>
                                    </div>
                                    {role.description && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            {role.description}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Uyarı */}
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    <div className="font-medium">Bu işlem geri alınamaz!</div>
                                    <div className="text-sm mt-1">
                                        Rol kalıcı olarak silinecek ve tüm yetki atamaları kaldırılacaktır.
                                    </div>
                                </AlertDescription>
                            </Alert>

                            {/* Kullanıcı Transfer Seçenekleri */}
                            {hasUsers && (
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="transfer-users"
                                            checked={transferUsers}
                                            onCheckedChange={(checked) => setTransferUsers(!!checked)}
                                        />
                                        <Label htmlFor="transfer-users" className="text-sm font-medium">
                                            Kullanıcıları başka bir role aktar ({role._count.users} kullanıcı)
                                        </Label>
                                    </div>

                                    {transferUsers ? (
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-sm">Hedef Rol Seçimi</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <Select value={targetRoleId} onValueChange={setTargetRoleId}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Kullanıcıları aktarılacak rolü seçin..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {targetRoles.map(targetRole => (
                                                            <SelectItem key={targetRole.id} value={targetRole.id}>
                                                                <div className="flex items-center gap-2">
                                                                    <div
                                                                        className="w-3 h-3 rounded-full"
                                                                        style={{ backgroundColor: targetRole.color || '#6366f1' }}
                                                                    />
                                                                    {targetRole.displayName}
                                                                    <span className="text-xs text-muted-foreground">
                                                                        ({targetRole.name})
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                {selectedTargetRole && (
                                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Users className="h-4 w-4 text-green-600" />
                                                            <span className="font-medium">
                                                                {role._count.users} kullanıcı
                                                            </span>
                                                            <ArrowRight className="h-3 w-3 text-green-600" />
                                                            <span className="font-medium">
                                                                {selectedTargetRole.displayName}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-green-600 mt-1">
                                                            Kullanıcılar güvenli şekilde aktarılacak
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Alert variant="destructive">
                                            <UserX className="h-4 w-4" />
                                            <AlertDescription>
                                                <div className="font-medium">Kullanıcılar rolsüz kalacak!</div>
                                                <div className="text-sm mt-1">
                                                    Bu kullanıcılara sistem varsayılan &quot;user&quot; rolü atanacak.
                                                </div>
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        İptal
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirmDelete}
                        disabled={loading || (hasUsers && transferUsers && !targetRoleId)}
                        className="gap-2"
                    >
                        {loading ? (
                            <>Siliniyor...</>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Rolü Sil
                            </>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 