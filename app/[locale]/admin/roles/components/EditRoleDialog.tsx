"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Crown,
  Edit,
  Plus,
  Save,
  Settings,
  Shield,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

// Interfaces remain the same...
interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  color: string | null;
  layoutType: string;
  isActive: boolean;
  isSystemDefault: boolean;
}

interface Permission {
  id: string;
  name: string;
  category: string;
  resourcePath: string;
  action: string;
  displayName: string;
  description: string;
  permissionType?: string;
}

interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  onRoleUpdated: () => void;
}

// Helper functions remain the same...
function parseJSONField(
  value: string | Record<string, string> | null | undefined,
  locale: string = "tr"
): string {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as Record<string, string>;
      return (
        parsed?.[locale] || parsed?.en || Object.values(parsed)[0] || value
      );
    } catch {
      return value;
    }
  }
  if (typeof value === "object" && value !== null) {
    return value[locale] || value.en || Object.values(value)[0] || "";
  }
  return value || "";
}

function formatPermission(
  permission: Permission,
  t: ReturnType<typeof useTranslations>,
  locale: string = "tr"
): Permission {
  let displayName = permission.displayName;

  // API'den locale'e göre formatlanmış geliyorsa direkt kullan
  if (
    typeof permission.displayName === "string" &&
    permission.displayName !== permission.name
  ) {
    displayName = permission.displayName;
  } else {
    const parsed = parseJSONField(permission.displayName, locale);
    if (parsed && parsed.trim() !== "") {
      displayName = parsed;
    } else {
      const categoryName =
        t(`categories.${permission.category}`) || permission.category;
      const actionName = t(`actions.${permission.action}`) || permission.action;
      const resourceName = permission.resourcePath
        .replace(/^\//, "")
        .replace(/\//g, " ");
      displayName = `${categoryName} - ${resourceName} ${actionName}`;
    }
  }

  let description = permission.description;
  if (
    typeof permission.description === "string" &&
    permission.description !== permission.name
  ) {
    description = permission.description;
  } else {
    const parsed = parseJSONField(permission.description, locale);
    if (parsed && parsed.trim() !== "") {
      description = parsed;
    } else {
      const categoryName =
        t(`categories.${permission.category}`) || permission.category;
      const actionName = t(`actions.${permission.action}`) || permission.action;
      description = t("permissionDescription", {
        resource: permission.resourcePath,
        category: categoryName,
        action: actionName,
      });
    }
  }

  return { ...permission, displayName, description };
}

const COLOR_PALETTE = [
  "#ef4444",
  "#f59e0b",
  "#eab308",
  "#22c55e",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#64748b",
  "#374151",
];

const generateRoleCode = (displayName: string): string => {
  return displayName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
};

export default function EditRoleDialog({
  open,
  onOpenChange,
  role,
  onRoleUpdated,
}: EditRoleDialogProps) {
  const t = useTranslations("AdminRoles.editDialog");
  const tCommon = useTranslations("AdminCommon");
  const params = useParams();
  const locale = (params?.locale as string) || "tr";

  const [loading, setLoading] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    displayName: role.displayName,
    description: role.description || "",
    color: role.color || "#6366f1",
    layoutType: role.layoutType || "user",
    isActive: role.isActive,
  });

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );
  const [expandedMobileItems, setExpandedMobileItems] = useState<Set<string>>(
    new Set()
  );

  const isProtectedRole = role.name === "super_admin" || role.name === "user";
  const loadingRef = useRef(false);

  const loadPermissions = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoadingPermissions(true);

    try {
      const permissionsResponse = await fetch(
        `/api/admin/permissions?limit=1000&locale=${locale}`
      );
      if (!permissionsResponse.ok)
        throw new Error(t("notifications.permissionsLoadError"));
      const permissionsData = await permissionsResponse.json();
      const formattedPermissions = (permissionsData.permissions || []).map(
        (p: Permission) => formatPermission(p, t, locale)
      );

      const roleResponse = await fetch(
        `/api/admin/roles/${role.id}/permissions`
      );
      if (!roleResponse.ok)
        throw new Error(t("notifications.rolePermissionsLoadError"));
      const roleData = await roleResponse.json();

      const selectedIds = new Set<string>();
      (roleData.permissions || []).forEach((perm: Permission) => {
        const permission = formattedPermissions.find(
          (p: Permission) => p.name === perm.name
        );
        if (permission) {
          selectedIds.add(permission.id);
        }
      });

      setPermissions(formattedPermissions);
      setSelectedPermissions(selectedIds);
    } catch (error) {
      console.error(
        t("info.dataLoadingError", { error: (error as Error).message })
      );
      toast.error(t("notifications.updateErrorGeneric"));
    } finally {
      setLoadingPermissions(false);
      loadingRef.current = false;
    }
  }, [role.id, t, locale]);

  useEffect(() => {
    if (open) {
      setFormData({
        displayName: role.displayName,
        description: role.description || "",
        color: role.color || "#6366f1",
        layoutType: role.layoutType || "user",
        isActive: role.isActive,
      });
      setSearchTerm("");
      loadPermissions();
    }
  }, [open, role, loadPermissions]); // Depend on role and loadPermissions

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.displayName.trim()) {
      newErrors.displayName = t("roleNameRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (isProtectedRole) {
      toast.error(t("notifications.protectedError"));
      return;
    }

    setLoading(true);
    try {
      const roleUpdateData = {
        ...formData,
        name: generateRoleCode(formData.displayName),
      };
      const roleResponse = await fetch(`/api/admin/roles/${role.id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roleUpdateData),
      });
      if (!roleResponse.ok)
        throw new Error((await roleResponse.json()).message);

      const permissionNames = Array.from(selectedPermissions)
        .map((id) => permissions.find((p) => p.id === id)?.name)
        .filter(Boolean) as string[];
      const permissionsResponse = await fetch(
        `/api/admin/roles/${role.id}/permissions`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissions: permissionNames }),
        }
      );
      if (!permissionsResponse.ok)
        throw new Error((await permissionsResponse.json()).error);

      toast.success(t("notifications.updateSuccess"));
      onRoleUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error(t("info.updateError", { error: (error as Error).message }));
      toast.error(
        (error as Error).message || t("notifications.genericUpdateError")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLayoutTypeChange = async (value: "admin" | "user") => {
    setFormData((prev) => ({ ...prev, layoutType: value }));

    const newSelectedPermissions = new Set<string>();
    let removedCount = 0;

    selectedPermissions.forEach((permissionId) => {
      const permission = permissions.find((p) => p.id === permissionId);
      if (permission && permission.permissionType === value) {
        newSelectedPermissions.add(permissionId);
      } else {
        removedCount++;
      }
    });

    const layoutPermissionName =
      value === "admin" ? "admin.layout" : "user.layout";
    const layoutPermission = permissions.find(
      (p) => p.name === layoutPermissionName
    );
    if (layoutPermission) {
      newSelectedPermissions.add(layoutPermission.id);
    }

    // Önce UI state'i güncelle
    setSelectedPermissions(newSelectedPermissions);
    if (removedCount > 0) {
      toast(
        t("notifications.incompatiblePermissionsRemoved", {
          count: removedCount,
          kept: newSelectedPermissions.size,
        })
      );
    }

    // Ardından API'ye otomatik kaydet (rol layoutType ve rol yetkileri)
    try {
      setLoading(true);

      // 1) Rol'ün layoutType alanını güncelle
      const roleResponse = await fetch(`/api/admin/roles/${role.id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layoutType: value }),
      });
      if (!roleResponse.ok) {
        const err = await roleResponse.json().catch(() => ({}));
        throw new Error(err?.message || t("notifications.updateError"));
      }

      // 2) Rol yetkilerini yeni seçime göre güncelle (layout permission otomatik ekli)
      const permissionNames = Array.from(newSelectedPermissions)
        .map((id) => permissions.find((p) => p.id === id)?.name)
        .filter(Boolean) as string[];

      const permResponse = await fetch(
        `/api/admin/roles/${role.id}/permissions`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissions: permissionNames }),
        }
      );
      if (!permResponse.ok) {
        const err = await permResponse.json().catch(() => ({}));
        throw new Error(err?.message || t("notifications.updateError"));
      }

      toast.success(t("notifications.updateSuccess"));
    } catch (error) {
      console.error("Layout type auto-update error:", error);
      toast.error((error as Error).message || t("notifications.updateError"));
    } finally {
      setLoading(false);
    }
  };

  const addPermission = (permissionId: string) => {
    setSelectedPermissions((prev) => new Set(prev).add(permissionId));
  };

  const removePermission = (permissionId: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      next.delete(permissionId);
      return next;
    });
  };

  const toggleMobileItem = (permissionId: string) => {
    setExpandedMobileItems((prev) => {
      const next = new Set(prev);
      if (next.has(permissionId)) {
        next.delete(permissionId);
      } else {
        next.add(permissionId);
      }
      return next;
    });
  };

  const availablePermissions = permissions.filter(
    (p) =>
      !selectedPermissions.has(p.id) &&
      p.permissionType === formData.layoutType &&
      p.category !== "layout" &&
      (p.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentPermissions = Array.from(selectedPermissions)
    .map((id) => permissions.find((p) => p.id === id))
    .filter((p): p is Permission => p !== undefined && p.category !== "layout");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[94vw] sm:max-w-[95vw] lg:max-w-6xl max-h-[92vh] sm:max-h-[95vh] bg-white dark:bg-gray-900 flex flex-col overflow-y-auto md:overflow-hidden touch-pan-y touch-pan-x">
        <DialogHeader className="border-b pb-3 md:pb-4">
          <DialogTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-bold">
            <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Edit className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="truncate block">
                {role.displayName} {t("title")}
              </span>
              <p className="text-xs md:text-sm font-normal text-gray-600 dark:text-gray-400 mt-1 hidden md:block">
                {t("roleInfoDescription")}
              </p>
            </div>
            {isProtectedRole && (
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-600 text-xs"
              >
                <ShieldCheck className="w-3 h-3 mr-1" />
                {t("protectedRole")}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6 md:overflow-hidden scroll-smooth">
          {/* Sol Panel - Rol Bilgileri */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6 overflow-y-auto md:pr-4 scroll-smooth">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings className="h-4 w-4" />
                  {t("roleInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">{t("displayName")} *</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        displayName: e.target.value,
                      }))
                    }
                    placeholder={t("displayNamePlaceholder")}
                    disabled={isProtectedRole}
                    className={errors.displayName ? "border-red-500" : ""}
                  />
                  {errors.displayName && (
                    <p className="text-xs text-red-500">{errors.displayName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t("description")}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder={t("descriptionPlaceholder")}
                    disabled={isProtectedRole}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("accessType")}</Label>
                  <Select
                    value={formData.layoutType}
                    onValueChange={(value: "admin" | "user") =>
                      handleLayoutTypeChange(value)
                    }
                    disabled={isProtectedRole}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          {t("adminAccess")}
                        </div>
                      </SelectItem>
                      <SelectItem value="user">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {t("userAccess")}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">{t("color")}</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          color: e.target.value,
                        }))
                      }
                      disabled={isProtectedRole}
                      className="w-10 h-10 p-1 border rounded cursor-pointer"
                    />
                    <div className="flex flex-wrap gap-1">
                      {COLOR_PALETTE.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className="w-6 h-6 rounded-full border-2"
                          style={{
                            backgroundColor: c,
                            borderColor:
                              formData.color === c ? "black" : "transparent",
                          }}
                          onClick={() =>
                            setFormData((prevState) => ({
                              ...prevState,
                              color: c,
                            }))
                          }
                          disabled={isProtectedRole}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                    disabled={isProtectedRole}
                  />
                  <Label htmlFor="isActive">{t("isActive")}</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Panel - Yetkiler */}
          <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <Shield className="h-4 w-4" />
                  {t("permissionManagement")}
                </CardTitle>
                <Input
                  placeholder={t("searchPermissions")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col min-h-0">
                {loadingPermissions ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    {/* Desktop: Grid Layout */}
                    <div className="hidden md:grid md:grid-cols-2 gap-4 flex-1 min-h-0">
                      {/* Eklenebilir Yetkiler */}
                      <div className="flex flex-col gap-2 min-h-0">
                        <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400">
                          {t("availablePermissions")} (
                          {availablePermissions.length})
                        </h4>
                        <ScrollArea className="flex-1 max-h-[60vh] border rounded-lg p-2">
                          <div className="space-y-1.5">
                            {availablePermissions.map((p: Permission) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md"
                              >
                                <span className="text-sm font-medium">
                                  {p.displayName}
                                </span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() =>
                                    !isProtectedRole && addPermission(p.id)
                                  }
                                  disabled={isProtectedRole}
                                  className="w-5 h-5 text-green-600"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Mevcut Yetkiler */}
                      <div className="flex flex-col gap-2 min-h-0">
                        <h4 className="font-semibold text-sm text-green-700 dark:text-green-400">
                          {t("currentPermissions")} ({currentPermissions.length}
                          )
                        </h4>
                        <ScrollArea className="flex-1 max-h-[60vh] border rounded-lg p-2">
                          <div className="space-y-1.5">
                            {currentPermissions
                              .filter((p) =>
                                p.displayName
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                              )
                              .map((p) => (
                                <div
                                  key={p.id}
                                  className="flex items-center justify-between p-1.5 bg-green-50 dark:bg-green-900/20 rounded-md"
                                >
                                  <span className="text-sm font-medium">
                                    {p.displayName}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() =>
                                      !isProtectedRole && removePermission(p.id)
                                    }
                                    disabled={isProtectedRole}
                                    className="w-5 h-5 text-red-600"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>

                    {/* Mobile: Tabs Layout */}
                    <div className="md:hidden min-h-0 flex flex-col flex-1">
                      <Tabs
                        defaultValue="current"
                        className="flex flex-col h-full min-h-0"
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger
                            value="current"
                            className="flex items-center gap-1 text-xs sm:text-sm"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              {t("currentPermissions")}
                            </span>
                            <span className="sm:hidden">Mevcut</span>(
                            {currentPermissions.length})
                          </TabsTrigger>
                          <TabsTrigger
                            value="available"
                            className="flex items-center gap-1 text-xs sm:text-sm"
                          >
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">
                              {t("available_permissions")}
                            </span>
                            <span className="sm:hidden">Ekle</span>(
                            {availablePermissions.length})
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent
                          value="current"
                          className="flex-1 mt-3 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
                        >
                          <ScrollArea className="max-h-[60vh] border rounded-lg p-2">
                            <div className="space-y-1.5">
                              {currentPermissions
                                .filter((p) =>
                                  p.displayName
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                                )
                                .map((p) => (
                                  <div
                                    key={p.id}
                                    className="flex items-start justify-between p-1.5 bg-green-50 dark:bg-green-900/20 rounded-md min-w-[280px] cursor-pointer"
                                    onClick={() => toggleMobileItem(p.id)}
                                  >
                                    <div className="flex-1 min-w-0 pr-2">
                                      <div className="text-xs sm:text-sm font-medium break-words">
                                        {p.displayName}
                                      </div>
                                      {expandedMobileItems.has(p.id) && (
                                        <div className="mt-1 text-[11px] sm:text-xs text-muted-foreground break-words">
                                          {p.description}
                                        </div>
                                      )}
                                    </div>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        !isProtectedRole &&
                                          removePermission(p.id);
                                      }}
                                      disabled={isProtectedRole}
                                      className="w-6 h-6 text-red-600 flex-shrink-0"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              {currentPermissions.filter((p) =>
                                p.displayName
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                              ).length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                  <ShieldCheck className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                  <p>Henüz yetki eklenmemiş</p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </TabsContent>

                        <TabsContent
                          value="available"
                          className="flex-1 mt-3 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
                        >
                          <ScrollArea className="max-h-[60vh] border rounded-lg p-2">
                            <div className="space-y-1.5">
                              {availablePermissions.map((p: Permission) => (
                                <div
                                  key={p.id}
                                  className="flex items-start justify-between p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md min-w-[280px] cursor-pointer"
                                  onClick={() => toggleMobileItem(p.id)}
                                >
                                  <div className="flex-1 min-w-0 pr-2">
                                    <div className="text-xs sm:text-sm font-medium break-words">
                                      {p.displayName}
                                    </div>
                                    {expandedMobileItems.has(p.id) && (
                                      <div className="mt-1 text-[11px] sm:text-xs text-muted-foreground break-words">
                                        {p.description}
                                      </div>
                                    )}
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      !isProtectedRole && addPermission(p.id);
                                    }}
                                    disabled={isProtectedRole}
                                    className="w-6 h-6 text-green-600 flex-shrink-0"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              {availablePermissions.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                  <Plus className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                  <p>Eklenebilir yetki bulunamadı</p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="order-2 sm:order-1"
          >
            {tCommon("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              loading || !formData.displayName.trim() || isProtectedRole
            }
            className="order-1 sm:order-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="hidden sm:inline">{t("updating")}</span>
                <span className="sm:hidden">Güncelleniyor...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t("updateRole")}</span>
                <span className="sm:hidden">Güncelle</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
