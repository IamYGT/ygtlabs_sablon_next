"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import {
    Plus,
    Trash2,
    Sparkles,
    Globe,
    Image as ImageIcon,
    Type,
    FileText,
    Tag,
    Link,
    BarChart3,
    Settings,
    Save,
    X,
    CheckCircle,
    AlertCircle,
    Info,
    FolderOpen,
    Layers
} from "lucide-react";

interface CreateSliderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

interface MultilingualField {
    tr: string;
    en: string;
}

interface ButtonField {
    tr: { text: string; url: string };
    en: { text: string; url: string };
}

interface StatisticField {
    value: string;
    label: string;
}

export function CreateSliderDialog({ open, onOpenChange, onSuccess }: CreateSliderDialogProps) {
    const [loading, setLoading] = useState(false);

    // Form verileri
    const [title, setTitle] = useState<MultilingualField>({ tr: "", en: "" });
    const [subtitle, setSubtitle] = useState<MultilingualField>({ tr: "", en: "" });
    const [description, setDescription] = useState<MultilingualField>({ tr: "", en: "" });
    const [badge, setBadge] = useState<MultilingualField>({ tr: "", en: "" });
    const [backgroundImage, setBackgroundImage] = useState("");
    const [primaryButton, setPrimaryButton] = useState<ButtonField>({
        tr: { text: "", url: "" },
        en: { text: "", url: "" }
    });
    const [secondaryButton, setSecondaryButton] = useState<ButtonField>({
        tr: { text: "", url: "" },
        en: { text: "", url: "" }
    });
    const [statistics, setStatistics] = useState<StatisticField[]>([
        { value: "", label: "" },
        { value: "", label: "" },
        { value: "", label: "" },
        { value: "", label: "" }
    ]);
    const [isActive, setIsActive] = useState(true);
    const [order, setOrder] = useState(0);

    const resetForm = () => {
        setTitle({ tr: "", en: "" });
        setSubtitle({ tr: "", en: "" });
        setDescription({ tr: "", en: "" });
        setBadge({ tr: "", en: "" });
        setBackgroundImage("");
        setPrimaryButton({
            tr: { text: "", url: "" },
            en: { text: "", url: "" }
        });
        setSecondaryButton({
            tr: { text: "", url: "" },
            en: { text: "", url: "" }
        });
        setStatistics([
            { value: "", label: "" },
            { value: "", label: "" },
            { value: "", label: "" },
            { value: "", label: "" }
        ]);
        setIsActive(true);
        setOrder(0);
    };

    const addStatistic = () => {
        if (statistics.length < 4) {
            setStatistics([...statistics, { value: "", label: "" }]);
        }
    };

    const removeStatistic = (index: number) => {
        if (statistics.length > 1) {
            setStatistics(statistics.filter((_, i) => i !== index));
        }
    };

    const updateStatistic = (index: number, field: 'value' | 'label', value: string) => {
        const newStats = [...statistics];
        newStats[index][field] = value;
        setStatistics(newStats);
    };

    const handleSubmit = async () => {
        // Validasyon
        if (!title.tr || !title.en) {
            toast.error("Başlık alanları zorunludur");
            return;
        }

        if (!description.tr || !description.en) {
            toast.error("Açıklama alanları zorunludur");
            return;
        }

        if (!backgroundImage) {
            toast.error("Arka plan görseli zorunludur");
            return;
        }

        if (!primaryButton.tr.text || !primaryButton.en.text) {
            toast.error("Ana buton metni zorunludur");
            return;
        }

        try {
            setLoading(true);

            const sliderData = {
                title,
                subtitle: subtitle.tr || subtitle.en ? subtitle : null,
                description,
                badge: badge.tr || badge.en ? badge : null,
                backgroundImage,
                primaryButton,
                secondaryButton: secondaryButton.tr.text || secondaryButton.en.text ? secondaryButton : null,
                statistics: statistics.filter(stat => stat.value),
                isActive,
                order
            };

            const response = await fetch("/api/admin/hero-slider", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sliderData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Slider oluşturulamadı");
            }

            toast.success("Slider başarıyla oluşturuldu");
            resetForm();
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Create slider error:", error);
            toast.error(error instanceof Error ? error.message : "Slider oluşturulurken hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 -m-6 mb-0 p-6 rounded-t-lg">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                                Yeni Hero Slider Oluştur
                            </span>
                            <p className="text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
                                Ana sayfanız için etkileyici bir slider oluşturun
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[calc(95vh-120px)] px-1">
                    <Tabs defaultValue="tr" className="w-full mt-6">
                        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 p-1 rounded-xl shadow-inner">
                            <TabsTrigger
                                value="tr"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 font-semibold"
                            >
                                <div className="flex items-center gap-2">
                                    🇹🇷 <span>Türkçe</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="en"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 font-semibold"
                            >
                                <div className="flex items-center gap-2">
                                    🇺🇸 <span>English</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-6 space-y-6">
                            {/* İçerik Sekmeleri */}
                            <TabsContent value="tr" className="space-y-6 mt-0">
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-blue-800 dark:text-blue-300">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            Türkçe İçerik
                                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                                                🇹🇷 TR
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="title-tr" className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                                                    <Type className="h-4 w-4 text-blue-600" />
                                                    Başlık
                                                    <Badge variant="destructive" className="h-4 text-xs">Zorunlu</Badge>
                                                </Label>
                                                <Input
                                                    id="title-tr"
                                                    value={title.tr}
                                                    onChange={(e) => setTitle({ ...title, tr: e.target.value })}
                                                    placeholder="Araç Performansının Zirvesi"
                                                    className="border-blue-200 dark:border-blue-800 focus:ring-blue-500 focus:border-blue-500 bg-white/80 dark:bg-gray-900/80"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="subtitle-tr" className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                                                    <FileText className="h-4 w-4 text-indigo-600" />
                                                    Alt Başlık
                                                </Label>
                                                <Input
                                                    id="subtitle-tr"
                                                    value={subtitle.tr}
                                                    onChange={(e) => setSubtitle({ ...subtitle, tr: e.target.value })}
                                                    placeholder="Profesyonel ECU Tuning"
                                                    className="border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-900/80"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description-tr" className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                                                <FileText className="h-4 w-4 text-purple-600" />
                                                Açıklama
                                                <Badge variant="destructive" className="h-4 text-xs">Zorunlu</Badge>
                                            </Label>
                                            <Textarea
                                                id="description-tr"
                                                value={description.tr}
                                                onChange={(e) => setDescription({ ...description, tr: e.target.value })}
                                                placeholder="Aracınızın gerçek potansiyelini keşfedin. Uzman ekibimiz ile güvenli ve profesyonel ECU tuning hizmeti."
                                                rows={4}
                                                className="border-purple-200 dark:border-purple-800 focus:ring-purple-500 focus:border-purple-500 bg-white/80 dark:bg-gray-900/80 resize-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="badge-tr" className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                                                <Tag className="h-4 w-4 text-green-600" />
                                                Rozet Metni
                                            </Label>
                                            <Input
                                                id="badge-tr"
                                                value={badge.tr}
                                                onChange={(e) => setBadge({ ...badge, tr: e.target.value })}
                                                placeholder="✨ Yeni"
                                                className="border-green-200 dark:border-green-800 focus:ring-green-500 focus:border-green-500 bg-white/80 dark:bg-gray-900/80"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Butonlar TR */}
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-950/20 dark:to-green-950/20">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
                                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                                <Link className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            Buton Ayarları (Türkçe)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4 p-4 bg-white/60 dark:bg-gray-900/60 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">Ana Buton</h4>
                                                    <Badge variant="destructive" className="h-4 text-xs">Zorunlu</Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Buton Metni</Label>
                                                    <Input
                                                        value={primaryButton.tr.text}
                                                        onChange={(e) => setPrimaryButton({
                                                            ...primaryButton,
                                                            tr: { ...primaryButton.tr, text: e.target.value }
                                                        })}
                                                        placeholder="Hemen Başlayın"
                                                        className="border-emerald-200 dark:border-emerald-800"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">URL</Label>
                                                    <Input
                                                        value={primaryButton.tr.url}
                                                        onChange={(e) => setPrimaryButton({
                                                            ...primaryButton,
                                                            tr: { ...primaryButton.tr, url: e.target.value }
                                                        })}
                                                        placeholder="/services"
                                                        className="border-emerald-200 dark:border-emerald-800"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 p-4 bg-white/60 dark:bg-gray-900/60 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">İkincil Buton</h4>
                                                    <Badge variant="secondary" className="h-4 text-xs">Opsiyonel</Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Buton Metni</Label>
                                                    <Input
                                                        value={secondaryButton.tr.text}
                                                        onChange={(e) => setSecondaryButton({
                                                            ...secondaryButton,
                                                            tr: { ...secondaryButton.tr, text: e.target.value }
                                                        })}
                                                        placeholder="Daha Fazla Bilgi"
                                                        className="border-gray-200 dark:border-gray-700"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">URL</Label>
                                                    <Input
                                                        value={secondaryButton.tr.url}
                                                        onChange={(e) => setSecondaryButton({
                                                            ...secondaryButton,
                                                            tr: { ...secondaryButton.tr, url: e.target.value }
                                                        })}
                                                        placeholder="/about"
                                                        className="border-gray-200 dark:border-gray-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="en" className="space-y-6 mt-0">
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-indigo-800 dark:text-indigo-300">
                                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                                                <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            English Content
                                            <Badge variant="outline" className="bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
                                                🇺🇸 EN
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="title-en" className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                                                    <Type className="h-4 w-4 text-blue-600" />
                                                    Title
                                                    <Badge variant="destructive" className="h-4 text-xs">Required</Badge>
                                                </Label>
                                                <Input
                                                    id="title-en"
                                                    value={title.en}
                                                    onChange={(e) => setTitle({ ...title, en: e.target.value })}
                                                    placeholder="Peak of Vehicle Performance"
                                                    className="border-blue-200 dark:border-blue-800 focus:ring-blue-500 focus:border-blue-500 bg-white/80 dark:bg-gray-900/80"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="subtitle-en" className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                                                    <FileText className="h-4 w-4 text-indigo-600" />
                                                    Subtitle
                                                </Label>
                                                <Input
                                                    id="subtitle-en"
                                                    value={subtitle.en}
                                                    onChange={(e) => setSubtitle({ ...subtitle, en: e.target.value })}
                                                    placeholder="Professional ECU Tuning"
                                                    className="border-indigo-200 dark:border-indigo-800 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 dark:bg-gray-900/80"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description-en" className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                                                <FileText className="h-4 w-4 text-purple-600" />
                                                Description
                                                <Badge variant="destructive" className="h-4 text-xs">Required</Badge>
                                            </Label>
                                            <Textarea
                                                id="description-en"
                                                value={description.en}
                                                onChange={(e) => setDescription({ ...description, en: e.target.value })}
                                                placeholder="Discover your vehicle's true potential. Safe and professional ECU tuning service with our expert team."
                                                rows={4}
                                                className="border-purple-200 dark:border-purple-800 focus:ring-purple-500 focus:border-purple-500 bg-white/80 dark:bg-gray-900/80 resize-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="badge-en" className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                                                <Tag className="h-4 w-4 text-green-600" />
                                                Badge Text
                                            </Label>
                                            <Input
                                                id="badge-en"
                                                value={badge.en}
                                                onChange={(e) => setBadge({ ...badge, en: e.target.value })}
                                                placeholder="✨ New"
                                                className="border-green-200 dark:border-green-800 focus:ring-green-500 focus:border-green-500 bg-white/80 dark:bg-gray-900/80"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Butonlar EN */}
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50/50 to-cyan-50/50 dark:from-teal-950/20 dark:to-cyan-950/20">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-teal-800 dark:text-teal-300">
                                            <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-lg">
                                                <Link className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                            </div>
                                            Button Settings (English)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4 p-4 bg-white/60 dark:bg-gray-900/60 rounded-lg border border-teal-200 dark:border-teal-800">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                                                    <h4 className="font-semibold text-teal-800 dark:text-teal-300">Primary Button</h4>
                                                    <Badge variant="destructive" className="h-4 text-xs">Required</Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Button Text</Label>
                                                    <Input
                                                        value={primaryButton.en.text}
                                                        onChange={(e) => setPrimaryButton({
                                                            ...primaryButton,
                                                            en: { ...primaryButton.en, text: e.target.value }
                                                        })}
                                                        placeholder="Get Started"
                                                        className="border-teal-200 dark:border-teal-800"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">URL</Label>
                                                    <Input
                                                        value={primaryButton.en.url}
                                                        onChange={(e) => setPrimaryButton({
                                                            ...primaryButton,
                                                            en: { ...primaryButton.en, url: e.target.value }
                                                        })}
                                                        placeholder="/services"
                                                        className="border-teal-200 dark:border-teal-800"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 p-4 bg-white/60 dark:bg-gray-900/60 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">Secondary Button</h4>
                                                    <Badge variant="secondary" className="h-4 text-xs">Optional</Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Button Text</Label>
                                                    <Input
                                                        value={secondaryButton.en.text}
                                                        onChange={(e) => setSecondaryButton({
                                                            ...secondaryButton,
                                                            en: { ...secondaryButton.en, text: e.target.value }
                                                        })}
                                                        placeholder="Learn More"
                                                        className="border-gray-200 dark:border-gray-700"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">URL</Label>
                                                    <Input
                                                        value={secondaryButton.en.url}
                                                        onChange={(e) => setSecondaryButton({
                                                            ...secondaryButton,
                                                            en: { ...secondaryButton.en, url: e.target.value }
                                                        })}
                                                        placeholder="/about"
                                                        className="border-gray-200 dark:border-gray-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Ortak Alanlar */}
                            <div className="space-y-6">
                                {/* Görsel Upload */}
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50/50 to-pink-50/50 dark:from-rose-950/20 dark:to-pink-950/20">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-rose-800 dark:text-rose-300">
                                            <div className="p-2 bg-rose-100 dark:bg-rose-900/50 rounded-lg">
                                                <ImageIcon className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                            </div>
                                            Arka Plan Görseli
                                            <Badge variant="destructive" className="h-4 text-xs">Zorunlu</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="p-6 border-2 border-dashed border-rose-200 dark:border-rose-800 rounded-xl bg-rose-50/50 dark:bg-rose-950/20">
                                                <ImageUpload
                                                    value={backgroundImage}
                                                    onChange={setBackgroundImage}
                                                />
                                            </div>
                                            {backgroundImage && (
                                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Görsel başarıyla yüklendi
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* İstatistikler */}
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-amber-800 dark:text-amber-300">
                                            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                                                <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            İstatistikler
                                            <Badge variant="secondary" className="h-4 text-xs">Opsiyonel</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {statistics.map((stat, index) => (
                                            <div key={index} className="p-4 bg-white/60 dark:bg-gray-900/60 rounded-lg border border-amber-200 dark:border-amber-800">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                                        İstatistik #{index + 1}
                                                    </h4>
                                                    {statistics.length > 1 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeStatistic(index)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                                            Değer
                                                        </Label>
                                                        <Input
                                                            placeholder="1000+"
                                                            value={stat.value}
                                                            onChange={(e) => updateStatistic(index, 'value', e.target.value)}
                                                            className="border-amber-200 dark:border-amber-800"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                                            Etiket
                                                        </Label>
                                                        <Input
                                                            placeholder="Mutlu Müşteri"
                                                            value={stat.label}
                                                            onChange={(e) => updateStatistic(index, 'label', e.target.value)}
                                                            className="border-amber-200 dark:border-amber-800"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {statistics.length < 4 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addStatistic}
                                                className="w-full border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Yeni İstatistik Ekle ({statistics.length}/4)
                                            </Button>
                                        )}
                                        {statistics.length === 4 && (
                                            <div className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-700">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>Maksimum 4 istatistik ekleyebilirsiniz</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Ayarlar */}
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-slate-950/20 dark:to-gray-950/20">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-300">
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                            </div>
                                            Slider Ayarları
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Yayın Durumu - Yatay */}
                                        <div className="p-4 bg-white/70 dark:bg-gray-900/70 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-base font-semibold text-slate-700 dark:text-slate-300">
                                                            Yayın Durumu
                                                        </Label>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            Slider ana sayfada görüntülensin mi?
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Switch
                                                        checked={isActive}
                                                        onCheckedChange={setIsActive}
                                                        className="data-[state=checked]:bg-green-500 scale-110"
                                                    />
                                                    <Badge
                                                        variant={isActive ? "default" : "secondary"}
                                                        className={`px-3 py-1 font-medium ${isActive
                                                            ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700"
                                                            : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600"
                                                            }`}
                                                    >
                                                        {isActive ? "✓ Aktif" : "✗ Pasif"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sıralama - Yatay */}
                                        <div className="p-4 bg-white/70 dark:bg-gray-900/70 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                                        <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="order" className="text-base font-semibold text-slate-700 dark:text-slate-300">
                                                            Sıralama
                                                        </Label>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            Düşük sayılar önce gösterilir
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex-1 max-w-xs">
                                                    <Input
                                                        id="order"
                                                        type="number"
                                                        value={order}
                                                        onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                                                        placeholder="0"
                                                        className="border-blue-200 dark:border-blue-800 focus:ring-blue-500 focus:border-blue-500 bg-white/80 dark:bg-gray-900/80"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </Tabs>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/80 to-slate-50/80 dark:from-gray-800/80 dark:to-slate-800/80 -m-6 mt-0 p-6 rounded-b-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Info className="h-4 w-4" />
                        <span>Zorunlu alanları doldurmayı unutmayın</span>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            <X className="h-4 w-4 mr-2" />
                            İptal
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-semibold px-8"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Oluşturuluyor...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Slider Oluştur
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 