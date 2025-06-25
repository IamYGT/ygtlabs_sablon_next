'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';

import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface Role {
    id: string;
    name: string;
    displayName: string;
    color: string | null;
    priority: number;
}

interface AddUserDialogProps {
    availableRoles: Role[];
    onUserAdded: () => void;
}

interface UserFormData {
    name: string;
    email: string;
    password: string;
    roleIds: string[];
    isActive: boolean;
}

export default function AddUserDialog({ availableRoles, onUserAdded }: AddUserDialogProps) {
    const t = useTranslations('AdminUsers.addUserDialog');
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<UserFormData>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            roleIds: [],
            isActive: true,
        },
    });

    const onSubmit = async (data: UserFormData) => {
        // Manual validation
        if (!data.name || data.name.length < 2) {
            toast.error(t('validation.nameMinLength'));
            return;
        }
        if (!data.email || !data.email.includes('@')) {
            toast.error(t('validation.emailInvalid'));
            return;
        }
        if (!data.password || data.password.length < 6) {
            toast.error(t('validation.passwordMinLength'));
            return;
        }
        if (!data.roleIds || data.roleIds.length === 0) {
            toast.error(t('validation.roleRequired'));
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success(t('notifications.createSuccess'));
                form.reset();
                setOpen(false);
                onUserAdded();
            } else {
                const error = await response.json();
                toast.error(error.message || t('notifications.createError'));
            }
        } catch (_error) {
            toast.error(t('notifications.unexpectedError'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleToggle = (roleId: string, checked: boolean) => {
        const currentRoles = form.getValues('roleIds');
        if (checked) {
            form.setValue('roleIds', [...currentRoles, roleId]);
        } else {
            form.setValue('roleIds', currentRoles.filter(id => id !== roleId));
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t('title')}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>
                        {t('description')}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.nameLabel')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('form.namePlaceholder')} {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.emailLabel')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder={t('form.emailPlaceholder')}
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.passwordLabel')}</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={t('form.passwordPlaceholder')}
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="roleIds"
                            render={() => (
                                <FormItem>
                                    <FormLabel>{t('form.rolesLabel')}</FormLabel>
                                    <div className="space-y-3 max-h-40 overflow-y-auto">
                                        {availableRoles.map((role) => (
                                            <div key={role.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={role.id}
                                                    checked={form.watch('roleIds').includes(role.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleRoleToggle(role.id, checked as boolean)
                                                    }
                                                />
                                                <label
                                                    htmlFor={role.id}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                                                >
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: role.color || '#6366f1' }}
                                                    />
                                                    {role.displayName}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <FormLabel>{t('form.activeUserLabel')}</FormLabel>
                                        <div className="text-sm text-muted-foreground">
                                            {t('form.activeUserDescription')}
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isLoading}
                            >
                                {t('buttons.cancel')}
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? t('buttons.creating') : t('buttons.create')}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 