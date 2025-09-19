"use client";

import LogoutButton from "@/components/panel/LogoutButton";
import { SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAdminNavigation } from "@/hooks/useAdminNavigation";
import { useAdminAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  ChevronDown,
  ChevronRight,
  Building2,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function AdminSidebar() {
  const admin = useAdminAuth();
  const t = useTranslations("AdminSidebar");
  const {
    open,
    locked: _locked,
    setLocked: _setLocked,
    setCollapsed,
    setOpen,
  } = useSidebar();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [crmOpen, setCrmOpen] = useState<boolean>(true);
  const [systemOpen, setSystemOpen] = useState<boolean>(true);

  useEffect(() => {
    if (!isMobile) {
      // Başlangıçta sidebar'ı geniş ve kilitli yap
      setCollapsed(true); // true = kilitli (sabit açık)
      setOpen(true); // açık
    }
  }, [isMobile, setCollapsed, setOpen]);

  // 🚀 SÜPER BASİT! Tek satırda tüm navigation'ı hallettik
  const { crmItems, systemItems, otherItems } = useAdminNavigation();

  // Sadece dashboard ve profile'ı diğer öğeler olarak ayır
  const {
    finalOtherItems,
    isAnyCrmActive,
    isAnySystemActive,
  } = useMemo(() => {
    // Sadece dashboard ve profile'ı diğer öğeler olarak bırak
    const otherKeys = new Set(["dashboard", "profile"]);
    const visibleLinks = otherItems.filter((l) => otherKeys.has(l.key));

    const crmActive = crmItems.some((l) => l.href === pathname);
    const systemActive = systemItems.some((l) => l.href === pathname);

    return {
      finalOtherItems: visibleLinks,
      isAnyCrmActive: crmActive,
      isAnySystemActive: systemActive,
    };
  }, [otherItems, pathname, crmItems, systemItems]);

  return (
    <div className="h-screen flex relative" data-sidebar="true">
      <SidebarBody className="justify-between gap-6 md:gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Logo - Responsive */}
          <div className="mb-4 md:mb-6 px-2 flex items-center justify-center">
            {open ? <AdminLogo /> : <AdminLogoIcon />}
          </div>

          {/* Navigation Links - Responsive Spacing */}
          <div
            className={cn(
              "flex flex-col gap-1 md:gap-2",
              open ? "px-2" : "items-center"
            )}
          >
            {/* CRM Dropdown Group */}
            {crmItems.length > 0 && (
              <div className="mt-1">
                {/* Parent trigger */}
                <button
                  type="button"
                  onClick={() => setCrmOpen((s) => !s)}
                  className={cn(
                    "flex w-full items-center group/sidebar transition-colors duration-200 rounded-lg",
                    open
                      ? "justify-start gap-2 py-2 md:py-2.5 px-3"
                      : "justify-center p-3",
                    isAnyCrmActive
                      ? "bg-blue-200 dark:bg-slate-700"
                      : "hover:bg-blue-100 dark:hover:bg-slate-700/50"
                  )}
                >
                  <Building2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  <motion.span
                    animate={{
                      width: open ? "auto" : 0,
                      opacity: open ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className={cn(
                      "text-sm whitespace-pre overflow-hidden",
                      isAnyCrmActive
                        ? "text-slate-800 dark:text-slate-100 font-semibold"
                        : "text-slate-700 dark:text-slate-200"
                    )}
                  >
                    {t("customerManagement")}
                  </motion.span>
                  {open &&
                    (crmOpen ? (
                      <ChevronDown className="ml-auto h-4 w-4 opacity-70" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                    ))}
                </button>

                {/* Nested CRM items */}
                {open && crmOpen && (
                  <div className="mt-1 ml-6 flex flex-col gap-1">
                    {crmItems.map((link) => (
                      <SidebarLink
                        key={link.key}
                        link={link}
                        className={cn("rounded-md", "py-1.5 px-2 w-full")}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sistem Yönetimi Dropdown Group */}
            {systemItems.length > 0 && (
              <div className="mt-1">
                {/* Parent trigger */}
                <button
                  type="button"
                  onClick={() => setSystemOpen((s) => !s)}
                  className={cn(
                    "flex w-full items-center group/sidebar transition-colors duration-200 rounded-lg",
                    open
                      ? "justify-start gap-2 py-2 md:py-2.5 px-3"
                      : "justify-center p-3",
                    isAnySystemActive
                      ? "text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <Settings className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                  {open && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: open ? 1 : 0,
                      }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className={cn(
                        "text-sm whitespace-pre overflow-hidden",
                        isAnySystemActive
                          ? "text-slate-800 dark:text-slate-100 font-semibold"
                          : "text-slate-700 dark:text-slate-200"
                      )}
                    >
                      {t("systemManagement")}
                    </motion.span>
                  )}
                  {open &&
                    (systemOpen ? (
                      <ChevronDown className="ml-auto h-4 w-4 opacity-70" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                    ))}
                </button>

                {/* Nested Sistem items */}
                {open && systemOpen && (
                  <div className="mt-1 ml-6 flex flex-col gap-1">
                    {systemItems.map((link) => (
                      <SidebarLink
                        key={link.key}
                        link={link}
                        className={cn("rounded-md", "py-1.5 px-2 w-full")}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {finalOtherItems.map((link) => (
              <SidebarLink
                key={link.key}
                link={link}
                className={cn(
                  "rounded-lg",
                  open ? "py-2 md:py-2.5 px-3 w-full" : "p-3"
                )}
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
              <Building2 className="h-3 w-3 md:h-4 md:w-4 text-white" />
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
              className={`w-full text-xs md:text-sm py-2 px-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 ${
                open ? "justify-start" : "justify-center"
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
          src="/logo/logo.png"
          alt=" Logo"
          width={160}
          height={40}
          priority
          className="dark:hidden"
        />
        <Image
          src="/logo/logo.png"
          alt=" Logo"
          width={160}
          height={40}
          priority
          className="hidden dark:block"
        />
      </Link>

      {/* Kilit Butonu - Sadece Desktop */}
      {open && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => setLocked(!locked)}
          className={`hidden md:flex p-1.5 rounded-md transition-colors ${
            locked
              ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
              : "hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
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
      className="font-normal flex items-center justify-center text-sm text-black py-1 relative z-20 w-full"
    >
      <Image
        src="/logo/logo.png"
        alt=" Logo Icon"
        width={48}
        height={48}
        priority
      />
    </Link>
  );
};
