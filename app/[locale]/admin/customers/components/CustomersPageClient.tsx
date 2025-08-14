"use client";

import { AdminPageGuard } from "@/components/panel/AdminPageGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Locale } from "date-fns";
import { format } from "date-fns";
import * as dfLocales from "date-fns/locale";
import {
  CheckCircle,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
  Trash2,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CreateCustomerDialog } from "./CreateCustomerDialog";
import { DeleteCustomerDialog } from "./DeleteCustomerDialog";
import { EditCustomerDialog } from "./EditCustomerDialog";
import { ViewCustomerDialog } from "./ViewCustomerDialog";
import type { Customer } from "./types";

export default function CustomersPageClient() {
  const t = useTranslations("Customers");
  const tCommon = useTranslations("AdminCommon");
  const router = useRouter();
  const locale = useLocale();

  const [items, setItems] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<Customer | null>(null);
  const [viewing, setViewing] = useState<Customer | null>(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

  const dateLocale: Locale =
    (dfLocales as unknown as Record<string, Locale>)[locale] ?? dfLocales.enUS;

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "1000"); // Daha fazla veri çekmek için limiti artırabiliriz
      if (q) params.set("q", q);

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      if (!res.ok) throw new Error(t("messages.fetchError"));
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
      toast.error(t("messages.fetchError"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!q) return items;
    const f = q.toLowerCase();
    return items.filter(
      (x) =>
        x.name.toLowerCase().includes(f) ||
        x.email?.toLowerCase().includes(f) ||
        x.company?.toLowerCase().includes(f)
    );
  }, [items, q]);

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filtered.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filtered.map((c) => c.id));
    }
  };

  const handleBulkDelete = async () => {
    // Toplu silme API'si henüz yok, gelecekte eklenebilir.
    // Bu fonksiyon şimdilik bir uyarı gösterecek.
    toast.error("Toplu silme işlemi henüz desteklenmiyor.");
    setBulkDeleteModalOpen(false);
  };

  return (
    <AdminPageGuard requiredPermission="admin.customers.view">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {t("title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t("subtitle")}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {t("actions.newCustomer")}
          </Button>
        </div>

        {/* Customers Table */}
        <Card className="bg-blue-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-lg">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 text-base"
                />
              </div>
              {selectedCustomers.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setBulkDeleteModalOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t("actions.deleteSelected", {
                    count: selectedCustomers.length,
                  })}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-white dark:bg-gray-900">
                  <TableHead className="w-[50px] pl-6">
                    <Checkbox
                      checked={
                        selectedCustomers.length === filtered.length &&
                        filtered.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>{t("table.name")}</TableHead>
                  <TableHead>{t("table.contact")}</TableHead>
                  <TableHead>{t("table.company")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("table.createdAt")}</TableHead>
                  <TableHead className="text-right pr-6">
                    {t("table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      {t("loading")}
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      {t("empty")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-800/50"
                    >
                      <TableCell className="pl-6">
                        <Checkbox
                          checked={selectedCustomers.includes(item.id)}
                          onCheckedChange={() => handleSelectCustomer(item.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10">
                            <Image
                              src={`https://ui-avatars.com/api/?name=${
                                item.name || "C"
                              }&background=random`}
                              alt={item.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{item.email || "-"}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.phone || "-"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.company || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={item.isActive ? "default" : "secondary"}
                        >
                          {item.isActive ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {item.isActive
                            ? t("status.active")
                            : t("status.inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.createdAt), "PPP", {
                          locale: dateLocale,
                        })}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-9 w-9 p-0 rounded-lg"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewing(item)}>
                              <Eye className="h-4 w-4 mr-2" />
                              {t("actions.view")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditing(item)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {t("actions.edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleting(item)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              {t("actions.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Modals */}
        <CreateCustomerDialog
          open={isCreateOpen}
          onOpenChange={setCreateOpen}
          onSuccess={() => {
            load();
            router.refresh();
          }}
        />
        <EditCustomerDialog
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          customer={editing}
          onSuccess={() => {
            load();
            router.refresh();
          }}
        />
        <ViewCustomerDialog
          open={!!viewing}
          onOpenChange={(open) => !open && setViewing(null)}
          customer={viewing}
        />
        <DeleteCustomerDialog
          open={!!deleting}
          onOpenChange={(open) => !open && setDeleting(null)}
          customer={deleting}
          onSuccess={() => {
            load();
            router.refresh();
          }}
        />

        <Dialog
          open={bulkDeleteModalOpen}
          onOpenChange={setBulkDeleteModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("messages.bulkDeleteConfirmTitle")}</DialogTitle>
              <DialogDescription>
                {t("messages.bulkDeleteConfirmText", {
                  count: selectedCustomers.length,
                })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setBulkDeleteModalOpen(false)}
              >
                {tCommon("cancel")}
              </Button>
              <Button variant="destructive" onClick={handleBulkDelete}>
                {tCommon("delete")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageGuard>
  );
}
