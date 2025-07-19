'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { KeyRound, Save } from 'lucide-react';

const passwordFormSchema = (t: (key: string) => string) => z.object({
    currentPassword: z.string().min(1, { message: t('security.validation.currentPasswordRequired') }),
    newPassword: z.string().min(8, { message: t('security.validation.newPasswordMinLength') }),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: t('security.validation.passwordsDoNotMatch'),
    path: ['confirmPassword']
});


export default function ChangePasswordForm() {
    const t = useTranslations('AdminProfile');
    const [isLoading, setIsLoading] = useState(false);

    type PasswordFormValues = z.infer<ReturnType<typeof passwordFormSchema>>;

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema(t)),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (data: PasswordFormValues) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || t('security.passwordUpdateError'));
            }

            toast.success(t('security.passwordUpdateSuccess'));
            form.reset();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : t('security.passwordUpdateError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-sm">
                        <KeyRound className="h-4 w-4" />
                    </div>
                    {t('security.changePasswordTitle')}
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400 ml-11">
                    {t('security.changePasswordDescription')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('security.currentPassword')}</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} placeholder="********" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('security.newPassword')}</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} placeholder="********" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('security.confirmNewPassword')}</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} placeholder="********" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end pt-2">
                             <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        {t('security.updating')}
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        {t('security.updatePasswordButton')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
} 