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
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Trash2 } from "lucide-react";

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
    tr: { value: string; label: string };
    en: { value: string; label: string };
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
        { tr: { value: "", label: "" }, en: { value: "", label: "" } }
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
            { tr: { value: "", label: "" }, en: { value: "", label: "" } }
        ]);
        setIsActive(true);
        setOrder(0);
    };

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
        } catch (error: any) {
            console.error("Create slider error:", error);
            toast.error(error.message || "Slider oluşturulurken hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Yeni Hero Slider Oluştur</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="tr" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="tr">Türkçe 🇹🇷</TabsTrigger>
                        <TabsTrigger value="en">English 🇺🇸</TabsTrigger>
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

                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        İptal
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? "Oluşturuluyor..." : "Oluştur"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 