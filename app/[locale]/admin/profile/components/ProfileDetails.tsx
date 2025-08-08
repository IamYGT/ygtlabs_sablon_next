"use client";

import ProfileImageUpload from '@/components/panel/ProfileImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Camera, Clock, Edit3, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';

export default function ProfileDetails() {
    const t = useTranslations('AdminProfile');
    const { profile, updateProfile, isLoading } = useProfile();
    const [profileImage, setProfileImage] = useState(profile?.profileImage || null);
    const [formData, setFormData] = useState({
        name: profile?.name || '',
        email: profile?.email || '',
    });

    React.useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
            });
            setProfileImage(profile.profileImage || null);
        }
    }, [profile]);

    const handleSave = async () => {
        try {
            await updateProfile.mutateAsync(formData);
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const handleImageUpdate = (newImageUrl: string | null) => {
        setProfileImage(newImageUrl);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Profile Image Section */}
            <div className="lg:col-span-1">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-sm">
                                <Camera className="h-4 w-4" />
                            </div>
                            {t('profileImage')}
                        </CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400 ml-11">
                            {t('profileImageDescription')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="flex justify-center">
                            <ProfileImageUpload
                                currentImage={profileImage}
                                userName={profile?.name || profile?.email || ''}
                                onImageUpdate={handleImageUpdate}
                                size="lg"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>


            {/* Profile Details Section */}
            <div className="lg:col-span-2">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl hover:shadow-md transition-all duration-200 h-full">
                    <CardHeader className="pb-4">
                        <div>
                            <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                                <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-sm">
                                    <Edit3 className="h-4 w-4" />
                                </div>
                                {t('profileDetails')}
                            </CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-400 ml-11">
                                {t('profileDetailsDescription')}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('name')} *
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={t('namePlaceholder')}
                                    className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('email')} *
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder={t('emailPlaceholder')}
                                    className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {profile && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="group">
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">{t('createdAt')}</Label>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                            {new Date(profile.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="group">
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">{t('lastLogin')}</Label>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                            {profile.lastLoginAt
                                                ? new Date(profile.lastLoginAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })
                                                : t('notSpecified')
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                onClick={handleSave}
                                disabled={updateProfile.isPending}
                                className="bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all duration-200"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {updateProfile.isPending ? t('saving') : t('saveChanges')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}