"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Search,
  Shield,
  User,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getAssignableRoles, canAssignRole } from "@/lib/utils/role-hierarchy";
import { useAuthStore } from "@/lib/stores/auth-store";

interface Role {
  id: string;
  name: string;
  displayName: string;
  color: string | null;
  isActive: boolean;
  isSystemDefault: boolean;
}

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
  onUserCreated: () => void;
}

export default function CreateUserModal({
  open,
  onOpenChange,
  roles,
  onUserCreated,
}: CreateUserModalProps) {
  const t = useTranslations("AdminUsers.createUser");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuthStore();
  const [assignableRoles, setAssignableRoles] = useState<Role[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    isActive: true,
  });
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Kullanıcının atayabileceği rolleri filtrele
  useEffect(() => {
    if (currentUser?.currentRole?.name) {
      const assignableRoleNames = getAssignableRoles(currentUser.currentRole.name);
      const filteredAssignableRoles = roles.filter(
        (role) => 
          role.isActive && 
          assignableRoleNames.includes(role.name)
      );
      setAssignableRoles(filteredAssignableRoles);
    } else {
      // Eğer kullanıcının rolü yoksa hiçbir rol atamasın
      setAssignableRoles([]);
    }
  }, [currentUser, roles]);

  // Filtrelenmiş roller (hem atanabilir hem de arama ile filtrelenmiş)
  const filteredRoles = assignableRoles.filter(
    (role) =>
      role.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleSelect = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role && currentUser?.currentRole?.name && !canAssignRole(currentUser.currentRole.name, role.name)) {
      toast.error("Bu rolü atama yetkiniz yok");
      return;
    }
    setSelectedRole((prev) => (prev === roleId ? "" : roleId));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      isActive: true,
    });
    setSelectedRole("");
    setSearchTerm("");
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasyon
    if (!formData.name.trim()) {
      toast.error(t("validation.nameRequired"));
      return;
    }

    if (!formData.email.trim()) {
      toast.error(t("validation.emailRequired"));
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      toast.error(t("validation.passwordMinLength"));
      return;
    }

    if (!selectedRole) {
      toast.error(t("validation.roleRequired"));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          roleId: selectedRole,
          isActive: formData.isActive,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(t("successMessage"));
        resetForm();
        onOpenChange(false);
        onUserCreated();
      } else {
        toast.error(result.error || t("errorMessage"));
      }
    } catch (error) {
      console.error("User creation error:", error);
      toast.error(t("genericError"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-blue-50 dark:bg-slate-900 backdrop-blur-sm p-0 border border-gray-200 dark:border-gray-800">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 p-3 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
              <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {t("title")}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {t("description")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Temel Bilgiler */}
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                {t("basicInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">{t("fullNameLabel")} *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t("fullNamePlaceholder")}
                    disabled={loading}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t("emailLabel")} *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t("emailPlaceholder")}
                      className="pl-9"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">{t("passwordLabel")} *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t("passwordPlaceholder")}
                      className="pl-9 pr-9"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("passwordHint")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                  <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                {t("roleAndStatus")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Durum */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive">{t("accountStatusLabel")}</Label>
                  <p className="text-xs text-muted-foreground">
                    {t("accountStatusDescription")}
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={handleSwitchChange}
                  disabled={loading}
                />
              </div>

              <Separator />

              {/* Rol Seçimi */}
              <div className="space-y-4">
                {/* Arama */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("roleSearchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    disabled={loading}
                  />
                </div>

                {/* Rol Listesi */}
                <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-2">
                  {assignableRoles.length === 0 ? (
                    <div className="text-center py-4">
                      <AlertCircle className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Rol atama yetkiniz bulunmuyor
                      </p>
                    </div>
                  ) : filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => {
                      const canAssign = currentUser?.currentRole?.name ? 
                        canAssignRole(currentUser.currentRole.name, role.name) : false;
                      return (
                      <div
                        key={role.id}
                        className={`flex items-center space-x-3 p-2 rounded-md ${
                          !canAssign ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          id={`role-${role.id}`}
                          name="selectedRole"
                          checked={selectedRole === role.id}
                          onChange={() => handleRoleSelect(role.id)}
                          disabled={!canAssign}
                          className="h-4 w-4 text-primary disabled:opacity-50"
                        />
                        <label
                          htmlFor={`role-${role.id}`}
                          className={`flex-1 flex items-center gap-3 ${
                            canAssign ? 'cursor-pointer' : 'cursor-not-allowed'
                          }`}
                          onClick={() => canAssign && handleRoleSelect(role.id)}
                        >
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
                          {role.isSystemDefault && (
                            <Badge variant="outline" className="text-xs">
                              {t("systemDefault")}
                            </Badge>
                          )}
                        </label>
                      </div>
                    );})
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      {t("roleNotFound")}
                    </div>
                  )}
                </div>

                {/* Seçili Rol */}
                {selectedRole && (
                  <div>
                    <Label className="text-sm">{t("selectedRoleLabel")}</Label>
                    <div className="mt-2">
                      {(() => {
                        const role = roles.find((r) => r.id === selectedRole);
                        return role ? (
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: role.color || "#6366f1",
                              color: "white",
                            }}
                          >
                            {role.displayName}
                          </Badge>
                        ) : null;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </form>

        <DialogFooter className="p-3 bg-gray-100/80 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              loading ||
              !formData.name ||
              !formData.email ||
              !formData.password ||
              !selectedRole
            }
            className="shadow h-8 rounded-md bg-blue-600 text-white text-xs px-4"
          >
            {loading ? t("creating") : t("createButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
