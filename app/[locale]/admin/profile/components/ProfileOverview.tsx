"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { User, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

export default function ProfileOverview() {
    const { profile, isLoading } = useProfile();

    if (isLoading) {
        return (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!profile) {
        return (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                    <p className="text-gray-500 dark:text-gray-400">Profile not found</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <div className="p-2.5 bg-blue-500 text-white rounded-lg shadow-sm">
                        <User className="h-4 w-4" />
                    </div>
                    Profile Overview
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400 ml-11">
                    General overview of your account information
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-5">
                        <div className="group">
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Full Name</Label>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                {profile.name || 'Not specified'}
                            </p>
                        </div>
                        <div className="group">
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Email Address</Label>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 break-all">
                                {profile.email}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-5">
                        <div className="group">
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Account Status</Label>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={profile.isActive ? "default" : "secondary"}
                                    className={`flex items-center gap-1.5 px-3 py-1 ${profile.isActive
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800'
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800'
                                        }`}
                                >
                                    {profile.isActive ? (
                                        <CheckCircle2 className="h-3 w-3" />
                                    ) : (
                                        <XCircle className="h-3 w-3" />
                                    )}
                                    {profile.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        </div>
                        <div className="group">
                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Member Since</Label>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 