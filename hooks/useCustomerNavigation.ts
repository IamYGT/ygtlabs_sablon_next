"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { 
  Home, 
  Package, 
  Heart, 
  ShoppingCart, 
  CreditCard, 
  User, 
  Settings, 
  Star,
  Clock,
  MapPin
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export interface CustomerNavigationItem {
  key: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredPermission?: string;
  badge?: string;
}

export function useCustomerNavigation() {
  const { hasPermission } = useAuth();
  const t = useTranslations("CustomerNavigation");

  const allLinks: CustomerNavigationItem[] = useMemo(
    () => [
      {
        key: "dashboard",
        label: t("dashboard"),
        href: "/customer/dashboard",
        icon: Home,
        requiredPermission: "customer.dashboard.view",
      },
      {
        key: "orders",
        label: t("orders"),
        href: "/customer/orders",
        icon: Package,
        requiredPermission: "customer.orders.view",
      },
      {
        key: "order-history",
        label: t("orderHistory"),
        href: "/customer/order-history",
        icon: Clock,
        requiredPermission: "customer.orders.view",
      },
      {
        key: "track-order",
        label: t("trackOrder"),
        href: "/customer/track-order",
        icon: MapPin,
        requiredPermission: "customer.orders.view",
      },
      {
        key: "wishlist",
        label: t("wishlist"),
        href: "/customer/wishlist",
        icon: Heart,
        requiredPermission: "customer.wishlist.view",
        badge: "12",
      },
      {
        key: "cart",
        label: t("cart"),
        href: "/customer/cart",
        icon: ShoppingCart,
        requiredPermission: "customer.cart.view",
        badge: "3",
      },
      {
        key: "loyalty",
        label: t("loyalty"),
        href: "/customer/loyalty",
        icon: Star,
        requiredPermission: "customer.loyalty.view",
      },
      {
        key: "payment",
        label: t("payment"),
        href: "/customer/payment",
        icon: CreditCard,
        requiredPermission: "customer.payment.view",
      },
      {
        key: "profile",
        label: t("profile"),
        href: "/customer/profile",
        icon: User,
        requiredPermission: "customer.profile.view",
      },
      {
        key: "settings",
        label: t("settings"),
        href: "/customer/settings",
        icon: Settings,
        requiredPermission: "customer.settings.view",
      },
    ],
    [t]
  );

  // Filter links based on permissions
  const filteredLinks = useMemo(() => {
    return allLinks.filter((link) => {
      // If no permission required, show the link
      if (!link.requiredPermission) return true;
      
      // Check if user has the required permission
      return hasPermission(link.requiredPermission);
    });
  }, [allLinks, hasPermission]);

  return filteredLinks;
}

// Helper hook to check if user has access to a specific customer page
export function useHasCustomerPageAccess(pageKey: string) {
  const links = useCustomerNavigation();
  return links.some((link) => link.key === pageKey);
}

// Helper hook to get all accessible customer pages
export function useCustomerAccessiblePages() {
  const links = useCustomerNavigation();
  return links.map((link) => link.key);
}
