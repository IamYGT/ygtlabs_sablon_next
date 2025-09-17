"use client";

import LogoutButton from "@/components/panel/LogoutButton";
import { SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAdminNavigation } from "@/hooks/useAdminNavigation";
import { useAdminAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Lock, Shield, Unlock } from "lucide-react";

import {
  ChevronDown,
  ChevronRight,
  Languages,
  MessageSquareText,
  Monitor,
  Route,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function AdminSidebar() {
  const admin = useAdminAuth();
  const {
    open,
    locked: _locked,
    setLocked: _setLocked,
    setCollapsed,
  } = useSidebar();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [i18nOpen, setI18nOpen] = useState<boolean>(true);
  const [authOpen, setAuthOpen] = useState<boolean>(true);
  const [websiteOpen, setWebsiteOpen] = useState<boolean>(true);

  useEffect(() => {
    if (!isMobile) {
      setCollapsed(false);
    }
  }, [isMobile, setCollapsed]);

  // 🚀 SÜPER BASİT! Tek satırda tüm navigation'ı hallettik
  const links = useAdminNavigation();

  // i18n grubu, yetkilendirme grubu (users/roles) ve diğer linkleri ayır
  const {
    i18nItems,
    authItems,
    websiteItems,
    otherItems,
    isAnyI18nActive,
    isAnyAuthActive,
    isAnyWebsiteActive,
  } = useMemo(() => {
    const i18nKeys = new Set(["i18nLanguages", "i18nMessages", "i18nRoutes"]);
    const authKeys = new Set(["users", "roles"]);
    const websiteKeys = new Set(["hero-slider", "information", "about"]);

    // permissions öğesini sidebar'dan tamamen kaldır
    const visibleLinks = links.filter((l) => l.key !== "permissions");

    const i18n = visibleLinks.filter((l) => i18nKeys.has(l.key));
    const auth = visibleLinks.filter((l) => authKeys.has(l.key));
    const website = visibleLinks.filter((l) => websiteKeys.has(l.key));
    const others = visibleLinks.filter(
      (l) =>
        !i18nKeys.has(l.key) && !authKeys.has(l.key) && !websiteKeys.has(l.key)
    );

    const i18nActive = i18n.some((l) => l.href === pathname);
    const authActive = auth.some((l) => l.href === pathname);
    const websiteActive = website.some((l) => l.href === pathname);

    return {
      i18nItems: i18n,
      authItems: auth,
      websiteItems: website,
      otherItems: others,
      isAnyI18nActive: i18nActive,
      isAnyAuthActive: authActive,
      isAnyWebsiteActive: websiteActive,
    };
  }, [links, pathname]);

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
            {otherItems.map((link) => (
              <SidebarLink
                key={link.key}
                link={link}
                className={cn(
                  "rounded-lg",
                  open ? "py-2 md:py-2.5 px-3 w-full" : "p-3"
                )}
              />
            ))}

            {/* WEBSITE YÖNETİMİ Dropdown Group */}
            {websiteItems.length > 0 && (
              <div className="mt-1">
                {/* Parent trigger */}
                <button
                  type="button"
                  onClick={() => setWebsiteOpen((s) => !s)}
                  className={cn(
                    "flex w-full items-center group/sidebar transition-colors duration-200 rounded-lg",
                    open
                      ? "justify-start gap-2 py-2 md:py-2.5 px-3"
                      : "justify-center p-3",
                    isAnyWebsiteActive
                      ? "bg-blue-200 dark:bg-slate-700"
                      : "hover:bg-blue-100 dark:hover:bg-slate-700/50"
                  )}
                >
                  <Monitor className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  <motion.span
                    animate={{
                      width: open ? "auto" : 0,
                      opacity: open ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className={cn(
                      "text-sm whitespace-pre overflow-hidden",
                      isAnyWebsiteActive
                        ? "text-slate-800 dark:text-slate-100 font-semibold"
                        : "text-slate-700 dark:text-slate-200"
                    )}
                  >
                    Website Yönetimi
                  </motion.span>
                  {open &&
                    (websiteOpen ? (
                      <ChevronDown className="ml-auto h-4 w-4 opacity-70" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                    ))}
                </button>

                {/* Nested items */}
                {open && websiteOpen && (
                  <div className="mt-1 ml-6 flex flex-col gap-1">
                    {websiteItems.map((link) => (
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

            {/* YETKILENDIRME Dropdown Group */}
            {authItems.length > 0 && (
              <div className="mt-1">
                {/* Parent trigger */}
                <button
                  type="button"
                  onClick={() => setAuthOpen((s) => !s)}
                  className={cn(
                    "flex w-full items-center group/sidebar transition-colors duration-200 rounded-lg",
                    open
                      ? "justify-start gap-2 py-2 md:py-2.5 px-3"
                      : "justify-center p-3",
                    isAnyAuthActive
                      ? "bg-blue-200 dark:bg-slate-700"
                      : "hover:bg-blue-100 dark:hover:bg-slate-700/50"
                  )}
                >
                  <Shield className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  <motion.span
                    animate={{
                      width: open ? "auto" : 0,
                      opacity: open ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className={cn(
                      "text-sm whitespace-pre overflow-hidden",
                      isAnyAuthActive
                        ? "text-slate-800 dark:text-slate-100 font-semibold"
                        : "text-slate-700 dark:text-slate-200"
                    )}
                  >
                    Yetkilendirme
                  </motion.span>
                  {open &&
                    (authOpen ? (
                      <ChevronDown className="ml-auto h-4 w-4 opacity-70" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                    ))}
                </button>

                {/* Nested items */}
                {open && authOpen && (
                  <div className="mt-1 ml-6 flex flex-col gap-1">
                    {authItems.map((link) => (
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

            {/* DİLLER Dropdown Group */}
            {i18nItems.length > 0 && (
              <div className="mt-1">
                {/* Parent trigger */}
                <button
                  type="button"
                  onClick={() => setI18nOpen((s) => !s)}
                  className={cn(
                    "flex w-full items-center group/sidebar transition-colors duration-200 rounded-lg",
                    open
                      ? "justify-start gap-2 py-2 md:py-2.5 px-3"
                      : "justify-center p-3",
                    isAnyI18nActive
                      ? "bg-blue-200 dark:bg-slate-700"
                      : "hover:bg-blue-100 dark:hover:bg-slate-700/50"
                  )}
                >
                  <Languages className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  <motion.span
                    animate={{
                      width: open ? "auto" : 0,
                      opacity: open ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className={cn(
                      "text-sm whitespace-pre overflow-hidden",
                      isAnyI18nActive
                        ? "text-slate-800 dark:text-slate-100 font-semibold"
                        : "text-slate-700 dark:text-slate-200"
                    )}
                  >
                    Diller
                  </motion.span>
                  {open &&
                    (i18nOpen ? (
                      <ChevronDown className="ml-auto h-4 w-4 opacity-70" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                    ))}
                </button>

                {/* Nested items */}
                {open && i18nOpen && (
                  <div className="mt-1 ml-6 flex flex-col gap-1">
                    {i18nItems.map((link) => {
                      const iconEl =
                        link.key === "i18nLanguages" ? (
                          <Languages className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                        ) : link.key === "i18nMessages" ? (
                          <MessageSquareText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                        ) : (
                          <Route className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                        );
                      return (
                        <SidebarLink
                          key={link.key}
                          link={{ ...link, icon: iconEl }}
                          className={cn("rounded-md", "py-1.5 px-2 w-full")}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
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
          src="/logo/memghjfs.png"
          alt=" Logo"
          width={160}
          height={40}
          priority
          className="dark:hidden"
        />
        <Image
          src="/logo/dfgfd.png"
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
        src="/logo/.png"
        alt=" Logo Icon"
        width={48}
        height={48}
        priority
      />
    </Link>
  );
};
