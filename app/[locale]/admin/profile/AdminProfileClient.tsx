"use client";

import { Suspense } from 'react';
import { useProfile } from './hooks/useProfile';
import { useProfileStats } from './hooks/useProfileStats';
import ProfileHeader from './components/ProfileHeader';
import ProfileStats from './components/ProfileStats';
import ProfileTabs from './components/ProfileTabs';

export default function AdminProfileClient() {
    const { profile, isLoading: profileLoading, isError: profileError } = useProfile();
    const { data: stats, isLoading: statsLoading } = useProfileStats();

    if (profileLoading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                </div>
                <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
            </div>
        );
    }

    if (profileError || !profile) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Error Loading Profile
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Unable to load profile information. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Profile Header */}
            <Suspense fallback={<div className="h-32 bg-gray-200 rounded-lg animate-pulse" />}>
                <ProfileHeader profile={profile} />
            </Suspense>

            {/* Profile Stats */}
            <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse" />
                    ))}
                </div>
            }>
                <ProfileStats stats={stats} isLoading={statsLoading} />
            </Suspense>

            {/* Profile Tabs */}
            <Suspense fallback={<div className="h-96 bg-gray-200 rounded-lg animate-pulse" />}>
                <ProfileTabs />
            </Suspense>
        </div>
    );
}

// Export default AdminProfileClient