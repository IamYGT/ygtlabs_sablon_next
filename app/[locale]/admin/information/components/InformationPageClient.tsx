"use client";

import { AdminPageGuard } from "@/components/panel/AdminPageGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BlogSection } from "./BlogSection";
import { FAQSection } from "./FAQSection";

type Localized = { tr: string; en: string };

interface InfoArticle {
  id: string;
  title: Localized | string;
  content: Localized | string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

function parseJSONField(value: Localized | string): string {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as Localized;
      return parsed.tr || parsed.en || "";
    } catch {
      return value;
    }
  }
  return value.tr || value.en || "";
}

export default function InformationPageClient() {
  const [items, setItems] = useState<InfoArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/information");
        if (!res.ok) throw new Error("Failed to fetch information");
        const data = await res.json();
        const sorted = (data.items || []).sort(
          (a: InfoArticle, b: InfoArticle) => a.order - b.order
        );
        setItems(sorted);
      } catch (e) {
        console.error(e);
        toast.error("Bilgi listesi alınamadı");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return items;
    const f = q.toLowerCase();
    return items.filter((x) =>
      parseJSONField(x.title).toLowerCase().includes(f)
    );
  }, [items, q]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminPageGuard requiredPermission="admin.information.view">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600 font-bold">i</span>
            </div>
            <h1 className="text-2xl font-bold">Bilgi Merkezi</h1>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ara..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-56"
            />
          </div>
        </div>

        <Tabs defaultValue="articles">
          <TabsList>
            <TabsTrigger value="articles">Makale</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="faq">SSS</TabsTrigger>
          </TabsList>
          <TabsContent value="articles">
            <Card>
              <CardHeader>
                <CardTitle>İçerikler</CardTitle>
              </CardHeader>
              <CardContent>
                {filtered.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Başlık</TableHead>
                        <TableHead>Sıra</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead className="w-24" />
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
                            <Badge
                              variant={item.isActive ? "default" : "secondary"}
                            >
                              {item.isActive ? "Aktif" : "Pasif"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Düzenle
                            </Button>
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
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="blog">
            <BlogSection />
          </TabsContent>
          <TabsContent value="faq">
            <FAQSection />
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageGuard>
  );
}
