"use client";

import { CustomerStatusWidget } from "@/components/panel/CustomerStatusWidget";
import LogoutButton from "@/components/panel/LogoutButton";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { useCustomerAuth } from "@/lib/hooks/useAuth";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { routing } from "@/src/i18n/routing";
import TR from "country-flag-icons/react/3x2/TR";
import US from "country-flag-icons/react/3x2/US";
import {
  Bell,
  Check,
  ChevronRight,
  Languages,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

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

  // setOpen prop'u varsa onu kullan, yoksa sidebar hook'undan al
  const handleMenuToggle = setOpen || setSidebarOpen;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Static örnek bildirimler
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

  // Okunmamış bildirim sayısı
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Müşteri rol açıklaması
  const getUserRoleDescription = (user: { permissions?: string[] } | null) => {
    if (!user?.permissions) return t("userRoles.customer");

    if (user.permissions.includes("customer.layout")) {
      return t("userRoles.premiumCustomer");
    } else {
      return t("userRoles.customer");
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
        return "border-l-4 border-purple-500";
    }
  };

  // Arama fonksiyonu
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Arama:", searchQuery);
      // TODO: Implement search functionality
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full customer-header md:rounded-tl-[2rem] shadow-sm transition-all duration-300">
      <div className="flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Sol Taraf - Hamburger Menu + Başlık */}
        <div className="flex items-center space-x-4 md:space-x-6 min-w-0">
          {/* Mobile Hamburger Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden transition-all duration-200 hover:scale-105 hover:bg-purple-100/50 dark:hover:bg-purple-900/20 rounded-lg"
            onClick={() => handleMenuToggle(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Başlık */}
          <div className="min-w-0">
            <h1 className="hidden md:block text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent truncate transition-all duration-300">
              {resolvedTitle}
            </h1>
          </div>
        </div>

        {/* Orta - Arama (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-8">
          <form onSubmit={handleSearch} className="relative w-full group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60 transition-all duration-300 group-focus-within:text-purple-500" />
            <Input
              placeholder={t("searchPlaceholder")}
              className="pl-12 pr-4 h-10 bg-background/50 border-purple-200/60 dark:border-purple-700/30 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 focus:bg-background hover:bg-background/80 placeholder:text-muted-foreground/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Sağ Taraf - Kontroller */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobil Arama */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden transition-all duration-200 hover:scale-105 hover:bg-purple-100/50 dark:hover:bg-purple-900/20 rounded-lg h-9 w-9"
              >
                <Search className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72 sm:w-80 p-4 border-border/60 shadow-xl"
            >
              <form onSubmit={handleSearch} className="relative w-full group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60 transition-all duration-300 group-focus-within:text-purple-500" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  className="pl-12 pr-4 h-10 bg-background/50 border-purple-200/60 dark:border-purple-700/30 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Alışveriş Sepeti */}
          <Button
            variant="ghost"
            size="icon"
            className="relative transition-all duration-200 hover:scale-105 hover:bg-purple-100/50 dark:hover:bg-purple-900/20 rounded-lg h-9 w-9"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
              3
            </span>
          </Button>

          {/* Tema Değiştirme */}
          <ThemeToggle />

          {/* Dil Değiştirme */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="transition-all duration-200 hover:scale-105 hover:bg-purple-100/50 dark:hover:bg-purple-900/20 rounded-lg h-9 w-9"
              >
                {getLanguageFlag(locale) || <Languages className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 border-border/60 shadow-xl"
            >
              <DropdownMenuLabel className="text-sm font-semibold text-muted-foreground">
                {t("selectLanguage")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {routing.locales.map((loc) => (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => router.replace(pathname, { locale: loc })}
                  className={`transition-all duration-200 ${
                    locale === loc
                      ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {getLanguageFlag(loc)}
                      <span className="capitalize">{tLang(loc as any)}</span>
                    </div>
                    {locale === loc && <Check className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Bildirimler */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative transition-all duration-200 hover:scale-105 hover:bg-purple-100/50 dark:hover:bg-purple-900/20 rounded-lg h-9 w-9"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-[10px] text-white flex items-center justify-center animate-pulse font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 sm:w-96 max-h-[400px] overflow-y-auto border-border/60 shadow-xl"
            >
              <DropdownMenuLabel className="text-base font-semibold">
                {t("notifications")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {loading ? (
                <div className="p-4 text-center text-muted-foreground">
                  {t("loading")}...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {t("noNotifications")}
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      !notification.read
                        ? "bg-purple-50 dark:bg-purple-900/10"
                        : ""
                    } ${getNotificationStyle(notification.type)}`}
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-0 h-5">
                            {t("new")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground/60">
                        {notification.time}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Kullanıcı Profili */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 rounded-lg px-2 transition-all duration-200 hover:bg-purple-100/50 dark:hover:bg-purple-900/20"
              >
                <Avatar className="h-8 w-8 border-2 border-purple-200 dark:border-purple-700">
                  <AvatarImage
                    src={customer?.profileImage || undefined}
                    alt={customer?.name || "Customer"}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold">
                    {customer?.name?.charAt(0)?.toUpperCase() || "C"}
                  </AvatarFallback>
                </Avatar>
                <span className="ml-2 hidden lg:inline-block text-sm font-medium">
                  {customer?.name || customer?.email}
                </span>
                <ChevronRight className="ml-2 h-4 w-4 hidden lg:inline-block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 border-border/60 shadow-xl"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {customer?.name || t("customer")}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {customer?.email}
                  </p>
                  <Badge
                    variant="secondary"
                    className="mt-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300"
                  >
                    {getUserRoleDescription(customer)}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/customer/profile")}
                className="cursor-pointer transition-all duration-200 hover:bg-purple-100/50 dark:hover:bg-purple-900/20"
              >
                <User className="mr-2 h-4 w-4" />
                <span>{t("profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/customer/orders")}
                className="cursor-pointer transition-all duration-200 hover:bg-purple-100/50 dark:hover:bg-purple-900/20"
              >
                <Package className="mr-2 h-4 w-4" />
                <span>{t("orders")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Alt Status Widget */}
      <CustomerStatusWidget />
    </header>
  );
}
