"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from 'next-intl';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Image as ImageIcon,
    GripVertical,
    Languages,
    BarChart3,
    User,
    CheckCircle,
    XCircle,
    Calendar,
    ArrowUpDown,
    Sparkles,
    Zap
} from "lucide-react";
import { CreateSliderDialog } from "./CreateSliderDialog";
import { EditSliderDialog } from "./EditSliderDialog";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Image from "next/image";
import { FlagWrapper } from '@/components/ui/flag-wrapper';

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

// Drag and Drop constants
const ItemTypes = {
    SLIDER: 'slider'
};

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

// Draggable Table Row Component
interface DraggableRowProps {
    slider: HeroSlider;
    index: number;
    moveSlider: (dragIndex: number, hoverIndex: number) => void;
    onEdit: (slider: HeroSlider) => void;
    onDelete: (sliderId: string) => void;
    onToggleActive: (sliderId: string, currentStatus: boolean) => void;
    onImagePreview: (imageUrl: string) => void;
    locale: string;
}

function DraggableRow({
    slider,
    index,
    moveSlider,
    onEdit,
    onDelete,
    onToggleActive,
    onImagePreview,
    locale
}: DraggableRowProps) {
    const t = useTranslations('HeroSlider');
    const [{ isDragging }, drag, preview] = useDrag({
        type: ItemTypes.SLIDER,
        item: { index, id: slider.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.SLIDER,
        hover: (item: { index: number }) => {
            if (item.index !== index) {
                moveSlider(item.index, index);
                item.index = index;
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const attachRef = (node: HTMLTableRowElement | null) => {
        preview(drop(node));
    };

    const attachDragRef = (node: HTMLDivElement | null) => {
        drag(node);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <TableRow
            ref={attachRef}
            className={`
                transition-all duration-300 border-b border-gray-100 dark:border-gray-800 group
                ${isDragging ? 'opacity-40 scale-[0.98] shadow-2xl z-50' : 'opacity-100 scale-100'} 
                ${isOver ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-700 shadow-md' : ''}
                hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-800/50 dark:hover:to-slate-800/50
                hover:shadow-sm hover:-translate-y-0.5
            `}
        >
            <TableCell className="w-10 py-4">
                <div
                    ref={attachDragRef}
                    className="cursor-grab active:cursor-grabbing p-2 rounded-lg hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200 hover:shadow-sm"
                >
                    <GripVertical className="h-4 w-4 text-gray-400 hover:text-blue-600 transition-colors" />
                </div>
            </TableCell>

            <TableCell className="py-4">
                <div
                    className="relative w-20 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 transition-all duration-300 group/image hover:shadow-lg hover:scale-105"
                    onClick={() => slider.backgroundImage && onImagePreview(slider.backgroundImage)}
                >
                    {slider.backgroundImage ? (
                        <>
                            <Image
                                src={slider.backgroundImage}
                                alt="Slider"
                                fill
                                className="object-cover transition-transform duration-300 group-hover/image:scale-110"
                                sizes="80px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-300 flex items-center justify-center">
                                <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-1.5 transform scale-75 group-hover/image:scale-100 transition-transform duration-200">
                                    <Eye className="h-3 w-3 text-gray-700 dark:text-gray-300" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-2">
                                <ImageIcon className="h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    )}
                </div>
            </TableCell>

            <TableCell className="py-4 max-w-xs">
                <div className="space-y-2">
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        {parseJSONField(slider.title, locale)}
                    </div>
                    {slider.subtitle && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                            {parseJSONField(slider.subtitle, locale)}
                        </div>
                    )}
                    {slider.badge && (
                        <Badge variant="outline" className="text-xs h-5 px-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                            {parseJSONField(slider.badge, locale)}
                        </Badge>
                    )}
                </div>
            </TableCell>

            <TableCell className="py-4 max-w-sm">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                    {parseJSONField(slider.description, locale)}
                </p>
            </TableCell>

            <TableCell className="py-4 text-center">
                <div className="flex items-center justify-center">
                    <Badge variant="secondary" className="font-mono text-xs bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                        #{slider.order}
                    </Badge>
                </div>
            </TableCell>

            <TableCell className="py-4">
                <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-full ${slider.isActive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        {slider.isActive ? (
                            <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                        ) : (
                            <XCircle className="h-3 w-3 text-gray-400" />
                        )}
                    </div>
                    <Badge
                        variant={slider.isActive ? "default" : "secondary"}
                        className={`text-xs font-medium ${slider.isActive
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 dark:from-green-900/50 dark:to-emerald-900/50 dark:text-green-100 dark:border-green-700'
                            : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-600 border-gray-200 dark:from-gray-800 dark:to-slate-800 dark:text-gray-300 dark:border-gray-700'
                            }`}
                    >
                        {slider.isActive ? (
                            <span className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                {t('status.active')}
                            </span>
                        ) : (
                            t('status.inactive')
                        )}
                    </Badge>
                </div>
            </TableCell>

            <TableCell className="py-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-1">
                            <User className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium">{slider.createdBy?.name || t('system')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                            <Calendar className="h-2.5 w-2.5 text-gray-500" />
                        </div>
                        <span>{formatDate(slider.createdAt)}</span>
                    </div>
                </div>
            </TableCell>

            <TableCell className="py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gradient-to-br hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-800 dark:hover:to-slate-800 transition-all duration-200">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl">
                        <DropdownMenuItem onClick={() => onEdit(slider)} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30">
                            <Edit className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="font-medium">{t('actions.edit')}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onToggleActive(slider.id, slider.isActive)}
                            className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 dark:hover:from-amber-950/30 dark:hover:to-yellow-950/30"
                        >
                            {slider.isActive ? (
                                <>
                                    <EyeOff className="h-4 w-4 mr-2 text-amber-600" />
                                    <span className="font-medium">{t('actions.deactivate')}</span>
                                </>
                            ) : (
                                <>
                                    <Eye className="h-4 w-4 mr-2 text-green-600" />
                                    <span className="font-medium">{t('actions.activate')}</span>
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(slider.id)}
                            className="text-red-600 focus:text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-950/30 dark:hover:to-rose-950/30"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span className="font-medium">{t('actions.delete')}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}

export function HeroSliderPageClient() {
    const t = useTranslations('HeroSlider');

    const [sliders, setSliders] = useState<HeroSlider[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedSlider, setSelectedSlider] = useState<HeroSlider | null>(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState("");
    const [locale, setLocale] = useState<'tr' | 'en'>('tr');

    const fetchSliders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/hero-slider?limit=100");

            if (!response.ok) {
                throw new Error(t('messages.fetchError'));
            }

            const data = await response.json();
            // Sıralamaya göre düzenle
            const sortedSliders = (data.sliders || []).sort((a: HeroSlider, b: HeroSlider) => a.order - b.order);
            setSliders(sortedSliders);
        } catch (error) {
            console.error("Slider fetch error:", error);
            toast.error(t('messages.fetchError'));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchSliders();
    }, [fetchSliders]);

    const handleDeleteSlider = async (sliderId: string) => {
        if (!confirm(t('messages.deleteConfirm'))) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/hero-slider/${sliderId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || t('messages.deleteError'));
            }

            toast.success(t('messages.deleteSuccess'));
            fetchSliders();
        } catch (error) {
            console.error("Slider delete error:", error);
            const errorMessage = error instanceof Error ? error.message : t('messages.deleteError');
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
                throw new Error(error.error || t('messages.updateError'));
            }

            toast.success(!currentStatus ? t('messages.activateSuccess') : t('messages.deactivateSuccess'));
            fetchSliders();
        } catch (error) {
            console.error("Toggle status error:", error);
            const errorMessage = error instanceof Error ? error.message : t('messages.updateError');
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

    const moveSlider = useCallback(async (dragIndex: number, hoverIndex: number) => {
        const draggedSlider = sliders[dragIndex];
        const hoveredSlider = sliders[hoverIndex];

        if (!draggedSlider || !hoveredSlider) return;

        // Optimistic update - UI'ı hemen güncelle
        const newSliders = [...sliders];
        newSliders.splice(dragIndex, 1);
        newSliders.splice(hoverIndex, 0, draggedSlider);

        // Order değerlerini güncelle
        const updatedSliders = newSliders.map((slider, index) => ({
            ...slider,
            order: index + 1
        }));

        setSliders(updatedSliders);

        try {
            // Backend'e batch update gönder
            const updatePromises = updatedSliders.map((slider, index) =>
                fetch(`/api/admin/hero-slider/${slider.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ order: index + 1 }),
                })
            );

            await Promise.all(updatePromises);
            toast.success(t('messages.sortingSuccess'));
        } catch (error) {
            console.error("Order update error:", error);
            toast.error(t('messages.sortingError'));
            // Hata durumunda verileri yeniden yükle
            fetchSliders();
        }
    }, [sliders, fetchSliders, t]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                        <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-t-blue-400 animate-ping mx-auto opacity-20"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">{t('loading')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{t('loadingWait')}</p>
                </div>
            </div>
        );
    }

    const activeSliders = sliders.filter(s => s.isActive);
    const inactiveSliders = sliders.filter(s => !s.isActive);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="space-y-8 p-1">
                {/* Enhanced Header */}
                <div className="relative overflow-hidden rounded-2xl">
                    <div className="relative flex items-center justify-between p-8">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                    <Sparkles className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                        {t('title')}
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1 font-medium">
                                        {t('subtitle')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Select value={locale} onValueChange={(value: 'tr' | 'en') => setLocale(value)}>
                                <SelectTrigger className="w-36 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-200">
                                    <div className="flex items-center gap-2">
                                        <Languages className="h-4 w-4 text-blue-600" />
                                        <SelectValue />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-blue-200 dark:border-blue-800">
                                    <SelectItem value="tr">
                                        <div className="flex items-center gap-2">
                                            <FlagWrapper locale="tr" className="w-5 h-3 rounded-sm object-cover shadow-sm" />
                                            {t('languages.tr')}
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="en">
                                        <div className="flex items-center gap-2">
                                            <FlagWrapper locale="en" className="w-5 h-3 rounded-sm object-cover shadow-sm" />
                                            {t('languages.en')}
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={() => setCreateDialogOpen(true)}
                                className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t('newSlider')}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full -translate-y-10 translate-x-10"></div>
                        <CardHeader className="pb-3 relative">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-300">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                    <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                {t('stats.total')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                                {sliders.length}
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{t('stats.totalDesc')}</p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/50">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full -translate-y-10 translate-x-10"></div>
                        <CardHeader className="pb-3 relative">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-green-700 dark:text-green-300">
                                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                                {t('stats.active')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-green-800 dark:text-green-200">
                                {activeSliders.length}
                            </div>
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">{t('stats.activeDesc')}</p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-950/50 dark:to-slate-900/50">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-400/20 to-slate-600/20 rounded-full -translate-y-10 translate-x-10"></div>
                        <CardHeader className="pb-3 relative">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <XCircle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                </div>
                                {t('stats.inactive')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                                {inactiveSliders.length}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t('stats.inactiveDesc')}</p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/50 dark:to-violet-900/50">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-600/20 rounded-full -translate-y-10 translate-x-10"></div>
                        <CardHeader className="pb-3 relative">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-purple-700 dark:text-purple-300">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                    <Languages className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                {t('stats.currentLanguage')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200 flex items-center gap-3">
                                <FlagWrapper locale={locale} className="w-8 h-5 rounded-md object-cover shadow-md" />
                                <span>{locale.toUpperCase()}</span>
                            </div>
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{t('stats.currentLanguageDesc')}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Enhanced Slider List */}
                <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/80 dark:to-slate-800/80 backdrop-blur-sm">
                        <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg">
                                <ArrowUpDown className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold">{t('listTitle')}</span>
                                <Badge variant="outline" className="ml-3 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50">
                                    {sliders.length} {t('slider')}
                                </Badge>
                                <Badge variant="outline" className="ml-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 flex items-center gap-1.5">
                                    <FlagWrapper locale={locale} className="w-4 h-2.5 rounded-sm object-cover" />
                                    {locale === 'tr' ? t('languages.tr') : t('languages.en')}
                                </Badge>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {sliders.length > 0 ? (
                            <div className="overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border-b border-gray-200 dark:border-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-700/50 dark:hover:to-slate-700/50">
                                            <TableHead className="w-10 font-semibold text-gray-700 dark:text-gray-300"></TableHead>
                                            <TableHead className="w-24 font-semibold text-gray-700 dark:text-gray-300">{t('table.image')}</TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">{t('table.titleContent')}</TableHead>
                                            <TableHead className="font-semibold text-gray-700 dark:text-gray-300">{t('table.description')}</TableHead>
                                            <TableHead className="text-center w-16 font-semibold text-gray-700 dark:text-gray-300">{t('table.order')}</TableHead>
                                            <TableHead className="w-28 font-semibold text-gray-700 dark:text-gray-300">{t('table.status')}</TableHead>
                                            <TableHead className="w-36 font-semibold text-gray-700 dark:text-gray-300">{t('table.creator')}</TableHead>
                                            <TableHead className="w-12 font-semibold text-gray-700 dark:text-gray-300"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sliders.map((slider, index) => (
                                            <DraggableRow
                                                key={slider.id}
                                                slider={slider}
                                                index={index}
                                                moveSlider={moveSlider}
                                                onEdit={handleEditSlider}
                                                onDelete={handleDeleteSlider}
                                                onToggleActive={handleToggleActive}
                                                onImagePreview={handleImagePreview}
                                                locale={locale}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                    <ImageIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {t('noSliders')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                    {t('noSlidersDescription')}
                                </p>
                                <Button
                                    onClick={() => setCreateDialogOpen(true)}
                                    className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    {t('createFirstSlider')}
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

                {/* Enhanced Image Preview Dialog */}
                <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
                    <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl">
                        <DialogHeader className="p-6 pb-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/80 to-slate-50/80 dark:from-gray-800/80 dark:to-slate-800/80">
                            <DialogTitle className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                                    <Eye className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">{t('actions.imagePreview')}</span>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-6 pt-4">
                            {previewImageUrl && (
                                <div className="relative w-full bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 rounded-xl overflow-hidden shadow-inner">
                                    <Image
                                        src={previewImageUrl}
                                        alt="Slider Preview"
                                        width={1200}
                                        height={600}
                                        className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
                                        onError={() => console.error(t('messages.imageLoadError'))}
                                    />
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DndProvider>
    );
} 