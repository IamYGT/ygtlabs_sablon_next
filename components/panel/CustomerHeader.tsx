"use client";

import { CustomerStatusWidget } from "@/components/panel/CustomerStatusWidget";
import LogoutButton from "@/components/panel/LogoutButton";
import { ThemeToggle, useTheme } from "@/components/panel/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { useCustomerNavigation } from "@/hooks/useCustomerNavigation";
import { useCustomerAuth } from "@/lib/hooks/useAuth";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import TR from "country-flag-icons/react/3x2/TR";
import US from "country-flag-icons/react/3x2/US";
import {
  Bell,
  Check,
  ChevronRight,
  Languages,
  LifeBuoy,
  Menu,
  Moon,
  Search,
  Sun,
  User,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

interface CustomerHeaderProps {
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
  icon: React.ElementType;
}

export function CustomerHeader({
  title = "Dashboard",
  subtitle: _subtitle,
  setOpen,
}: CustomerHeaderProps) {
  const customer = useCustomerAuth();
  const { setOpen: setSidebarOpen } = useSidebar();
  const t = useTranslations("CustomerHeader");
  const tLang = useTranslations("Language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const resolvedTitle = title || t("customerPanel");

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

  const handleMenuToggle = setOpen || setSidebarOpen;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Record<string, SearchResult[]>>({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setNotifications([
      {
        id: "1",
        title: t("demoNotification.title"),
        message: t("demoNotification.message"),
        time: new Date().toLocaleString(locale),
        type: "success",
        read: false,
      },
      {
        id: "2",
        title: t("orderNotification.title"),
        message: t("orderNotification.message"),
        time: new Date().toLocaleString(locale),
        type: "info",
        read: false,
      },
    ]);
    setLoading(false);
  }, [customer, t, locale]);

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

  const customerNavItems = useCustomerNavigation();

  const allPages = React.useMemo(() => {
    return customerNavItems.map((item) => ({
      id: item.key,
      title: item.label,
      url: item.href,
      icon: item.icon,
    }));
  }, [customerNavItems]);

  useEffect(() => {
    const staticSearchData = {
      "Sayfalar": allPages,
      "Aksiyonlar": [
        { id: "new-support-ticket", title: "Yeni Destek Talebi Oluştur", url: "/customer/support/new", icon: LifeBuoy },
      ],
    };

    if (inputValue.length > 0) {
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
        setSearchResults({
            "Sayfalar": allPages,
            "Aksiyonlar": [
              { id: "new-support-ticket", title: "Yeni Destek Talebi Oluştur", url: "/customer/support/new", icon: LifeBuoy },
            ],
        });
    }
  }, [inputValue, allPages]);

  const handleSelect = (url: string) => {
    router.push(url);
    setCommandPaletteOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getUserRoleDescription = (user: { permissions?: string[] } | null) => {
    if (!user?.permissions) return t("userRoles.customer");

    if (user.permissions.includes("customer.layout")) {
      return t("userRoles.premiumCustomer");
    } else {
      return t("userRoles.customer");
    }
  };

  const getNotificationStyle = (type: Notification["type"]) => {
    switch (type) {
      case "error":
        return "border-l-4 border-red-500";
      case "warning":
        return "border-l-4 border-yellow-500";
      case "success":
        return "border-l-4 border-green-500";
      default:
        return "border-l-4 border-purple-500";
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-blue-100 dark:bg-slate-900 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-50/80 dark:supports-[backdrop-filter]:bg-slate-900/80 shadow-sm transition-all duration-300 md:rounded-tl-[1.5rem]">
        <div className="flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 md:space-x-6 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden transition-all duration-200 hover:scale-105 hover:bg-accent/50 rounded-lg"
              onClick={() => handleMenuToggle(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="hidden md:block text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent truncate transition-all duration-300">
                {resolvedTitle}
              </h1>
            </div>
          </div>

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

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden transition-all duration-200 hover:scale-105 hover:bg-accent/50 rounded-lg h-9 w-9"
              onClick={() => setCommandPaletteOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>

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
                data-scope="customer"
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

            <div className="hidden md:flex">
              <CustomerStatusWidget />
            </div>

            <div className="hidden md:flex">
              <LanguageSwitcher isCustomer={true} dataScope="customer" />
            </div>

            <div className="hidden md:flex">
              <ThemeToggle />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full transition-all duration-200 hover:scale-105 ml-3 p-0"
                >
                  <Avatar className="h-10 w-10 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25">
                    {customer?.profileImage ? (
                      <AvatarImage
                        src={customer.profileImage}
                        alt={customer.name || "Customer"}
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 text-white font-semibold">
                        {customer?.name ? (
                          customer.name
                            .split(" ")
                            .map((n: string) => n)
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
                data-scope="customer"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {customer?.name || t("defaultUserName")}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {customer?.email || "customer@example.com"}
                    </p>
                    <Badge variant="secondary" className="w-fit mt-1">
                      {getUserRoleDescription(customer)}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="transition-colors duration-200 cursor-pointer"
                  onClick={() => {
                    const currentLocale = window.location.pathname.split("/");
                    window.location.href = `/${currentLocale}/customer/profile`;
                  }}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("profile")}</span>
                </DropdownMenuItem>
                <div className="md:hidden">
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>{t("settings")}</DropdownMenuLabel>

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
                    <DropdownMenuContent align="end" data-scope="customer">
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
                <div className="p-1">
                  <LogoutButton
                    showMultiDeviceOptions={true}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start transition-colors duration-200"
                    dataScope="customer"
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <CommandDialog open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen}>
        <CommandInput
          placeholder="Bir sayfayı veya eylemi arayın..."
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
                    className="flex items-center gap-2"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.title}</span>
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