"use client";

import { ShoppingCart, Package, CreditCard, Heart } from "lucide-react";
import { useTranslations } from "next-intl";

export function CustomerStatusWidget() {
  const t = useTranslations("CustomerStatus");

  const stats = [
    {
      icon: ShoppingCart,
      label: t("cart"),
      value: "3",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      icon: Package,
      label: t("activeOrders"),
      value: "2",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
    },
    {
      icon: Heart,
      label: t("wishlist"),
      value: "12",
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
    {
      icon: CreditCard,
      label: t("loyaltyPoints"),
      value: "450",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
    },
  ];

  return (
    <div className="border-t border-purple-200/30 dark:border-purple-700/30 px-4 py-2 bg-gradient-to-r from-purple-50/50 via-pink-50/50 to-indigo-50/50 dark:from-purple-900/10 dark:via-pink-900/10 dark:to-indigo-900/10">
      <div className="flex items-center justify-between gap-4 overflow-x-auto">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-2 min-w-fit"
          >
            <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {stat.label}
              </span>
              <span className={`text-sm font-bold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
