'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/hooks/useAuth';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    User,
    Mail,
    Shield,
    Upload,
    CheckCircle,
    XCircle,
    Camera,
    Key,
    Eye,
    EyeOff,
    ImageIcon,
    Trash2,
    RotateCcw,
    X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';



// API tabanlı dinamik rol kontrolü - Cookie tabanlı authentication
async function checkRolePermissions(currentUserId: string, roleNames: string[]) {
    try {
        const response = await fetch('/api/auth/check-role-permissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Bu cookie'leri otomatik gönderir
            body: JSON.stringify({ roleNames }),
        });

        if (!response.ok) {
            throw new Error('Permission check failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Role permission check error:', error);
        return { results: {} };
    }
}

// Kullanıcının atayabileceği rolleri API'den al (tamamen dinamik)
async function getAssignableRoles(currentUserId: string, allRoles: Role[]) {
    const roleNames = allRoles.map(role => role.name);
    const result = await checkRolePermissions(currentUserId, roleNames);

    return allRoles.filter(role =>
        result.results?.[role.name] === true
    );
}

interface User {
    id: string;
    name: string | null;
    email: string | null;
    profileImage: string | null;
    isActive: boolean;
    roleId?: string | null;
    roleAssignedAt?: string | null;
    // Tek rol sistemi
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

interface UserEditModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    roles: Role[];
    onUserUpdated: () => void;
}

interface UpdateUserData {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
    profileImage: string | null;
    password?: string;
    roleId?: string | null; // Tek rol sistemi
}

export default function UserEditModal({
    open,
    onOpenChange,
    user,
    roles,
    onUserUpdated,
}: UserEditModalProps) {
    const t = useTranslations('AdminUsers.editUser');
    const { user: currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [originalProfileImage, setOriginalProfileImage] = useState<string | null>(null);
    const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

    // Şifre değiştirme state'leri
    const [changePassword, setChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Image viewer state'leri
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [_currentImage, _setCurrentImage] = useState<string | null>(null);

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Kullanıcı bilgileri
    const isEditingSelf = currentUser?.id === user?.id;
    const isSuperAdmin = currentUser?.userRoles?.includes('super_admin') || false;

    // Resim durumu kontrolü
    const imageToDisplay = profileImage === '' ? null : (profileImage || user?.profileImage);
    const hasImage = imageToDisplay !== null && imageToDisplay !== '';
    const hasOriginalImage = originalProfileImage !== null && originalProfileImage !== '';
    const isImageChanged = profileImage !== originalProfileImage;
    const isImageRemoved = profileImage === '' && hasOriginalImage;
    const hasAnyChange = isImageChanged || isImageRemoved;

    // Kullanıcının atayabileceği rolleri dinamik olarak yükle
    useEffect(() => {
        async function loadAvailableRoles() {
            if (!currentUser || !open) return;

            try {
                // Süper admin tüm rolleri görebilir
                if (isSuperAdmin) {
                    setAvailableRoles(roles);
                    return;
                }

                // Dinamik rol filtreleme
                const assignableRoles = await getAssignableRoles(currentUser.id, roles);
                setAvailableRoles(assignableRoles);
            } catch (error) {
                console.error('Rol yükleme hatası:', error);
                setAvailableRoles([]);
            }
        }

        loadAvailableRoles();
    }, [currentUser, roles, open, isSuperAdmin]);

    // Modal açıldığında kullanıcı verilerini form'a yükle
    useEffect(() => {
        if (user && open) {
            setName(user.name || '');
            setEmail(user.email || '');
            setIsActive(user.isActive);
            setSelectedRole(user.currentRole?.id || null);
            setProfileImage(user.profileImage);
            setOriginalProfileImage(user.profileImage);
            // Şifre alanlarını her modal açılışında sıfırla
            setChangePassword(false);
            setNewPassword('');
            setConfirmPassword('');
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        }
    }, [user, open]);

    // Modal kapandığında form'u temizle
    useEffect(() => {
        if (!open) {
            // Tüm form state'lerini sıfırla
            setTimeout(() => {
                setName('');
                setEmail('');
                setIsActive(true);
                setSelectedRole(null);
                setProfileImage(null);
                setOriginalProfileImage(null);
                setChangePassword(false);
                setNewPassword('');
                setConfirmPassword('');
                setShowNewPassword(false);
                setShowConfirmPassword(false);
                // File input'u da temizle
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }, 150); // Modal kapatma animasyonundan sonra temizle
        }
    }, [open]);

    const handleRoleChange = (roleId: string | null) => {
        setSelectedRole(roleId);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = (file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            toast.error(t('notifications.fileTooLarge'));
            return;
        }
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            toast.error(t('notifications.invalidFileType'));
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setProfileImage(e.target?.result as string);
            toast.success(t('notifications.imageUploadSuccess'));
        };
        reader.readAsDataURL(file);
    };

    const handleImageRemove = () => {
        setProfileImage('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.success(t('notifications.imageRemoveSuccess'));
    };

    const handleImageReset = () => {
        setProfileImage(originalProfileImage);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.success(t('notifications.imageRevertSuccess'));
    };

    const validatePassword = () => {
        if (!changePassword) return true;

        if (!newPassword) {
            toast.error(t('notifications.passwordRequired'));
            return false;
        }

        if (newPassword.length < 8) {
            toast.error(t('notifications.passwordMinLength'));
            return false;
        }

        if (newPassword !== confirmPassword) {
            toast.error(t('notifications.passwordsNoMatch'));
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!user) return;

        if (isEditingSelf && !isSuperAdmin) {
            toast.error(t('notifications.editSelfError'));
            return;
        }

        if (!name.trim()) {
            toast.error(t('notifications.nameRequired'));
            return;
        }

        if (!email.trim()) {
            toast.error(t('notifications.emailRequired'));
            return;
        }

        if (!validatePassword()) {
            return;
        }

        setLoading(true);

        try {
            const updateData: UpdateUserData = {
                id: user.id,
                name: name.trim(),
                email: email.trim(),
                isActive,
                profileImage,
                roleId: selectedRole,
            };

            if (changePassword && newPassword) {
                updateData.password = newPassword;
            }

            const updateResponse = await fetch('/api/admin/users/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            const updateResult = await updateResponse.json();

            if (!updateResponse.ok) {
                throw new Error(updateResult.error || t('notifications.updateError'));
            }

            toast.success(t('notifications.updateSuccess'));
            onUserUpdated();
            onOpenChange(false);

        } catch (error) {
            console.error('User update error:', error);
            toast.error(error instanceof Error ? error.message : t('notifications.updateError'));
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-0">
                    <DialogHeader className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50">
                        <DialogTitle className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
                            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span>{t('title')}</span>
                        </DialogTitle>
                        <DialogDescription className="pt-1">
                            {t('description')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 p-4">
                        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-0 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                                        <ImageIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    {t('profileImage.title')}
                                </CardTitle>
                                <CardDescription className="pt-2">
                                    {t('profileImage.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col lg:flex-row gap-6 items-start">
                                    <input
                                        ref={fileInputRef}
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <div className="relative group">
                                        <Avatar
                                            className="h-32 w-32 border-4 border-border shadow-lg cursor-pointer transition-transform hover:scale-105"
                                            onClick={() => hasImage && setImageViewerOpen(true)}
                                        >
                                            {imageToDisplay && (
                                                <AvatarImage
                                                    src={imageToDisplay}
                                                    className="object-cover"
                                                />
                                            )}
                                            <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-100 to-purple-100">
                                                <User className="h-16 w-16 text-muted-foreground" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                            <div className="flex gap-2">
                                                {hasImage && (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        className="h-8 w-8 rounded-full p-0 bg-white/20 hover:bg-white/30 border-white/20"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setImageViewerOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 text-white" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-8 w-8 rounded-full p-0 bg-white/20 hover:bg-white/30 border-white/20"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        fileInputRef.current?.click();
                                                    }}
                                                >
                                                    <Camera className="h-4 w-4 text-white" />
                                                </Button>
                                            </div>
                                        </div>
                                        {hasImage && (
                                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                {t('profileImage.enlargeHint')}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 flex-wrap justify-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-2"
                                        >
                                            <Upload className="h-4 w-4" />
                                            {t('profileImage.uploadButton')}
                                        </Button>
                                        {hasAnyChange && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleImageReset}
                                                className="flex items-center gap-2"
                                            >
                                                <RotateCcw className="h-4 w-4" />
                                                {t('profileImage.revertButton')}
                                            </Button>
                                        )}
                                        {hasImage && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleImageRemove}
                                                className="flex items-center gap-2 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                {t('profileImage.removeButton')}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                {hasAnyChange && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-amber-800">
                                                    {isImageRemoved ? t('profileImage.status.removed') : t('profileImage.status.changed')}
                                                </p>
                                                <p className="text-xs text-amber-700 mt-1">
                                                    {t('profileImage.status.savePrompt')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    {t('basicInfo.title')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('basicInfo.nameLabel')}</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t('basicInfo.namePlaceholder')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t('basicInfo.emailLabel')}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={t('basicInfo.emailPlaceholder')}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>{t('basicInfo.statusLabel')}</Label>
                                        <p className="text-sm text-muted-foreground">
                                            {t('basicInfo.statusDescription')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={isActive}
                                            onCheckedChange={setIsActive}
                                        />
                                        <Badge variant={isActive ? "default" : "secondary"}>
                                            {isActive ? (
                                                <>
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    {t('basicInfo.active')}
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="h-3 w-3 mr-1" />
                                                    {t('basicInfo.passive')}
                                                </>
                                            )}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                                        <Key className="h-5 w-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    {t('password.title')}
                                </CardTitle>
                                <CardDescription className="pt-2">
                                    {t('password.description')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="change-password"
                                            checked={changePassword}
                                            onCheckedChange={(checked) => setChangePassword(checked === true)}
                                        />
                                        <Label htmlFor="change-password" className="text-sm font-medium">
                                            {t('password.checkboxLabel')}
                                        </Label>
                                    </div>
                                    {changePassword && (
                                        <div className="space-y-4 pt-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="new-password">{t('password.newPasswordLabel')}</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="new-password"
                                                        type={showNewPassword ? "text" : "password"}
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        placeholder={t('password.newPasswordPlaceholder')}
                                                        className="pr-10"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-password">{t('password.confirmPasswordLabel')}</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="confirm-password"
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        placeholder={t('password.confirmPasswordPlaceholder')}
                                                        className="pr-10"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground space-y-1">
                                                <p>{t('password.requirementsTitle')}</p>
                                                <ul className="list-disc list-inside space-y-0.5 pl-2">
                                                    <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                                                        {t('password.reqMinLength')}
                                                    </li>
                                                    <li className={newPassword === confirmPassword && confirmPassword ? 'text-green-600' : ''}>
                                                        {t('password.reqMatch')}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                        <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    {t('roleAssignment.title')}
                                </CardTitle>
                                <CardDescription className="pt-2">
                                    {isEditingSelf && !isSuperAdmin
                                        ? t('roleAssignment.descriptionSelfNoPermission')
                                        : isEditingSelf && isSuperAdmin
                                            ? t('roleAssignment.descriptionSelfWithPermission')
                                            : t('roleAssignment.descriptionOther')
                                    }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isEditingSelf && !isSuperAdmin && (
                                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-amber-800">
                                            <Shield className="h-4 w-4" />
                                            <span className="text-sm font-medium">{t('roleAssignment.securityWarningTitle')}</span>
                                        </div>
                                        <p className="text-sm text-amber-700 mt-1">
                                            {t('roleAssignment.securityWarningText')}
                                        </p>
                                    </div>
                                )}
                                {isEditingSelf && isSuperAdmin && (
                                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center gap-2 text-blue-800">
                                            <Shield className="h-4 w-4" />
                                            <span className="text-sm font-medium">{t('roleAssignment.superAdminWarningTitle')}</span>
                                        </div>
                                        <p className="text-sm text-blue-700 mt-1">
                                            {t('roleAssignment.superAdminWarningText')}
                                        </p>
                                    </div>
                                )}
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {availableRoles.filter(role => role.isActive).map((role) => {
                                        const isCurrentUserRole = user?.currentRole?.id === role.id;
                                        const canModifyRole = !isEditingSelf || isSuperAdmin;

                                        return (
                                            <div
                                                key={role.id}
                                                className={`flex items-center space-x-3 p-3 rounded-lg border ${canModifyRole ? 'hover:bg-muted/50' : 'opacity-60'}`}
                                            >
                                                <Checkbox
                                                    id={`role-${role.id}`}
                                                    checked={selectedRole === role.id}
                                                    onCheckedChange={() => canModifyRole && handleRoleChange(selectedRole === role.id ? null : role.id)}
                                                    disabled={!canModifyRole}
                                                />
                                                <div className="flex-1">
                                                    <Label
                                                        htmlFor={`role-${role.id}`}
                                                        className={`font-medium ${canModifyRole ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                                    >
                                                        {role.displayName}
                                                        {isCurrentUserRole && (
                                                            <span className="ml-2 text-xs text-muted-foreground">
                                                                {t('roleAssignment.currentRoleSuffix')}
                                                            </span>
                                                        )}
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {role.name}
                                                    </p>
                                                </div>
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: role.color || '#6366f1' }}
                                                />
                                            </div>
                                        );
                                    })}
                                    {roles.filter(role => role.isActive && !availableRoles.includes(role)).length > 0 && (
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-blue-800">
                                                <Shield className="h-4 w-4" />
                                                <span className="text-sm font-medium">{t('roleAssignment.restrictedRolesTitle')}</span>
                                            </div>
                                            <p className="text-sm text-blue-700 mt-1">
                                                {t('roleAssignment.restrictedRolesText')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {!selectedRole && (
                                    <div className="text-center py-4 text-muted-foreground">
                                        <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">{t('roleAssignment.noRoleSelected')}</p>
                                    </div>
                                )}
                                {selectedRole && (
                                    <div className="mt-4 pt-4 border-t">
                                        <Label className="text-sm font-medium">{t('roleAssignment.selectedRoleLabel')}</Label>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {(() => {
                                                const role = roles.find(r => r.id === selectedRole);
                                                return role ? (
                                                    <Badge
                                                        key={role.id}
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
                            </CardContent>
                        </Card>
                    </div>

                    <DialogFooter className="p-6 bg-gray-100/80 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            {t('buttons.cancel')}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !name.trim() || !email.trim()}
                            className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                    {t('buttons.updating')}
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {t('buttons.update')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
                <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0 overflow-hidden">
                    <div className="relative w-full h-full bg-black/95 flex items-center justify-center">
                        <div className="relative max-w-full max-h-full">
                            {imageToDisplay && (
                                <Image
                                    src={imageToDisplay}
                                    alt={t('imageViewer.title', { name: user.name || t('unnamedUser') })}
                                    width={800}
                                    height={600}
                                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                                    priority
                                />
                            )}
                        </div>
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                            <div className="bg-black/50 rounded-lg px-3 py-2 backdrop-blur-sm">
                                <p className="text-white text-sm font-medium">
                                    {t('imageViewer.title', { name: user.name || t('unnamedUser') })}
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-black/50 hover:bg-black/70 border-white/20 text-white"
                                onClick={() => setImageViewerOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                        fileInputRef.current?.click();
                                        setImageViewerOpen(false);
                                    }}
                                    className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                                >
                                    <Camera className="h-4 w-4 mr-2" />
                                    {t('imageViewer.changeButton')}
                                </Button>
                                {hasAnyChange && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                            handleImageReset();
                                            setImageViewerOpen(false);
                                        }}
                                        className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        {t('imageViewer.revertButton')}
                                    </Button>
                                )}
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        handleImageRemove();
                                        setImageViewerOpen(false);
                                    }}
                                    className="bg-red-500/20 hover:bg-red-500/30 border-red-500/20 text-red-300"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t('imageViewer.removeButton')}
                                </Button>
                            </div>
                        </div>
                        <div
                            className="absolute inset-0 -z-10"
                            onClick={() => setImageViewerOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
} 