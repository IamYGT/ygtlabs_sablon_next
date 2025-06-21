"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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

  const deleteUser = async (userId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Kullanıcı başarıyla silindi");
        router.refresh();
        return true;
      } else {
        toast.error(result.error || "Kullanıcı silinemedi");
        return false;
      }
    } catch (error) {
      console.error("User deletion error:", error);
      toast.error("Bir hata oluştu");
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
        toast.success(
          `Kullanıcı ${
            !currentStatus ? "aktif edildi" : "devre dışı bırakıldı"
          }`
        );
        router.refresh();
        return true;
      } else {
        toast.error("İşlem başarısız oldu");
        return false;
      }
    } catch (error) {
      console.error("Status toggle error:", error);
      toast.error("Kullanıcı durumu güncellenirken bir hata oluştu");
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
        toast.success("Rol başarıyla güncellendi");
        router.refresh();
        return true;
      } else {
        const result = await response.json();
        toast.error(result.error || "Rol güncellenirken hata oluştu");
        return false;
      }
    } catch (error) {
      console.error("Role assignment error:", error);
      toast.error("Rol güncelleme başarısız oldu");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const bulkActivate = async (userIds: string[]): Promise<boolean> => {
    return bulkOperation(userIds, "activate", "Kullanıcılar aktif edildi");
  };

  const bulkDeactivate = async (userIds: string[]): Promise<boolean> => {
    return bulkOperation(
      userIds,
      "deactivate",
      "Kullanıcılar devre dışı bırakıldı"
    );
  };

  const bulkDelete = async (userIds: string[]): Promise<boolean> => {
    if (
      !confirm(
        `${userIds.length} kullanıcıyı silmek istediğinizden emin misiniz?`
      )
    ) {
      return false;
    }
    return bulkOperation(userIds, "delete", "Kullanıcılar silindi");
  };

  const bulkOperation = async (
    userIds: string[],
    operation: string,
    successMessage: string
  ): Promise<boolean> => {
    if (userIds.length === 0) {
      toast.error("Lütfen en az bir kullanıcı seçin");
      return false;
    }

    setLoading(true);
    try {
      let response;
      switch (operation) {
        case "activate":
          response = await fetch("/api/admin/users/bulk-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userIds, isActive: true }),
          });
          break;
        case "deactivate":
          response = await fetch("/api/admin/users/bulk-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userIds, isActive: false }),
          });
          break;
        case "delete":
          response = await fetch("/api/admin/users/bulk-delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userIds }),
          });
          break;
        default:
          throw new Error("Geçersiz işlem");
      }

      if (response.ok) {
        toast.success(successMessage);
        router.refresh();
        return true;
      } else {
        const error = await response.json();
        toast.error(error.error || "İşlem başarısız oldu");
        return false;
      }
    } catch (error) {
      console.error("Bulk operation error:", error);
      toast.error("Beklenmeyen bir hata oluştu");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const exportUsersToCSV = (users: User[]) => {
    const csvData = users.map((user) => ({
      Ad: user.name || "",
      "E-posta": user.email || "",
      Rol: user.currentRole?.displayName || "Rol Atanmamış",
      Durum: user.isActive ? "Aktif" : "Pasif",
      "Kayıt Tarihi": new Date(user.createdAt).toLocaleDateString("tr-TR"),
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `kullanicilar_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();

    toast.success("Kullanıcı listesi CSV olarak indirildi");
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
