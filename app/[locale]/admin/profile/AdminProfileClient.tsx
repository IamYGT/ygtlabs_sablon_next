"use client";

import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type SimpleUser } from "@/lib";
import {
    Shield,
    Calendar,
    Edit3,
    Save,
    X,
    Key,
    Activity,
    User,
    Clock,
    Settings,
    Lock,
    Mail,
    TrendingUp,
    Users,
    CheckCircle,
    AlertCircle,
    Info
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from 'next-intl';
import ChangePasswordModal from "@/components/panel/ChangePasswordModal";
import ProfileImageUpload from "@/components/panel/ProfileImageUpload";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";

type TFunction = ReturnType<typeof useTranslations<"AdminProfile">>;

// Enhanced loading skeleton component
function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse space-y-8">
                    {/* Header skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                        </div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>

                    {/* Profile header skeleton */}
                    <Card className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></Card>

                    {/* Tabs skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Enhanced profile stats component
function ProfileStats({ admin, t }: { admin: SimpleUser; t: TFunction }) {
    const stats = [
        {
            label: t('loginCount'),
            value: "847",
            icon: Activity,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/20"
        },
        {
            label: t('sessionsToday'),
            value: "12",
            icon: Clock,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/20"
        },
        {
            label: t('managedUsers'),
            value: "156",
            icon: Users,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-900/20"
        },
        {
            label: t('systemActions'),
            value: "2.4K",
            icon: TrendingUp,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-900/20"
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="group relative overflow-hidden bg-gradient-to-br from-white via-white to-gray-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[1px] rounded-lg">
                        <div className="h-full w-full bg-white dark:bg-slate-800 rounded-lg"></div>
                    </div>

                    <CardContent className="relative p-6">
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">{stat.value}</p>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Enhanced profile header component  
function ProfileHeader({ admin, t, isEditing, onEdit }: { admin: SimpleUser; t: TFunction; isEditing: boolean; onEdit: () => void }) {
    const userInitials = admin?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || admin?.email?.charAt(0).toUpperCase() || 'A';

    return (
        <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px]">
            {/* Inner card with glassmorphism effect */}
            <div className="relative h-full w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-lg">
                {/* Animated background pattern */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 via-blue-400/20 to-purple-400/20 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-violet-400/10 via-pink-400/10 to-orange-400/10 rounded-full animate-spin-slow"></div>
                </div>

                <div className="relative p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <div className="flex items-start gap-8">
                            <div className="relative group">
                                {/* Avatar with enhanced glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                                {admin.profileImage ? (
                                    <Avatar className="relative h-36 w-36 border-4 border-white dark:border-slate-700 shadow-2xl ring-4 ring-purple-500/20">
                                        <AvatarImage src={admin.profileImage || undefined} alt={admin.name || admin.email || 'Profile'} />
                                        <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
                                            {userInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <div className="relative h-36 w-36 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-2xl ring-4 ring-purple-500/20">
                                        <span className="text-4xl font-bold text-white">{userInitials}</span>
                                    </div>
                                )}
                                {/* Enhanced status indicator with animation */}
                                <div className="absolute -bottom-2 -right-2">
                                    <div className="bg-emerald-500 rounded-full p-3 border-4 border-white dark:border-slate-700 shadow-lg">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {admin.name || admin.email}
                                    </h1>
                                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-3 py-1">
                                        <Shield className="h-4 w-4 mr-1" />
                                        {admin.primaryRole || t('administrator')}
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        <span>{admin.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{t('memberSince')} {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : t('notSpecified')}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className={`h-3 w-3 rounded-full ${admin.isActive ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
                                    <span className={`text-sm font-medium ${admin.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {admin.isActive ? t('online') : t('offline')}
                                    </span>
                                    <span className="text-gray-400 text-sm mx-2">•</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('lastSeen')} 2 {t('minutesAgo')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {!isEditing && (
                                <Button onClick={onEdit} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg">
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    {t('edit')}
                                </Button>
                            )}
                            <Button variant="outline" size="lg" className="border-gray-200 dark:border-gray-700">
                                <Settings className="h-4 w-4 mr-2" />
                                {t('settings')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// Security tips component
function SecurityTips({ t }: { t: TFunction }) {
    const tips = [
        { icon: Lock, text: t('securityTip1'), color: "text-blue-600" },
        { icon: Clock, text: t('securityTip2'), color: "text-emerald-600" },
        { icon: Shield, text: t('securityTip3'), color: "text-purple-600" },
    ];

    return (
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <Info className="h-5 w-5" />
                    {t('securityTips')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {tips.map((tip, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <tip.icon className={`h-4 w-4 ${tip.color}`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{tip.text}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default function AdminProfileClient() {
    const admin = useAdminAuth();
    const queryClient = useQueryClient();
    const t = useTranslations('AdminProfile');
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    // Update form data when admin data loads
    useEffect(() => {
        if (admin) {
            setFormData({
                name: admin.name || "",
                email: admin.email || "",
            });
        }
    }, [admin]);

    const handleSave = async () => {
        try {
            // API call to save profile data would go here
            toast.success(t('updateSuccess'));
            setIsEditing(false);
            // Invalidate user query to refetch data
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_USER });
        } catch (_error) {
            toast.error(t('updateError'));
        }
    };

    const handleCancel = () => {
        if (admin) {
            setFormData({
                name: admin.name || "",
                email: admin.email || "",
            });
        }
        setIsEditing(false);
    };

    const handleImageUpdate = async (_newImageUrl: string | null) => {
        // Invalidate user query to refetch data
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_USER });
    };

    if (!admin) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {t('title')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            {t('description')}
                        </p>
                    </div>
                </div>

                {/* Profile Header */}
                <ProfileHeader
                    admin={admin}
                    t={t}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                />

                {/* Profile Stats */}
                <ProfileStats admin={admin} t={t} />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-white via-gray-50 to-white dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 backdrop-blur-xl border-0 shadow-2xl rounded-2xl p-2">
                                <TabsTrigger value="overview" className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:scale-105">
                                    <User className="h-4 w-4 mr-2" />
                                    {t('overview')}
                                </TabsTrigger>
                                <TabsTrigger value="details" className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:scale-105">
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    {t('details')}
                                </TabsTrigger>
                                <TabsTrigger value="security" className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:scale-105">
                                    <Shield className="h-4 w-4 mr-2" />
                                    {t('security')}
                                </TabsTrigger>
                                <TabsTrigger value="activity" className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:scale-105">
                                    <Activity className="h-4 w-4 mr-2" />
                                    {t('activity')}
                                </TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="space-y-6">
                                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            {t('profileOverview')}
                                        </CardTitle>
                                        <CardDescription>{t('profileOverviewDesc')}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('name')}</Label>
                                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{admin.name || t('notSpecified')}</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('email')}</Label>
                                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{admin.email}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('role')}</Label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                                            {admin.primaryRole || t('administrator')}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('status')}</Label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant={admin.isActive ? "default" : "destructive"}>
                                                            {admin.isActive ? t('active') : t('inactive')}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Details Tab */}
                            <TabsContent value="details" className="space-y-6">
                                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Edit3 className="h-5 w-5" />
                                            {t('profileDetails')}
                                        </CardTitle>
                                        <CardDescription>{t('profileDetailsDescription')}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">{t('name')} *</Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        disabled={!isEditing}
                                                        placeholder={t('namePlaceholder')}
                                                        className="bg-white/50 dark:bg-slate-700/50"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">{t('email')} *</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        disabled={!isEditing}
                                                        placeholder={t('emailPlaceholder')}
                                                        className="bg-white/50 dark:bg-slate-700/50"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('createdAt')}</Label>
                                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : t('notSpecified')}
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('role')}</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                                            {admin.primaryRole || t('administrator')}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <Button variant="outline" onClick={handleCancel} size="lg">
                                                    <X className="h-4 w-4 mr-2" />
                                                    {t('cancel')}
                                                </Button>
                                                <Button onClick={handleSave} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                                    <Save className="h-4 w-4 mr-2" />
                                                    {t('save')}
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Security Tab */}
                            <TabsContent value="security" className="space-y-6">
                                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Shield className="h-5 w-5" />
                                            {t('security')}
                                        </CardTitle>
                                        <CardDescription>{t('securityDescription')}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Key className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{t('changePassword')}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('changePasswordDesc')}</p>
                                                    </div>
                                                </div>
                                                <ChangePasswordModal>
                                                    <Button variant="outline" size="lg">
                                                        <Key className="h-4 w-4 mr-2" />
                                                        {t('changePassword')}
                                                    </Button>
                                                </ChangePasswordModal>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Activity className="h-5 w-5 text-emerald-600" />
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{t('activeSessions')}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('activeSessionsDesc')}</p>
                                                    </div>
                                                </div>
                                                <Button variant="outline" size="lg">
                                                    <Activity className="h-4 w-4 mr-2" />
                                                    {t('manageSessions')}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Activity Tab */}
                            <TabsContent value="activity" className="space-y-6">
                                <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-xl">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Activity className="h-5 w-5" />
                                            {t('recentActivity')}
                                        </CardTitle>
                                        <CardDescription>{t('recentActivityDesc')}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[
                                                { action: t('loginAction'), time: t('timeAgo2Minutes'), icon: User, color: "text-blue-600" },
                                                { action: t('profileUpdateAction'), time: t('timeAgo1Hour'), icon: Edit3, color: "text-emerald-600" },
                                                { action: t('passwordChangeAction'), time: t('timeAgo3Hours'), icon: Key, color: "text-purple-600" },
                                                { action: t('settingsUpdateAction'), time: t('timeAgo1Day'), icon: Settings, color: "text-orange-600" }
                                            ].map((activity, index) => (
                                                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                                    <activity.icon className={`h-5 w-5 ${activity.color}`} />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Profile Image Card */}
                        <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <CardHeader className="relative">
                                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    {t('profileImage')}
                                </CardTitle>
                                <CardDescription>{t('profileImageDescription')}</CardDescription>
                            </CardHeader>
                            <CardContent className="relative flex justify-center pb-8">
                                <ProfileImageUpload
                                    currentImage={admin.profileImage}
                                    userName={admin.name}
                                    onImageUpdate={handleImageUpdate}
                                    size="lg"
                                    editable={true}
                                />
                            </CardContent>
                        </Card>

                        {/* Account Status */}
                        <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-white to-emerald-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <CardHeader className="relative">
                                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
                                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
                                        <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    {t('accountStatus')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('accountSecurity')}</span>
                                        <div className="flex items-center gap-3">
                                            <Progress value={85} className="w-20 h-3" />
                                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">85%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('profileCompletion')}</span>
                                        <div className="flex items-center gap-3">
                                            <Progress value={75} className="w-20 h-3" />
                                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">75%</span>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors">
                                        <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                                            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('emailVerified')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors">
                                        <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                                            <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('twoFactorEnabled')}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
                                        <div className="p-1 rounded-full bg-amber-100 dark:bg-amber-900/20">
                                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('profileIncomplete')}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Tips */}
                        <SecurityTips t={t} />
                    </div>
                </div>
            </div>
        </div>
    );
} 