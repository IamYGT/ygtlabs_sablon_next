"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

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

interface UseUserManagementReturn {
  // User operations
  deleteUser: (userId: string) => Promise<boolean>;
  toggleUserStatus: (
    userId: string,
    currentStatus: boolean
  ) => Promise<boolean>;
  assignRole: (userId: string, roleId: string | null) => Promise<boolean>;

  // Bulk operations
  bulkActivate: (userIds: string[]) => Promise<boolean>;
  bulkDeactivate: (userIds: string[]) => Promise<boolean>;
  bulkDelete: (userIds: string[]) => Promise<boolean>;

  // Export
  exportUsersToCSV: (users: User[]) => void;

  // Loading states
  loading: boolean;
}

export function useUserManagement(): UseUserManagementReturn {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("AdminUsers");
  const locale = useLocale();

  const deleteUser = async (userId: string): Promise<boolean> => {
    if (!window.confirm(t("messages.deleteConfirmText"))) {
      return false;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(t("messages.deleteSuccess"));
        router.refresh();
        return true;
      } else {
        toast.error(result.error || t("messages.deleteError"));
        return false;
      }
    } catch (error) {
      console.error("User deletion error:", error);
      toast.error(t("messages.genericError"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (
    userId: string,
    currentStatus: boolean
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users/toggle-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      });

      if (response.ok) {
        toast.success(t("messages.statusUpdateSuccess"));
        router.refresh();
        return true;
      } else {
        toast.error(t("messages.statusUpdateError"));
        return false;
      }
    } catch (error) {
      console.error("Status toggle error:", error);
      toast.error(t("messages.statusUpdateError"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (
    userId: string,
    roleId: string | null
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, roleId }),
      });

      if (response.ok) {
        toast.success(t("messages.roleUpdateSuccess"));
        router.refresh();
        return true;
      } else {
        const result = await response.json();
        toast.error(result.error || t("messages.roleUpdateError"));
        return false;
      }
    } catch (error) {
      console.error("Role assignment error:", error);
      toast.error(t("messages.roleUpdateError"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const bulkActivate = async (userIds: string[]): Promise<boolean> => {
    return bulkOperation(userIds, "activate", t("bulkActions.activateAll"));
  };

  const bulkDeactivate = async (userIds: string[]): Promise<boolean> => {
    return bulkOperation(userIds, "deactivate", t("bulkActions.deactivateAll"));
  };

  const bulkDelete = async (userIds: string[]): Promise<boolean> => {
    if (
      !window.confirm(
        t("messages.bulkDeleteConfirmText", { count: userIds.length })
      )
    ) {
      return false;
    }
    return bulkOperation(
      userIds,
      "delete",
      t("messages.bulkDeleteSuccess", { count: userIds.length })
    );
  };

  const bulkOperation = async (
    userIds: string[],
    operation: string,
    successMessage: string
  ): Promise<boolean> => {
    if (userIds.length === 0) {
      toast.error(t("selectAtLeastOne"));
      return false;
    }

    setLoading(true);
    try {
      // Note: The API endpoint for bulk-update is hypothetical and needs to be implemented.
      // Assuming a single endpoint for activate/deactivate for simplicity.
      const endpoint =
        operation === "delete"
          ? "/api/admin/users/bulk-delete"
          : "/api/admin/users/bulk-update";
      const body =
        operation === "delete"
          ? { userIds }
          : { userIds, isActive: operation === "activate" };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(successMessage);
        router.refresh();
        return true;
      } else {
        const error = await response.json();
        toast.error(error.error || t("errorOccurred"));
        return false;
      }
    } catch (error) {
      console.error("Bulk operation error:", error);
      toast.error(t("messages.genericError"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const exportUsersToCSV = (users: User[]) => {
    const csvData = users.map((user) => ({
      [t("name")]: user.name || "",
      [t("email")]: user.email || "",
      [t("roles")]: user.currentRole?.displayName || t("noRoleAssigned"),
      [t("status")]: user.isActive ? t("active") : t("inactive"),
      [t("registrationDate")]: new Date(user.createdAt).toLocaleDateString(
        locale
      ),
    }));

    if (csvData.length === 0) {
      toast.error(t("errorOccurred")); // Or a more specific message
      return;
    }

    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast.success(t("messages.exportSuccess"));
  };

  return {
    deleteUser,
    toggleUserStatus,
    assignRole,
    bulkActivate,
    bulkDeactivate,
    bulkDelete,
    exportUsersToCSV,
    loading,
  };
}
