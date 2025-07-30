'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Clock, X, Shield, Smartphone, Laptop, Globe } from 'lucide-react';
import { useProfileSessions } from '../hooks/useProfileSessions';
import ChangePasswordForm from './ChangePasswordForm';

export default function ProfileSecurity() {
    const { sessions, isLoading, terminateSession, isTerminating } = useProfileSessions();

    const getDeviceIcon = (deviceInfo: string) => {
        const info = deviceInfo.toLowerCase();
        if (info.includes('mobile') || info.includes('phone')) {
            return <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
        } else if (info.includes('tablet')) {
            return <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
        } else {
            return <Laptop className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <ChangePasswordForm />
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                        <div className="p-2.5 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-sm">
                            <Shield className="h-4 w-4" />
                        </div>
                        Active Sessions
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400 ml-11">
                        Manage your active sessions across different devices
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                    <div className="space-y-3">
                        {sessions?.map((session) => (
                            <div
                                key={session.id}
                                className="group flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-200">
                                        {getDeviceIcon(session.deviceInfo)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                                {session.deviceInfo}
                                            </h4>
                                            {session.isCurrent && (
                                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800 text-xs px-2 py-0.5">
                                                    Current Session
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-5 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <Globe className="h-3.5 w-3.5" />
                                                <span className="font-medium">{session.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                <span>{new Date(session.lastActive).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 font-mono">
                                            IP: {session.ipAddress}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {!session.isCurrent && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => terminateSession(session.id)}
                                            disabled={isTerminating}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200"
                                        >
                                            <X className="h-4 w-4 mr-1.5" />
                                            Terminate
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {(!sessions || sessions.length === 0) && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                <p className="text-lg font-medium mb-1">No Active Sessions</p>
                                <p className="text-sm">You don&apos;t have any active sessions at the moment</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}