"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit3, Save, X, Camera } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import ProfileImageUpload from '@/components/panel/ProfileImageUpload';

export default function ProfileDetails() {
    const { profile, updateProfile, isLoading } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
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
            setIsEditing(false);
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: profile?.name || '',
            email: profile?.email || '',
        });
        setIsEditing(false);
    };

    const handleImageUpdate = (newImageUrl: string | null) => {
        setProfileImage(newImageUrl);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Profile Image Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Profile Image
                    </CardTitle>
                    <CardDescription>
                        Upload or change your profile picture
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileImageUpload
                        currentImage={profileImage}
                        userName={profile?.name || profile?.email || ''}
                        onImageUpdate={handleImageUpdate}
                        size="lg"
                    />
                </CardContent>
            </Card>

            {/* Profile Details Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Edit3 className="h-5 w-5" />
                                Profile Details
                            </CardTitle>
                            <CardDescription>
                                Update your profile information
                            </CardDescription>
                        </div>
                        {!isEditing && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                disabled={!isEditing}
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                disabled={!isEditing}
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    {profile && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                            <div>
                                <Label className="text-sm text-gray-500">Created At</Label>
                                <p className="font-medium">
                                    {new Date(profile.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm text-gray-500">Last Login</Label>
                                <p className="font-medium">
                                    {profile.lastLoginAt
                                        ? new Date(profile.lastLoginAt).toLocaleDateString()
                                        : 'Never'
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {isEditing && (
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={updateProfile.isPending}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={updateProfile.isPending}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {updateProfile.isPending ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// Export default ProfileDetails