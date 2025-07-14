"use client";

import { useState, Dispatch, SetStateAction } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, Shield, Palette, ChevronRight } from 'lucide-react';
import ProfileOverview from './ProfileOverview';
import ProfileDetails from './ProfileDetails';
import ProfileSecurity from './ProfileSecurity';
import ProfilePreferences from './ProfilePreferences';

interface ProfileTabsProps {
    activeTab?: string;
    onTabChange?: (value: string) => void;
}

export default function ProfileTabs({ activeTab: externalActiveTab, onTabChange }: ProfileTabsProps) {
    const [internalActiveTab, setInternalActiveTab] = useState('overview');

    // Use external activeTab if provided, otherwise use internal state
    const activeTab = externalActiveTab ?? internalActiveTab;

    const handleTabChange = (value: string) => {
        if (onTabChange) {
            onTabChange(value);
        } else {
            setInternalActiveTab(value);
        }
    };

    const tabs = [
        {
            id: 'overview',
            label: 'Overview',
            icon: User,
            component: ProfileOverview,
            color: 'blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            description: 'General profile information'
        },
        {
            id: 'details',
            label: 'Details',
            icon: Settings,
            component: ProfileDetails,
            color: 'purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            description: 'Personal details and information'
        },
        {
            id: 'security',
            label: 'Security',
            icon: Shield,
            component: ProfileSecurity,
            color: 'green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            description: 'Security settings and privacy'
        },
        {
            id: 'preferences',
            label: 'Preferences',
            icon: Palette,
            component: ProfilePreferences,
            color: 'orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-900/20',
            description: 'App preferences and themes'
        },
    ];

    return (
        <div className="w-full">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                {/* Custom Enhanced Tab List */}
                <div className="relative mb-8">
                    <div className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-2">
                        {/* Animated background indicator */}
                        <div
                            className="absolute top-2 bottom-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm transition-all duration-300 ease-out"
                            style={{
                                left: `${(tabs.findIndex(tab => tab.id === activeTab) * 100) / tabs.length + 1}%`,
                                width: `${100 / tabs.length - 2}%`,
                            }}
                        />

                        <TabsList className="relative grid w-full grid-cols-4 bg-transparent p-0 h-auto">
                            {tabs.map((tab, index) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className={`
                                        relative flex flex-col items-center gap-2 py-4 px-6 text-sm font-medium
                                        bg-transparent border-0 shadow-none
                                        data-[state=active]:bg-transparent data-[state=active]:text-gray-900 dark:data-[state=active]:text-white
                                        data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400
                                        hover:text-gray-800 dark:hover:text-gray-200
                                        transition-all duration-200 ease-out
                                        group
                                    `}
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animation: 'fadeInUp 0.6s ease-out forwards'
                                    }}
                                >
                                    <div className={`
                                        relative p-2 rounded-lg transition-all duration-200
                                        ${activeTab === tab.id
                                            ? `bg-${tab.color} text-white shadow-sm`
                                            : `${tab.bgColor} group-hover:scale-105`
                                        }
                                    `}>
                                        <tab.icon className={`
                                            h-5 w-5 transition-all duration-200
                                            ${activeTab === tab.id
                                                ? 'text-white'
                                                : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'
                                            }
                                        `} />
                                    </div>

                                    <div className="text-center">
                                        <div className={`
                                            font-semibold transition-colors duration-200
                                            ${activeTab === tab.id
                                                ? 'text-gray-900 dark:text-white'
                                                : 'text-gray-600 dark:text-gray-400'
                                            }
                                        `}>
                                            {tab.label}
                                        </div>
                                        <div className={`
                                            text-xs mt-1 transition-all duration-200
                                            ${activeTab === tab.id
                                                ? 'text-gray-700 dark:text-gray-300 opacity-100'
                                                : 'text-gray-500 dark:text-gray-500 opacity-70'
                                            }
                                        `}>
                                            {tab.description}
                                        </div>
                                    </div>

                                    {/* Active indicator arrow */}
                                    {activeTab === tab.id && (
                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 rotate-90" />
                                        </div>
                                    )}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                </div>

                {/* Tab Content with enhanced styling */}
                {tabs.map((tab) => (
                    <TabsContent
                        key={tab.id}
                        value={tab.id}
                        className="mt-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                        <div
                            className="relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                            style={{
                                animation: 'fadeInScale 0.4s ease-out forwards'
                            }}
                        >
                            <div className="relative p-6">
                                <tab.component />
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
}

// Export default ProfileTabs