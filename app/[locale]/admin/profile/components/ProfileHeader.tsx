"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, Clock } from 'lucide-react';
import { AdminProfile } from '../types/profile.types';
import { getProfileInitials } from '../utils/profileUtils';

interface ProfileHeaderProps {
    profile: AdminProfile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
    const userInitials = getProfileInitials(profile);

    return (
        <Card className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-900/10">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Avatar and basic info */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
                            <AvatarImage
                                src={profile.profileImage || undefined}
                                alt={profile.name || profile.email}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {profile.name || profile.email}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant={profile.isActive ? "default" : "secondary"}>
                                    {profile.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Profile details */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Mail className="h-4 w-4" />
                            <span>{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
                        </div>
                        {profile.lastLoginAt && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4" />
                                <span>Last seen {new Date(profile.lastLoginAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Export default ProfileHeader