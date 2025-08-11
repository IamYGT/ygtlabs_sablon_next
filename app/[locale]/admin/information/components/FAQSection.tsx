"use client";

import { FunctionGuard } from "@/components/panel/AdminPageGuard";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Localized = { tr: string; en: string };

export interface FAQItem {
  id: string;
  question: Localized | string;
  answer: Localized | string;
  category?: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

function parseJSONField(value: Localized | string | null | undefined): string {
  if (!value) return "";
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as Localized;
      return parsed.tr || parsed.en || value;
    } catch {
      return value;
    }
  }
  return value.tr || value.en || "";
}

export function FAQSection() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [deleting, setDeleting] = useState<FAQItem | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/information/faq?limit=500`);
      if (!res.ok) throw new Error("SSS listesi alınamadı");
      const data = await res.json();
      setItems(
        (data.items || []).sort((a: FAQItem, b: FAQItem) => a.order - b.order)
      );
    } catch (e) {
      console.error(e);
      toast.error("SSS listesi alınamadı");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return items;
    const f = q.toLowerCase();
    return items.filter((x) =>
      parseJSONField(x.question).toLowerCase().includes(f)
    );
  }, [items, q]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>SSS</CardTitle>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Ara..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-56"
          />
          <FunctionGuard
            requiredPermission="information.create"
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
                  <DialogTitle>Yeni SSS</DialogTitle>
                </DialogHeader>
                <FAQForm
                  onSubmit={async (payload) => {
                    const res = await fetch("/api/admin/information/faq", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    if (!res.ok) {
                      toast.error("SSS oluşturulamadı");
                      return;
                    }
                    toast.success("SSS oluşturuldu");
                    setCreateOpen(false);
                    await load();
                  }}
                />
              </DialogContent>
            </Dialog>
          </FunctionGuard>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-sm text-muted-foreground">Yükleniyor...</div>
        ) : filtered.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Soru</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Sıra</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="w-36" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {parseJSONField(item.question)}
                  </TableCell>
                  <TableCell>{item.category || "-"}</TableCell>
                  <TableCell>#{item.order}</TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? "default" : "secondary"}>
                      {item.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <FunctionGuard
                      requiredPermission="information.update"
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
                      requiredPermission="information.delete"
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
          <div className="text-sm text-muted-foreground">Kayıt bulunamadı.</div>
        )}

        {/* Edit Dialog */}
        {editing && (
          <Dialog
            open={!!editing}
            onOpenChange={(open) => !open && setEditing(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>SSS Düzenle</DialogTitle>
              </DialogHeader>
              <FAQForm
                initial={editing}
                onSubmit={async (payload) => {
                  const res = await fetch(
                    `/api/admin/information/faq/${editing.id}`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    }
                  );
                  if (!res.ok) {
                    toast.error("SSS güncellenemedi");
                    return;
                  }
                  toast.success("SSS güncellendi");
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
                "{parseJSONField(deleting.question)}" sorusunu silmek
                istediğinize emin misiniz?
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleting(null)}>
                  Vazgeç
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    const res = await fetch(
                      `/api/admin/information/faq/${deleting.id}`,
                      { method: "DELETE" }
                    );
                    if (!res.ok) {
                      toast.error("SSS silinemedi");
                      return;
                    }
                    toast.success("SSS silindi");
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
  );
}

function FAQForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<FAQItem>;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [trQ, setTrQ] = useState(
    initial ? parseJSONField(initial.question) : ""
  );
  const [enQ, setEnQ] = useState("");
  const [trA, setTrA] = useState(initial ? parseJSONField(initial.answer) : "");
  const [enA, setEnA] = useState("");
  const [category, setCategory] = useState(initial?.category || "");
  const [order, setOrder] = useState<number>(
    typeof initial?.order === "number" ? initial!.order : 0
  );
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!trQ || !trA) {
      toast.error("Soru ve cevap gereklidir");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        question: { tr: trQ, en: enQ || trQ },
        answer: { tr: trA, en: enA || trA },
        category: category || undefined,
        order,
        isActive,
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
          <Label>Soru (TR)</Label>
          <Input value={trQ} onChange={(e) => setTrQ(e.target.value)} />
        </div>
        <div>
          <Label>Question (EN)</Label>
          <Input value={enQ} onChange={(e) => setEnQ(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Cevap (TR)</Label>
          <Textarea
            rows={5}
            value={trA}
            onChange={(e) => setTrA(e.target.value)}
          />
        </div>
        <div>
          <Label>Answer (EN)</Label>
          <Textarea
            rows={5}
            value={enA}
            onChange={(e) => setEnA(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 items-end">
        <div>
          <Label>Kategori</Label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="opsiyonel"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 items-end">
          <div>
            <Label>Sıra</Label>
            <Input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value || "0", 10))}
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Aktif</Label>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </div>
  );
}
