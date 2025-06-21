"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
  locked: boolean;
  setLocked: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const [locked, setLocked] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate, locked, setLocked }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = ({
  className,
  children,
  ...restProps
}: {
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof motion.div>, 'className' | 'children'>) => {
  const { open, setOpen, animate, locked } = useSidebar();

  return (
    <>
      {/* Desktop Sidebar - Sadece desktop'ta görünür */}
      <motion.div
        className={cn(
          "h-full px-3 md:px-4 py-3 md:py-4 hidden md:flex md:flex-col bg-blue-100 dark:bg-slate-800 flex-shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "280px" : "60px") : "280px",
        }}
        onMouseEnter={() => !locked && setOpen(true)}
        onMouseLeave={() => !locked && setOpen(false)}
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
              <div className="mt-8">
                {children}
              </div>
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
  const { open, setOpen, animate, locked } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-3 md:px-4 py-3 md:py-4 hidden md:flex md:flex-col bg-blue-100 dark:bg-slate-800 flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "280px" : "60px") : "280px",
      }}
      onMouseEnter={() => !locked && setOpen(true)}
      onMouseLeave={() => !locked && setOpen(false)}
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
                "fixed h-full w-80 max-w-[85vw] left-0 top-0 bg-blue-100 dark:bg-neutral-900 p-6 z-[100] flex flex-col justify-between shadow-xl",
                className
              )}
            >
              {/* Close Button */}
              <div
                className="absolute right-4 top-4 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="mt-8">
                {children}
              </div>
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
  const { open, animate } = useSidebar();
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-3 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 ease-out",
        className
      )}
      {...props}
    >
      {/* İkon */}
      <div className="flex-shrink-0 transition-transform duration-200 group-hover/sidebar:scale-105">
        {link.icon}
      </div>

      {/* Label */}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="text-neutral-700 dark:text-neutral-200 text-sm md:text-base group-hover/sidebar:text-neutral-900 dark:group-hover/sidebar:text-neutral-100 transition-colors duration-200 whitespace-pre inline-block !p-0 !m-0 font-medium"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
