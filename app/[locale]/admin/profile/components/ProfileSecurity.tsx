'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, MapPin, Clock, X } from 'lucide-react';
import { useProfileSessions } from '../hooks/useProfileSessions';

export default function ProfileSecurity() {
    const { sessions, isLoading, terminateSession, isTerminating } = useProfileSessions();

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <div className="h-6 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        Active Sessions
                    </CardTitle>
                    <CardDescription>
                        Manage your active sessions across different devices
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sessions?.map((session) => (
                            <div
                                key={session.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <Monitor className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                {session.deviceInfo}
                                            </h4>
                                            {session.isCurrent && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Current
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {session.location}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(session.lastActive).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
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
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Terminate
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {(!sessions || sessions.length === 0) && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No active sessions found
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Export default ProfileSecurity