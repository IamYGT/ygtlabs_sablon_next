"use client";

import {
  AdminPageGuard,
  FunctionGuard,
} from "@/components/panel/AdminPageGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function CustomersPageClient() {
  const [items, setItems] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<Customer | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "true" | "false">(
    "all"
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "10");
      params.set("page", String(page));
      if (q) params.set("q", q);
      if (statusFilter) params.set("isActive", statusFilter);

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      if (!res.ok) throw new Error("Müşteri listesi alınamadı");
      const data = await res.json();
      setItems(data.items || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (e) {
      console.error(e);
      toast.error("Müşteri listesi alınamadı");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  const filtered = useMemo(() => {
    if (!q) return items;
    const f = q.toLowerCase();
    return items.filter(
      (x) =>
        x.name.toLowerCase().includes(f) || x.email?.toLowerCase().includes(f)
    );
  }, [items, q]);

  return (
    <AdminPageGuard requiredPermission="admin.customers.view">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <span className="text-emerald-600 font-bold">C</span>
            </div>
            <h1 className="text-2xl font-bold">Müşteri Yönetimi</h1>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ara..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-56"
            />
            <Select
              value={statusFilter}
              onValueChange={(v: "all" | "true" | "false") => {
                setPage(1);
                setStatusFilter(v);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="true">Aktif</SelectItem>
                <SelectItem value="false">Pasif</SelectItem>
              </SelectContent>
            </Select>
            <FunctionGuard
              requiredPermission="customers.create"
              showMessage={false}
            >
              <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8">
                    Yeni
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Yeni Müşteri</DialogTitle>
                  </DialogHeader>
                  <CustomerForm
                    onSubmit={async (payload) => {
                      const res = await fetch("/api/admin/customers", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                      });
                      if (!res.ok) {
                        toast.error("Müşteri oluşturulamadı");
                        return;
                      }
                      toast.success("Müşteri oluşturuldu");
                      setCreateOpen(false);
                      await load();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </FunctionGuard>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Müşteriler</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-sm text-muted-foreground">Yükleniyor...</div>
            ) : filtered.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Firma</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="w-36" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.email || "-"}</TableCell>
                      <TableCell>{item.phone || "-"}</TableCell>
                      <TableCell>{item.company || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={item.isActive ? "default" : "secondary"}
                          >
                            {item.isActive ? "Aktif" : "Pasif"}
                          </Badge>
                          <FunctionGuard
                            requiredPermission="customers.update"
                            showMessage={false}
                          >
                            <Switch
                              checked={item.isActive}
                              onCheckedChange={async () => {
                                try {
                                  const res = await fetch(
                                    `/api/admin/customers/${item.id}`,
                                    {
                                      method: "PUT",
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                        isActive: !item.isActive,
                                      }),
                                    }
                                  );
                                  if (!res.ok)
                                    throw new Error("Durum güncellenemedi");
                                  toast.success(
                                    !item.isActive
                                      ? "Aktifleştirildi"
                                      : "Pasifleştirildi"
                                  );
                                  load();
                                } catch (err) {
                                  console.error(err);
                                  toast.error("Durum güncellenemedi");
                                }
                              }}
                            />
                          </FunctionGuard>
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <FunctionGuard
                          requiredPermission="customers.update"
                          showMessage={false}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditing(item)}
                          >
                            Düzenle
                          </Button>
                        </FunctionGuard>
                        <FunctionGuard
                          requiredPermission="customers.delete"
                          showMessage={false}
                        >
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleting(item)}
                          >
                            Sil
                          </Button>
                        </FunctionGuard>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-sm text-muted-foreground">
                Kayıt bulunamadı.
              </div>
            )}

            {/* Edit Dialog */}
            {editing && (
              <Dialog
                open={!!editing}
                onOpenChange={(open) => !open && setEditing(null)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Müşteri Düzenle</DialogTitle>
                  </DialogHeader>
                  <CustomerForm
                    initial={editing}
                    onSubmit={async (payload) => {
                      const res = await fetch(
                        `/api/admin/customers/${editing.id}`,
                        {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload),
                        }
                      );
                      if (!res.ok) {
                        toast.error("Müşteri güncellenemedi");
                        return;
                      }
                      toast.success("Müşteri güncellendi");
                      setEditing(null);
                      await load();
                    }}
                  />
                </DialogContent>
              </Dialog>
            )}

            {/* Delete Dialog */}
            {deleting && (
              <Dialog
                open={!!deleting}
                onOpenChange={(open) => !open && setDeleting(null)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Silme Onayı</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground mb-4">
                    "{deleting.name}" müşterisini silmek istediğinize emin
                    misiniz?
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeleting(null)}>
                      Vazgeç
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        const res = await fetch(
                          `/api/admin/customers/${deleting.id}`,
                          { method: "DELETE" }
                        );
                        if (!res.ok) {
                          toast.error("Müşteri silinemedi");
                          return;
                        }
                        toast.success("Müşteri silindi");
                        setDeleting(null);
                        await load();
                      }}
                    >
                      Sil
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
        {totalPages > 1 && (
          <div className="flex justify-end">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </AdminPageGuard>
  );
}

function CustomerForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<Customer>;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [company, setCompany] = useState(initial?.company || "");
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!name) {
      toast.error("İsim gereklidir");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name,
        email: email || undefined,
        phone: phone || undefined,
        company: company || undefined,
        isActive,
        notes: notes ? { tr: notes } : undefined,
      };
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Ad</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>E-posta</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Telefon</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <Label>Firma</Label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Notlar</Label>
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Opsiyonel"
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={isActive} onCheckedChange={setIsActive} />
        <Label>Aktif</Label>
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </div>
  );
}

