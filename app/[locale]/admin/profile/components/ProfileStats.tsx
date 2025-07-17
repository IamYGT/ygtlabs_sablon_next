"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Clock, Monitor, TrendingUp, Activity, Shield } from 'lucide-react';
import { ProfileStats as ProfileStatsType } from '../types/profile.types';

interface ProfileStatsProps {
    stats?: ProfileStatsType;
    isLoading: boolean;
}

export default function ProfileStats({ stats, isLoading }: ProfileStatsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                        <CardContent className="relative p-6">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse" />
                                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse" />
                                </div>
                                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                                <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Logins',
            value: stats?.totalLogins || 0,
            icon: User,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            trend: '+12%',
            trendUp: true,
        },
        {
            title: 'Account Age',
            value: `${stats?.accountAge || 0} days`,
            icon: Clock,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20',
            trend: '30 days',
            trendUp: false,
        },
        {
            title: 'Active Sessions',
            value: stats?.activeSessions || 0,
            icon: Monitor,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            trend: '+2',
            trendUp: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map((stat, index) => (
                <Card
                    key={stat.title}
                    className={`
                        relative overflow-hidden group
                        bg-white/80 dark:bg-gray-800/80 
                        backdrop-blur-sm 
                        border border-gray-200 dark:border-gray-700
                        shadow-lg hover:shadow-xl
                        transition-all duration-300 ease-out
                        hover:bg-white/90 dark:hover:bg-gray-800/90
                    `}
                    style={{
                        animationDelay: `${index * 150}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                >
                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200">
                            {stat.title}
                        </CardTitle>
                        <div className={`
                            relative p-3 rounded-xl 
                            ${stat.bgColor}
                            border border-gray-200 dark:border-gray-600
                            shadow-sm
                        `}>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                    </CardHeader>

                    <CardContent className="relative">
                        <div className="space-y-3">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stat.value}
                            </div>

                            {/* Trend indicator */}
                            <div className="flex items-center gap-2">
                                <div className={`
                                    flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                                    ${stat.trendUp
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                        : 'bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400'
                                    }
                                `}>
                                    {stat.trendUp ? (
                                        <TrendingUp className="h-3 w-3" />
                                    ) : (
                                        <Activity className="h-3 w-3" />
                                    )}
                                    <span>{stat.trend}</span>
                                </div>

                                {stat.title === 'Active Sessions' && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                        <Shield className="h-3 w-3" />
                                        <span>Secure</span>
                                    </div>
                                )}
                            </div>

                            {/* Progress bar for visual enhancement */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${stat.title === 'Total Logins' ? 'bg-blue-500' :
                                            stat.title === 'Account Age' ? 'bg-purple-500' :
                                                'bg-green-500'
                                        }`}
                                    style={{
                                        width: stat.title === 'Total Logins' ? '75%' :
                                            stat.title === 'Account Age' ? '60%' : '85%',
                                        animationDelay: `${index * 200 + 500}ms`
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}

// Export default ProfileStats