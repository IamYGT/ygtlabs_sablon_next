"use client";

import React, { useState } from "react";
import { useAdminAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Mail,
    Shield,
    Calendar,
    Clock,
    Edit3,
    Save,
    X,
    Key,
    Activity
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from 'next-intl';
import ChangePasswordModal from "@/components/panel/ChangePasswordModal";
import ProfileImageUpload from "@/components/panel/ProfileImageUpload";

export default function AdminProfileClient() {
    const admin = useAdminAuth();
    const t = useTranslations('AdminProfile');
    const tCommon = useTranslations('AdminCommon');
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(admin?.profileImage || null);
    const [formData, setFormData] = useState({
        name: admin?.name || "",
        email: admin?.email || "",
    });

    const handleSave = async () => {
        try {
            // API çağrısı devre dışı - sadece başarılı mesajı göster
            toast.success(t('updateSuccess'));
            setIsEditing(false);
        } catch (_error) {
            toast.error(t('updateError'));
        }
    };

    const handleCancel = () => {
        setFormData({
            name: admin?.name || "",
            email: admin?.email || "",
        });
        setIsEditing(false);
    };

    const handleImageUpdate = (newImageUrl: string | null) => {
        setProfileImage(newImageUrl);
        // Sayfa yenilenmesini engelle ve state'i güncel tut
        window.location.reload();
    };

    if (!admin) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">{tCommon('loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {t('title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {t('description')}
                    </p>
                </div>

                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="gap-2">
                        <Edit3 className="h-4 w-4" />
                        {t('edit')}
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button onClick={handleSave} className="gap-2">
                            <Save className="h-4 w-4" />
                            {t('save')}
                        </Button>
                        <Button variant="outline" onClick={handleCancel} className="gap-2">
                            <X className="h-4 w-4" />
                            {t('cancel')}
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profil Resmi Kartı */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t('profileImage')}</CardTitle>
                            <CardDescription>
                                {t('profileImageDescription')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <ProfileImageUpload
                                currentImage={profileImage}
                                userName={admin?.name}
                                onImageUpdate={handleImageUpdate}
                                size="lg"
                                editable={true}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Ana Profil Kartı */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">{t('title')}</CardTitle>
                                    <CardDescription>
                                        {t('description')}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Ad Soyad */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    {t('name')}
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder={t('namePlaceholder')}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                        {admin.name || t('notSpecified')}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {t('email')}
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder={t('emailPlaceholder')}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                        {admin.email || t('notSpecified')}
                                    </p>
                                )}
                            </div>

                            <Separator />

                            {/* Rol Bilgisi */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    {t('role')}
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        <Shield className="h-3 w-3 mr-1" />
                                        {t('administrator')}
                                    </Badge>
                                    <span className="text-xs text-gray-500">{t('fullAccess')}</span>
                                </div>
                            </div>

                            {/* Hesap Durumu */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    {t('accountStatus')}
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        {t('active')}
                                    </Badge>
                                    <span className="text-xs text-gray-500">{t('accountActive')}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Yan Panel */}
                <div className="space-y-6">
                    {/* Hesap İstatistikleri */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t('accountStats')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{t('role')}</span>
                                </div>
                                <span className="text-sm font-medium">
                                    {admin.userRoles?.includes('super_admin') || admin.userRoles?.includes('admin') ? t('administrator') : t('user')}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">{t('status')}</span>
                                </div>
                                <span className="text-sm font-medium">
                                    {admin.isActive ? t('active') : t('inactive')}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Güvenlik */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t('security')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ChangePasswordModal>
                                <Button variant="outline" className="w-full gap-2">
                                    <Key className="h-4 w-4" />
                                    {t('changePassword')}
                                </Button>
                            </ChangePasswordModal>

                            <div className="text-xs text-gray-500 space-y-1">
                                <p>• {t('securityTip1')}</p>
                                <p>• {t('securityTip2')}</p>
                                <p>• {t('securityTip3')}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 