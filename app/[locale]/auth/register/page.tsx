"use client";

import { useState, useCallback, memo } from "react";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, Mail, Lock, User, ArrowRight, Check, X, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Link, useRouter as useLocalizedRouter } from '@/src/i18n/navigation';

// Optimized loading component
const LoadingSpinner = memo(({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <Loader2 className={cn("animate-spin", className)} {...props} />
));
LoadingSpinner.displayName = "LoadingSpinner";

// Password strength indicator
const PasswordStrength = memo(({ password }: { password: string }) => {
    const getStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/\d/.test(pwd)) score++;
        if (/[^a-zA-Z\d]/.test(pwd)) score++;
        return score;
    };

    const strength = getStrength(password);
    const getColor = () => {
        if (strength < 2) return "bg-destructive";
        if (strength < 4) return "bg-yellow-500 dark:bg-yellow-600";
        return "bg-green-500 dark:bg-green-600";
    };

    const getLabel = () => {
        if (strength < 2) return "Zayıf";
        if (strength < 4) return "Orta";
        return "Güçlü";
    };

    if (!password) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 space-y-1"
        >
            <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-1">
                    <motion.div
                        className={cn("h-1 rounded-full transition-all duration-300", getColor())}
                        initial={{ width: 0 }}
                        animate={{ width: `${(strength / 5) * 100}%` }}
                    />
                </div>
                <span className="text-xs text-muted-foreground">{getLabel()}</span>
            </div>
        </motion.div>
    );
});
PasswordStrength.displayName = "PasswordStrength";

const RegisterForm = memo(() => {
    const router = useLocalizedRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    // Toggle password visibility
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const toggleConfirmPasswordVisibility = useCallback(() => {
        setShowConfirmPassword(prev => !prev);
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const toastId = "register-toast";
        toast.loading("Kayıt işlemi yapılıyor...", { id: toastId });

        // Şifre kontrolü
        if (formData.password !== formData.confirmPassword) {
            toast.error("Şifreler eşleşmiyor", { id: toastId });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Kayıt sırasında bir hata oluştu", { id: toastId });
            } else {
                toast.success("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.", { id: toastId });
                setTimeout(() => {
                    // Use localized routing for redirect
                    router.push('/auth/login');
                }, 2000);
            }
        } catch (error) {
            console.error("Kayıt hatası:", error);
            toast.error("Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, [formData, router]);

    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
    const passwordsDontMatch = formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword;

    return (
        <div className="p-6 sm:p-8">
            <CardHeader className="text-center pb-6 px-0">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Hesap Oluşturun
                    </CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">
                        Yeni hesabınızı oluşturmak için bilgilerinizi girin
                    </CardDescription>
                </motion.div>
            </CardHeader>

            <CardContent className="px-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        className="space-y-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Label htmlFor="name" className="text-sm font-medium text-foreground">
                            Ad Soyad
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Adınız ve soyadınız"
                                disabled={loading}
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
                        <Label htmlFor="email" className="text-sm font-medium text-foreground">
                            E-posta Adresi
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="ornek@domain.com"
                                disabled={loading}
                                className="pl-10 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 transition-all duration-200"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className="space-y-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Label htmlFor="password" className="text-sm font-medium text-foreground">
                            Şifre
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
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
                        <PasswordStrength password={formData.password} />
                    </motion.div>

                    <motion.div
                        className="space-y-2"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                            Şifre Tekrar
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                                className={cn(
                                    "pl-10 pr-10 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 transition-all duration-200",
                                    passwordsMatch && "border-green-500 dark:border-green-400",
                                    passwordsDontMatch && "border-destructive"
                                )}
                            />
                            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                {formData.confirmPassword && (
                                    <div className="flex items-center">
                                        {passwordsMatch ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <X className="h-4 w-4 text-destructive" />
                                        )}
                                    </div>
                                )}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-muted/50"
                                    onClick={toggleConfirmPasswordVisibility}
                                    disabled={loading}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        {passwordsDontMatch && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm text-destructive"
                            >
                                Şifreler eşleşmiyor
                            </motion.p>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <Button
                            type="submit"
                            disabled={loading || !passwordsMatch}
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <LoadingSpinner className="mr-2 h-5 w-5" />
                                    Kayıt Olunuyor...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    Kayıt Ol
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </span>
                            )}
                        </Button>
                    </motion.div>

                    <motion.div
                        className="text-center pt-4 border-t border-border"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <p className="text-sm text-muted-foreground">
                            Zaten bir hesabınız var mı?{" "}
                            <Link
                                href="/auth/login"
                                className="font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                Giriş Yap
                            </Link>
                        </p>
                    </motion.div>
                </form>
            </CardContent>
        </div>
    );
});
RegisterForm.displayName = "RegisterForm";

export default function RegisterPage() {
    return <RegisterForm />;
} 