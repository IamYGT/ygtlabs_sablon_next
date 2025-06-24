"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import {
    Plus,
    Trash2,
    Save,
    X,
    Info,
    Edit
} from "lucide-react";
import { FlagWrapper } from '@/components/ui/flag-wrapper';

interface HeroSlider {
    id: string;
    title: unknown;
    subtitle?: unknown;
    description: unknown;
    badge?: unknown;
    backgroundImage: string;
    primaryButton: unknown;
    secondaryButton?: unknown;
    statistics: unknown;
    isActive: boolean;
    order: number;
}

interface EditSliderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    slider: HeroSlider | null;
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
    tr: { value: string; label: string };
    en: { value: string; label: string };
}

// JSON field parse etme fonksiyonu
function parseJSONField(value: unknown): MultilingualField {
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return {
                tr: parsed?.tr || '',
                en: parsed?.en || ''
            };
        } catch {
            return { tr: value, en: value };
        }
    }

    if (typeof value === 'object' && value !== null) {
        const obj = value as Record<string, unknown>;
        return {
            tr: String(obj.tr || ''),
            en: String(obj.en || '')
        };
    }

    return { tr: '', en: '' };
}

function parseButtonField(value: unknown): ButtonField {
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return {
                tr: { text: parsed?.tr?.text || '', url: parsed?.tr?.url || '' },
                en: { text: parsed?.en?.text || '', url: parsed?.en?.url || '' }
            };
        } catch {
            return {
                tr: { text: '', url: '' },
                en: { text: '', url: '' }
            };
        }
    }

    if (typeof value === 'object' && value !== null) {
        const obj = value as Record<string, { text?: string; url?: string }>;
        return {
            tr: {
                text: obj.tr?.text || '',
                url: obj.tr?.url || ''
            },
            en: {
                text: obj.en?.text || '',
                url: obj.en?.url || ''
            }
        };
    }

    return {
        tr: { text: '', url: '' },
        en: { text: '', url: '' }
    };
}

function parseStatisticsField(value: unknown): StatisticField[] {
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                return parsed.map(stat => ({
                    tr: { value: stat?.tr?.value || '', label: stat?.tr?.label || '' },
                    en: { value: stat?.en?.value || '', label: stat?.en?.label || '' }
                }));
            }
        } catch {
            // ignore
        }
    }

    if (Array.isArray(value)) {
        return value.map(stat => ({
            tr: { value: stat?.tr?.value || '', label: stat?.tr?.label || '' },
            en: { value: stat?.en?.value || '', label: stat?.en?.label || '' }
        }));
    }

    return [{ tr: { value: '', label: '' }, en: { value: '', label: '' } }];
}

export function EditSliderDialog({ open, onOpenChange, slider, onSuccess }: EditSliderDialogProps) {
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
        { tr: { value: "", label: "" }, en: { value: "", label: "" } }
    ]);
    const [isActive, setIsActive] = useState(true);
    const [order, setOrder] = useState(0);

    // Slider verilerini form'a yükle
    useEffect(() => {
        if (slider) {
            setTitle(parseJSONField(slider.title));
            setSubtitle(parseJSONField(slider.subtitle));
            setDescription(parseJSONField(slider.description));
            setBadge(parseJSONField(slider.badge));
            setBackgroundImage(slider.backgroundImage || '');
            setPrimaryButton(parseButtonField(slider.primaryButton));
            setSecondaryButton(parseButtonField(slider.secondaryButton));
            setStatistics(parseStatisticsField(slider.statistics));
            setIsActive(slider.isActive);
            setOrder(slider.order || 0);
        }
    }, [slider]);

    const addStatistic = () => {
        setStatistics([...statistics, { tr: { value: "", label: "" }, en: { value: "", label: "" } }]);
    };

    const removeStatistic = (index: number) => {
        if (statistics.length > 1) {
            setStatistics(statistics.filter((_, i) => i !== index));
        }
    };

    const updateStatistic = (index: number, lang: 'tr' | 'en', field: 'value' | 'label', value: string) => {
        const newStats = [...statistics];
        newStats[index][lang][field] = value;
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

        if (!slider?.id) {
            toast.error("Slider bilgisi bulunamadı");
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
                statistics: statistics.filter(stat => stat.tr.value || stat.en.value),
                isActive,
                order
            };

            const response = await fetch(`/api/admin/hero-slider/${slider.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sliderData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Slider güncellenemedi");
            }

            toast.success("Slider başarıyla güncellendi");
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Update slider error:", error);
            toast.error(error instanceof Error ? error.message : "Slider güncellenirken hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[95vh] bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl flex flex-col">
                <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 -m-6 mb-0 p-6 rounded-t-lg">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                            <Edit className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                                Hero Slider Düzenle
                            </span>
                            <p className="text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
                                Mevcut slider&apos;ınızı güncelleyin ve düzenleyin
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-1">

                    <Tabs defaultValue="tr" className="w-full mt-6">
                        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 p-1 rounded-xl shadow-inner">
                            <TabsTrigger
                                value="tr"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 font-semibold"
                            >
                                <div className="flex items-center gap-2">
                                    <FlagWrapper locale="tr" className="w-5 h-3 rounded-sm object-cover shadow-sm" />
                                    <span>Türkçe</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="en"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 font-semibold"
                            >
                                <div className="flex items-center gap-2">
                                    <FlagWrapper locale="en" className="w-5 h-3 rounded-sm object-cover shadow-sm" />
                                    <span>English</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="tr" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Türkçe İçerik</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="title-tr">Başlık *</Label>
                                        <Input
                                            id="title-tr"
                                            value={title.tr}
                                            onChange={(e) => setTitle({ ...title, tr: e.target.value })}
                                            placeholder="Araç Performansının Zirvesi"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="subtitle-tr">Alt Başlık</Label>
                                        <Input
                                            id="subtitle-tr"
                                            value={subtitle.tr}
                                            onChange={(e) => setSubtitle({ ...subtitle, tr: e.target.value })}
                                            placeholder="Profesyonel ECU Tuning"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="description-tr">Açıklama *</Label>
                                        <Textarea
                                            id="description-tr"
                                            value={description.tr}
                                            onChange={(e) => setDescription({ ...description, tr: e.target.value })}
                                            placeholder="Aracınızın gizli potansiyelini ortaya çıkarın..."
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="badge-tr">Badge</Label>
                                        <Input
                                            id="badge-tr"
                                            value={badge.tr}
                                            onChange={(e) => setBadge({ ...badge, tr: e.target.value })}
                                            placeholder="Yeni"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="primary-button-text-tr">Ana Buton Metni *</Label>
                                        <Input
                                            id="primary-button-text-tr"
                                            value={primaryButton.tr.text}
                                            onChange={(e) => setPrimaryButton({
                                                ...primaryButton,
                                                tr: { ...primaryButton.tr, text: e.target.value }
                                            })}
                                            placeholder="Hemen Başla"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="primary-button-url-tr">Ana Buton URL</Label>
                                        <Input
                                            id="primary-button-url-tr"
                                            value={primaryButton.tr.url}
                                            onChange={(e) => setPrimaryButton({
                                                ...primaryButton,
                                                tr: { ...primaryButton.tr, url: e.target.value }
                                            })}
                                            placeholder="/contact"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="secondary-button-text-tr">İkinci Buton Metni</Label>
                                        <Input
                                            id="secondary-button-text-tr"
                                            value={secondaryButton.tr.text}
                                            onChange={(e) => setSecondaryButton({
                                                ...secondaryButton,
                                                tr: { ...secondaryButton.tr, text: e.target.value }
                                            })}
                                            placeholder="Daha Fazla Bilgi"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="secondary-button-url-tr">İkinci Buton URL</Label>
                                        <Input
                                            id="secondary-button-url-tr"
                                            value={secondaryButton.tr.url}
                                            onChange={(e) => setSecondaryButton({
                                                ...secondaryButton,
                                                tr: { ...secondaryButton.tr, url: e.target.value }
                                            })}
                                            placeholder="/about"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* İstatistikler */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        İstatistikler (Türkçe)
                                        <Button onClick={addStatistic} size="sm">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {statistics.map((stat, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-3 border rounded">
                                            <div className="flex-1">
                                                <Input
                                                    placeholder="Değer (5K+)"
                                                    value={stat.tr.value}
                                                    onChange={(e) => updateStatistic(index, 'tr', 'value', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    placeholder="Etiket (Müşteri)"
                                                    value={stat.tr.label}
                                                    onChange={(e) => updateStatistic(index, 'tr', 'label', e.target.value)}
                                                />
                                            </div>
                                            {statistics.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeStatistic(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="en" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>English Content</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="title-en">Title *</Label>
                                        <Input
                                            id="title-en"
                                            value={title.en}
                                            onChange={(e) => setTitle({ ...title, en: e.target.value })}
                                            placeholder="Peak of Vehicle Performance"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="subtitle-en">Subtitle</Label>
                                        <Input
                                            id="subtitle-en"
                                            value={subtitle.en}
                                            onChange={(e) => setSubtitle({ ...subtitle, en: e.target.value })}
                                            placeholder="Professional ECU Tuning"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="description-en">Description *</Label>
                                        <Textarea
                                            id="description-en"
                                            value={description.en}
                                            onChange={(e) => setDescription({ ...description, en: e.target.value })}
                                            placeholder="Unlock your vehicle's hidden potential..."
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="badge-en">Badge</Label>
                                        <Input
                                            id="badge-en"
                                            value={badge.en}
                                            onChange={(e) => setBadge({ ...badge, en: e.target.value })}
                                            placeholder="New"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="primary-button-text-en">Primary Button Text *</Label>
                                        <Input
                                            id="primary-button-text-en"
                                            value={primaryButton.en.text}
                                            onChange={(e) => setPrimaryButton({
                                                ...primaryButton,
                                                en: { ...primaryButton.en, text: e.target.value }
                                            })}
                                            placeholder="Get Started"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="primary-button-url-en">Primary Button URL</Label>
                                        <Input
                                            id="primary-button-url-en"
                                            value={primaryButton.en.url}
                                            onChange={(e) => setPrimaryButton({
                                                ...primaryButton,
                                                en: { ...primaryButton.en, url: e.target.value }
                                            })}
                                            placeholder="/contact"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="secondary-button-text-en">Secondary Button Text</Label>
                                        <Input
                                            id="secondary-button-text-en"
                                            value={secondaryButton.en.text}
                                            onChange={(e) => setSecondaryButton({
                                                ...secondaryButton,
                                                en: { ...secondaryButton.en, text: e.target.value }
                                            })}
                                            placeholder="Learn More"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="secondary-button-url-en">Secondary Button URL</Label>
                                        <Input
                                            id="secondary-button-url-en"
                                            value={secondaryButton.en.url}
                                            onChange={(e) => setSecondaryButton({
                                                ...secondaryButton,
                                                en: { ...secondaryButton.en, url: e.target.value }
                                            })}
                                            placeholder="/about"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* İstatistikler */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Statistics (English)</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {statistics.map((stat, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-3 border rounded">
                                            <div className="flex-1">
                                                <Input
                                                    placeholder="Value (5K+)"
                                                    value={stat.en.value}
                                                    onChange={(e) => updateStatistic(index, 'en', 'value', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    placeholder="Label (Customers)"
                                                    value={stat.en.label}
                                                    onChange={(e) => updateStatistic(index, 'en', 'label', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Genel Ayarlar */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Genel Ayarlar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ImageUpload
                                value={backgroundImage}
                                onChange={setBackgroundImage}
                                label="Arka Plan Görseli *"
                                description="Hero slider için arka plan görseli yükleyin (1920x1080 önerilir)"
                                maxSize={10}
                            />

                            <div>
                                <Label htmlFor="order">Sıra</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    value={order}
                                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is-active"
                                    checked={isActive}
                                    onCheckedChange={setIsActive}
                                />
                                <Label htmlFor="is-active">Aktif</Label>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Footer Buttons */}
                <div className="flex-shrink-0 flex items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/80 to-slate-50/80 dark:from-gray-800/80 dark:to-slate-800/80 -m-6 mt-0 p-6 rounded-b-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Info className="h-4 w-4" />
                        <span>Değişiklikleri kaydetmeyi unutmayın</span>
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
                                    Güncelleniyor...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Değişiklikleri Kaydet
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
