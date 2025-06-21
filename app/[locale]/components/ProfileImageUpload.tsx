"use client";

import React, { useState, useRef } from 'react';
// import Image from 'next/image'; // Şu an kullanılmıyor
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
    Upload,
    Trash2,
    User,
    Camera,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface ProfileImageUploadProps {
    currentImage?: string | null;
    userName?: string | null;
    onImageUpdate?: (newImageUrl: string | null) => void;
    size?: 'sm' | 'md' | 'lg';
    editable?: boolean;
}

export default function ProfileImageUpload({
    currentImage,
    userName,
    onImageUpdate,
    size = 'md',
    editable = true
}: ProfileImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const sizeClasses = {
        sm: 'h-16 w-16',
        md: 'h-24 w-24',
        lg: 'h-32 w-32'
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Dosya boyutu kontrolü (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Dosya boyutu 5MB\'dan fazla olamaz');
            return;
        }

        // Dosya tipi kontrolü
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Desteklenmeyen dosya formatı. PNG, JPG, JPEG veya WebP kullanın');
            return;
        }

        // Önizleme için dosyayı oku
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        setIsUploading(true);

        try {
            // API çağrısı devre dışı - demo mode
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay

            toast.success('Profil resmi güncellendi (demo mod)');
            setPreviewImage(null);

            // Parent component'e preview image'i bildir (demo için)
            onImageUpdate?.(previewImage);

        } catch (error) {
            console.error('Yükleme hatası:', error);
            toast.error('Dosya yüklenirken hata oluştu');
            setPreviewImage(null);
        } finally {
            setIsUploading(false);
            // Input'u temizle
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteImage = async () => {
        if (!currentImage) return;

        setIsDeleting(true);

        try {
            // API çağrısı devre dışı - demo mode
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delete delay

            toast.success('Profil resmi silindi (demo mod)');

            // Parent component'e resmin silindiğini bildir
            onImageUpdate?.(null);

        } catch (error) {
            console.error('Silme hatası:', error);
            toast.error('Resim silinirken hata oluştu');
        } finally {
            setIsDeleting(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const displayImage = previewImage || currentImage;
    const userInitials = userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    if (!editable) {
        // Sadece görüntüleme modu
        return (
            <Avatar className={sizeClasses[size]}>
                {displayImage ? (
                    <AvatarImage src={displayImage} alt={userName || 'Profil resmi'} />
                ) : (
                    <AvatarFallback>
                        <User className="h-1/2 w-1/2" />
                    </AvatarFallback>
                )}
            </Avatar>
        );
    }

    return (
        <Card className="w-fit">
            <CardContent className="p-4">
                <div className="flex flex-col items-center space-y-4">
                    {/* Avatar */}
                    <div className="relative group">
                        <Avatar className={`${sizeClasses[size]} border-2 border-gray-200 dark:border-gray-700`}>
                            {displayImage ? (
                                <AvatarImage
                                    src={displayImage}
                                    alt={userName || 'Profil resmi'}
                                    className="object-cover"
                                />
                            ) : (
                                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white font-semibold">
                                    {userInitials}
                                </AvatarFallback>
                            )}
                        </Avatar>

                        {/* Yükleme overlay'i */}
                        {isUploading && (
                            <div className={`absolute inset-0 ${sizeClasses[size]} bg-black bg-opacity-50 rounded-full flex items-center justify-center`}>
                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                            </div>
                        )}

                        {/* Hover overlay */}
                        {!isUploading && (
                            <div
                                className={`absolute inset-0 ${sizeClasses[size]} bg-black bg-opacity-0 hover:bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer`}
                                onClick={triggerFileInput}
                            >
                                <Camera className="h-6 w-6 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Butonlar */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={triggerFileInput}
                            disabled={isUploading || isDeleting}
                            className="gap-2"
                        >
                            {isUploading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Upload className="h-4 w-4" />
                            )}
                            {isUploading ? 'Yükleniyor...' : 'Resim Seç'}
                        </Button>

                        {currentImage && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDeleteImage}
                                disabled={isUploading || isDeleting}
                                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                {isDeleting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash2 className="h-4 w-4" />
                                )}
                                {isDeleting ? 'Siliniyor...' : 'Sil'}
                            </Button>
                        )}
                    </div>

                    {/* Bilgi metni */}
                    <p className="text-xs text-gray-500 text-center max-w-48">
                        PNG, JPG, JPEG veya WebP formatında, maksimum 5MB boyutunda dosya yükleyebilirsiniz.
                    </p>

                    {/* Gizli dosya input'u */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading || isDeleting}
                        aria-label="Profil resmi seç"
                        title="Profil resmi seç"
                    />
                </div>
            </CardContent>
        </Card>
    );
} 