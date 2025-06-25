'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    MoreHorizontal,
    Eye,
    Shield,
    UserMinus,
    UserPlus,
    Trash2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { useTranslations, useLocale } from 'next-intl';
import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';

interface UserWithRoles {
    id: string;
    name: string | null;
    email: string | null;
    isActive: boolean;
    createdAt: Date;
    lastLoginAt: Date | null;
    roleAssignments: Array<{
        id: string;
        isActive: boolean;
        assignedAt: Date;
        role: {
            id: string;
            name: string;
            displayName: string;
            color: string | null;
            priority: number;
        };
    }>;
}

interface Role {
    id: string;
    name: string;
    displayName: string;
    color: string | null;
    priority: number;
}

interface UserActionsCellProps {
    user: UserWithRoles;
    availableRoles: Role[];
    onUserUpdate: () => void;
}

export default function UserActionsCell({ user, availableRoles, onUserUpdate }: UserActionsCellProps) {
    const t = useTranslations('AdminUsers.actionsCell');
    const locale = useLocale();
    const dateLocale = locale === 'tr' ? tr : enUS;

    const [showDetails, setShowDetails] = useState(false);
    const [showRoleManagement, setShowRoleManagement] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>('');

    const handleAssignRole = async () => {
        if (!selectedRole) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/users/assign-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    roleId: selectedRole,
                }),
            });

            if (response.ok) {
                toast.success(t('roleAssignSuccess'));
                setSelectedRole('');
                setShowRoleManagement(false);
                onUserUpdate();
            } else {
                toast.error(t('roleAssignError'));
            }
        } catch (_error) {
            toast.error(t('errorOccurred'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveRole = async (assignmentId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/users/remove-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignmentId }),
            });

            if (response.ok) {
                toast.success(t('roleRemoveSuccess'));
                onUserUpdate();
            } else {
                toast.error(t('roleRemoveError'));
            }
        } catch (_error) {
            toast.error(t('errorOccurred'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleUserStatus = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/users/toggle-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    isActive: !user.isActive
                }),
            });

            if (response.ok) {
                toast.success(user.isActive ? t('userDeactivated') : t('userActivated'));
                onUserUpdate();
            } else {
                toast.error(t('statusUpdateError'));
            }
        } catch (_error) {
            toast.error(t('errorOccurred'));
        } finally {
            setIsLoading(false);
        }
    };

    const assignedRoleIds = user.roleAssignments.map(ra => ra.role.id);
    const unassignedRoles = availableRoles.filter(role => !assignedRoleIds.includes(role.id));

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={isLoading}>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowDetails(true)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t('viewDetails')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowRoleManagement(true)}>
                        <Shield className="mr-2 h-4 w-4" />
                        {t('roleManagement')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleToggleUserStatus}>
                        {user.isActive ? (
                            <>
                                <UserMinus className="mr-2 h-4 w-4" />
                                {t('deactivateUser')}
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                {t('activateUser')}
                            </>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showDetails} onOpenChange={setShowDetails}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{t('userDetailsTitle')}</DialogTitle>
                        <DialogDescription>
                            {user.name || t('unnamedUser')} ({user.email})
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">{t('name')}</label>
                                <p className="text-sm text-muted-foreground">
                                    {user.name || t('notSpecified')}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">{t('email')}</label>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">{t('registrationDate')}</label>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(user.createdAt), 'PPP', { locale: dateLocale })}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">{t('lastLogin')}</label>
                                <p className="text-sm text-muted-foreground">
                                    {user.lastLoginAt
                                        ? format(new Date(user.lastLoginAt), 'PPP p', { locale: dateLocale })
                                        : t('neverLoggedIn')
                                    }
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium">{t('assignedRoles')}</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {user.roleAssignments.length > 0 ? (
                                    user.roleAssignments.map((assignment) => (
                                        <Badge
                                            key={assignment.id}
                                            style={{
                                                backgroundColor: assignment.role.color || '#6366f1',
                                                color: 'white',
                                            }}
                                        >
                                            {assignment.role.displayName}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">{t('noRolesAssigned')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showRoleManagement} onOpenChange={setShowRoleManagement}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('roleManagementTitle')}</DialogTitle>
                        <DialogDescription>{t('roleManagementDesc', { userName: user.name || t('unnamedUser') })}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold">{t('assignedRoles')}</h4>
                            {user.roleAssignments.length > 0 ? (
                                user.roleAssignments.map((assignment) => (
                                    <div key={assignment.id} className="flex items-center justify-between p-2 my-1 bg-gray-100 dark:bg-gray-800 rounded">
                                        <span>{assignment.role.displayName}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveRole(assignment.id)}
                                            disabled={isLoading}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">{t('noRolesAssigned')}</p>
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold">{t('assignNewRole')}</h4>
                            <div className="flex gap-2 mt-2">
                                <Select onValueChange={setSelectedRole} value={selectedRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('selectRolePlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unassignedRoles.map((role) => (
                                            <SelectItem key={role.id} value={role.id}>
                                                {role.displayName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleAssignRole} disabled={isLoading || !selectedRole}>
                                    {t('assign')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
} 