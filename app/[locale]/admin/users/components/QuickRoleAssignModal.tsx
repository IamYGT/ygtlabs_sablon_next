'use client';

import React, { useState } from 'react';
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

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-hot-toast';
import { Users, Shield, Search } from 'lucide-react';
import Image from 'next/image';

interface User {
    id: string;
    name: string | null;
    email: string | null;
    profileImage: string | null;
    roleId?: string | null;
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
    color: string | null;
    isActive: boolean;
}

interface QuickRoleAssignModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    roles: Role[];
    onRoleAssigned: () => void;
}

export default function QuickRoleAssignModal({
    open,
    onOpenChange,
    user,
    roles,
    onRoleAssigned
}: QuickRoleAssignModalProps) {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('');

    React.useEffect(() => {
        if (user) {
            // Kullanıcının mevcut rolünü seçili yap
            setSelectedRole(user.currentRole?.id || '');
        }
    }, [user]);

    // Filtrelenmiş roller
    const filteredRoles = roles.filter(role =>
        role.isActive &&
        role.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRoleSelect = (roleId: string) => {
        setSelectedRole(roleId === selectedRole ? '' : roleId);
    };

    const handleSave = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const response = await fetch('/api/admin/users/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    roleId: selectedRole || null
                }),
            });

            if (!response.ok) {
                // Detaylı hata mesajı almak için response body'yi okuyalım
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData
                });

                const errorMessage = errorData.error || 'Rol güncelleme başarısız oldu';
                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            console.log('Success response:', responseData);

            toast.success(responseData.message || 'Rol başarıyla güncellendi');
            onOpenChange(false);
            onRoleAssigned();
        } catch (error) {
            console.error('Role assignment error:', error);

            // Daha detaylı hata mesajı göster
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Rol güncelleme başarısız oldu');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const currentRoleId = user.currentRole?.id || '';
    const hasChanges = selectedRole !== currentRoleId;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Hızlı Rol Atama
                    </DialogTitle>
                    <DialogDescription>
                        {user.name || user.email} için rol atayın veya kaldırın
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Kullanıcı Bilgisi */}
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            {user.profileImage ? (
                                <Image
                                    src={user.profileImage}
                                    alt={user.name || ''}
                                    width={40}
                                    height={40}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <Users className="h-5 w-5 text-white" />
                            )}
                        </div>
                        <div>
                            <div className="font-medium">{user.name || 'İsimsiz'}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                    </div>

                    {/* Arama */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rol ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Mevcut Rol */}
                    {user.currentRole && (
                        <div>
                            <Label className="text-sm font-medium">Mevcut Rol</Label>
                            <div className="flex flex-wrap gap-1 mt-2">
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
                            <Separator className="mt-3" />
                        </div>
                    )}

                    {/* Rol Listesi */}
                    <div>
                        <Label className="text-sm font-medium">Roller ({filteredRoles.length})</Label>
                        <div className="max-h-60 overflow-y-auto mt-2 space-y-2">
                            {/* Rol Yok Seçeneği */}
                            <div
                                className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                                onClick={() => handleRoleSelect('')}
                            >
                                <input
                                    type="radio"
                                    name="selectedRole"
                                    checked={selectedRole === ''}
                                    onChange={() => handleRoleSelect('')}
                                    className="h-4 w-4 text-primary"
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-muted-foreground">Rol Atanmamış</div>
                                    <div className="text-xs text-muted-foreground">Kullanıcının rolü kaldırılır</div>
                                </div>
                            </div>

                            {filteredRoles.map((role) => {
                                const isSelected = selectedRole === role.id;

                                return (
                                    <div
                                        key={role.id}
                                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                                        onClick={() => handleRoleSelect(role.id)}
                                    >
                                        <input
                                            type="radio"
                                            name="selectedRole"
                                            checked={isSelected}
                                            onChange={() => handleRoleSelect(role.id)}
                                            className="h-4 w-4 text-primary"
                                        />
                                        <div
                                            className="h-3 w-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: role.color || '#6366f1' }}
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{role.displayName}</div>
                                            <div className="text-xs text-muted-foreground">{role.name}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Özet */}
                    {hasChanges && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <div className="text-sm">
                                <div className="text-blue-800 dark:text-blue-200 font-medium mb-1">
                                    Değişiklik Özeti:
                                </div>
                                <div className="text-blue-700 dark:text-blue-300 text-xs">
                                    {selectedRole ? `"${filteredRoles.find(r => r.id === selectedRole)?.displayName}" rolü atanacak` : 'Rol kaldırılacak'}
                                </div>
                            </div>
                        </div>
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
                        onClick={handleSave}
                        disabled={loading || !hasChanges}
                    >
                        {loading ? 'Kaydediliyor...' : 'Kaydet'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 