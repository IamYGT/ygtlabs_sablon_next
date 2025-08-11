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

export interface BlogPostItem {
  id: string;
  title: Localized | string;
  content: Localized | string;
  excerpt?: Localized | string | null;
  coverImage?: string | null;
  isActive: boolean;
  order: number;
  publishedAt?: string | null;
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

export function BlogSection() {
  const [items, setItems] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPostItem | null>(null);
  const [deleting, setDeleting] = useState<BlogPostItem | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/information/blog?limit=200`);
      if (!res.ok) throw new Error("Blog listesi alınamadı");
      const data = await res.json();
      setItems(
        (data.items || []).sort(
          (a: BlogPostItem, b: BlogPostItem) => a.order - b.order
        )
      );
    } catch (e) {
      console.error(e);
      toast.error("Blog listesi alınamadı");
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
      parseJSONField(x.title).toLowerCase().includes(f)
    );
  }, [items, q]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Blog</CardTitle>
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
                  <DialogTitle>Yeni Blog Yazısı</DialogTitle>
                </DialogHeader>
                <BlogForm
                  onSubmit={async (payload) => {
                    const res = await fetch("/api/admin/information/blog", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    if (!res.ok) {
                      toast.error("Blog oluşturulamadı");
                      return;
                    }
                    toast.success("Blog oluşturuldu");
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
                <TableHead>Başlık</TableHead>
                <TableHead>Sıra</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Yayın</TableHead>
                <TableHead className="w-36" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {parseJSONField(item.title)}
                  </TableCell>
                  <TableCell>#{item.order}</TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? "default" : "secondary"}>
                      {item.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString()
                      : "-"}
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
                <DialogTitle>Blog Yazısını Düzenle</DialogTitle>
              </DialogHeader>
              <BlogForm
                initial={editing}
                onSubmit={async (payload) => {
                  const res = await fetch(
                    `/api/admin/information/blog/${editing.id}`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    }
                  );
                  if (!res.ok) {
                    toast.error("Blog güncellenemedi");
                    return;
                  }
                  toast.success("Blog güncellendi");
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
                "{parseJSONField(deleting.title)}" başlıklı blog yazısını silmek
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
                      `/api/admin/information/blog/${deleting.id}`,
                      { method: "DELETE" }
                    );
                    if (!res.ok) {
                      toast.error("Blog silinemedi");
                      return;
                    }
                    toast.success("Blog silindi");
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

function BlogForm({
  initial,
  onSubmit,
}: {
  initial?: Partial<BlogPostItem>;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const [titleTR, setTitleTR] = useState(
    initial ? parseJSONField(initial.title) : ""
  );
  const [titleEN, setTitleEN] = useState("");
  const [contentTR, setContentTR] = useState(
    initial ? parseJSONField(initial.content) : ""
  );
  const [contentEN, setContentEN] = useState("");
  const [excerptTR, setExcerptTR] = useState(
    initial ? parseJSONField(initial.excerpt as any) : ""
  );
  const [excerptEN, setExcerptEN] = useState("");
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
  const [order, setOrder] = useState<number>(
    typeof initial?.order === "number" ? initial!.order : 0
  );
  const [isActive, setIsActive] = useState<boolean>(initial?.isActive ?? true);
  const [publishedAt, setPublishedAt] = useState<string>(
    initial?.publishedAt || ""
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!titleTR || !contentTR) {
      toast.error("Başlık ve içerik gereklidir");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: { tr: titleTR, en: titleEN || titleTR },
        content: { tr: contentTR, en: contentEN || contentTR },
        excerpt:
          excerptTR || excerptEN
            ? { tr: excerptTR, en: excerptEN || excerptTR }
            : undefined,
        coverImage: coverImage || undefined,
        order,
        isActive,
        publishedAt: publishedAt || undefined,
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
          <Label>Başlık (TR)</Label>
          <Input value={titleTR} onChange={(e) => setTitleTR(e.target.value)} />
        </div>
        <div>
          <Label>Title (EN)</Label>
          <Input value={titleEN} onChange={(e) => setTitleEN(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>İçerik (TR)</Label>
          <Textarea
            rows={6}
            value={contentTR}
            onChange={(e) => setContentTR(e.target.value)}
          />
        </div>
        <div>
          <Label>Content (EN)</Label>
          <Textarea
            rows={6}
            value={contentEN}
            onChange={(e) => setContentEN(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Önizleme (TR)</Label>
          <Textarea
            rows={3}
            value={excerptTR}
            onChange={(e) => setExcerptTR(e.target.value)}
          />
        </div>
        <div>
          <Label>Excerpt (EN)</Label>
          <Textarea
            rows={3}
            value={excerptEN}
            onChange={(e) => setExcerptEN(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Kapak Görseli URL</Label>
          <Input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://..."
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
      <div>
        <Label>Yayın Tarihi</Label>
        <Input
          type="datetime-local"
          value={publishedAt}
          onChange={(e) => setPublishedAt(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </div>
  );
}
