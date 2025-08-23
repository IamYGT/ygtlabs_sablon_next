"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
    Upload,
    Trash2,
    User,
    Camera,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { isSuccess, getErrorMessage } from '@/lib/api';
import { profileAPI } from '@/lib/api/profile-api';
import { useTranslations } from 'next-intl';

interface ProfileImageUploadProps {
    currentImage?: string | null;
    userName?: string | null;
    onImageUpdate: (newImageUrl: string | null) => void;
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const t = useTranslations('ProfileImageUpload');

    const sizeClasses = {
        sm: 'h-16 w-16',
        md: 'h-24 w-24',
        lg: 'h-32 w-32'
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error(t('errorFileSize'));
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error(t('errorFileType'));
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await profileAPI.uploadProfileImage(formData);

            if (isSuccess(response) && response.data && typeof response.data === 'object' && response.data !== null && 'profileImage' in response.data) {
                toast.success(t('uploadSuccess'));
                onImageUpdate((response.data as { profileImage: string }).profileImage);
            } else {
                toast.error(getErrorMessage(response) || t('uploadError'));
            }
        } catch (error) {
            console.error('Yükleme hatası:', error);
            toast.error(t('uploadError'));
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDeleteImage = async () => {
        if (!currentImage) return;

        setIsDeleting(true);

        try {
            const response = await profileAPI.deleteProfileImage();

            if (isSuccess(response)) {
                toast.success(t('deleteSuccess'));
                onImageUpdate(null);
            } else {
                toast.error(getErrorMessage(response) || t('deleteError'));
            }
        } catch (error) {
            console.error('Silme hatası:', error);
            toast.error(t('deleteError'));
        } finally {
            setIsDeleting(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const userInitials = userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

    if (!editable) {
        return (
            <Avatar className={sizeClasses[size]}>
                {currentImage ? (
                    <AvatarImage src={currentImage} alt={userName || t('profileImageAlt')} />
                ) : (
                    <AvatarFallback>
                        <User className="h-1/2 w-1/2" />
                    </AvatarFallback>
                )}
            </Avatar>
        );
    }

    return (
        <div className="p-4 flex flex-col items-center space-y-4">
            <div className="relative group">
                <Avatar className={`${sizeClasses[size]} border-2 border-gray-200 dark:border-gray-700`}>
                    {currentImage ? (
                        <AvatarImage
                            src={currentImage}
                            alt={userName || t('profileImageAlt')}
                            className="object-cover"
                        />
                    ) : (
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white font-semibold">
                            {userInitials}
                        </AvatarFallback>
                    )}
                </Avatar>

                {(isUploading || isDeleting) && (
                    <div className={`absolute inset-0 ${sizeClasses[size]} bg-black bg-opacity-50 rounded-full flex items-center justify-center`}>
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                )}

                {!isUploading && !isDeleting && (
                    <div
                        className={`absolute inset-0 ${sizeClasses[size]} bg-black bg-opacity-0 hover:bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer`}
                        onClick={triggerFileInput}
                    >
                        <Camera className="h-6 w-6 text-white" />
                    </div>
                )}
            </div>

            <div className="flex flex-col space-y-2 w-full">
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
                    {isUploading ? t('uploading') : t('selectImage')}
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
                        {isDeleting ? t('deleting') : t('delete')}
                    </Button>
                )}
            </div>

            <p className="text-xs text-gray-500 text-center max-w-48">
                {t('fileDescription')}
            </p>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading || isDeleting}
                aria-label={t('selectImageAria')}
                title={t('selectImageAria')}
            />
        </div>
    );
}
