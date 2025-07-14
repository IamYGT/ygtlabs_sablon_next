"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Calendar, Clock, Edit, Camera, MapPin, Shield } from 'lucide-react';
import { AdminProfile } from '../types/profile.types';
import { getProfileInitials } from '../utils/profileUtils';
import ProfileImageUpload from '@/components/panel/ProfileImageUpload';
import { useState } from 'react';

interface ProfileHeaderProps {
    profile: AdminProfile;
    onEditClick?: () => void;
}

export default function ProfileHeader({ profile, onEditClick }: ProfileHeaderProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(profile.profileImage);
    const userInitials = getProfileInitials(profile);

    const handleImageUpdate = (newImageUrl: string | null) => {
        setProfileImage(newImageUrl);
        setIsDialogOpen(false);
    };

    return (
        <Card className="relative overflow-hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg">
            <CardContent className="relative p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                    {/* Avatar section with enhanced styling */}
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <Avatar className="h-28 w-28 border-4 border-white dark:border-gray-700 shadow-lg">
                                <AvatarImage
                                    src={profileImage || undefined}
                                    alt={profile.name || profile.email}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-xl font-bold bg-blue-600 text-white">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white dark:bg-gray-800 shadow-lg border-2 border-blue-500/20 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Profile Photo</DialogTitle>
                                    </DialogHeader>
                                    <ProfileImageUpload
                                        currentImage={profileImage}
                                        userName={profile.name || profile.email}
                                        onImageUpdate={handleImageUpdate}
                                        size="lg"
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {profile.name || profile.email}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 font-medium mt-1">
                                    Administrator
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Badge
                                    variant={profile.isActive ? "default" : "secondary"}
                                    className={`px-3 py-1 text-sm font-semibold ${profile.isActive
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <div className={`w-2 h-2 rounded-full mr-2 ${profile.isActive ? 'bg-white' : 'bg-gray-500'
                                        }`} />
                                    {profile.isActive ? 'Active' : 'Inactive'}
                                </Badge>

                                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                                    <Shield className="w-3 h-3 mr-1" />
                                    Admin
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Profile details with enhanced icons and layout - 2x2 grid */}
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{profile.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                    <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Member Since</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {new Date(profile.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {profile.lastLoginAt && (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                        <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Last Seen</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {new Date(profile.lastLoginAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                    <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Location</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Remote</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3 lg:items-end">
                        <Button
                            onClick={onEditClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Export default ProfileHeader