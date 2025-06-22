"use client";

import React, { useState, useCallback, memo } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2, Mail, ArrowLeft, Check, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from '@/src/i18n/navigation';

// Optimized loading component
const LoadingSpinner = memo(({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <Loader2 className={cn("animate-spin", className)} {...props} />
));
LoadingSpinner.displayName = "LoadingSpinner";

// Success state component
const SuccessState = memo(({ email, onReset }: { email: string; onReset: () => void }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
    >
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>

        <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
                E-posta Gönderildi
            </h2>
            <p className="text-muted-foreground text-sm">
                Şifre sıfırlama bağlantısı <span className="font-medium text-foreground">{email}</span> adresine gönderildi.
            </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Sonraki Adımlar:</p>
                    <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                        <li>• E-posta kutunuzu kontrol edin</li>
                        <li>• Spam klasörünü de kontrol etmeyi unutmayın</li>
                        <li>• Bağlantıya tıklayarak şifrenizi sıfırlayın</li>
                        <li>• Bağlantı 15 dakika boyunca geçerlidir</li>
                    </ul>
                </div>
            </div>
        </div>

        <div className="flex flex-col space-y-3">
            <Button
                onClick={onReset}
                variant="outline"
                className="w-full"
            >
                Tekrar Gönder
            </Button>

            <Link href="/auth/login">
                <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Giriş Sayfasına Dön
                </Button>
            </Link>
        </div>
    </motion.div>
));
SuccessState.displayName = "SuccessState";

// Main forgot password form
const ForgotPasswordForm = memo(() => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        const toastId = "forgot-password-toast";
        toast.loading("E-posta gönderiliyor...", { id: toastId });

        try {
            const response = await fetch(`/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
                credentials: "include",
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Şifre sıfırlama e-postası gönderildi!", { id: toastId });
                setSubmittedEmail(email);
                setIsSubmitted(true);
            } else {
                toast.error(result.error || "E-posta gönderilirken bir hata oluştu", { id: toastId });
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error("Beklenmeyen bir hata oluştu.", { id: toastId });
        } finally {
            setLoading(false);
        }
    }, [email, loading]);

    const handleReset = useCallback(() => {
        setIsSubmitted(false);
        setSubmittedEmail("");
        setEmail("");
    }, []);

    if (isSubmitted) {
        return <SuccessState email={submittedEmail} onReset={handleReset} />;
    }

    return (
        <div className="p-6 sm:p-8">
            <CardHeader className="text-center pb-6 px-0">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Şifremi Unuttum
                    </CardTitle>
                    <CardDescription className="mt-2 text-muted-foreground">
                        E-posta adresinizi girin, şifre sıfırlama bağlantısını size gönderelim
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
                                placeholder="ornek@adres.com"
                                disabled={loading}
                                value={email}
                                onChange={handleEmailChange}
                                className="pl-10 h-12 bg-background border-border focus:border-primary focus:ring-primary/20 transition-all duration-200"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Kayıtlı e-posta adresinizi girin. Size şifre sıfırlama bağlantısı göndereceğiz.
                        </p>
                    </motion.div>

                    <motion.div
                        className="space-y-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Button
                            type="submit"
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                            disabled={loading || !email.trim()}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <LoadingSpinner className="mr-2 h-5 w-5" />
                                    E-posta Gönderiliyor...
                                </span>
                            ) : (
                                "Şifre Sıfırlama E-postası Gönder"
                            )}
                        </Button>

                        <Link href="/auth/login">
                            <Button
                                variant="ghost"
                                className="w-full h-12 text-muted-foreground hover:text-foreground transition-colors"
                                disabled={loading}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Giriş Sayfasına Dön
                            </Button>
                        </Link>
                    </motion.div>
                </form>

                <motion.div
                    className="mt-8 p-4 bg-muted/50 rounded-lg border border-border"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-muted-foreground">
                            <p className="font-medium mb-1">Güvenlik Bildirimi:</p>
                            <p>
                                Şifre sıfırlama bağlantısı güvenlik nedeniyle 15 dakika sonra geçersiz olacaktır.
                                E-posta almadıysanız spam klasörünüzü kontrol edin.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </CardContent>
        </div>
    );
});
ForgotPasswordForm.displayName = "ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
} 