"use client";

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
import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Search, Shield, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  profileImage: string | null;
  roleId?: string | null;
  currentRole?: {
    id: string;
    name: string;
    displayName: string;
    color: string | null;
  } | null;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  color: string | null;
  isActive: boolean;
}

interface QuickRoleAssignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  roles: Role[];
  onRoleAssigned: () => void;
}

export default function QuickRoleAssignModal({
  open,
  onOpenChange,
  user,
  roles,
  onRoleAssigned,
}: QuickRoleAssignModalProps) {
  const t = useTranslations("AdminUsers.quickRoleAssign");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  React.useEffect(() => {
    if (user) {
      // Kullanıcının mevcut rolünü seçili yap
      setSelectedRole(user.currentRole?.id || "");
    }
  }, [user]);

  // Filtrelenmiş roller
  const filteredRoles = roles.filter(
    (role) =>
      role.isActive &&
      role.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId === selectedRole ? "" : roleId);
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch("/api/admin/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          roleId: selectedRole || null,
        }),
      });

      if (!response.ok) {
        // Detaylı hata mesajı almak için response body'yi okuyalım
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });

        const errorMessage = errorData.error || t("updateFailed");
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log("Success response:", responseData);

      toast.success(responseData.message || t("updateSuccess"));
      onOpenChange(false);
      onRoleAssigned();
    } catch (error) {
      console.error("Role assignment error:", error);

      // Daha detaylı hata mesajı göster
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t("updateFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const currentRoleId = user.currentRole?.id || "";
  const hasChanges = selectedRole !== currentRoleId;
  const newRole = selectedRole
    ? roles.find((r) => r.id === selectedRole)
    : null;
  const oldRole = currentRoleId
    ? roles.find((r) => r.id === currentRoleId)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-blue-50 dark:bg-slate-900 border border-gray-200 dark:border-gray-800">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("title")}
          </DialogTitle>
          <DialogDescription>
            {t("description", { userName: user.name || user.email || "" })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Kullanıcı Bilgisi */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.name || ""}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-contain"
                />
              ) : (
                <Users className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <div className="font-medium">{user.name || t("unnamed")}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>

          {/* Arama */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Mevcut Rol */}
          {user.currentRole && (
            <div>
              <Label className="text-sm font-medium">{t("currentRole")}</Label>
              <div className="flex flex-wrap gap-1 mt-2">
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
              <Separator className="mt-3" />
            </div>
          )}

          {/* Rol Listesi */}
          <div>
            <Label className="text-sm font-medium">
              {t("roles", { count: filteredRoles.length })}
            </Label>
            <div className="max-h-60 overflow-y-auto mt-2 space-y-2">
              {/* Rol Yok Seçeneği */}
              <div
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => handleRoleSelect("")}
              >
                <input
                  type="radio"
                  name="selectedRole"
                  checked={selectedRole === ""}
                  onChange={() => handleRoleSelect("")}
                  className="h-4 w-4 text-primary"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground">
                    {t("noRoleAssigned.title")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("noRoleAssigned.description")}
                  </div>
                </div>
              </div>

              {filteredRoles.map((role) => {
                const isSelected = selectedRole === role.id;

                return (
                  <div
                    key={role.id}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <input
                      type="radio"
                      name="selectedRole"
                      checked={isSelected}
                      onChange={() => handleRoleSelect(role.id)}
                      className="h-4 w-4 text-primary"
                    />
                    <div
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: role.color || "#6366f1" }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {role.displayName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {role.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Özet */}
          {hasChanges && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {t("summary.title")}
              </Label>
              <div className="flex items-center justify-center gap-2 text-sm mt-2">
                <Badge variant="destructive">
                  {oldRole ? oldRole.displayName : t("summary.noRole")}
                </Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="default">
                  {newRole ? newRole.displayName : t("summary.noRole")}
                </Badge>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={loading || !hasChanges}
            className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
          >
            {loading ? t("saving") : t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
