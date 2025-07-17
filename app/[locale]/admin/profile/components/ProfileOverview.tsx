"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

export default function ProfileOverview() {
    const { profile, isLoading } = useProfile();

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!profile) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-gray-500">Profile not found</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Overview
                </CardTitle>
                <CardDescription>
                    General overview of your account information
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm text-gray-500">Name</Label>
                            <p className="text-lg font-semibold">
                                {profile.name || 'Not specified'}
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm text-gray-500">Email</Label>
                            <p className="text-lg font-semibold">{profile.email}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm text-gray-500">Status</Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant={profile.isActive ? "default" : "secondary"}>
                                    {profile.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm text-gray-500">Member Since</Label>
                            <p className="text-lg font-semibold">
                                {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Export default ProfileOverview 