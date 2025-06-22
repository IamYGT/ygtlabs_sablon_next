'use client';

import { useUserAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, Settings, BarChart3 } from 'lucide-react';

function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
            </div>
        </div>
    );
}

export default function UsersDashboard() {
    const user = useUserAuth();

    if (!user) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Welcome Section */}
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-blue-600 shadow-lg">
                        <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Hoş geldiniz, {user.name || user.email}
                        </h1>
                        <p className="text-gray-600 dark:text-slate-300">
                            Kullanıcı kontrol paneli
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-blue-600 text-white border-blue-500 px-3 py-1 text-sm font-medium">
                        <User className="h-4 w-4 mr-2" />
                        {user.primaryRole || 'Kullanıcı'}
                    </Badge>
                    {user.userRoles && user.userRoles.length > 0 && (
                        user.userRoles.map((roleName, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-600 px-3 py-1 text-sm"
                            >
                                {roleName}
                            </Badge>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-blue-600" />
                            Profil Ayarları
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 dark:text-slate-300 mb-4">
                            Profil bilgilerinizi güncelleyin
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                            Profili Düzenle
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-emerald-600" />
                            Aktivite Raporu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 dark:text-slate-300 mb-4">
                            Hesap aktivitelerinizi görüntüleyin
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                            Raporu Görüntüle
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-purple-600" />
                            Takvim
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 dark:text-slate-300 mb-4">
                            Etkinliklerinizi yönetin
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                            Takvimi Aç
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* User Info */}
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                    <CardTitle>Hesap Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-slate-400">E-posta</p>
                            <p className="text-gray-900 dark:text-white">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Durum</p>
                            <Badge variant={user.isActive ? "default" : "destructive"}>
                                {user.isActive ? "Aktif" : "Pasif"}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Yetkiler</p>
                            <p className="text-gray-900 dark:text-white">{user.permissions?.length || 0} yetki</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Roller</p>
                            <p className="text-gray-900 dark:text-white">{user.userRoles?.length || 0} rol</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 