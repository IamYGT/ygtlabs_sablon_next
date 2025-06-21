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
import ChangePasswordModal from "@/app/[locale]/components/ChangePasswordModal";
import ProfileImageUpload from "@/app/[locale]/components/ProfileImageUpload";

export default function AdminProfilePage() {
    const admin = useAdminAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(admin?.profileImage || null);
    const [formData, setFormData] = useState({
        name: admin?.name || "",
        email: admin?.email || "",
    });

    const handleSave = async () => {
        try {
            // API çağrısı devre dışı - sadece başarılı mesajı göster
            toast.success("Profil bilgileri güncellendi (demo mod)");
            setIsEditing(false);
        } catch (_error) {
            toast.error("Profil güncellenirken hata oluştu");
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
                    <p className="text-gray-500">Profil bilgileri yükleniyor...</p>
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
                        Admin Profili
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Hesap bilgilerinizi görüntüleyin ve düzenleyin
                    </p>
                </div>

                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="gap-2">
                        <Edit3 className="h-4 w-4" />
                        Düzenle
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button onClick={handleSave} className="gap-2">
                            <Save className="h-4 w-4" />
                            Kaydet
                        </Button>
                        <Button variant="outline" onClick={handleCancel} className="gap-2">
                            <X className="h-4 w-4" />
                            İptal
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profil Resmi Kartı */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Profil Resmi</CardTitle>
                            <CardDescription>
                                Hesabınız için profil resmi yükleyin
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
                                    <CardTitle className="text-xl">Profil Bilgileri</CardTitle>
                                    <CardDescription>
                                        Temel hesap bilgileriniz
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Ad Soyad */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Ad Soyad
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Adınızı ve soyadınızı girin"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                        {admin.name || "Belirtilmemiş"}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    E-posta Adresi
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="E-posta adresinizi girin"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                                        {admin.email || "Belirtilmemiş"}
                                    </p>
                                )}
                            </div>

                            <Separator />

                            {/* Rol Bilgisi */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Rol
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        <Shield className="h-3 w-3 mr-1" />
                                        Administrator
                                    </Badge>
                                    <span className="text-xs text-gray-500">Tam yetki</span>
                                </div>
                            </div>

                            {/* Hesap Durumu */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Hesap Durumu
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        Aktif
                                    </Badge>
                                    <span className="text-xs text-gray-500">Hesabınız aktif durumda</span>
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
                            <CardTitle className="text-lg">Hesap İstatistikleri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">Rol</span>
                                </div>
                                <span className="text-sm font-medium">
                                    {admin.userRoles?.includes('super_admin') || admin.userRoles?.includes('admin') ? 'Administrator' : 'Kullanıcı'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm">Durum</span>
                                </div>
                                <span className="text-sm font-medium">
                                    {admin.isActive ? 'Aktif' : 'Pasif'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Güvenlik */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Güvenlik</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ChangePasswordModal>
                                <Button variant="outline" className="w-full gap-2">
                                    <Key className="h-4 w-4" />
                                    Şifre Değiştir
                                </Button>
                            </ChangePasswordModal>

                            <div className="text-xs text-gray-500 space-y-1">
                                <p>• Güçlü şifre kullanın</p>
                                <p>• Düzenli olarak şifrenizi değiştirin</p>
                                <p>• Şifrenizi kimseyle paylaşmayın</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 