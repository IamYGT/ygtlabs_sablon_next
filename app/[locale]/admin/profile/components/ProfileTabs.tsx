"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, Shield, Palette, Edit, Camera } from 'lucide-react';
import ProfileOverview from './ProfileOverview';
import ProfileDetails from './ProfileDetails';
import ProfileSecurity from './ProfileSecurity';
import ProfilePreferences from './ProfilePreferences';
import { AdminProfile } from '../types/profile.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getProfileInitials } from '../utils/profileUtils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ProfileImageUpload from '@/components/panel/ProfileImageUpload';

interface ProfileTabsProps {
    profile: AdminProfile;
    activeTab?: string;
    onTabChange?: (value: string) => void;
}

export default function ProfileTabs({ profile, activeTab: externalActiveTab, onTabChange }: ProfileTabsProps) {
    const [internalActiveTab, setInternalActiveTab] = useState('overview');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(profile.profileImage);
    const userInitials = getProfileInitials(profile);

    // Use external activeTab if provided, otherwise use internal state
    const activeTab = externalActiveTab ?? internalActiveTab;

    const handleTabChange = (value: string) => {
        if (onTabChange) {
            onTabChange(value);
        } else {
            setInternalActiveTab(value);
        }
    };

    const handleImageUpdate = (newImageUrl: string | null) => {
        setProfileImage(newImageUrl);
        setIsDialogOpen(false);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User, component: ProfileOverview, color: 'blue', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
        { id: 'details', label: 'Details', icon: Settings, component: ProfileDetails, color: 'purple', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
        { id: 'security', label: 'Security', icon: Shield, component: ProfileSecurity, color: 'green', bgColor: 'bg-green-50 dark:bg-green-900/20' },
        { id: 'preferences', label: 'Preferences', icon: Palette, component: ProfilePreferences, color: 'orange', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
    ];

    const colorMap = {
        blue: 'bg-blue-600',
        purple: 'bg-purple-600',
        green: 'bg-green-600',
        orange: 'bg-orange-600',
    };

    return (
        <div className="w-full">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
                    {/* Left Sidebar - Integrated Profile Info & Vertical Tab List */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-blue-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
                            {/* Integrated Profile Header */}
                            <div className="flex flex-col items-center text-center p-4 mb-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="relative group mb-3">
                                    <Avatar className="h-20 w-20 border-2 border-white dark:border-gray-700 shadow-md">
                                        <AvatarImage src={profileImage || undefined} alt={profile.name || profile.email} className="object-cover" />
                                        <AvatarFallback className="text-lg font-bold bg-blue-600 text-white">{userInitials}</AvatarFallback>
                                    </Avatar>
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="secondary" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full p-0 bg-white dark:bg-gray-800 shadow-md border border-blue-500/20 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                                <Camera className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader><DialogTitle>Profile Photo</DialogTitle></DialogHeader>
                                            <ProfileImageUpload currentImage={profileImage} userName={profile.name || profile.email} onImageUpdate={handleImageUpdate} size="lg" />
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{profile.name || 'Admin'}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{profile.email}</p>
                                <Button onClick={() => handleTabChange('details')} size="sm" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xs px-4">
                                    <Edit className="w-3 h-3 mr-1.5" /> Edit Profile
                                </Button>
                            </div>

                            <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-1 w-full">
                                {tabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className="w-full flex items-center justify-start gap-3 p-3 text-left bg-transparent border-0 shadow-none rounded-lg data-[state=active]:text-blue-700 dark:data-[state=active]:text-white data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400 hover:bg-blue-50/70 dark:hover:bg-gray-700/60 transition-all duration-200 group"
                                    >
                                        <div className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${activeTab === tab.id ? `${colorMap[tab.color as keyof typeof colorMap]} text-white shadow-sm` : `${tab.bgColor} group-hover:scale-105`}`}>
                                            <tab.icon className={`h-5 w-5 transition-all duration-200 ${activeTab === tab.id ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold">{tab.label}</div>
                                        </div>
                                        {activeTab === tab.id && <div className={`w-1.5 h-6 rounded-full flex-shrink-0 ${colorMap[tab.color as keyof typeof colorMap]}`} />}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 min-w-0">
                        {tabs.map((tab) => (
                            <TabsContent key={tab.id} value={tab.id} className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                                <div className="relative bg-blue-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden" style={{ animation: 'fadeInRight 0.4s ease-out forwards' }}>
                                    <div className="relative p-6"><tab.component /></div>
                                </div>
                            </TabsContent>
                        ))}
                    </div>
                </div>
            </Tabs>

            <style jsx>{`
                @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes fadeInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
            `}</style>
        </div>
    );
}

// Export default ProfileTabs