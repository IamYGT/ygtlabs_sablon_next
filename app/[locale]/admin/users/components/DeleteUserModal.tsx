"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import * as locales from "date-fns/locale";
import { AlertTriangle, Calendar, Mail, Shield, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  profileImage: string | null;
  isActive: boolean;
  createdAt: string;
  roleId?: string | null;
  currentRole?: {
    id: string;
    name: string;
    displayName: string;
    color: string | null;
  } | null;
}

interface DeleteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onUserDeleted: () => void;
}

export default function DeleteUserModal({
  open,
  onOpenChange,
  user,
  onUserDeleted,
}: DeleteUserModalProps) {
  const t = useTranslations("AdminUsers.deleteUser");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const dateLocale = locales[locale as keyof typeof locales] || locales.enUS;

  const handleDelete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(t("notifications.deleteSuccess"));
        onOpenChange(false);
        onUserDeleted();
      } else {
        toast.error(result.error || t("notifications.deleteError"));
      }
    } catch (error) {
      console.error("User deletion error:", error);
      toast.error(t("notifications.unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  // Super admin kontrolü
  const isSuperAdmin = user.currentRole?.name === "super_admin";

  // Rol var mı kontrolü
  const hasRole = user.currentRole !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-blue-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 shadow-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Kullanıcı Bilgisi */}
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <div className="relative h-12 w-12">
              <Image
                src={
                  user.profileImage ||
                  `https://ui-avatars.com/api/?name=${
                    user.name || user.email
                  }&background=random`
                }
                alt={user.name || t("userAvatarAlt")}
                fill
                sizes="48px"
                className="rounded-full object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="font-medium text-lg">
                {user.name || t("unnamed")}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user.email}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                {t("registeredAt")}:{" "}
                {format(new Date(user.createdAt), "dd MMM yyyy", {
                  locale: dateLocale,
                })}
              </div>
            </div>
            <Badge variant={user.isActive ? "default" : "secondary"}>
              {user.isActive ? t("status.active") : t("status.passive")}
            </Badge>
          </div>

          {/* Rol */}
          {hasRole && user.currentRole && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4" />
                {t("userRole")}
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: user.currentRole.color || "#6366f1",
                    color: "white",
                  }}
                >
                  {user.currentRole.displayName}
                </Badge>
              </div>
            </div>
          )}

          {/* Uyarılar */}
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">{t("warning.title")}</div>
                <ul className="text-sm space-y-1">
                  <li>• {t("warning.permanentDeletion")}</li>
                  <li>• {t("warning.roleRemoval")}</li>
                  <li>• {t("warning.unrecoverable")}</li>
                  {hasRole && <li>• {t("warning.roleAssignmentLost")}</li>}
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Super Admin Uyarısı */}
          {isSuperAdmin && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium text-red-700">
                  {t("warning.superAdmin")}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading || isSuperAdmin}
          >
            {loading ? (
              t("buttons.deleting")
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("buttons.delete")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
