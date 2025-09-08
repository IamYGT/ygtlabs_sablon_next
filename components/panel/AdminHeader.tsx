"use client";

import { AdminStatusWidget } from "@/components/panel/AdminStatusWidget";
import { ThemeToggle, useTheme } from "@/components/panel/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSidebar } from "@/components/ui/sidebar";
import { useAdminNavigation } from "@/hooks/useAdminNavigation";
import { useAdminAuth } from "@/lib/hooks/useAuth";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import TR from "country-flag-icons/react/3x2/TR";
import US from "country-flag-icons/react/3x2/US";
import {
  Bell,
  Check,
  ChevronRight,
  Languages,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  LogOut,
  Monitor,
  Smartphone,
  ChevronDown,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLogoutModal } from "./LogoutModalProvider";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  setOpen?: (open: boolean) => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  url: string;
}

export function AdminHeader({
  title = "Dashboard",
  subtitle: _subtitle,
  setOpen,
}: AdminHeaderProps) {
  const admin = useAdminAuth();
  const { setOpen: setSidebarOpen } = useSidebar();
  const t = useTranslations("AdminHeader");
  const tLang = useTranslations("Language");
  const tLogout = useTranslations("LogoutModal");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { showLogoutModal } = useLogoutModal();

  const resolvedTitle = title || t("adminPanel");

  const getLanguageFlag = (loc: string) => {
    switch (loc) {
      case "tr":
        return <TR className="w-5 h-4 rounded-sm" />;
      case "en":
        return <US className="w-5 h-4 rounded-sm" />;
      default:
        return null;
    }
  };

  // setOpen prop'u varsa onu kullan, yoksa sidebar hook'undan al
  const handleMenuToggle = setOpen || setSidebarOpen;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Record<string, SearchResult[]>>({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Static örnek bildirimler - API çağrısı devre dışı
  useEffect(() => {
    // Sadece örnek bildirimler göster, API çağrısı yapma
    setNotifications([
      {
        id: "1",
        title: t("demoNotification.title"),
        message: t("demoNotification.message"),
        time: new Date().toLocaleString(locale),
        type: "success",
        read: false,
      },
    ]);
    setLoading(false);
  }, [admin, t, locale]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const adminNavItems = useAdminNavigation();

  const allPages = React.useMemo(() => {
    const adminPages = adminNavItems.map((item) => ({
      id: item.key,
      title: item.label,
      url: item.href,
    }));

    return adminPages;
  }, [adminNavItems]);

  useEffect(() => {
    const staticSearchData = {
      "Sayfalar": allPages,
      "Aksiyonlar": [
        { id: "8", title: "Yeni Kullanıcı Oluştur", url: "/admin/users/create" },
        { id: "9", title: "Yeni Rol Oluştur", url: "/admin/roles/create" },
        { id: "10", title: "Yeni Destek Talebi Oluştur", url: "/admin/support/new" },
        { id: "11", title: "Çıkış Yap", url: "/logout" },
      ],
      "Sekmeler": [
        { id: "12", title: "Genel Ayarlar (Profil)", url: "/admin/profile?tab=general" },
        { id: "13", title: "Güvenlik Ayarları (Profil)", url: "/admin/profile?tab=security" },
        { id: "14", title: "Bildirim Ayarları (Profil)", url: "/admin/profile?tab=notifications" },
      ],
    };

    if (inputValue.length > 1) {
      setSearchLoading(true);
      const filteredResults: Record<string, SearchResult[]> = {};
      for (const group in staticSearchData) {
        const items = staticSearchData[group as keyof typeof staticSearchData];
        const filteredItems = items.filter(item =>
          item.title.toLowerCase().includes(inputValue.toLowerCase())
        );
        if (filteredItems.length > 0) {
          filteredResults[group] = filteredItems;
        }
      }
      setSearchResults(filteredResults);
      setSearchLoading(false);
    } else {
      setSearchResults({});
    }
  }, [inputValue, allPages]);

  const handleSelect = (url: string) => {
    router.push(url);
    setCommandPaletteOpen(false);
  };

  // Okunmamış bildirim sayısı
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Kullanıcının yetkilerine göre rol açıklaması
  const getUserRoleDescription = (user: { permissions?: string[] } | null) => {
    if (!user?.permissions) return t("userRoles.user");

    if (user.permissions.includes("admin.layout")) {
      return t("userRoles.admin");
    } else if (user.permissions.includes("dashboard.view")) {
      return t("userRoles.user");
    } else {
      return t("userRoles.guest");
    }
  };

  // Bildirim tipine göre stil
  const getNotificationStyle = (type: Notification["type"]) => {
    switch (type) {
      case "error":
        return "border-l-4 border-red-500";
      case "warning":
        return "border-l-4 border-yellow-500";
      case "success":
        return "border-l-4 border-green-500";
      default:
        return "border-l-4 border-blue-500";
    }
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full bg-blue-100 dark:bg-slate-900 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-50/80 dark:supports-[backdrop-filter]:bg-slate-900/80 shadow-sm transition-all duration-300 md:rounded-tl-[1.5rem]">
      <div className="flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Sol Taraf - Hamburger Menu + Başlık */}
        <div className="flex items-center space-x-4 md:space-x-6 min-w-0">
          {/* Mobile Hamburger Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden transition-all duration-200 hover:scale-105 hover:bg-accent/50 rounded-lg"
            onClick={() => handleMenuToggle(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Başlık */}
          <div className="min-w-0">
            <h1 className="hidden md:block text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent truncate transition-all duration-300">
              {resolvedTitle}
            </h1>
          </div>
        </div>

        {/* Orta - Arama (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-8">
          <Button
            variant="outline"
            className="relative w-full justify-start text-sm text-muted-foreground h-10 bg-background/50 border-border/60 rounded-xl transition-all duration-300 hover:bg-background/80"
            onClick={() => setCommandPaletteOpen(true)}
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <span className="pl-8">{t("searchPlaceholder")}</span>
            <kbd className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Sağ Taraf - Kontroller */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobil Arama */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden transition-all duration-200 hover:scale-105 hover:bg-accent/50 rounded-lg h-9 w-9"
            onClick={() => setCommandPaletteOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Bildirimler */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative transition-all duration-200 hover:scale-105 hover:bg-accent/50 rounded-lg h-9 w-9"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse shadow-lg"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72 sm:w-80 lg:w-96 max-h-96 overflow-y-auto border-border/60 shadow-xl"
              data-scope="admin"
            >
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>{t("notifications")}</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {t("unreadBadge", { count: unreadCount })}
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("loading")}
                  </p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {t("noNotifications")}
                  </p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-0">
                    <div
                      className={`w-full p-3 sm:p-4 ${getNotificationStyle(
                        notification.type
                      )} ${
                        !notification.read
                          ? "bg-blue-50 dark:bg-blue-950/20"
                          : ""
                      } transition-colors duration-200`}
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-tight flex-1">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
                        >
                          {t("viewNotification")}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center justify-center">
                    <Button
                      variant="link"
                      size="sm"
                      className="w-full text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 h-6 px-2"
                    >
                      {t("viewAllNotifications")}
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center justify-center">
                    <Button
                      variant="link"
                      size="sm"
                      className="w-full text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 h-6 px-2"
                    >
                      {t("markAllAsRead")}
                    </Button>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sistem Durumu Widget */}
          <div className="hidden md:flex">
            <AdminStatusWidget />
          </div>

          {/* Dil Değiştirici */}
          <div className="hidden md:flex">
            <LanguageSwitcher isAdmin={true} dataScope="admin" />
          </div>

          {/* Tema Değiştirici */}
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>

          {/* Admin Profil Menüsü */}
          <DropdownMenu onOpenChange={(open) => { if (!open) setLogoutOpen(false); }}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full transition-all duration-200 hover:scale-105 ml-3 p-0"
              >
                <Avatar className="h-10 w-10 ring-2 ring-background transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25">
                  {admin?.profileImage ? (
                    <AvatarImage
                      src={admin.profileImage}
                      alt={admin.name || "Admin"}
                      className="object-contain"
                      draggable={false}
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 text-white font-semibold">
                      {admin?.name ? (
                        admin.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 sm:w-64 border-border/60 shadow-xl"
              align="end"
              forceMount
              data-scope="admin"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {admin?.name || t("defaultUserName")}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {admin?.email || "admin@example.com"}
                  </p>
                  <Badge variant="secondary" className="w-fit mt-1">
                    {getUserRoleDescription(admin)}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="transition-colors duration-200 cursor-pointer"
                onClick={() => router.push("/admin/profile")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>{t("profile")}</span>
              </DropdownMenuItem>
              <div className="md:hidden">
                <DropdownMenuSeparator />
                <DropdownMenuLabel>{t("settings")}</DropdownMenuLabel>

                {/* Language Switcher Widget */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between px-3 py-2 h-auto font-normal cursor-pointer hover:bg-accent rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-muted-foreground" />
                        <span>{t("language")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {getLanguageFlag(locale)}
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" data-scope="admin">
                    {routing.locales.map((loc) => (
                      <DropdownMenuItem
                        key={loc}
                        onClick={() => router.push(pathname, { locale: loc })}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {getLanguageFlag(loc)}
                          <span>
                            {loc === "tr" ? tLang("turkish") : tLang("english")}
                          </span>
                        </div>
                        {locale === loc && (
                          <Check className="h-4 w-4 text-blue-500" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme Switcher Widget */}
                <Button
                  variant="ghost"
                  className="w-full justify-between px-3 py-2 h-auto font-normal cursor-pointer hover:bg-accent rounded-md"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative h-4 w-4">
                      <Sun className="absolute h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </div>
                    <span>{t("theme")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="capitalize text-sm">
                      {theme === "dark" ? t("dark") : t("light")}
                    </span>
                  </div>
                </Button>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setLogoutOpen((v) => !v);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("logout")}</span>
                <ChevronDown
                  className={`ml-auto h-4 w-4 opacity-70 transition-transform ${
                    logoutOpen ? "rotate-180" : ""
                  }`}
                />
              </DropdownMenuItem>
              {logoutOpen && (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      setTimeout(() => showLogoutModal("current"), 0);
                    }}
                    className="cursor-pointer pl-6"
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    <span>{tLogout("confirmCurrent")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setTimeout(() => showLogoutModal("all"), 0);
                    }}
                    className="cursor-pointer pl-6 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    <span>{tLogout("confirmAll")}</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
    <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
        <CommandInput
          placeholder="Bir komut yazın veya arama yapın..."
          value={inputValue}
          onValueChange={setInputValue}
        />
        <CommandList>
          {searchLoading && <div className="p-4 text-center text-sm">Yükleniyor...</div>}
          {!searchLoading && Object.keys(searchResults).length === 0 && inputValue.length > 1 && (
            <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
          )}
          
          {Object.entries(searchResults).map(([group, items]) => (
            items.length > 0 && (
              <CommandGroup key={group} heading={group}>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => handleSelect(item.url)}
                    value={`${group}-${item.title}`}
                  >
                    {item.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
