"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSupportStore } from "@/lib/stores/support-store";
import { formatDistanceToNow } from "date-fns";
import { tr, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setNotifications
  } = useSupportStore();

  // Bildirimleri yükle
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch("/api/support/notifications?limit=10");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [setNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);


  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/support/notifications?id=${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true })
      });
      
      if (response.ok) {
        markNotificationAsRead(notificationId);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch("/api/support/notifications?markAllRead=true", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true })
      });
      
      if (response.ok) {
        markAllNotificationsAsRead();
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ticket_assigned":
        return "👤";
      case "new_message":
        return "💬";
      case "ticket_resolved":
        return "✅";
      case "ticket_closed":
        return "🔒";
      default:
        return "📢";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
        >
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
            >
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadNotifications > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                    !notification.isRead && "bg-muted/20"
                  )}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <span className="text-xl">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm",
                        !notification.isRead && "font-medium"
                      )}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: locale === "tr" ? tr : enUS
                        })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full justify-center text-sm"
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to notifications page
                  window.location.href = `/${locale}/customer/notifications`;
                }}
              >
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
