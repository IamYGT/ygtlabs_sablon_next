"use client";

import {
  useSetSidebarCollapsed,
  useSetSidebarOpen,
  useToggleSidebar,
  useToggleSidebarCollapse,
  useUIStore,
} from "@/lib/stores/ui-store";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React, { ComponentType } from "react";

interface Links {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }> | React.ReactElement;
}

// Zustand-based sidebar hook - Optimized to prevent infinite loops
export const useSidebar = () => {
  const sidebar = useUIStore((state) => state.sidebar);
  const setSidebarOpen = useSetSidebarOpen();
  const toggleSidebar = useToggleSidebar();
  const setSidebarCollapsed = useSetSidebarCollapsed();
  const toggleSidebarCollapse = useToggleSidebarCollapse();

  return {
    open: sidebar.isOpen,
    setOpen: setSidebarOpen,
    toggle: toggleSidebar,
    collapsed: sidebar.isCollapsed,
    setCollapsed: setSidebarCollapsed,
    toggleCollapsed: toggleSidebarCollapse,
    // Compatibility props for existing code
    animate: true,
    locked: sidebar.isCollapsed, // Use collapsed state as locked
    setLocked: setSidebarCollapsed,
  };
};

// Simple wrapper component - no provider needed with Zustand
export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};

export const Sidebar = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const SidebarBody = ({
  className,
  children,
  ...restProps
}: {
  className?: string;
  children: React.ReactNode;
} & Omit<
  React.ComponentProps<typeof motion.div>,
  "className" | "children"
>) => {
  const { open, setOpen, collapsed } = useSidebar();

  return (
    <>
      {/* Desktop Sidebar - Sadece desktop'ta görünür */}
      <motion.div
        className={cn(
          "h-full px-3 md:px-4 py-3 md:py-4 hidden md:flex md:flex-col bg-blue-100 dark:bg-slate-800 flex-shrink-0",
          className
        )}
        animate={{
          width: open ? "280px" : "80px",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        onMouseEnter={() => !collapsed && setOpen(true)}
        onMouseLeave={() => !collapsed && setOpen(false)}
        {...restProps}
      >
        {children}
      </motion.div>

      {/* Mobile Overlay Sidebar - Sadece mobilde görünür */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop - Sadece mobilde */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[90] md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-80 max-w-[85vw] left-0 top-0 bg-blue-50 dark:bg-slate-800 p-6 z-[100] flex flex-col justify-between shadow-xl md:hidden",
                className
              )}
            >
              {/* Close Button */}
              <div
                className="absolute right-4 top-4 z-50 text-slate-800 dark:text-slate-200 cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="mt-8">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, collapsed } = useSidebar();

  return (
    <motion.div
      className={cn(
        "h-full px-3 md:px-4 py-3 md:py-4 hidden md:flex md:flex-col bg-blue-100 dark:bg-slate-800 flex-shrink-0",
        className
      )}
      animate={{
        width: open ? "280px" : "80px",
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      onMouseEnter={() => !collapsed && setOpen(true)}
      onMouseLeave={() => !collapsed && setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ..._props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();

  return (
    <>
      {/* Mobile Overlay Sidebar - Hamburger menü AdminHeader'da */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[90] md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-80 max-w-[85vw] left-0 top-0 bg-blue-50 dark:bg-slate-800 p-6 z-[100] flex flex-col justify-between shadow-xl md:hidden",
                className
              )}
            >
              {/* Close Button */}
              <div
                className="absolute right-4 top-4 z-50 text-slate-800 dark:text-slate-200 cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="mt-8">{children}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname === link.href;

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center group/sidebar transition-colors duration-200",
        open ? "justify-start gap-2" : "justify-center",
        isActive
          ? "bg-blue-200 dark:bg-slate-700"
          : "hover:bg-blue-100 dark:hover:bg-slate-700/50",
        className
      )}
      {...props}
    >
      {React.isValidElement(link.icon) ? (
        link.icon
      ) : (
        <link.icon className="h-5 w-5 flex-shrink-0 text-slate-500 dark:text-slate-400 group-hover/sidebar:text-slate-700 dark:group-hover/sidebar:text-slate-200" />
      )}

      <motion.span
        animate={{
          width: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        className={cn(
          "text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre !p-0 !m-0 overflow-hidden",
          isActive
            ? "text-slate-800 dark:text-slate-100 font-semibold"
            : "text-slate-700 dark:text-slate-200"
        )}
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
