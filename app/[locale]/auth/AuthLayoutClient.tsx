"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/panel/ThemeToggle';
import LanguageSwitcher from '@/components/panel/LanguageSwitcher';
import Logo from '@/components/panel/Logo';
import { Card } from '@/components/ui/card';
import { Toaster } from 'sonner';
import { useTranslations } from 'next-intl';

interface AuthLayoutClientProps {
    children: React.ReactNode;
}

export function AuthLayoutClient({ children }: AuthLayoutClientProps) {
    const t = useTranslations('AuthLayout');
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2393c5fd' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                />

                {/* Floating shapes */}
                <motion.div
                    className="absolute top-20 left-20 w-72 h-72 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-96 h-96 bg-slate-200/30 dark:bg-slate-500/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Navigation Bar */}
            <nav className="relative z-10 flex items-center justify-between p-6 lg:p-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center space-x-3"
                >
                    <Logo />
                    <div className="hidden sm:block">
                        <h1 className="text-xl font-bold text-foreground">{t('pageTitle')}</h1>
                        <p className="text-sm text-muted-foreground">{t('pageSubtitle')}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex items-center space-x-3"
                >
                    <LanguageSwitcher />
                    <ThemeToggle />
                </motion.div>
            </nav>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    <Card className="bg-card/80 dark:bg-card/90 backdrop-blur-xl border-border/50 shadow-2xl shadow-blue-500/5 dark:shadow-slate-900/20">
                        {children}
                    </Card>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 text-center py-6 text-sm text-muted-foreground">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    {t('copyright')}
                </motion.p>
            </footer>

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'hsl(var(--card))',
                        color: 'hsl(var(--card-foreground))',
                        border: '1px solid hsl(var(--border))',
                    },
                }}
            />
        </div>
    );
} 