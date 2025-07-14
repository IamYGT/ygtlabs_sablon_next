"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, Shield, Palette } from 'lucide-react';
import ProfileOverview from './ProfileOverview';
import ProfileDetails from './ProfileDetails';
import ProfileSecurity from './ProfileSecurity';
import ProfilePreferences from './ProfilePreferences';

export default function ProfileTabs() {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: User,
            component: ProfileOverview,
        },
        {
            id: 'details',
            label: 'Details',
            icon: Settings,
            component: ProfileDetails,
        },
        {
            id: 'security',
            label: 'Security',
            icon: Shield,
            component: ProfileSecurity,
        },
        {
            id: 'preferences',
            label: 'Preferences',
            icon: Palette,
            component: ProfilePreferences,
        },
    ];

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="flex items-center gap-2 text-sm"
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>

            {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                    <tab.component />
                </TabsContent>
            ))}
        </Tabs>
    );
}

// Export default ProfileTabs