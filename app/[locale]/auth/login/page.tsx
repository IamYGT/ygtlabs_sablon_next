"use client";

import React, { useState, Suspense, useCallback, memo } from 'react';
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from '@/src/i18n/navigation';
import { useTranslations } from 'next-intl';

// Optimized loading component
const LoadingSpinner = memo(({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <Loader2 className={cn("animate-spin", className)} {...props} />
));
LoadingSpinner.displayName = "LoadingSpinner";

// Optimized login form with memoization
const UnifiedAuthLoginForm = memo(() => {
    const t = useTranslations('Auth');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const params = useParams();
    const locale = (params.locale as string) || 'en';

    // URL'den logout parametresini kontrol et ve form state'ini temizle
    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('t')) {
            // Logout sonrası geldiyse form'u temizle
            setFormData({ email: "", password: "" });
            setLoading(false);
        }
    }, []);

    // Memoized change handler
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    // Toggle password visibility
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    // Memoized submit handler
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        const toastId = "login-toast";
        toast.loading(t('loggingIn'), { id: toastId });

        try {
            const response = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
                credentials: "include",
            });

            const result = await response.json();

            if (result.success) {
                toast.success(t('loginSuccessRedirect'), { id: toastId });

                // Form state'ini temizle
                setFormData({ email: "", password: "" });
                setLoading(false);

                // Check if user has admin access permission
                const hasAdminAccess = result.user.permissions?.includes('layout.admin.access') ||
                    result.user.userRoles?.includes('super_admin');

                // Redirect to appropriate dashboard with proper i18n routing
                const dashboardPath = hasAdminAccess ? '/admin/dashboard' : '/users/dashboard';
                const dashboardUrl = locale === 'en' ? dashboardPath : `/${locale}${dashboardPath}`;

                // Hard redirect ile tam geçiş
                window.location.replace(dashboardUrl);
            } else {
                toast.error(result.error || t('loginFailed'), { id: toastId });
                setLoading(false);
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error(t('unexpectedError'), { id: toastId });
            setLoading(false);
        }
    }, [formData.email, formData.password, loading, locale, t]);

    return (
        <div className="p-4 sm:p-6">
            <CardContent className="px-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div
                        className="space-y-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
                            {t('emailLabel')}
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder={t('emailPlaceholder')}
                                disabled={loading}
                                value={formData.email}
                                onChange={handleChange}
                                className="pl-10 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 transition-all duration-200"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="space-y-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                {t('passwordLabel')}
                            </Label>
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                {t('forgotPassword')}
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                disabled={loading}
                                value={formData.password}
                                onChange={handleChange}
                                className="pl-10 pr-10 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 transition-all duration-200"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
                                onClick={togglePasswordVisibility}
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Button
                            type="submit"
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <LoadingSpinner className="mr-2 h-5 w-5" />
                                    {t('loggingIn')}
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    {t('login')}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </motion.div>

                    <motion.div
                        className="text-center pt-4 border-t border-border"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <p className="text-sm text-muted-foreground">
                            {t('noAccount')}{" "}
                            <Link
                                href="/auth/register"
                                className="font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                {t('register')}
                            </Link>
                        </p>
                    </motion.div>
                </form>
            </CardContent>
        </div>
    );
});
UnifiedAuthLoginForm.displayName = "UnifiedAuthLoginForm";

// Client-side component with optimizations
function LoginPageClient() {
    return <UnifiedAuthLoginForm />;
}

// Main page component with Suspense
export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center p-8">
                <LoadingSpinner className="h-8 w-8" />
            </div>
        }>
            <LoginPageClient />
        </Suspense>
    );
}