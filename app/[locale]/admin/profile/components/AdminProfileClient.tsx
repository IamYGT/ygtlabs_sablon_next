"use client";

import { AdminPageGuard } from '@/components/panel/AdminPageGuard';
import { Suspense, useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import ProfileTabs from './ProfileTabs';

export default function AdminProfileClient() {
    const { profile, isLoading: profileLoading, isError: profileError } = useProfile();
    const [activeTab, setActiveTab] = useState('overview');

    if (profileLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto p-6 max-w-7xl">
                    <div className="h-[700px] bg-white dark:bg-gray-800 rounded-xl animate-pulse border border-gray-200 dark:border-gray-700 shadow-sm" />
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
        <AdminPageGuard requiredPermission="admin.profile.view">
            <div >
                <div className="container mx-auto p-6 max-w-7xl">
                    <Suspense fallback={
                        <div className="h-[700px] bg-white dark:bg-gray-800 rounded-xl animate-pulse border border-gray-200 dark:border-gray-700 shadow-sm" />
                    }>
                        <ProfileTabs profile={profile} activeTab={activeTab} onTabChange={setActiveTab} />
                    </Suspense>
                </div>
            </div>
        </AdminPageGuard>
    );
}

// Export default AdminProfileClient