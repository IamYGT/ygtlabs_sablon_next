"use client";

import Link from "next/link";
import React, { useState, Suspense, useCallback, memo } from 'react';
import { toast } from "sonner";
import Logo from "@/app/[locale]/components/Logo";
import { useSearchParams } from "next/navigation";
// Auth provider imports removed - using direct API calls

// Shadcn bileşenleri
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { GuestGuard } from "@/app/[locale]/components/AuthGuards";

// Optimized loading component
const LoadingSpinner = memo(({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <Loader2 className={cn("animate-spin", className)} {...props} />
));
LoadingSpinner.displayName = "LoadingSpinner";

// Loading fallback component
const LoadingFallback = memo(() => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
        <div className="w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Yükleniyor...</h1>
                <div className="mt-4 flex justify-center">
                    <LoadingSpinner className="h-8 w-8" />
                </div>
            </div>
        </div>
    </div>
));
LoadingFallback.displayName = "LoadingFallback";

// Optimized login form with memoization
const UnifiedAuthLoginForm = memo(() => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });

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

    // Memoized submit handler
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        const toastId = "login-toast";
        toast.loading("Giriş yapılıyor...", { id: toastId });

        try {
            // Get locale from pathname
            const locale = window.location.pathname.split('/')[1] || 'tr';

            const response = await fetch(`/${locale}/api/auth/login`, {
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
                toast.success("Giriş başarılı! Yönlendiriliyorsunuz...", { id: toastId });

                // Form state'ini temizle
                setFormData({ email: "", password: "" });
                setLoading(false);

                // Check if user has admin access permission
                const hasAdminAccess = result.user.permissions?.includes('layout.admin.access') ||
                    result.user.userRoles?.includes('super_admin');

                // Redirect to appropriate dashboard with locale
                const dashboardUrl = hasAdminAccess
                    ? `/${locale}/admin/dashboard`
                    : `/${locale}/users/dashboard`;

                // Hard redirect ile tam geçiş
                window.location.replace(dashboardUrl);
            } else {
                toast.error(result.error || "Giriş başarısız", { id: toastId });
                setLoading(false);
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Beklenmeyen bir hata oluştu.", { id: toastId });
            setLoading(false);
        }
    }, [formData.email, formData.password, loading]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="ornek@adres.com"
                    disabled={loading}
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Şifre</Label>
                    <Link href="#" className="text-sm font-medium text-primary hover:underline">
                        Şifremi Unuttum
                    </Link>
                </div>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={loading}
                size="lg"
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <LoadingSpinner className="mr-2 h-5 w-5" />
                        Giriş Yapılıyor...
                    </span>
                ) : (
                    "Giriş Yap"
                )}
            </Button>
        </form>
    );
});
UnifiedAuthLoginForm.displayName = "UnifiedAuthLoginForm";

// Optimized login page header
const LoginHeader = memo(() => (
    <div className="text-center flex flex-col items-center justify-center">
        <div className="mb-6">
            <Logo width={180} height={60} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-primary">
            Admin Paneline Giriş
        </h1>
    </div>
));
LoginHeader.displayName = "LoginHeader";

// Optimized footer
const LoginFooter = memo(() => (
    <div className="text-center text-xs text-muted-foreground pt-6">
        <p>&copy; {new Date().getFullYear()} Dünya Ekonomi. Tüm hakları saklıdır.</p>
    </div>
));
LoginFooter.displayName = "LoginFooter";

// Client-side component with optimizations
function LoginPageClient() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="w-full max-w-md space-y-6">
                <LoginHeader />

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Giriş Yap</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Hesabınıza erişmek için bilgilerinizi girin.
                            {callbackUrl !== '/dashboard' && (
                                <div className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                                    Giriş yaptıktan sonra istediğiniz sayfaya yönlendirileceksiniz.
                                </div>
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UnifiedAuthLoginForm />
                    </CardContent>
                    <CardFooter className="flex flex-col items-center justify-center gap-2 border-t pt-6">
                        <div className="text-sm text-muted-foreground">
                            Hesabınız yok mu?{' '}
                            <Link href="/auth/register" className="font-semibold text-primary hover:underline">
                                Hemen Kayıt Olun
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                <LoginFooter />
            </div>
        </div>
    );
}

// Main page component with optimized Suspense
export default function LoginPage() {
    return (
        <GuestGuard>
            <Suspense fallback={<LoadingFallback />}>
                <LoginPageClient />
            </Suspense>
        </GuestGuard>
    );
}