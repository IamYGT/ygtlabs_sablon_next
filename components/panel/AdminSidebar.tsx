"use client";

import React from "react";
import { SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import {
    LayoutDashboard,
    Users,
    Shield,
    User,
    Lock,
    Unlock,
    Monitor,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/lib/hooks/useAuth";
import LogoutButton from "@/components/panel/LogoutButton";
import { useTranslations } from 'next-intl';

export function AdminSidebar() {
    const admin = useAdminAuth();
    const t = useTranslations('AdminNavigation');
    const { open, locked: _locked, setLocked: _setLocked } = useSidebar();

    const links = [
        {
            label: t('dashboard'),
            href: "/admin/dashboard",
            icon: (
                <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: t('heroSlider'),
            href: "/admin/hero-slider",
            icon: (
                <Monitor className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: t('users'),
            href: "/admin/users",
            icon: (
                <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: t('roles'),
            href: "/admin/roles",
            icon: (
                <Shield className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: t('profile'),
            href: "/admin/profile",
            icon: (
                <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
    ];



    return (
        <div className="h-screen flex relative" data-sidebar="true">
            <SidebarBody className="justify-between gap-6 md:gap-10">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    {/* Logo - Responsive */}
                    <div className="mb-4 md:mb-6 px-2 flex items-center justify-center">
                        {open ? <AdminLogo /> : <AdminLogoIcon />}
                    </div>

                    {/* Navigation Links - Responsive Spacing */}
                    <div className="flex flex-col gap-1 md:gap-2">
                        {links.map((link, idx) => (
                            <SidebarLink
                                key={idx}
                                link={link}
                                className="py-2 md:py-3 px-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom Section - Responsive */}
                <div
                    className="space-y-2 pt-4"
                    onMouseEnter={(e) => e.stopPropagation()}
                    onMouseLeave={(e) => e.stopPropagation()}
                >
                    {/* Admin Info - Sadece görsel */}
                    <div className="flex items-center gap-2 md:gap-3 py-2 px-2">
                        <div className="h-6 w-6 md:h-7 md:w-7 flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <Shield className="h-3 w-3 md:h-4 md:w-4 text-white" />
                        </div>
                        {open && (
                            <span className="text-slate-700 dark:text-slate-200 text-sm md:text-base font-medium">
                                {admin?.name || "Admin"}
                            </span>
                        )}
                    </div>

                    {/* Logout Button - Responsive */}
                    <div
                        className="px-2 relative z-[10001]"
                        onMouseEnter={(e) => e.stopPropagation()}
                        onMouseLeave={(e) => e.stopPropagation()}
                    >
                        <LogoutButton
                            showMultiDeviceOptions={true}
                            variant="ghost"
                            size="sm"
                            iconOnly={!open}
                            className={`w-full text-xs md:text-sm py-2 px-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 ${open ? 'justify-start' : 'justify-center'
                                }`}
                        />
                    </div>
                </div>
            </SidebarBody>
        </div>
    );
}

export const AdminLogo = () => {
    const { open, locked, setLocked } = useSidebar();

    return (
        <div className="flex items-center justify-between w-full">
            <Link
                href="/admin/dashboard"
                className="font-normal flex items-center text-sm text-black py-1 relative z-20"
            >
                <Image
                    src="/logo/mems.png"
                    alt="Memsidea Logo"
                    width={160}
                    height={40}
                    priority
                />
            </Link>

            {/* Kilit Butonu - Sadece Desktop */}
            {open && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => setLocked(!locked)}
                    className={`hidden md:flex p-1.5 rounded-md transition-colors ${locked
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                    title={locked ? "Sidebar Kilitli - Tıkla Aç" : "Sidebar'ı Kilitle"}
                >
                    {locked ? (
                        <Lock className="h-4 w-4 transition-transform scale-110" />
                    ) : (
                        <Unlock className="h-4 w-4 transition-transform" />
                    )}
                </motion.button>
            )}
        </div>
    );
};

export const AdminLogoIcon = () => {
    return (
        <Link
            href="/admin/dashboard"
            className="font-normal flex items-center justify-center text-sm text-black py-1 relative z-20"
        >
            <Image
                src="/logo/memskucuk.png"
                alt="Memsidea Logo Icon"
                width={40}
                height={40}
                priority
            />
        </Link>
    );
}; 