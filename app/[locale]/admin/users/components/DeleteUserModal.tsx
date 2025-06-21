'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'react-hot-toast';
import {
    Trash2,
    AlertTriangle,
    Mail,
    Calendar,
    Shield
} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface User {
    id: string;
    name: string | null;
    email: string | null;
    profileImage: string | null;
    isActive: boolean;
    createdAt: string;
    roleId?: string | null;
    currentRole?: {
        id: string;
        name: string;
        displayName: string;
        color: string | null;
    } | null;
}

interface DeleteUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    onUserDeleted: () => void;
}

export default function DeleteUserModal({
    open,
    onOpenChange,
    user,
    onUserDeleted
}: DeleteUserModalProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const response = await fetch('/api/admin/users/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Kullanıcı başarıyla silindi');
                onOpenChange(false);
                onUserDeleted();
            } else {
                toast.error(result.error || 'Kullanıcı silinemedi');
            }
        } catch (error) {
            console.error('User deletion error:', error);
            toast.error('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    // Super admin kontrolü
    const isSuperAdmin = user.currentRole?.name === 'super_admin';

    // Rol var mı kontrolü
    const hasRole = user.currentRole !== null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-5 w-5" />
                        Kullanıcıyı Sil
                    </DialogTitle>
                    <DialogDescription>
                        Bu işlem geri alınamaz. Kullanıcı kalıcı olarak sistemden kaldırılacak.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Kullanıcı Bilgisi */}
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <div className="relative h-12 w-12">
                            <Image
                                src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name || user.email}&background=random`}
                                alt={user.name || 'User Avatar'}
                                fill
                                sizes="48px"
                                className="rounded-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-lg">{user.name || 'İsimsiz'}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {user.email}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                Kayıt: {format(new Date(user.createdAt), 'dd MMM yyyy', { locale: tr })}
                            </div>
                        </div>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? 'Aktif' : 'Pasif'}
                        </Badge>
                    </div>

                    {/* Rol */}
                    {hasRole && user.currentRole && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Shield className="h-4 w-4" />
                                Kullanıcının Rolü
                            </div>
                            <div className="flex flex-wrap gap-1">
                                <Badge
                                    variant="secondary"
                                    style={{
                                        backgroundColor: user.currentRole.color || '#6366f1',
                                        color: 'white',
                                    }}
                                >
                                    {user.currentRole.displayName}
                                </Badge>
                            </div>
                        </div>
                    )}

                    {/* Uyarılar */}
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <div className="space-y-2">
                                <div className="font-medium">Dikkat!</div>
                                <ul className="text-sm space-y-1">
                                    <li>• Kullanıcı kalıcı olarak silinecek</li>
                                    <li>• Rol ataması kaldırılacak</li>
                                    <li>• Kullanıcı hesabı kurtarılamayacak</li>
                                    {hasRole && (
                                        <li>• Rol ataması kaybolacak</li>
                                    )}
                                </ul>
                            </div>
                        </AlertDescription>
                    </Alert>

                    {/* Super Admin Uyarısı */}
                    {isSuperAdmin && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                <div className="font-medium text-red-700">
                                    Bu kullanıcı Super Admin rolüne sahip ve silinemez!
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        İptal
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={loading || isSuperAdmin}
                    >
                        {loading ? (
                            'Siliniyor...'
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Kullanıcıyı Sil
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 