"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Crown, Edit, Plus, Save, Settings, Shield, ShieldCheck, Users, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

interface Role {
  id: string; name: string; displayName: string; description: string | null;
  color: string | null; layoutType: string; isActive: boolean; isSystemDefault: boolean;
  power: number;
}

interface Permission {
  id: string; name: string; category: string; resourcePath: string; action: string;
  displayName: string; description: string; permissionType?: string;
}

interface EditRoleDialogProps {
  open: boolean; onOpenChange: (open: boolean) => void; role: Role; onRoleUpdated: () => void;
}

function parseJSONField(value: string | Record<string, string> | null | undefined, locale: string = "tr"): string {
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            return parsed?.[locale] || parsed?.en || Object.values(parsed)[0] || value;
        } catch { return value; }
    }
    if (typeof value === "object" && value !== null) {
        return value[locale] || value.en || Object.values(value)[0] || "";
    }
    return value || "";
}

function formatPermission(permission: Permission, locale: string = "tr"): Permission {
    const displayName = parseJSONField(permission.displayName, locale) || permission.name;
    const description = parseJSONField(permission.description, locale) || permission.name;
    return { ...permission, displayName, description };
}

const COLOR_PALETTE = [
  "#ef4444", "#f59e0b", "#eab308", "#22c55e", "#10b981", "#06b6d4",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
  "#f43f5e", "#64748b", "#374151",
];

export default function EditRoleDialog({ open, onOpenChange, role, onRoleUpdated }: EditRoleDialogProps) {
  const t = useTranslations("AdminRoles.editDialog");
  const tCommon = useTranslations("AdminCommon");
  const params = useParams();
  const locale = (params?.locale as string) || "tr";
  const { user: currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    displayName: role.displayName, description: role.description || "",
    color: role.color || "#6366f1", layoutType: role.layoutType || "user", isActive: role.isActive,
    power: role.power || 0,
  });

  const isProtectedRole = role.isSystemDefault;

  const fetchData = useCallback(async () => {
    const permissionsPromise = fetch(`/api/admin/permissions?limit=1000&locale=${locale}`).then((res) => res.json());
    const rolePermissionsPromise = fetch(`/api/admin/roles/${role.id}/permissions`).then((res) => res.json());
    const [permissionsData, roleData] = await Promise.all([permissionsPromise, rolePermissionsPromise]);
    return { allPermissions: permissionsData.permissions || [], rolePermissions: roleData.permissions || [] };
  }, [role.id, locale]);

  const { data, isLoading: loadingPermissions } = useQuery({
    queryKey: ["editRolePermissions", role.id, locale],
    queryFn: fetchData,
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });
  const { assignablePermissions, initialSelectedIds, canEditRole, cannotEditReason } = useMemo(() => {
    if (!data?.allPermissions || !data?.rolePermissions || !currentUser) {
      return {
        assignablePermissions: [],
        initialSelectedIds: new Set<string>(),
        canEditRole: false,
        cannotEditReason: "Veriler yükleniyor..."
      };
    }

    const formattedPermissions = data.allPermissions.map((p: Permission) => formatPermission(p, locale));
    
    // Super admin tüm yetkileri atayabilir, diğerleri sadece kendi yetkilerini
    const permissionsUserCanAssign = currentUser.primaryRole === 'super_admin'
      ? formattedPermissions
      : formattedPermissions.filter((p: Permission) => currentUser.permissions.includes(p.name));
    
    const selectedIds = new Set<string>();
    data.rolePermissions.forEach((perm: Permission) => {
      const permission = permissionsUserCanAssign.find((p: Permission) => p.name === perm.name);
      if (permission) selectedIds.add(permission.id);
    });

    // Rol düzenleme kontrolleri
    let canEdit = false;
    let reason = null;
    
    if (currentUser.primaryRole === 'super_admin') {
      canEdit = true;
    } else if (isProtectedRole) {
      canEdit = false;
      reason = t('notifications.protectedRole');
    } else if (typeof currentUser.power !== 'number' || role.power >= currentUser.power) {
      canEdit = false;
      reason = t('notifications.cannotEditHigherOrEqualPower');
    } else {
      canEdit = true;
    }

    return {
      assignablePermissions: permissionsUserCanAssign,
      initialSelectedIds: selectedIds,
      canEditRole: canEdit,
      cannotEditReason: reason
    };
  }, [data?.allPermissions, data?.rolePermissions, currentUser, locale, isProtectedRole, t, role.power]);

  const [currentSelectedPermissions, setCurrentSelectedPermissions] = useState<Set<string>>(new Set());

  useEffect(() => { setCurrentSelectedPermissions(initialSelectedIds); }, [initialSelectedIds]);

  // Auto-calculate power based on permissions
  useEffect(() => {
    if (!currentUser) return;

    const newPower = currentSelectedPermissions.size * 10;

    // Super admin can set any power. Others are capped.
    if (currentUser.primaryRole === 'super_admin') {
        setFormData(prev => ({ ...prev, power: newPower }));
    } else {
        const cappedPower = Math.min(newPower, (currentUser.power || 1) - 1);
        setFormData(prev => ({ ...prev, power: cappedPower }));
    }
  }, [currentSelectedPermissions, currentUser]);

  useEffect(() => {
    if (open) {
      setFormData({
        displayName: role.displayName, description: role.description || "",
        color: role.color || "#6366f1", layoutType: role.layoutType || "customer", isActive: role.isActive,
        power: role.power || 0,
      });
      setSearchTerm("");
    }
  }, [open, role]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.displayName.trim()) newErrors.displayName = t("roleNameRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!canEditRole) {
      toast.error(cannotEditReason || "Bu rolü düzenlemek için yeterli yetkiye sahip değilsiniz");
      return;
    }
    if (!validateForm()) return;
    setLoading(true);
    try {
      const roleUpdateData = { ...formData, name: role.name }; // Name'i değiştirmemeye dikkat
      const roleResponse = await fetch(`/api/admin/roles/${role.id}/update`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(roleUpdateData),
      });
      if (!roleResponse.ok) throw new Error((await roleResponse.json()).error || t("notifications.updateError"));

      const permissionNames = Array.from(currentSelectedPermissions)
        .map((id) => assignablePermissions.find((p: Permission) => p.id === id)?.name)
        .filter(Boolean) as string[];

      const permissionsResponse = await fetch(`/api/admin/roles/${role.id}/permissions`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ permissions: permissionNames }),
        }
      );
      if (!permissionsResponse.ok) throw new Error((await permissionsResponse.json()).error);
      toast.success(t("notifications.updateSuccess"));
      onOpenChange(false);
      onRoleUpdated();
    } catch (error) {
      toast.error((error as Error).message || t("notifications.genericUpdateError"));
    } finally {
      setLoading(false);
    }
  };
  
  const handleLayoutTypeChange = (value: "admin" | "customer") => {
    setFormData((prev) => ({ ...prev, layoutType: value }));
    const newSelectedPermissions = new Set<string>();
    currentSelectedPermissions.forEach((permissionId) => {
      const permission = assignablePermissions.find((p: Permission) => p.id === permissionId);
      if (permission && permission.permissionType === value) {
        newSelectedPermissions.add(permissionId);
      }
    });
    const layoutPermissionName = value === "admin" ? "admin.layout" : "customer.layout";
    const layoutPermission = assignablePermissions.find((p: Permission) => p.name === layoutPermissionName);
    if (layoutPermission) {
      newSelectedPermissions.add(layoutPermission.id);
    }
    setCurrentSelectedPermissions(newSelectedPermissions);
  };
  
  const addPermission = (permissionId: string) => setCurrentSelectedPermissions((prev) => new Set(prev).add(permissionId));
  const removePermission = (permissionId: string) => setCurrentSelectedPermissions((prev) => {
    const next = new Set(prev);
    next.delete(permissionId);
    return next;
  });
  


  const availablePermissionsForUI = assignablePermissions.filter(
    (p: Permission) => !currentSelectedPermissions.has(p.id) && p.permissionType === formData.layoutType && p.category !== "layout" &&
    (p.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const currentPermissionsForUI = Array.from(currentSelectedPermissions)
    .map((id) => assignablePermissions.find((p: Permission) => p.id === id))
    .filter((p): p is Permission => p !== undefined && p.category !== "layout");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[94vw] sm:max-w-[95vw] lg:max-w-6xl max-h-[92vh] sm:max-h-[95vh] overflow-y-auto bg-blue-50 dark:bg-slate-900 backdrop-blur-sm p-0 border border-gray-200 dark:border-gray-800">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 p-3 pr-12 rounded-t-lg">
          <DialogTitle className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-bold">
             <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg"><Edit className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" /></div>
             <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 flex-wrap">
                 <span className="truncate">{role.displayName} {t("title")}</span>
                 {isProtectedRole && (<Badge variant="outline" className="text-orange-600 border-orange-600 text-xs shrink-0"><ShieldCheck className="w-3 h-3 mr-1" />{t("protectedRole")}</Badge>)}
                 {!canEditRole && cannotEditReason && (<Badge variant="destructive" className="text-xs shrink-0"><Shield className="w-3 h-3 mr-1" />Yetki Sınırlaması</Badge>)}
               </div>
               <p className="text-xs md:text-sm font-normal text-gray-600 dark:text-gray-400 mt-1 hidden md:block">
                 {!canEditRole && cannotEditReason ? cannotEditReason : t("roleInfoDescription")}
               </p>
             </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6 overflow-y-auto scroll-smooth">
          <div className="lg:col-span-1 space-y-4 md:space-y-6 overflow-y-auto md:pr-4 scroll-smooth">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Settings className="h-4 w-4" />{t("roleInfo")}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">{t("displayName")} *</Label>
                  <Input id="displayName" value={formData.displayName} onChange={(e) => setFormData((prev) => ({...prev, displayName: e.target.value,}))} placeholder={t("displayNamePlaceholder")} disabled={!canEditRole} className={errors.displayName ? "border-red-500" : ""} />
                  {errors.displayName && (<p className="text-xs text-red-500">{errors.displayName}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t("description")}</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => setFormData((prev) => ({...prev, description: e.target.value,}))} placeholder={t("descriptionPlaceholder")} disabled={!canEditRole} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>{t("accessType")}</Label>
                  <Select value={formData.layoutType} onValueChange={(value: "admin" | "customer") => handleLayoutTypeChange(value)} disabled={!canEditRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin"><div className="flex items-center gap-2"><Crown className="w-4 h-4" />{t("adminAccess")}</div></SelectItem>
                      <SelectItem value="customer"><div className="flex items-center gap-2"><Users className="w-4 h-4" />{t("customerAccess")}</div></SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">{t("color")}</Label>
                  <div className="flex gap-2 items-center">
                    <Input id="color" type="color" value={formData.color} onChange={(e) => setFormData((prev) => ({...prev, color: e.target.value, }))} disabled={!canEditRole} className="w-10 h-10 p-1 border rounded cursor-pointer" />
                    <div className="flex flex-wrap gap-1">
                      {COLOR_PALETTE.map((c) => (<button key={c} type="button" className="w-6 h-6 rounded-full border-2" style={{backgroundColor: c, borderColor: formData.color === c ? "black" : "transparent",}} onClick={() => setFormData((prevState) => ({...prevState, color: c,}))} disabled={!canEditRole} />))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="isActive" checked={formData.isActive} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))} disabled={!canEditRole} />
                  <Label htmlFor="isActive">{t("isActive")}</Label>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
            <Card className="flex-1 flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm md:text-base"><Shield className="h-4 w-4" />{t("permissionManagement")}</CardTitle>
                <Input placeholder={t("searchPermissions")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" disabled={!canEditRole} />
              </CardHeader>
              <CardContent className="flex-1 flex flex-col min-h-0">
                {loadingPermissions ? (<div className="flex items-center justify-center h-full"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>) : (
                  <>
                    <div className="hidden md:grid md:grid-cols-2 gap-4 flex-1 min-h-0">
                      <div className="flex flex-col gap-2 min-h-0">
                        <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400">{t("availablePermissions")} ({availablePermissionsForUI.length})</h4>
                        <ScrollArea className="flex-1 max-h-[60vh] border rounded-lg p-2">
                          <div className="space-y-1.5">
                            {availablePermissionsForUI.map((p: Permission) => (<div key={p.id} className="flex items-center justify-between p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-md"><span className="text-sm font-medium">{p.displayName}</span><Button size="icon" variant="ghost" onClick={() => { if (canEditRole) addPermission(p.id);}} disabled={!canEditRole} className="w-5 h-5 text-green-600"><Plus className="h-4 w-4" /></Button></div>))}
                          </div>
                        </ScrollArea>
                      </div>
                      <div className="flex flex-col gap-2 min-h-0">
                        <h4 className="font-semibold text-sm text-green-700 dark:text-green-400">{t("currentPermissions")} ({currentPermissionsForUI.length})</h4>
                        <ScrollArea className="flex-1 max-h-[60vh] border rounded-lg p-2">
                          <div className="space-y-1.5">
                            {currentPermissionsForUI.filter((p) => p.displayName.toLowerCase().includes(searchTerm.toLowerCase())).map((p) => (<div key={p.id} className="flex items-center justify-between p-1.5 bg-green-50 dark:bg-green-900/20 rounded-md"><span className="text-sm font-medium">{p.displayName}</span><Button size="icon" variant="ghost" onClick={() => { if (canEditRole) removePermission(p.id);}} disabled={!canEditRole} className="w-5 h-5 text-red-600"><X className="h-4 w-4" /></Button></div>))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                    <div className="md:hidden min-h-0 flex flex-col flex-1">
                      <Tabs defaultValue="current" className="flex flex-col h-full min-h-0">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="current" className="flex items-center gap-1 text-xs sm:text-sm"><ShieldCheck className="h-4 w-4" /><span className="hidden sm:inline">{t("currentPermissions")}</span><span className="sm:hidden">Mevcut</span>({currentPermissionsForUI.length})</TabsTrigger>
                          <TabsTrigger value="available" className="flex items-center gap-1 text-xs sm:text-sm"><Plus className="h-4 w-4" /><span className="hidden sm:inline">{t("available_permissions")}</span><span className="sm:hidden">Ekle</span>({availablePermissionsForUI.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="current" className="flex-1 mt-3 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
                          <ScrollArea className="max-h-[60vh] border rounded-lg p-2">
                             {/* Mobile current permissions... */}
                          </ScrollArea>
                        </TabsContent>
                        <TabsContent value="available" className="flex-1 mt-3 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
                           <ScrollArea className="max-h-[60vh] border rounded-lg p-2">
                             {/* Mobile available permissions... */}
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
        <DialogFooter className="p-3 bg-gray-100/80 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="order-2 sm:order-1">{tCommon("cancel")}</Button>
            <Button onClick={handleSubmit} disabled={loading || !formData.displayName.trim() || !canEditRole} className="order-1 sm:order-2">
              {loading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div><span className="hidden sm:inline">{t("updating")}</span><span className="sm:hidden">Güncelleniyor...</span></>) : (<><Save className="w-4 h-4 mr-2" /><span className="hidden sm:inline">{t("updateRole")}</span><span className="sm:hidden">Güncelle</span></>)}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
