'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse duration-1000">
            {/* Enhanced Welcome Section Skeleton with better dark mode support */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-100/80 to-gray-200/60 dark:from-gray-800/60 dark:to-gray-700/40 border border-gray-200/50 dark:border-gray-600/30 backdrop-blur-sm transition-all duration-200">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gray-300/80 dark:bg-gray-600/60 rounded-lg transition-colors duration-150"></div>
                            <div>
                                <div className="h-8 bg-gray-300/80 dark:bg-gray-600/60 rounded w-64 mb-2 transition-colors duration-150"></div>
                                <div className="h-4 bg-gray-300/80 dark:bg-gray-600/60 rounded w-32 transition-colors duration-150"></div>
                            </div>
                        </div>
                        <div className="h-6 bg-gray-300/80 dark:bg-gray-600/60 rounded w-96 mb-4 transition-colors duration-150"></div>
                        <div className="flex gap-3">
                            <div className="h-6 bg-gray-300/80 dark:bg-gray-600/60 rounded w-24 transition-colors duration-150"></div>
                            <div className="h-6 bg-gray-300/80 dark:bg-gray-600/60 rounded w-20 transition-colors duration-150"></div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="h-8 bg-gray-300/80 dark:bg-gray-600/60 rounded w-24 transition-colors duration-150"></div>
                        <div className="h-8 bg-gray-300/80 dark:bg-gray-600/60 rounded w-20 transition-colors duration-150"></div>
                    </div>
                </div>
            </div>

            {/* Dashboard Stats Skeleton */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
                    </div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-28"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="border-0 shadow-sm bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-end justify-between">
                                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                                </div>
                                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="space-y-4">
                <div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-6 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-0 shadow-sm">
                            <div className="flex items-start space-x-4">
                                <div className="w-11 h-11 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                                <div className="flex-1 min-w-0">
                                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
                                </div>
                                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Activities and Chart Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activities Skeleton */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
                        </div>
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                    </div>
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                                        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-40"></div>
                                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                                            </div>
                                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-56"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart Skeleton */}
                <div className="space-y-4">
                    <div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
                    </div>
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
                                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
                                </div>
                                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                                </div>
                                <div className="space-y-4">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
                                                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                                <div className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
