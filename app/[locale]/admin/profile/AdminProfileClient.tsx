"use client";

import { Suspense, useRef, useState, Dispatch, SetStateAction } from 'react';
import { useProfile } from './hooks/useProfile';
import { useProfileStats } from './hooks/useProfileStats';
import ProfileHeader from './components/ProfileHeader';
import ProfileStats from './components/ProfileStats';
import ProfileTabs from './components/ProfileTabs';

export default function AdminProfileClient() {
    const { profile, isLoading: profileLoading, isError: profileError } = useProfile();
    const { data: stats, isLoading: statsLoading } = useProfileStats();
    const [activeTab, setActiveTab] = useState('overview');
    const profileTabsRef = useRef<HTMLDivElement>(null);

    const handleEditClick = () => {
        setActiveTab('details');
        // Scroll to ProfileTabs section
        setTimeout(() => {
            profileTabsRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    if (profileLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto p-6 space-y-8 max-w-7xl">
                    <div className="h-40 bg-white dark:bg-gray-800 rounded-xl animate-pulse border border-gray-200 dark:border-gray-700 shadow-sm" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-white dark:bg-gray-800 rounded-xl animate-pulse border border-gray-200 dark:border-gray-700 shadow-sm" />
                        ))}
                    </div>
                    <div className="h-[600px] bg-white dark:bg-gray-800 rounded-xl animate-pulse border border-gray-200 dark:border-gray-700 shadow-sm" />
                </div>
            </div>
        );
    }

    if (profileError || !profile) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto p-6 max-w-7xl">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm px-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                Profile Loading Error
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Unable to load profile information. Please try again later.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto p-6 space-y-8 max-w-7xl">
                {/* Profile Header */}
                <Suspense fallback={
                    <div className="h-40 bg-white dark:bg-gray-800 rounded-xl animate-pulse border border-gray-200 dark:border-gray-700 shadow-sm" />
                }>
                    <ProfileHeader profile={profile} onEditClick={handleEditClick} />
                </Suspense>

                {/* Profile Stats */}
                <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-white dark:bg-gray-800 rounded-xl animate-pulse border border-gray-200 dark:border-gray-700 shadow-sm" />
                        ))}
                    </div>
                }>
                    <ProfileStats stats={stats} isLoading={statsLoading} />
                </Suspense>

                {/* Profile Tabs */}
                <div ref={profileTabsRef}>
                    <Suspense fallback={
                        <div className="h-[600px] bg-white dark:bg-gray-800 rounded-xl animate-pulse border border-gray-200 dark:border-gray-700 shadow-sm" />
                    }>
                        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

// Export default AdminProfileClient