"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Image as ImageIcon,
    ArrowUp,
    ArrowDown
} from "lucide-react";
import { CreateSliderDialog } from "./CreateSliderDialog";
import { EditSliderDialog } from "./EditSliderDialog";
import Image from "next/image";

// JSON field tiplerini tanımla
type LocalizedContent = {
    tr: string;
    en: string;
};

type ButtonConfig = {
    tr: { text: string; href: string };
    en: { text: string; href: string };
};

type StatisticsConfig = {
    tr: Array<{ label: string; value: string; icon?: string }>;
    en: Array<{ label: string; value: string; icon?: string }>;
};

interface HeroSlider {
    id: string;
    title: LocalizedContent | string;
    subtitle?: LocalizedContent | string;
    description: LocalizedContent | string;
    badge?: LocalizedContent | string;
    backgroundImage: string;
    primaryButton: ButtonConfig | string;
    secondaryButton?: ButtonConfig | string;
    statistics: StatisticsConfig | string;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
    createdBy?: {
        id: string;
        name?: string;
        email?: string;
    };
    updatedBy?: {
        id: string;
        name?: string;
        email?: string;
    };
}

// JSON field parse etme fonksiyonu
function parseJSONField(value: LocalizedContent | string | unknown, locale: string = 'tr'): string {
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value) as LocalizedContent;
            return parsed?.[locale as keyof LocalizedContent] || value;
        } catch {
            return value;
        }
    }

    if (typeof value === 'object' && value !== null) {
        const obj = value as Record<string, string>;
        return obj[locale] || obj.en || Object.values(obj)[0] || '';
    }

    return String(value || '');
}

export function HeroSliderPageClient() {
    const [sliders, setSliders] = useState<HeroSlider[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedSlider, setSelectedSlider] = useState<HeroSlider | null>(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState("");

    const fetchSliders = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/hero-slider?limit=100");

            if (!response.ok) {
                throw new Error("Slider'lar getirilemedi");
            }

            const data = await response.json();
            setSliders(data.sliders || []);
        } catch (error) {
            console.error("Slider fetch error:", error);
            toast.error("Slider'lar getirilemedi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    const handleDeleteSlider = async (sliderId: string) => {
        if (!confirm("Bu slider'ı silmek istediğinizden emin misiniz?")) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/hero-slider/${sliderId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Slider silinemedi");
            }

            toast.success("Slider başarıyla silindi");
            fetchSliders();
        } catch (error) {
            console.error("Slider delete error:", error);
            const errorMessage = error instanceof Error ? error.message : "Slider silinirken bir hata oluştu";
            toast.error(errorMessage);
        }
    };

    const handleToggleActive = async (sliderId: string, currentStatus: boolean) => {
        try {
            const response = await fetch(`/api/admin/hero-slider/${sliderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Durum güncellenemedi");
            }

            toast.success(`Slider ${!currentStatus ? "aktif edildi" : "devre dışı bırakıldı"}`);
            fetchSliders();
        } catch (error) {
            console.error("Toggle status error:", error);
            const errorMessage = error instanceof Error ? error.message : "Durum güncellenirken hata oluştu";
            toast.error(errorMessage);
        }
    };

    const handleEditSlider = (slider: HeroSlider) => {
        setSelectedSlider(slider);
        setEditDialogOpen(true);
    };

    const handleImagePreview = (imageUrl: string) => {
        setPreviewImageUrl(imageUrl);
        setImagePreviewOpen(true);
    };

    const handleOrderChange = async (sliderId: string, direction: 'up' | 'down') => {
        const slider = sliders.find(s => s.id === sliderId);
        if (!slider) return;

        const newOrder = direction === 'up' ? slider.order - 1 : slider.order + 1;

        try {
            const response = await fetch(`/api/admin/hero-slider/${sliderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: newOrder }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Sıralama güncellenemedi");
            }

            toast.success("Sıralama güncellendi");
            fetchSliders();
        } catch (error) {
            console.error("Order update error:", error);
            const errorMessage = error instanceof Error ? error.message : "Sıralama güncellenirken hata oluştu";
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Slider&apos;lar yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Hero Slider Yönetimi</h1>
                    <p className="text-muted-foreground">
                        Ana sayfa slider&apos;larını oluşturun ve yönetin
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Slider
                </Button>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Toplam Slider</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sliders.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Aktif Slider</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {sliders.filter(s => s.isActive).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pasif Slider</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-500">
                            {sliders.filter(s => !s.isActive).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Slider Listesi */}
            <Card>
                <CardHeader>
                    <CardTitle>Slider Listesi ({sliders.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Görsel</TableHead>
                                <TableHead>Başlık</TableHead>
                                <TableHead>Açıklama</TableHead>
                                <TableHead>Sıra</TableHead>
                                <TableHead>Durum</TableHead>
                                <TableHead>Oluşturan</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sliders.map((slider) => (
                                <TableRow key={slider.id}>
                                    <TableCell>
                                        <div
                                            className="relative w-20 h-12 bg-gray-100 rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all group"
                                            onClick={() => slider.backgroundImage && handleImagePreview(slider.backgroundImage)}
                                        >
                                            {slider.backgroundImage ? (
                                                <>
                                                    <Image
                                                        src={slider.backgroundImage}
                                                        alt="Slider"
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                        quality={75}
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                                                        <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <ImageIcon className="h-4 w-4 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">
                                                {parseJSONField(slider.title)}
                                            </div>
                                            {slider.subtitle && (
                                                <div className="text-sm text-muted-foreground">
                                                    {parseJSONField(slider.subtitle)}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-xs truncate">
                                            {parseJSONField(slider.description)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <span className="font-mono text-sm">{slider.order}</span>
                                            <div className="flex flex-col">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-4 w-4 p-0"
                                                    onClick={() => handleOrderChange(slider.id, 'up')}
                                                >
                                                    <ArrowUp className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-4 w-4 p-0"
                                                    onClick={() => handleOrderChange(slider.id, 'down')}
                                                >
                                                    <ArrowDown className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={slider.isActive ? "default" : "secondary"}>
                                            {slider.isActive ? "Aktif" : "Pasif"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            {slider.createdBy?.name || slider.createdBy?.email || "Bilinmeyen"}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditSlider(slider)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Düzenle
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleToggleActive(slider.id, slider.isActive)}
                                                >
                                                    {slider.isActive ? (
                                                        <>
                                                            <EyeOff className="h-4 w-4 mr-2" />
                                                            Devre Dışı Bırak
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Aktif Et
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteSlider(slider.id)}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Sil
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {sliders.length === 0 && (
                        <div className="text-center py-8">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-muted-foreground">Henüz slider oluşturulmamış.</p>
                            <Button
                                onClick={() => setCreateDialogOpen(true)}
                                className="mt-4"
                            >
                                İlk Slider&apos;ınızı Oluşturun
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialogs */}
            <CreateSliderDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={fetchSliders}
            />

            {selectedSlider && (
                <EditSliderDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    slider={selectedSlider}
                    onSuccess={fetchSliders}
                />
            )}

            {/* Image Preview Dialog */}
            <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>Görsel Önizleme</DialogTitle>
                    </DialogHeader>
                    <div className="p-6 pt-0">
                        {previewImageUrl && (
                            <div className="relative w-full">
                                <Image
                                    src={previewImageUrl}
                                    alt="Slider Preview"
                                    width={800}
                                    height={600}
                                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                                    priority={true}
                                    quality={95}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                    onError={() => console.error('Slider görsel yüklenirken hata oluştu')}
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
} 