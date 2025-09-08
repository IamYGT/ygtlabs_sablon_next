'use client';

import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
    AlertCircle,
    BarChart3,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Code,
    Crown,
    Database,
    Eye,
    FileText,
    Filter,
    FolderOpen,
    Grid3x3,
    Info,
    Layers,
    LayoutGrid,
    List,
    Lock,
    LucideIcon,
    Minus,
    Package,
    Palette,
    PencilIcon,
    Plus,
    RefreshCw,
    Save,
    Search,
    Settings,
    Shield,
    ShieldCheck,
    ShieldOff,
    Star,
    Trash2,
    Users,
    Wand2,
    X,
    Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, Fragment } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';

// Permission interface
interface Permission {
    id: string;
    name: string;
    category: string;
    resourcePath: string;
    action: string;
    displayName: string;
    description: string;
    permissionType?: string;
}

// Props interface
interface CreateRoleDialogV3Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRoleCreated: () => void;
}

// Enhanced Color palette with names
const COLOR_PALETTE = [
    { color: '#ef4444', name: 'Red' },
    { color: '#f59e0b', name: 'Amber' },
    { color: '#eab308', name: 'Yellow' },
    { color: '#22c55e', name: 'Green' },
    { color: '#10b981', name: 'Emerald' },
    { color: '#06b6d4', name: 'Cyan' },
    { color: '#3b82f6', name: 'Blue' },
    { color: '#6366f1', name: 'Indigo' },
    { color: '#8b5cf6', name: 'Violet' },
    { color: '#a855f7', name: 'Purple' },
    { color: '#d946ef', name: 'Fuchsia' },
    { color: '#ec4899', name: 'Pink' },
    { color: '#f43f5e', name: 'Rose' },
    { color: '#64748b', name: 'Slate' },
    { color: '#374151', name: 'Gray' }
];

// Enhanced Quick templates
const QUICK_TEMPLATES = {
    admin_full: {
        name: 'Super Admin',
        description: 'Complete system control with all permissions',
        layoutType: 'admin' as const,
        color: '#ef4444',
        icon: Crown,
        badge: 'Popular',
        selectAll: true,
        permissionType: 'admin',
        gradient: 'from-red-500 to-orange-500'
    },
    admin_moderator: {
        name: 'Moderator',
        description: 'Content management and user moderation',
        layoutType: 'admin' as const,
        color: '#8b5cf6',
        icon: Shield,
        badge: 'Recommended',
        selectViews: true,
        selectSome: ['users.update', 'information.update'],
        permissionType: 'admin',
        gradient: 'from-violet-500 to-purple-500'
    },
    admin_viewer: {
        name: 'Admin Viewer',
        description: 'Read-only access to admin panel',
        layoutType: 'admin' as const,
        color: '#3b82f6',
        icon: Eye,
        selectViews: true,
        permissionType: 'admin',
        gradient: 'from-blue-500 to-cyan-500'
    },
    customer_premium: {
        name: 'Premium Customer',
        description: 'All customer features unlocked',
        layoutType: 'customer' as const,
        color: '#10b981',
        icon: Star,
        badge: 'Premium',
        selectAll: true,
        permissionType: 'customer',
        gradient: 'from-emerald-500 to-green-500'
    },
    customer_basic: {
        name: 'Basic Customer',
        description: 'Standard customer access',
        layoutType: 'customer' as const,
        color: '#06b6d4',
        icon: Users,
        selectViews: true,
        permissionType: 'customer',
        gradient: 'from-cyan-500 to-blue-500'
    }
};

// Helper function to generate role code
const generateRoleCode = (displayName: string): string => {
    return displayName
        .toLowerCase()
        .replace(/ç/g, 'c')
        .replace(/ğ/g, 'g')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ş/g, 's')
        .replace(/ü/g, 'u')
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
};

// Enhanced Resource icons with better mapping
const getResourceIcon = (resource: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
        users: Users,
        roles: Shield,
        permissions: ShieldCheck,
        dashboard: LayoutGrid,
        profile: Settings,
        'hero-slider': FileText,
        information: Info,
        customers: Users,
        about: Info,
        orders: Package,
        cart: Package,
        settings: Settings,
        analytics: BarChart3,
        database: Database,
    };
    
    return iconMap[resource] || FolderOpen;
};

// Get category icon with better styling
const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'layout': 
            return <Layers className="w-4 h-4 text-blue-500" />;
        case 'view': 
            return <Eye className="w-4 h-4 text-green-500" />;
        case 'function': 
            return <Zap className="w-4 h-4 text-orange-500" />;
        default: 
            return <Shield className="w-4 h-4 text-gray-500" />;
    }
};

// Enhanced action badge styling
const getActionBadgeVariant = (action: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (action) {
        case 'delete': return 'destructive';
        case 'create': return 'default';
        case 'update': case 'edit': return 'secondary';
        default: return 'outline';
    }
};

// Get action icon
const getActionIcon = (action: string) => {
    switch(action) {
        case 'create': return <Plus className="w-3 h-3" />;
        case 'update': case 'edit': return <PencilIcon className="w-3 h-3" />;
        case 'delete': return <Trash2 className="w-3 h-3" />;
        case 'view': return <Eye className="w-3 h-3" />;
        default: return null;
    }
};

export default function CreateRoleDialogV3({
    open,
    onOpenChange,
    onRoleCreated,
}: CreateRoleDialogV3Props) {
    const t = useTranslations('AdminRoles.createDialog');
    const params = useParams();
    const locale = (params?.locale as string) || 'tr';
    const { user: currentUser } = useAuth();

    // State
    const [loading, setLoading] = useState(false);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
    const [activeTab, setActiveTab] = useState<'templates' | 'basic' | 'permissions' | 'review'>('templates');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set());
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [expandAll, setExpandAll] = useState(false);
    
    // Form data
    const [formData, setFormData] = useState({
        displayName: '',
        description: '',
        layoutType: 'customer' as 'admin' | 'customer',
        color: '#6366f1',
        power: 0,
    });
    
    // Permissions
    const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
    
    // Auto-calculate power
    useEffect(() => {
        if (!currentUser) return;

        const newPower = selectedPermissions.size * 10;
        
        if (currentUser.primaryRole === 'super_admin') {
            setFormData(prev => ({ ...prev, power: newPower }));
        } else {
            const cappedPower = Math.min(newPower, (currentUser.power || 1) - 1);
            setFormData(prev => ({ ...prev, power: cappedPower }));
        }

    }, [selectedPermissions, currentUser]);
    
    // Form validation
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load permissions
    const loadPermissions = useCallback(async () => {
        if (loadingPermissions || availablePermissions.length > 0) return;
        
        setLoadingPermissions(true);
        try {
            const response = await fetch(`/api/admin/permissions?limit=1000&locale=${locale}`);
            if (response.ok) {
                const data = await response.json();
                setAvailablePermissions(data.permissions || []);
            } else {
                toast.error(t('notifications.loadError'));
            }
        } catch (_error) {
            toast.error(t('notifications.loadErrorGeneric'));
        } finally {
            setLoadingPermissions(false);
        }
    }, [loadingPermissions, availablePermissions.length, t, locale]);

    // Group permissions by resource
    const groupedPermissions = useMemo(() => {
        const groups: Record<string, Permission[]> = {};
        
        // Filter by layout type and search
        let filteredPermissions = availablePermissions.filter(p => 
            p.permissionType === formData.layoutType && 
            (searchTerm === '' || 
             p.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.resourcePath.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        // Apply category filter
        if (categoryFilter !== 'all') {
            filteredPermissions = filteredPermissions.filter(p => p.category === categoryFilter);
        }
        
        // Group by resource
        filteredPermissions.forEach(permission => {
            if (!groups[permission.resourcePath]) {
                groups[permission.resourcePath] = [];
            }
            groups[permission.resourcePath].push(permission);
        });
        
        // Sort groups and permissions
        Object.keys(groups).forEach(key => {
            groups[key].sort((a, b) => {
                // Layout permissions first
                if (a.category === 'layout' && b.category !== 'layout') return -1;
                if (a.category !== 'layout' && b.category === 'layout') return 1;
                // Then by category
                if (a.category !== b.category) return a.category.localeCompare(b.category);
                // Then by action
                return a.action.localeCompare(b.action);
            });
        });
        
        return groups;
    }, [availablePermissions, formData.layoutType, searchTerm, categoryFilter]);

    // Calculate resource selection state
    const getResourceSelectionState = (resource: string) => {
        const resourcePerms = groupedPermissions[resource] || [];
        const selectedCount = resourcePerms.filter(p => selectedPermissions.has(p.id)).length;
        
        if (selectedCount === 0) return 'none';
        if (selectedCount === resourcePerms.length) return 'all';
        return 'partial';
    };

    // Toggle resource permissions
    const toggleResourcePermissions = (resource: string) => {
        const resourcePerms = groupedPermissions[resource] || [];
        const state = getResourceSelectionState(resource);
        
        const newSelected = new Set(selectedPermissions);
        
        if (state === 'all') {
            resourcePerms.forEach(p => newSelected.delete(p.id));
        } else {
            resourcePerms.forEach(p => newSelected.add(p.id));
        }
        
        setSelectedPermissions(newSelected);
    };

    // Toggle single permission
    const togglePermission = (permissionId: string) => {
        const newSelected = new Set(selectedPermissions);
        if (newSelected.has(permissionId)) {
            newSelected.delete(permissionId);
        } else {
            newSelected.add(permissionId);
        }
        setSelectedPermissions(newSelected);
    };

    // Apply quick template
    const applyQuickTemplate = (templateKey: string) => {
        const template = QUICK_TEMPLATES[templateKey as keyof typeof QUICK_TEMPLATES];
        if (!template) return;
        
        setSelectedTemplate(templateKey);
        
        // Update form data
        setFormData({
            displayName: template.name,
            description: template.description,
            layoutType: template.layoutType,
            color: template.color,
            power: 0, // Reset power for quick templates
        });
        
        // Update permissions
        const newSelected = new Set<string>();
        
        availablePermissions.forEach(permission => {
            if (permission.permissionType !== template.permissionType) return;
            
            // Always include layout permission
            if (permission.category === 'layout') {
                newSelected.add(permission.id);
                return;
            }
            
            // Apply template rules
            if ('selectAll' in template && template.selectAll) {
                newSelected.add(permission.id);
            } else if ('selectViews' in template && template.selectViews && permission.category === 'view') {
                newSelected.add(permission.id);
            }
            
            // Handle specific permissions
            if ('selectSome' in template && template.selectSome) {
                if (template.selectSome.includes(permission.name)) {
                    newSelected.add(permission.id);
                }
            }
        });
        
        setSelectedPermissions(newSelected);
        setActiveTab('basic');
        toast.success('✨ Template applied successfully!');
    };

    // Toggle all resources expand/collapse
    const toggleAllResources = () => {
        if (expandAll) {
            setExpandedResources(new Set());
        } else {
            setExpandedResources(new Set(Object.keys(groupedPermissions)));
        }
        setExpandAll(!expandAll);
    };

    // Toggle resource expansion
    const toggleResourceExpansion = (resource: string) => {
        const newExpanded = new Set(expandedResources);
        if (newExpanded.has(resource)) {
            newExpanded.delete(resource);
        } else {
            newExpanded.add(resource);
        }
        setExpandedResources(newExpanded);
    };

    // Select all permissions
    const selectAllPermissions = () => {
        const allPermIds = availablePermissions
            .filter(p => p.permissionType === formData.layoutType)
            .map(p => p.id);
        setSelectedPermissions(new Set(allPermIds));
        toast.success('All permissions selected');
    };

    // Clear all permissions
    const clearAllPermissions = () => {
        // Keep only layout permission
        const layoutPerm = availablePermissions.find(
            p => p.name === `${formData.layoutType}.layout`
        );
        setSelectedPermissions(layoutPerm ? new Set([layoutPerm.id]) : new Set());
        toast('Permissions cleared');
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.displayName.trim()) {
            newErrors.displayName = t('roleNameRequired');
        }
        
        if (selectedPermissions.size === 0) {
            newErrors.permissions = 'At least one permission must be selected';
        }

        if (formData.power < 0) {
            newErrors.power = 'Power cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit form
    const handleSubmit = async () => {
        if (!validateForm()) {
            if (errors.permissions) {
                setActiveTab('permissions');
            }
            return;
        }
        
        setLoading(true);
        try {
            // Get permission names
            const permissionNames = Array.from(selectedPermissions)
                .map(id => availablePermissions.find(p => p.id === id)?.name)
                .filter(Boolean);
            
            const response = await fetch('/api/admin/roles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: generateRoleCode(formData.displayName),
                    displayName: formData.displayName,
                    description: formData.description,
                    layoutType: formData.layoutType,
                    color: formData.color,
                    power: formData.power,
                    permissions: permissionNames,
                }),
            });
            
            if (response.ok) {
                toast.success('🎉 ' + t('notifications.createSuccess'));
                onRoleCreated();
                onOpenChange(false);
            } else {
                const error = await response.json();
                toast.error(error.error || t('notifications.createError'));
            }
        } catch (_error) {
            toast.error(t('notifications.createErrorGeneric'));
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            displayName: '',
            description: '',
            layoutType: 'customer',
            color: '#6366f1',
            power: 0,
        });
        setSelectedPermissions(new Set());
        setErrors({});
        setActiveTab('templates');
        setSearchTerm('');
        setExpandedResources(new Set());
        setSelectedTemplate(null);
        setCategoryFilter('all');
        setExpandAll(false);
    };

    // Load permissions on mount
    useEffect(() => {
        if (open) {
            resetForm();
            loadPermissions();
        }
    }, [open, loadPermissions]);

    // Auto-add layout permission when layout type changes
    useEffect(() => {
        const layoutPermission = availablePermissions.find(
            p => p.name === `${formData.layoutType}.layout`
        );
        if (layoutPermission && !selectedPermissions.has(layoutPermission.id)) {
            setSelectedPermissions(prev => new Set([...prev, layoutPermission.id]));
        }
    }, [formData.layoutType, availablePermissions, selectedPermissions]);

    // Calculate stats
    const stats = useMemo(() => {
        const selected = Array.from(selectedPermissions)
            .map(id => availablePermissions.find(p => p.id === id))
            .filter(Boolean) as Permission[];
        
        const total = availablePermissions.filter(p => p.permissionType === formData.layoutType).length;
        
        return {
            total: selected.length,
            available: total,
            percentage: total > 0 ? Math.round((selected.length / total) * 100) : 0,
            view: selected.filter(p => p.category === 'view').length,
            function: selected.filter(p => p.category === 'function').length,
            layout: selected.filter(p => p.category === 'layout').length,
            resources: new Set(selected.map(p => p.resourcePath)).size,
        };
    }, [selectedPermissions, availablePermissions, formData.layoutType]);

    return (
        <TooltipProvider>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-[90vw] xl:max-w-7xl max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
                    {/* Enhanced Header - Sabit */}
                    <DialogHeader className="px-8 py-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 flex-shrink-0">
                        <div className="flex items-start justify-between pr-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                    <Plus className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        {t('title')}
                                    </DialogTitle>
                                    <DialogDescription className="mt-1.5 text-base">
                                        Design custom roles with granular permission control
                                    </DialogDescription>
                                </div>
                            </div>

                            {/* Progress Indicator - Moved to avoid close button */}
                            <div className="flex items-center gap-2 mr-4">
                                <div className="flex items-center gap-1">
                                    {['templates', 'basic', 'permissions', 'review'].map((tab, idx) => (
                                        <Fragment key={tab}>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full transition-all",
                                                activeTab === tab ? "w-8 bg-blue-600" :
                                                ['templates', 'basic', 'permissions', 'review'].indexOf(activeTab) > idx ?
                                                "bg-green-500" : "bg-gray-300"
                                            )} />
                                            {idx < 3 && <div className="w-4 h-0.5 bg-gray-300" />}
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Enhanced Tabs - Sabit Header */}
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'templates' | 'basic' | 'permissions' | 'review')} className="flex-1 flex flex-col overflow-hidden">
                        <TabsList className="mx-8 mt-6 p-1 bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                            <TabsTrigger value="templates" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                                <Wand2 className="w-4 h-4" />
                                Quick Start
                            </TabsTrigger>
                            <TabsTrigger value="basic" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                                <Settings className="w-4 h-4" />
                                Basic Info
                            </TabsTrigger>
                            <TabsTrigger value="permissions" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                                <Shield className="w-4 h-4" />
                                Permissions
                                {stats.total > 0 && (
                                    <Badge variant="secondary" className="ml-1 px-1.5 py-0 h-5">
                                        {stats.total}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="review" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
                                <CheckCircle2 className="w-4 h-4" />
                                Review
                            </TabsTrigger>
                        </TabsList>

                        {/* Tab Content - Scroll edilebilir */}
                        <div className="flex-1 overflow-y-auto">
                            {/* Templates Tab */}
                            <TabsContent value="templates" className="h-full m-0 px-6 py-6">
                                <div className="max-w-5xl mx-auto space-y-6">
                                    <div className="text-center mb-8">
                                        <h3 className="text-lg font-semibold mb-2">Choose a Template</h3>
                                        <p className="text-muted-foreground">
                                            Start with a pre-configured template or create from scratch
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {Object.entries(QUICK_TEMPLATES).map(([key, template]) => {
                                            const Icon = template.icon;
                                            const isSelected = selectedTemplate === key;

                                            return (
                                                <Card
                                                    key={key}
                                                    className={cn(
                                                        "relative cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1",
                                                        isSelected && "ring-2 ring-blue-500 shadow-xl"
                                                    )}
                                                    onClick={() => applyQuickTemplate(key)}
                                                >
                                                    {'badge' in template && template.badge && (
                                                        <div className="absolute -top-2 -right-2 z-10">
                                                            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                                                                {template.badge}
                                                            </Badge>
                                                        </div>
                                                    )}

                                                    <CardHeader className="pb-3">
                                                        <div className={cn(
                                                            "w-full h-2 rounded-full bg-gradient-to-r mb-4",
                                                            'gradient' in template ? template.gradient : 'from-gray-400 to-gray-500'
                                                        )} />
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="p-3 rounded-xl bg-gradient-to-br shadow-lg"
                                                                style={{
                                                                    backgroundImage: `linear-gradient(135deg, ${template.color}20, ${template.color}40)`,
                                                                }}
                                                            >
                                                                <Icon className="w-6 h-6" style={{ color: template.color }} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <CardTitle className="text-base">{template.name}</CardTitle>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="mt-1 text-xs"
                                                                >
                                                                    {template.layoutType}
                                                                </Badge>
                                                            </div>
                                                            {isSelected && (
                                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                            )}
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-sm text-muted-foreground">
                                                            {template.description}
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}

                                        {/* Custom Template Card */}
                                        <Card
                                            className="relative cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 border-dashed"
                                            onClick={() => {
                                                setSelectedTemplate(null);
                                                setActiveTab('basic');
                                            }}
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="w-full h-2 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 mb-4" />
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
                                                        <Plus className="w-6 h-6 text-gray-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <CardTitle className="text-base">Custom Role</CardTitle>
                                                        <Badge variant="outline" className="mt-1 text-xs">
                                                            Advanced
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground">
                                                    Create a role from scratch with custom permissions
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Basic Info Tab */}
                            <TabsContent value="basic" className="h-full m-0 px-6 py-6">
                                <div className="max-w-4xl mx-auto space-y-6">
                                        {/* Role Name Card */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Info className="w-5 h-5" />
                                                    Role Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div>
                                                    <Label htmlFor="displayName">
                                                        Role Name 
                                                        <span className="text-red-500 ml-1">*</span>
                                                    </Label>
                                                    <Input
                                                        id="displayName"
                                                        value={formData.displayName}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                                                        placeholder="e.g., Content Manager, Support Agent"
                                                        className={cn(
                                                            "mt-2",
                                                            errors.displayName && "border-red-500 focus:ring-red-500"
                                                        )}
                                                    />
                                                    {errors.displayName && (
                                                        <p className="text-sm text-red-500 mt-1">{errors.displayName}</p>
                                                    )}
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Code className="w-4 h-4 text-muted-foreground" />
                                                        <p className="text-xs text-muted-foreground">
                                                            System code: <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                                                                {generateRoleCode(formData.displayName || 'new_role')}
                                                            </code>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label htmlFor="description">Description</Label>
                                                    <Textarea
                                                        id="description"
                                                        value={formData.description}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                        placeholder="Describe the role's purpose and responsibilities..."
                                                        rows={4}
                                                        className="mt-2 resize-none"
                                                    />
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {formData.description.length}/500 characters
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Settings Card */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Settings className="w-5 h-5" />
                                                    Role Settings
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div>
                                                    <Label>Access Type</Label>
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        Choose the panel this role will have access to
                                                    </p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <Card 
                                                            className={cn(
                                                                "cursor-pointer transition-all",
                                                                formData.layoutType === 'customer' && "ring-2 ring-blue-500"
                                                            )}
                                                            onClick={() => setFormData(prev => ({ ...prev, layoutType: 'customer' }))}
                                                        >
                                                            <CardContent className="p-4">
                                                                <div className="flex items-center gap-3">
                                                                    <Users className="w-8 h-8 text-blue-500" />
                                                                    <div>
                                                                        <p className="font-semibold">Customer</p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            Customer panel access
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                        
                                                        <Card 
                                                            className={cn(
                                                                "cursor-pointer transition-all",
                                                                formData.layoutType === 'admin' && "ring-2 ring-blue-500"
                                                            )}
                                                            onClick={() => setFormData(prev => ({ ...prev, layoutType: 'admin' }))}
                                                        >
                                                            <CardContent className="p-4">
                                                                <div className="flex items-center gap-3">
                                                                    <Crown className="w-8 h-8 text-orange-500" />
                                                                    <div>
                                                                        <p className="font-semibold">Admin</p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            Admin panel access
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label className="flex items-center gap-2">
                                                        <Palette className="w-4 h-4" />
                                                        Role Color
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground mb-3">
                                                        Choose a color to identify this role
                                                    </p>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="color"
                                                                value={formData.color}
                                                                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                                                className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-12 gap-2">
                                                                    {COLOR_PALETTE.map(({ color, name }) => (
                                                                        <Tooltip key={color}>
                                                                            <TooltipTrigger asChild>
                                                                                <button
                                                                                    type="button"
                                                                                    className={cn(
                                                                                        "w-8 h-8 rounded-lg border-2 transition-all hover:scale-110",
                                                                                        formData.color === color ? 
                                                                                        "border-gray-900 dark:border-white shadow-lg" : 
                                                                                        "border-transparent"
                                                                                    )}
                                                                                    style={{ backgroundColor: color }}
                                                                                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                                                                                />
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                <p>{name}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                            <div 
                                                                className="w-10 h-10 rounded-lg shadow"
                                                                style={{ backgroundColor: formData.color }}
                                                            />
                                                            <div>
                                                                <p className="text-sm font-medium">{formData.displayName || 'Role Name'}</p>
                                                                <p className="text-xs text-muted-foreground">{formData.color}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                </div>
                            </TabsContent>

                            {/* Permissions Tab */}
                            <TabsContent value="permissions" className="h-full m-0 flex flex-col">
                                {/* Enhanced Toolbar */}
                                <div className="px-6 py-4 border-b bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="relative flex-1 max-w-sm">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search permissions..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-9"
                                                />
                                                {searchTerm && (
                                                    <button
                                                        onClick={() => setSearchTerm('')}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                                    >
                                                        <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                                    </button>
                                                )}
                                            </div>

                                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                                <SelectTrigger className="w-40">
                                                    <Filter className="w-4 h-4 mr-2" />
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Categories</SelectItem>
                                                    <SelectItem value="layout">Layout</SelectItem>
                                                    <SelectItem value="view">View</SelectItem>
                                                    <SelectItem value="function">Function</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <div className="flex items-center gap-2 border-l pl-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={toggleAllResources}
                                                >
                                                    {expandAll ? (
                                                        <>
                                                            <Minus className="w-4 h-4 mr-1" />
                                                            Collapse
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus className="w-4 h-4 mr-1" />
                                                            Expand
                                                        </>
                                                    )}
                                                </Button>

                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => setViewMode('grid')}
                                                    >
                                                        <Grid3x3 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => setViewMode('list')}
                                                    >
                                                        <List className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={selectAllPermissions}
                                            >
                                                Select All
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearAllPermissions}
                                            >
                                                Clear
                                            </Button>
                                            <Separator orientation="vertical" className="h-6" />
                                            <div className="flex items-center gap-2 text-sm">
                                                <Progress value={stats.percentage} className="w-20 h-2" />
                                                <span className="text-muted-foreground font-medium">
                                                    {stats.total}/{stats.available}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Bar */}
                                    <div className="flex items-center gap-4 mt-4">
                                        <Badge variant="secondary" className="gap-1">
                                            <LayoutGrid className="w-3 h-3" />
                                            {stats.resources} Resources
                                        </Badge>
                                        <Badge variant="outline" className="gap-1">
                                            <Eye className="w-3 h-3" />
                                            {stats.view} Views
                                        </Badge>
                                        <Badge variant="outline" className="gap-1">
                                            <Zap className="w-3 h-3" />
                                            {stats.function} Functions
                                        </Badge>
                                        <Badge variant="outline" className="gap-1">
                                            <Layers className="w-3 h-3" />
                                            {stats.layout} Layouts
                                        </Badge>
                                    </div>
                                </div>

                                {/* Permissions Content - Scroll edilebilir */}
                                <div className="flex-1 overflow-y-auto">
                                    <div className="px-6 py-6">
                                        {loadingPermissions ? (
                                            <div className="flex flex-col items-center justify-center py-16">
                                                <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                                                <p className="text-muted-foreground">Loading permissions...</p>
                                            </div>
                                        ) : Object.keys(groupedPermissions).length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-16">
                                                <ShieldOff className="w-12 h-12 text-gray-400 mb-4" />
                                                <p className="text-lg font-medium mb-2">No permissions found</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Try adjusting your search or filters
                                                </p>
                                            </div>
                                        ) : (
                                            <div className={cn(
                                                viewMode === 'grid' ?
                                                "grid grid-cols-1 xl:grid-cols-2 gap-4" :
                                                "space-y-3"
                                            )}>
                                                {Object.entries(groupedPermissions)
                                                    .sort(([a], [b]) => a.localeCompare(b))
                                                    .map(([resource, permissions]) => {
                                                        const ResourceIcon = getResourceIcon(resource);
                                                        const selectionState = getResourceSelectionState(resource);
                                                        const isExpanded = expandedResources.has(resource);
                                                        const hasLayoutPerm = permissions.some(p => p.category === 'layout');
                                                        const selectedInResource = permissions.filter(p => selectedPermissions.has(p.id)).length;
                                                        
                                                        return (
                                                            <Card 
                                                                key={resource} 
                                                                className={cn(
                                                                    "overflow-hidden transition-all",
                                                                    selectionState === 'all' && "ring-2 ring-green-500",
                                                                    selectionState === 'partial' && "ring-2 ring-blue-500"
                                                                )}
                                                            >
                                                                <CardHeader 
                                                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                                                    onClick={() => toggleResourceExpansion(resource)}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                                                <ResourceIcon className="w-5 h-5" />
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="font-semibold capitalize">
                                                                                        {resource.replace(/[/_-]/g, ' ')}
                                                                                    </span>
                                                                                    {hasLayoutPerm && (
                                                                                        <Badge variant="secondary" className="text-xs">
                                                                                            Required
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex items-center gap-2 mt-1">
                                                                                    <span className="text-xs text-muted-foreground">
                                                                                        {selectedInResource}/{permissions.length} selected
                                                                                    </span>
                                                                                    <Progress 
                                                                                        value={(selectedInResource / permissions.length) * 100} 
                                                                                        className="w-16 h-1.5"
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            toggleResourcePermissions(resource);
                                                                                        }}
                                                                                    >
                                                                                        {selectionState === 'all' ? 'Deselect All' : 'Select All'}
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    Toggle all permissions in this resource
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                            {isExpanded ? (
                                                                                <ChevronDown className="w-4 h-4" />
                                                                            ) : (
                                                                                <ChevronRight className="w-4 h-4" />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </CardHeader>
                                                                
                                                                <AnimatePresence>
                                                                    {isExpanded && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: 'auto', opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            transition={{ duration: 0.2 }}
                                                                        >
                                                                            <CardContent className="pt-0 border-t">
                                                                                <div className="space-y-1 pt-3">
                                                                                    {permissions.map(permission => (
                                                                                        <div
                                                                                            key={permission.id}
                                                                                            className={cn(
                                                                                                "flex items-start gap-3 p-3 rounded-lg transition-colors",
                                                                                                selectedPermissions.has(permission.id) ? 
                                                                                                "bg-blue-50 dark:bg-blue-950/20" : 
                                                                                                "hover:bg-muted/50"
                                                                                            )}
                                                                                        >
                                                                                            <Checkbox
                                                                                                checked={selectedPermissions.has(permission.id)}
                                                                                                onCheckedChange={() => togglePermission(permission.id)}
                                                                                                disabled={permission.category === 'layout'}
                                                                                                className="mt-0.5"
                                                                                            />
                                                                                            <div className="flex-1 space-y-1">
                                                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                                                    {getCategoryIcon(permission.category)}
                                                                                                    <span className="font-medium text-sm">
                                                                                                        {permission.displayName}
                                                                                                    </span>
                                                                                                    <Badge 
                                                                                                        variant={getActionBadgeVariant(permission.action)}
                                                                                                        className="text-xs h-5 gap-1"
                                                                                                    >
                                                                                                        {getActionIcon(permission.action)}
                                                                                                        {permission.action}
                                                                                                    </Badge>
                                                                                                    {permission.category === 'layout' && (
                                                                                                        <Tooltip>
                                                                                                            <TooltipTrigger>
                                                                                                                <Lock className="w-3 h-3 text-muted-foreground" />
                                                                                                            </TooltipTrigger>
                                                                                                            <TooltipContent>
                                                                                                                Required permission
                                                                                                            </TooltipContent>
                                                                                                        </Tooltip>
                                                                                                    )}
                                                                                                </div>
                                                                                                <p className="text-xs text-muted-foreground pl-6">
                                                                                                    {permission.description}
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </CardContent>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </Card>
                                                        );
                                                    })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                </TabsContent>

                            {/* Review Tab */}
                            <TabsContent value="review" className="h-full m-0 px-6 py-6">
                                    <div className="max-w-5xl mx-auto space-y-6">
                                        <div className="text-center mb-8">
                                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                                            <h3 className="text-lg font-semibold mb-2">Review Your Role</h3>
                                            <p className="text-muted-foreground">
                                                Double-check your role configuration before creating
                                            </p>
                                        </div>

                                        {/* Summary Cards */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <Card>
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-base flex items-center gap-2">
                                                        <Info className="w-4 h-4" />
                                                        Basic Information
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">Name:</span>
                                                        <span className="font-medium">{formData.displayName || 'Not set'}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">Code:</span>
                                                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                                                            {generateRoleCode(formData.displayName || 'new_role')}
                                                        </code>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">Type:</span>
                                                        <Badge variant="outline">{formData.layoutType}</Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">Color:</span>
                                                        <div className="flex items-center gap-2">
                                                            <div 
                                                                className="w-6 h-6 rounded border"
                                                                style={{ backgroundColor: formData.color }}
                                                            />
                                                            <span className="text-xs">{formData.color}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">Power:</span>
                                                        <Badge variant="outline">{formData.power}</Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-base flex items-center gap-2">
                                                        <Shield className="w-4 h-4" />
                                                        Permission Summary
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">Total:</span>
                                                        <span className="font-medium">{stats.total} permissions</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">Resources:</span>
                                                        <span className="font-medium">{stats.resources} resources</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">Coverage:</span>
                                                        <div className="flex items-center gap-2">
                                                            <Progress value={stats.percentage} className="w-20 h-2" />
                                                            <span className="text-xs font-medium">{stats.percentage}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="pt-2 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Eye className="w-3 h-3" />
                                                            <span className="text-xs">{stats.view} view permissions</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Zap className="w-3 h-3" />
                                                            <span className="text-xs">{stats.function} function permissions</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        {/* Description */}
                                        {formData.description && (
                                            <Card>
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-base">Description</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formData.description}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Selected Permissions Preview */}
                                        <Card>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-base flex items-center justify-between">
                                                    <span className="flex items-center gap-2">
                                                        <ShieldCheck className="w-4 h-4" />
                                                        Selected Permissions
                                                    </span>
                                                    <Badge>{stats.total}</Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <ScrollArea className="h-48">
                                                    <div className="space-y-2">
                                                        {Object.entries(groupedPermissions).map(([resource, perms]) => {
                                                            const selected = perms.filter(p => selectedPermissions.has(p.id));
                                                            if (selected.length === 0) return null;
                                                            
                                                            return (
                                                                <div key={resource} className="space-y-1">
                                                                    <div className="flex items-center gap-2 font-medium text-sm">
                                                                        {React.createElement(getResourceIcon(resource), { className: "w-4 h-4" })}
                                                                        <span className="capitalize">{resource.replace(/[/_-]/g, ' ')}</span>
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            {selected.length}
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="pl-6 space-y-0.5">
                                                                        {selected.map(p => (
                                                                            <div key={p.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                                {getCategoryIcon(p.category)}
                                                                                <span>{p.displayName}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </ScrollArea>
                                            </CardContent>
                                        </Card>

                                        {/* Validation Messages */}
                                        {errors.displayName && (
                                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                                                <AlertCircle className="w-4 h-4 text-red-500" />
                                                <span className="text-sm text-red-600">{errors.displayName}</span>
                                            </div>
                                        )}
                                        {errors.permissions && (
                                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                                                <AlertCircle className="w-4 h-4 text-red-500" />
                                                <span className="text-sm text-red-600">{errors.permissions}</span>
                                            </div>
                                        )}
                                        {errors.power && (
                                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                                                <AlertCircle className="w-4 h-4 text-red-500" />
                                                <span className="text-sm text-red-600">{errors.power}</span>
                                            </div>
                                        )}
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>

                    {/* Enhanced Footer */}
                    <DialogFooter className="px-6 py-6 border-t bg-gray-50 dark:bg-gray-900/50 flex-shrink-0">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                {activeTab !== 'templates' && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            const tabs = ['templates', 'basic', 'permissions', 'review'];
                                            const currentIndex = tabs.indexOf(activeTab);
                                            if (currentIndex > 0) {
                                                setActiveTab(tabs[currentIndex - 1] as 'templates' | 'basic' | 'permissions' | 'review');
                                            }
                                        }}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Previous
                                    </Button>
                                )}
                                
                                {stats.total > 0 && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>{stats.total} permissions selected</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <Button
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                
                                {activeTab === 'review' ? (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading || !formData.displayName.trim() || stats.total === 0}
                                        className="min-w-[120px]"
                                    >
                                        {loading ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Create Role
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            const tabs = ['templates', 'basic', 'permissions', 'review'];
                                            const currentIndex = tabs.indexOf(activeTab);
                                            if (currentIndex < tabs.length - 1) {
                                                setActiveTab(tabs[currentIndex + 1] as 'templates' | 'basic' | 'permissions' | 'review');
                                            }
                                        }}
                                        disabled={
                                            (activeTab === 'basic' && !formData.displayName.trim()) ||
                                            (activeTab === 'permissions' && stats.total === 0)
                                        }
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
}
