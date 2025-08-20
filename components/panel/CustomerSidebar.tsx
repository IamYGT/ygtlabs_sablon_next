"use client";

import LogoutButton from "@/components/panel/LogoutButton";
import { SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCustomerNavigation } from "@/hooks/useCustomerNavigation";
import { useCustomerAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Settings,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function CustomerSidebar() {
  const customer = useCustomerAuth();
  const { open, setCollapsed } = useSidebar();
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [ordersOpen, setOrdersOpen] = useState<boolean>(true);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(true);

  useEffect(() => {
    if (!isMobile) {
      setCollapsed(false);
    }
  }, [isMobile, setCollapsed]);

  // Customer navigation links
  const links = useCustomerNavigation();

  // Group links by category
  const {
    orderItems,
    settingItems,
    otherItems,
    isAnyOrderActive,
    isAnySettingActive,
  } = useMemo(() => {
    const orderKeys = new Set(["orders", "order-history", "track-order"]);
    const settingKeys = new Set(["profile", "settings", "preferences"]);

    const orders = links.filter((l) => orderKeys.has(l.key));
    const settings = links.filter((l) => settingKeys.has(l.key));
    const others = links.filter(
      (l) => !orderKeys.has(l.key) && !settingKeys.has(l.key)
    );

    const orderActive = orders.some((l) => l.href === pathname);
    const settingActive = settings.some((l) => l.href === pathname);

    return {
      orderItems: orders,
      settingItems: settings,
      otherItems: others,
      isAnyOrderActive: orderActive,
      isAnySettingActive: settingActive,
    };
  }, [links, pathname]);

  return (
    <div className="h-screen flex relative" data-sidebar="true">
      <SidebarBody className="justify-between gap-6 md:gap-10 customer-sidebar">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Logo - Responsive */}
          <div className="mb-4 md:mb-6 px-2 flex items-center justify-center">
            {open ? <CustomerLogo /> : <CustomerLogoIcon />}
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
                  "rounded-lg hover:bg-purple-100/50 dark:hover:bg-purple-900/20",
                  open ? "py-2 md:py-2.5 px-3 w-full" : "p-3",
                  link.href === pathname &&
                    "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-l-3 border-purple-600"
                )}
              />
            ))}

            {/* ORDERS Dropdown Group */}
            {orderItems.length > 0 && (
              <div className="mt-1">
                {/* Parent trigger */}
                <button
                  type="button"
                  onClick={() => setOrdersOpen((s) => !s)}
                  className={cn(
                    "flex w-full items-center group/sidebar transition-colors duration-200 rounded-lg",
                    open
                      ? "justify-start gap-2 py-2 md:py-2.5 px-3"
                      : "justify-center p-3",
                    isAnyOrderActive
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20"
                      : "hover:bg-purple-100/50 dark:hover:bg-purple-900/20"
                  )}
                >
                  <ShoppingBag className="text-purple-700 dark:text-purple-300 h-5 w-5 flex-shrink-0" />
                  <motion.span
                    animate={{
                      width: open ? "auto" : 0,
                      opacity: open ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className={cn(
                      "text-sm whitespace-pre overflow-hidden",
                      isAnyOrderActive
                        ? "text-purple-800 dark:text-purple-200 font-semibold"
                        : "text-slate-700 dark:text-slate-200"
                    )}
                  >
                    Siparişlerim
                  </motion.span>
                  {open &&
                    (ordersOpen ? (
                      <ChevronDown className="ml-auto h-4 w-4 opacity-70" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                    ))}
                </button>

                {/* Nested items */}
                {open && ordersOpen && (
                  <div className="mt-1 ml-6 flex flex-col gap-1">
                    {orderItems.map((link) => (
                      <SidebarLink
                        key={link.key}
                        link={link}
                        className={cn(
                          "rounded-md hover:bg-purple-100/50 dark:hover:bg-purple-900/20",
                          "py-1.5 px-2 w-full",
                          link.href === pathname &&
                            "bg-purple-100 dark:bg-purple-900/20"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS Dropdown Group */}
            {settingItems.length > 0 && (
              <div className="mt-1">
                {/* Parent trigger */}
                <button
                  type="button"
                  onClick={() => setSettingsOpen((s) => !s)}
                  className={cn(
                    "flex w-full items-center group/sidebar transition-colors duration-200 rounded-lg",
                    open
                      ? "justify-start gap-2 py-2 md:py-2.5 px-3"
                      : "justify-center p-3",
                    isAnySettingActive
                      ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20"
                      : "hover:bg-purple-100/50 dark:hover:bg-purple-900/20"
                  )}
                >
                  <Settings className="text-purple-700 dark:text-purple-300 h-5 w-5 flex-shrink-0" />
                  <motion.span
                    animate={{
                      width: open ? "auto" : 0,
                      opacity: open ? 1 : 0,
                    }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className={cn(
                      "text-sm whitespace-pre overflow-hidden",
                      isAnySettingActive
                        ? "text-purple-800 dark:text-purple-200 font-semibold"
                        : "text-slate-700 dark:text-slate-200"
                    )}
                  >
                    Ayarlar
                  </motion.span>
                  {open &&
                    (settingsOpen ? (
                      <ChevronDown className="ml-auto h-4 w-4 opacity-70" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                    ))}
                </button>

                {/* Nested items */}
                {open && settingsOpen && (
                  <div className="mt-1 ml-6 flex flex-col gap-1">
                    {settingItems.map((link) => (
                      <SidebarLink
                        key={link.key}
                        link={link}
                        className={cn(
                          "rounded-md hover:bg-purple-100/50 dark:hover:bg-purple-900/20",
                          "py-1.5 px-2 w-full",
                          link.href === pathname &&
                            "bg-purple-100 dark:bg-purple-900/20"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Kullanıcı Profili ve Logout - Responsive */}
        <div
          className={cn(
            "border-t border-purple-200/30 dark:border-purple-700/30 pt-4 px-2",
            !open && "border-t-0 pt-0"
          )}
        >
          {open ? (
            <div className="flex flex-col gap-3">
              {/* Kullanıcı Bilgileri */}
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                  {customer?.name?.charAt(0)?.toUpperCase() || "C"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {customer?.name || "Customer"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {customer?.email}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <LogoutButton />
            </div>
          ) : (
            <div className="flex flex-col gap-2 items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                {customer?.name?.charAt(0)?.toUpperCase() || "C"}
              </div>
              <LogoutButton />
            </div>
          )}
        </div>
      </SidebarBody>
    </div>
  );
}

// Customer Logo Component
const CustomerLogo = () => {
  return (
    <Link
      href="/customer/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-lg flex items-center justify-center">
        <ShoppingCart className="h-5 w-5 text-white" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-pre"
      >
        Customer Panel
      </motion.span>
    </Link>
  );
};

// Customer Logo Icon (Collapsed)
const CustomerLogoIcon = () => {
  return (
    <Link
      href="/customer/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 rounded-lg flex items-center justify-center">
        <ShoppingCart className="h-5 w-5 text-white" />
      </div>
    </Link>
  );
};
