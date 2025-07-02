"use client";

import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/lib/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

    Info
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from 'next-intl';
import ChangePasswordModal from "@/components/panel/ChangePasswordModal";
import ProfileImageUpload from "@/components/panel/ProfileImageUpload";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";

type TFunction = ReturnType<typeof useTranslations<"AdminProfile">>;

// Clean loading skeleton component
function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse space-y-8">
                    {/* Header skeleton */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                        </div>
                    </div>

                    {/* Profile header skeleton */}
                    <Card className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></Card>

                    {/* Content skeleton */}
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

// Profile stats component with clean design
function ProfileStats({ t }: { t: TFunction }) {
    const [stats, setStats] = useState([
        {
            label: t('loginCount'),
            value: "...",
            icon: Activity,
            color: "text-sky-600 dark:text-sky-400",
            bgColor: "bg-sky-100 dark:bg-sky-900/20"
        },
        {
            label: t('sessionsToday'),
            value: "...",
            icon: Clock,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-900/20"
        },
        {
            label: t('managedUsers'),
            value: "...",
            icon: Users,
            color: "text-sky-600 dark:text-sky-400",
            bgColor: "bg-sky-100 dark:bg-sky-900/20"
        },
        {
            label: t('systemActions'),
            value: "...",
            icon: TrendingUp,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/20"
        }
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/admin/profile?stats=true');
                if (response.ok) {
                    const data = await response.json();
                    setStats([
                        {
                            label: t('loginCount'),
                            value: data.loginCount.toString(),
                            icon: Activity,
                            color: "text-sky-600 dark:text-sky-400",
                            bgColor: "bg-sky-100 dark:bg-sky-900/20"
                        },
                        {
                            label: t('sessionsToday'),
                            value: data.sessionsToday.toString(),
                            icon: Clock,
                            color: "text-orange-600 dark:text-orange-400",
                            bgColor: "bg-orange-100 dark:bg-orange-900/20"
                        },
                        {
                            label: t('managedUsers'),
                            value: data.managedUsers.toString(),
                            icon: Users,
                            color: "text-sky-600 dark:text-sky-400",
                            bgColor: "bg-sky-100 dark:bg-sky-900/20"
                        },
                        {
                            label: t('systemActions'),
                            value: data.systemActions > 1000 ? `${(data.systemActions / 1000).toFixed(1)}K` : data.systemActions.toString(),
                            icon: TrendingUp,
                            color: "text-green-600 dark:text-green-400",
                            bgColor: "bg-green-100 dark:bg-green-900/20"
                        }
                    ]);
                }
            } catch (error) {
                console.error('Stats fetch error:', error);
            }
        };

        fetchStats();
    }, [t]);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">{stat.label}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

// Clean profile header component  
function ProfileHeader({ admin, t, isEditing, onEdit }: { admin: SimpleUser; t: TFunction; isEditing: boolean; onEdit: () => void }) {
    const userInitials = admin?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || admin?.email?.charAt(0).toUpperCase() || 'A';

    return (
        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="flex items-start gap-6">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-2 border-gray-200 dark:border-gray-700 shadow-sm">
                                <AvatarImage src={admin.profileImage || undefined} alt={admin.name || admin.email || 'Profile'} />
                                <AvatarFallback className="text-2xl font-bold bg-sky-500 text-white">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            {/* Status indicator */}
                            <div className="absolute -bottom-1 -right-1">
                                <div className={`rounded-full p-1 border-2 border-white dark:border-gray-900 ${admin.isActive ? 'bg-sky-400' : 'bg-gray-400'}`}>
                                    <CheckCircle className="h-3 w-3 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                                    {admin.name || admin.email}
                                </h1>
                                <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/20 dark:text-sky-300">
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
                                <div className={`h-2 w-2 rounded-full ${admin.isActive ? 'bg-sky-500' : 'bg-red-500'}`}></div>
                                <span className={`text-sm font-medium ${admin.isActive ? 'text-sky-600 dark:text-sky-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {admin.isActive ? t('online') : t('offline')}
                                </span>
                                <span className="text-gray-400 text-sm mx-2">•</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">{t('lastSeen')} 2 {t('minutesAgo')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {!isEditing && (
                            <Button onClick={onEdit} className="bg-sky-500 hover:bg-sky-600 text-white font-medium shadow-sm hover:shadow transition-all duration-200">
                                <Edit3 className="h-4 w-4 mr-2" />
                                {t('edit')}
                            </Button>
                        )}
                        <Button variant="outline" className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <Settings className="h-4 w-4 mr-2" />
                            {t('settings')}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// Security tips component
function SecurityTips({ t }: { t: TFunction }) {
    const tips = [
        { icon: Lock, text: t('securityTip1'), color: "text-green-600" },
        { icon: Clock, text: t('securityTip2'), color: "text-sky-600" },
        { icon: Shield, text: t('securityTip3'), color: "text-purple-600" },
    ];

    return (
        <Card className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
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
            const response = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || t('updateError'));
            }

            toast.success(data.message || t('updateSuccess'));
            setIsEditing(false);
            // Invalidate user query to refetch data
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_USER });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : t('updateError');
            toast.error(errorMessage);
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {t('title')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
                <ProfileStats t={t} />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-lg p-1">
                                <TabsTrigger value="overview" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white rounded-md transition-all duration-200">
                                    <User className="h-4 w-4 mr-2" />
                                    {t('overview')}
                                </TabsTrigger>
                                <TabsTrigger value="details" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md transition-all duration-200">
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    {t('details')}
                                </TabsTrigger>
                                <TabsTrigger value="security" className="data-[state=active]:bg-slate-600 data-[state=active]:text-white rounded-md transition-all duration-200">
                                    <Shield className="h-4 w-4 mr-2" />
                                    {t('security')}
                                </TabsTrigger>
                                <TabsTrigger value="activity" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white rounded-md transition-all duration-200">
                                    <Activity className="h-4 w-4 mr-2" />
                                    {t('activity')}
                                </TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="space-y-6">
                                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                            <div className="p-2 bg-sky-100 dark:bg-sky-900/20 rounded-lg">
                                                <User className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                                            </div>
                                            {t('profileOverview')}
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-400">{t('profileOverviewDesc')}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('name')}</Label>
                                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{admin.name || t('notSpecified')}</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('email')}</Label>
                                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{admin.email}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('role')}</Label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/20 dark:text-sky-300">
                                                            {admin.primaryRole || t('administrator')}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('status')}</Label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge className={admin.isActive ? "bg-sky-100 text-sky-800 dark:bg-sky-900/20 dark:text-sky-300" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}>
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
                                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                                <Edit3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            {t('profileDetails')}
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-400">{t('profileDetailsDescription')}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('name')} *</Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        disabled={!isEditing}
                                                        placeholder={t('namePlaceholder')}
                                                        className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-sky-500 focus:ring-sky-500/20"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('email')} *</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        disabled={!isEditing}
                                                        placeholder={t('emailPlaceholder')}
                                                        className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-sky-500 focus:ring-sky-500/20"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('createdAt')}</Label>
                                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : t('notSpecified')}
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('role')}</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/20 dark:text-sky-300">
                                                            {admin.primaryRole || t('administrator')}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <Button variant="outline" onClick={handleCancel} className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                    <X className="h-4 w-4 mr-2" />
                                                    {t('cancel')}
                                                </Button>
                                                <Button onClick={handleSave} className="bg-sky-500 hover:bg-sky-600 text-white font-medium shadow-sm hover:shadow transition-all duration-200">
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
                                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <Shield className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            {t('security')}
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-400">{t('securityDescription')}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                        <Key className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">{t('changePassword')}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('changePasswordDesc')}</p>
                                                    </div>
                                                </div>
                                                <ChangePasswordModal>
                                                    <Button variant="outline" className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                        <Key className="h-4 w-4 mr-2" />
                                                        {t('changePassword')}
                                                    </Button>
                                                </ChangePasswordModal>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                                        <User className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">{t('profileImage')}</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('profileImageDesc')}</p>
                                                    </div>
                                                </div>
                                                <ProfileImageUpload
                                                    currentImage={admin.profileImage || null}
                                                    userName={admin.name}
                                                    onImageUpdate={handleImageUpdate}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Activity Tab */}
                            <TabsContent value="activity" className="space-y-6">
                                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                                <Activity className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            {t('activity')}
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-400">{t('activityDescription')}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-12">
                                            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400">{t('activityComingSoon')}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('quickActions')}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <Settings className="h-4 w-4 mr-2" />
                                    {t('accountSettings')}
                                </Button>
                                <Button variant="outline" className="w-full justify-start border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <Shield className="h-4 w-4 mr-2" />
                                    {t('privacySettings')}
                                </Button>
                                <Button variant="outline" className="w-full justify-start border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <Activity className="h-4 w-4 mr-2" />
                                    {t('viewActivity')}
                                </Button>
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