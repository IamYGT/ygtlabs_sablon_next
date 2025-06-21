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
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';
import {
    UserPlus,
    Mail,
    Lock,
    Shield,
    Eye,
    EyeOff,
    Search,
    User
} from 'lucide-react';

interface Role {
    id: string;
    name: string;
    displayName: string;
    color: string | null;
    isActive: boolean;
    isSystemDefault: boolean;
}

interface CreateUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    roles: Role[];
    onUserCreated: () => void;
}

export default function CreateUserModal({
    open,
    onOpenChange,
    roles,
    onUserCreated
}: CreateUserModalProps) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        isActive: true,
    });
    const [selectedRole, setSelectedRole] = useState<string>('');

    // Filtrelenmiş roller
    const filteredRoles = roles.filter(role =>
        role.isActive &&
        role.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRoleSelect = (roleId: string) => {
        setSelectedRole(prev => prev === roleId ? '' : roleId);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            isActive: checked
        }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            isActive: true,
        });
        setSelectedRole('');
        setSearchTerm('');
        setShowPassword(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasyon
        if (!formData.name.trim()) {
            toast.error('İsim gereklidir');
            return;
        }

        if (!formData.email.trim()) {
            toast.error('E-posta gereklidir');
            return;
        }

        if (!formData.password || formData.password.length < 6) {
            toast.error('Şifre en az 6 karakter olmalıdır');
            return;
        }

        if (!selectedRole) {
            toast.error('Bir rol seçmelisiniz');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/admin/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                    roleId: selectedRole,
                    isActive: formData.isActive,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Kullanıcı başarıyla oluşturuldu');
                resetForm();
                onOpenChange(false);
                onUserCreated();
            } else {
                toast.error(result.error || 'Kullanıcı oluşturulamadı');
            }
        } catch (error) {
            console.error('User creation error:', error);
            toast.error('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            resetForm();
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Yeni Kullanıcı Ekle
                    </DialogTitle>
                    <DialogDescription>
                        Sisteme yeni bir kullanıcı ekleyin ve bir rol atayın
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Temel Bilgiler */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <User className="h-4 w-4" />
                            Temel Bilgiler
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="name">Ad Soyad *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Kullanıcının tam adı"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">E-posta *</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="kullanici@example.com"
                                        className="pl-9"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="password">Şifre *</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="En az 6 karakter"
                                        className="pl-9 pr-9"
                                        disabled={loading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Şifre en az 6 karakter olmalıdır
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Durum */}
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="isActive">Kullanıcı Durumu</Label>
                            <p className="text-xs text-muted-foreground">
                                Kullanıcının sisteme giriş yapabilmesi için aktif olmalıdır
                            </p>
                        </div>
                        <Switch
                            id="isActive"
                            checked={formData.isActive}
                            onCheckedChange={handleSwitchChange}
                            disabled={loading}
                        />
                    </div>

                    <Separator />

                    {/* Rol Seçimi */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Shield className="h-4 w-4" />
                            Rol Seçimi {selectedRole && '(1 seçili)'}
                        </div>

                        {/* Arama */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rol ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                                disabled={loading}
                            />
                        </div>

                        {/* Rol Listesi */}
                        <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-2">
                            {filteredRoles.length > 0 ? (
                                filteredRoles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted"
                                    >
                                        <input
                                            type="radio"
                                            id={`role-${role.id}`}
                                            name="selectedRole"
                                            checked={selectedRole === role.id}
                                            onChange={() => handleRoleSelect(role.id)}
                                            className="h-4 w-4 text-primary"
                                        />
                                        <label
                                            htmlFor={`role-${role.id}`}
                                            className="flex-1 flex items-center gap-3 cursor-pointer"
                                            onClick={() => handleRoleSelect(role.id)}
                                        >
                                            <div
                                                className="h-3 w-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: role.color || '#6366f1' }}
                                            />
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">{role.displayName}</div>
                                                <div className="text-xs text-muted-foreground">{role.name}</div>
                                            </div>
                                            {role.isSystemDefault && (
                                                <Badge variant="outline" className="text-xs">Sistem</Badge>
                                            )}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-muted-foreground">
                                    Rol bulunamadı
                                </div>
                            )}
                        </div>

                        {/* Seçili Rol */}
                        {selectedRole && (
                            <div>
                                <Label className="text-sm">Seçili Rol</Label>
                                <div className="mt-2">
                                    {(() => {
                                        const role = roles.find(r => r.id === selectedRole);
                                        return role ? (
                                            <Badge
                                                variant="secondary"
                                                style={{
                                                    backgroundColor: role.color || '#6366f1',
                                                    color: 'white',
                                                }}
                                            >
                                                {role.displayName}
                                            </Badge>
                                        ) : null;
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        İptal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !formData.name || !formData.email || !formData.password || !selectedRole}
                    >
                        {loading ? 'Oluşturuluyor...' : 'Kullanıcı Oluştur'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 