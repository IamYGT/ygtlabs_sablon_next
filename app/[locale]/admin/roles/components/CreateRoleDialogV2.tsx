'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
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
    Activity,
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Code,
    Crown,
    Eye,
    FileText,
    FolderOpen,
    HelpCircle,
    Info,
    Layers,
    Lock,
    LucideIcon,
    Minus,
    Package,
    Palette,
    PencilIcon,
    Plus,
    Save,
    Search,
    Settings,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Star,
    Trash2,
    Users,
    Wand2,
    X,
    Zap,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

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
interface CreateRoleDialogV2Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRoleCreated: () => void;
}

// Color palette
const COLOR_PALETTE = [
    '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981',
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#d946ef', '#ec4899', '#f43f5e', '#64748b', '#374151'
];

// Quick templates
const QUICK_TEMPLATES = {
    admin_full: {
        name: 'Full Admin',
        description: 'Complete admin access with all permissions',
        layoutType: 'admin' as const,
        color: '#ef4444',
        icon: Crown,
        selectAll: true,
        permissionType: 'admin'
    },
    admin_viewer: {
        name: 'Admin Viewer',
        description: 'View-only admin access',
        layoutType: 'admin' as const,
        color: '#3b82f6',
        icon: Shield,
        selectViews: true,
        permissionType: 'admin'
    },
    customer_full: {
        name: 'Premium Customer',
        description: 'Full customer access',
        layoutType: 'customer' as const,
        color: '#10b981',
        icon: Sparkles,
        selectAll: true,
        permissionType: 'customer'
    },
    customer_basic: {
        name: 'Basic Customer',
        description: 'Basic customer access with view permissions',
        layoutType: 'customer' as const,
        color: '#06b6d4',
        icon: Users,
        selectViews: true,
        permissionType: 'customer'
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

// Get resource icon
const getResourceIcon = (resource: string) => {
    const iconMap: Record<string, typeof Users> = {
        users: Users,
        roles: Shield,
        permissions: ShieldCheck,
        dashboard: Activity,
        profile: Settings,
        'hero-slider': FileText,
        information: Info,
        customers: Users,
        about: Info,
        orders: Package,
        cart: Package,
        settings: Settings,
    };
    
    return iconMap[resource] || FolderOpen;
};

// Get category icon
const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'layout': return <Settings className="w-4 h-4" />;
        case 'view': return <FileText className="w-4 h-4" />;
        case 'function': return <Activity className="w-4 h-4" />;
        default: return <Shield className="w-4 h-4" />;
    }
};

// Get action badge color
const getActionBadgeVariant = (action: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (action) {
        case 'delete': return 'destructive';
        case 'create': return 'default';
        case 'update': case 'edit': return 'secondary';
        default: return 'outline';
    }
};

export default function CreateRoleDialogV2({
    open,
    onOpenChange,
    onRoleCreated,
}: CreateRoleDialogV2Props) {
    const t = useTranslations('AdminRoles.createDialog');
    const tCommon = useTranslations('AdminCommon');
    const params = useParams();
    const locale = (params?.locale as string) || 'tr';

    // State
    const [loading, setLoading] = useState(false);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'permissions'>('basic');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedResources, setExpandedResources] = useState<Set<string>>(new Set());
    
    // Form data
    const [formData, setFormData] = useState({
        displayName: '',
        description: '',
        layoutType: 'customer' as 'admin' | 'customer',
        color: '#6366f1',
    });
    
    // Permissions
    const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
    
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
        
        // Filter by layout type
        const filteredPermissions = availablePermissions.filter(p => 
            p.permissionType === formData.layoutType && 
            (searchTerm === '' || 
             p.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
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
    }, [availablePermissions, formData.layoutType, searchTerm]);

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
            // Deselect all
            resourcePerms.forEach(p => newSelected.delete(p.id));
        } else {
            // Select all
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
        
        // Update form data
        setFormData({
            displayName: template.name,
            description: template.description,
            layoutType: template.layoutType,
            color: template.color,
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
        });
        
        setSelectedPermissions(newSelected);
        toast.success('Template applied successfully');
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

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.displayName.trim()) {
            newErrors.displayName = t('roleNameRequired');
        }
        
        if (selectedPermissions.size === 0) {
            newErrors.permissions = 'At least one permission must be selected';
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
            
            const response = await fetch('/api/admin/roles/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: generateRoleCode(formData.displayName),
                    displayName: formData.displayName,
                    description: formData.description,
                    layoutType: formData.layoutType,
                    color: formData.color,
                    permissions: permissionNames,
                }),
            });
            
            if (response.ok) {
                toast.success(t('notifications.createSuccess'));
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
        });
        setSelectedPermissions(new Set());
        setErrors({});
        setActiveTab('basic');
        setSearchTerm('');
        setExpandedResources(new Set());
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
        
        return {
            total: selected.length,
            view: selected.filter(p => p.category === 'view').length,
            function: selected.filter(p => p.category === 'function').length,
            resources: new Set(selected.map(p => p.resourcePath)).size,
        };
    }, [selectedPermissions, availablePermissions]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <span className="text-xl font-bold">{t('title')}</span>
                            <p className="text-sm font-normal text-muted-foreground mt-1">
                                Create a new role with custom permissions
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'basic' | 'permissions')} className="flex-1">
                    <TabsList className="mx-6">
                        <TabsTrigger value="basic" className="gap-2">
                            <Settings className="w-4 h-4" />
                            Basic Information
                        </TabsTrigger>
                        <TabsTrigger value="permissions" className="gap-2">
                            <Shield className="w-4 h-4" />
                            Permissions
                            {stats.total > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {stats.total}
                                </Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <div className="px-6 py-4 max-h-[calc(90vh-200px)] overflow-y-auto">
                        <TabsContent value="basic" className="mt-0 space-y-6">
                            {/* Quick Templates */}
                            <div>
                                <Label className="text-base mb-3 block">Quick Templates</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(QUICK_TEMPLATES).map(([key, template]) => {
                                        const Icon = template.icon;
                                        return (
                                            <Card
                                                key={key}
                                                className="cursor-pointer hover:shadow-md transition-all"
                                                onClick={() => applyQuickTemplate(key)}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="p-2 rounded-lg"
                                                            style={{ backgroundColor: `${template.color}20`, color: template.color }}
                                                        >
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-sm">{template.name}</h4>
                                                            <p className="text-xs text-muted-foreground">
                                                                {template.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Role Details */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="displayName">Role Name *</Label>
                                    <Input
                                        id="displayName"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                                        placeholder="e.g., Content Manager"
                                        className={errors.displayName ? 'border-red-500' : ''}
                                    />
                                    {errors.displayName && (
                                        <p className="text-sm text-red-500 mt-1">{errors.displayName}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        System code: {generateRoleCode(formData.displayName || 'new_role')}
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Describe the role's purpose and responsibilities"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Access Type</Label>
                                        <Select
                                            value={formData.layoutType}
                                            onValueChange={(value: 'customer' | 'admin') => {
                                                setFormData(prev => ({ ...prev, layoutType: value }));
                                                // Clear incompatible permissions
                                                const newSelected = new Set<string>();
                                                selectedPermissions.forEach(id => {
                                                    const perm = availablePermissions.find(p => p.id === id);
                                                    if (perm && perm.permissionType === value) {
                                                        newSelected.add(id);
                                                    }
                                                });
                                                setSelectedPermissions(newSelected);
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="customer">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4" />
                                                        Customer Access
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="admin">
                                                    <div className="flex items-center gap-2">
                                                        <Crown className="w-4 h-4" />
                                                        Admin Access
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Color</Label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="color"
                                                value={formData.color}
                                                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                                className="w-10 h-10 rounded border cursor-pointer"
                                            />
                                            <div className="flex flex-wrap gap-1">
                                                {COLOR_PALETTE.slice(0, 8).map((color) => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        className="w-6 h-6 rounded border-2"
                                                        style={{
                                                            backgroundColor: color,
                                                            borderColor: formData.color === color ? '#000' : 'transparent'
                                                        }}
                                                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="permissions" className="mt-0">
                            {errors.permissions && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                    <span className="text-sm text-red-600">{errors.permissions}</span>
                                </div>
                            )}

                            {/* Search and Stats */}
                            <div className="mb-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Input
                                        placeholder="Search permissions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="max-w-xs"
                                    />
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-muted-foreground">
                                            {stats.resources} resources
                                        </span>
                                        <Badge variant="outline">
                                            {stats.view} views
                                        </Badge>
                                        <Badge variant="outline">
                                            {stats.function} functions
                                        </Badge>
                                        <Badge variant="default">
                                            {stats.total} total
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Permissions by Resource */}
                            {loadingPermissions ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                                        <p className="text-muted-foreground">Loading permissions...</p>
                                    </div>
                                </div>
                            ) : (
                                <ScrollArea className="h-[400px]">
                                    <div className="space-y-2">
                                        {Object.entries(groupedPermissions)
                                            .sort(([a], [b]) => a.localeCompare(b))
                                            .map(([resource, permissions]) => {
                                                const ResourceIcon = getResourceIcon(resource);
                                                const selectionState = getResourceSelectionState(resource);
                                                const isExpanded = expandedResources.has(resource);
                                                const hasLayoutPerm = permissions.some(p => p.category === 'layout');
                                                
                                                return (
                                                    <Card key={resource} className="overflow-hidden">
                                                        <CardHeader 
                                                            className="p-3 cursor-pointer hover:bg-muted/50"
                                                            onClick={() => toggleResourceExpansion(resource)}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    {isExpanded ? (
                                                                        <ChevronDown className="w-4 h-4" />
                                                                    ) : (
                                                                        <ChevronRight className="w-4 h-4" />
                                                                    )}
                                                                    <ResourceIcon className="w-5 h-5 text-muted-foreground" />
                                                                    <div>
                                                                        <span className="font-semibold capitalize">
                                                                            {resource.replace(/[/_-]/g, ' ')}
                                                                        </span>
                                                                        <span className="ml-2 text-xs text-muted-foreground">
                                                                            ({permissions.length} permissions)
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                                    {hasLayoutPerm && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            Layout
                                                                        </Badge>
                                                                    )}
                                                                    <Checkbox
                                                                        checked={selectionState === 'all' || selectionState === 'partial'}
                                                                        onCheckedChange={() => toggleResourcePermissions(resource)}
                                                                        className={selectionState === 'partial' ? 'data-[state=checked]:bg-blue-400' : ''}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </CardHeader>
                                                        {isExpanded && (
                                                            <CardContent className="p-3 pt-0 border-t">
                                                                <div className="space-y-2">
                                                                    {permissions.map(permission => (
                                                                        <div
                                                                            key={permission.id}
                                                                            className="flex items-start gap-3 p-2 rounded hover:bg-muted/50"
                                                                        >
                                                                            <Checkbox
                                                                                checked={selectedPermissions.has(permission.id)}
                                                                                onCheckedChange={() => togglePermission(permission.id)}
                                                                                disabled={permission.category === 'layout'}
                                                                            />
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center gap-2">
                                                                                    {getCategoryIcon(permission.category)}
                                                                                    <span className="font-medium text-sm">
                                                                                        {permission.displayName}
                                                                                    </span>
                                                                                    <Badge 
                                                                                        variant={getActionBadgeVariant(permission.action)}
                                                                                        className="text-xs"
                                                                                    >
                                                                                        {permission.action}
                                                                                    </Badge>
                                                                                </div>
                                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                                    {permission.description}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </CardContent>
                                                        )}
                                                    </Card>
                                                );
                                            })}
                                    </div>
                                </ScrollArea>
                            )}
                        </TabsContent>
                    </div>
                </Tabs>

                <DialogFooter className="p-6 pt-4 border-t">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {stats.total > 0 && (
                                <>
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>{stats.total} permissions selected</span>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                {tCommon('cancel')}
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || !formData.displayName.trim()}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Create Role
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
