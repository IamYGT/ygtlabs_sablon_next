"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { ChevronDown, LogOut, Monitor, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLogoutModal } from "./LogoutModalProvider";

interface LogoutButtonProps {
  className?: string;
  variant?:
    | "outline"
    | "ghost"
    | "default"
    | "destructive"
    | "secondary"
    | "link"
    | null
    | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
  isMenuMode?: boolean; // Dropdown menu'de mi kullanılıyor
  showMultiDeviceOptions?: boolean; // Çoklu cihaz seçeneklerini göster
  iconOnly?: boolean; // Sadece icon göster (collapsed sidebar için)
  dataScope?: "admin" | "customer";
}

export default function LogoutButton({
  className,
  variant = "outline",
  size = "sm",
  isMenuMode = false,
  showMultiDeviceOptions = false,
  iconOnly = false,
  dataScope,
}: LogoutButtonProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [itemClicked, setItemClicked] = useState(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const { setOpen: setSidebarOpen, locked } = useSidebar();
  const { showLogoutModal } = useLogoutModal();
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("AdminHeader");
  const tLogout = useTranslations("LogoutModal");

  // Mouse pozisyonunu takip et (useRef ile)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Mouse pozisyonunu kontrol et
  const isMouseOverSidebar = useCallback(() => {
    const sidebarElement = document.querySelector('[data-sidebar="true"]');
    if (!sidebarElement) return false;
    const rect = sidebarElement.getBoundingClientRect();
    return (
      lastMousePosition.current.x >= rect.left &&
      lastMousePosition.current.x <= rect.right &&
      lastMousePosition.current.y >= rect.top &&
      lastMousePosition.current.y <= rect.bottom
    );
  }, []);

  // Dropdown kapandığında sidebar'ı da kapat (eğer kilitli değilse ve mouse sidebar dışındaysa)
  const handleDropdownOpenChange = useCallback(
    (open: boolean) => {
      setDropdownOpen(open);

      if (!open && !locked) {
        if (itemClicked) {
          setItemClicked(false);
          return;
        }
        setTimeout(() => {
          if (!isMouseOverSidebar()) {
            setSidebarOpen(false);
          }
        }, 150);
      }
    },
    [locked, itemClicked, isMouseOverSidebar, setSidebarOpen]
  );

  const handleMenuItemClick = (logoutType: "current" | "all") => {
    setItemClicked(true);
    setDropdownOpen(false);

    // Modal'ı aç ve sidebar'ı kapat
    showLogoutModal(logoutType);
    if (!locked) {
      setSidebarOpen(false);
    }
  };

  const handleSimpleLogout = () => {
    // Modal'ı aç ve sidebar'ı kapat
    showLogoutModal("current");
    if (!locked) {
      setSidebarOpen(false);
    }
  };

  // Basit logout butonu (eski davranış)
  if (!showMultiDeviceOptions) {
    return (
      <Button
        type="button"
        variant={isMenuMode ? "ghost" : variant}
        size={iconOnly ? "icon" : isMenuMode ? "sm" : size}
        onClick={handleSimpleLogout}
        className={`${className} ${iconOnly ? "min-w-[40px] h-10 p-0" : ""}`}
        title={iconOnly ? t("logout") : undefined}
      >
        <LogOut className={`h-4 w-4 ${!iconOnly ? "mr-2" : "flex-shrink-0"}`} />
        {!iconOnly && (isMenuMode ? t("logout") : t("logout"))}
      </Button>
    );
  }

  // Çoklu cihaz seçenekleri ile dropdown
  return (
    <div ref={containerRef}>
      <DropdownMenu open={dropdownOpen} onOpenChange={handleDropdownOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant={isMenuMode ? "ghost" : variant}
            size={iconOnly ? "icon" : isMenuMode ? "sm" : size}
            className={`${className} ${
              iconOnly ? "min-w-[40px] h-10 p-0" : ""
            }`}
            title={iconOnly ? t("logoutOptions") : undefined}
          >
            <LogOut
              className={`h-4 w-4 ${!iconOnly ? "mr-2" : "flex-shrink-0"}`}
            />
            {!iconOnly && (
              <>
                {isMenuMode ? t("logout") : t("logout")}
                <ChevronDown className="h-3 w-3 ml-1 opacity-60" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          data-scope={dataScope}
          align="end"
          className="w-56 shadow-lg border border-slate-200 dark:border-slate-700 z-[10000]"
        >
          <DropdownMenuItem
            onClick={() => handleMenuItemClick("current")}
            className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-slate-50 dark:focus:bg-slate-800"
          >
            <Monitor className="h-4 w-4 mr-2 text-slate-600 dark:text-slate-400" />
            <span className="text-slate-700 dark:text-slate-300">
              {tLogout("confirmCurrent")}
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
          <DropdownMenuItem
            onClick={() => handleMenuItemClick("all")}
            className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 focus:bg-red-50 dark:focus:bg-red-950 focus:text-red-600 dark:focus:text-red-400"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            <span>{tLogout("confirmAll")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
