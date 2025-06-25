"use client";

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
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
    const t = useTranslations('HeroSlider');
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
            toast.error("Slider güncellenemedi, ID bulunamadı");
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

            const response = await fetch(`/api/admin/hero-slider/update?id=${slider.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sliderData),
            });

            if (response.ok) {
                toast.success('Slider başarıyla güncellendi');
                onSuccess();
                onOpenChange(false);
            } else {
                const error = await response.json();
                toast.error(error.message || 'Slider güncellenirken bir hata oluştu');
            }

        } catch (error) {
            toast.error('Bir hata oluştu');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        {t('editSlider')}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                    <form className="space-y-6">
                        {/* İçerik ve Butonlar */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('form.buttonSettings')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="tr" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="tr">
                                            <FlagWrapper locale="tr" className="mr-2" /> {t('form.turkishContent')}
                                        </TabsTrigger>
                                        <TabsTrigger value="en">
                                            <FlagWrapper locale="en" className="mr-2" /> {t('form.englishContent')}
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Türkçe İçerik */}
                                    <TabsContent value="tr" className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title-tr">{t('form.title')} <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="title-tr"
                                                value={title.tr}
                                                onChange={(e) => setTitle({ ...title, tr: e.target.value })}
                                                placeholder={t('form.placeholders.titleTr')}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subtitle-tr">{t('form.subtitle')}</Label>
                                            <Input
                                                id="subtitle-tr"
                                                value={subtitle.tr}
                                                onChange={(e) => setSubtitle({ ...subtitle, tr: e.target.value })}
                                                placeholder={t('form.placeholders.subtitleTr')}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description-tr">{t('form.description')}</Label>
                                            <Textarea
                                                id="description-tr"
                                                value={description.tr}
                                                onChange={(e) => setDescription({ ...description, tr: e.target.value })}
                                                placeholder={t('form.placeholders.descriptionTr')}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="badge-tr">{t('form.badge')}</Label>
                                            <Input
                                                id="badge-tr"
                                                value={badge.tr}
                                                onChange={(e) => setBadge({ ...badge, tr: e.target.value })}
                                                placeholder={t('form.placeholders.badgeTr')}
                                            />
                                        </div>
                                        {/* Butonlar */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                            <div className="space-y-2">
                                                <Label>{t('form.primaryButton')} <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={primaryButton.tr.text}
                                                    onChange={(e) => setPrimaryButton({ ...primaryButton, tr: { ...primaryButton.tr, text: e.target.value } })}
                                                    placeholder={t('form.placeholders.primaryButtonTr')}
                                                />
                                                <Input
                                                    value={primaryButton.tr.url}
                                                    onChange={(e) => setPrimaryButton({ ...primaryButton, tr: { ...primaryButton.tr, url: e.target.value } })}
                                                    placeholder={t('form.placeholders.primaryButtonUrlTr')}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t('form.secondaryButton')} <span className="text-muted-foreground">({t('form.secondaryButtonOptional')})</span></Label>
                                                <Input
                                                    value={secondaryButton.tr.text}
                                                    onChange={(e) => setSecondaryButton({ ...secondaryButton, tr: { ...secondaryButton.tr, text: e.target.value } })}
                                                    placeholder={t('form.placeholders.secondaryButtonTr')}
                                                />
                                                <Input
                                                    value={secondaryButton.tr.url}
                                                    onChange={(e) => setSecondaryButton({ ...secondaryButton, tr: { ...secondaryButton.tr, url: e.target.value } })}
                                                    placeholder={t('form.placeholders.secondaryButtonUrlTr')}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>

                                    {/* English Content */}
                                    <TabsContent value="en" className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title-en">{t('form.titleEn')} <span className="text-red-500">*</span></Label>
                                            <Input
                                                id="title-en"
                                                value={title.en}
                                                onChange={(e) => setTitle({ ...title, en: e.target.value })}
                                                placeholder={t('form.placeholders.titleEn')}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subtitle-en">{t('form.subtitleEn')}</Label>
                                            <Input
                                                id="subtitle-en"
                                                value={subtitle.en}
                                                onChange={(e) => setSubtitle({ ...subtitle, en: e.target.value })}
                                                placeholder={t('form.placeholders.subtitleEn')}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description-en">{t('form.descriptionEn')}</Label>
                                            <Textarea
                                                id="description-en"
                                                value={description.en}
                                                onChange={(e) => setDescription({ ...description, en: e.target.value })}
                                                placeholder={t('form.placeholders.descriptionEn')}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="badge-en">{t('form.badgeEn')}</Label>
                                            <Input
                                                id="badge-en"
                                                value={badge.en}
                                                onChange={(e) => setBadge({ ...badge, en: e.target.value })}
                                                placeholder={t('form.placeholders.badgeEn')}
                                            />
                                        </div>
                                        {/* Buttons */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                            <div className="space-y-2">
                                                <Label>{t('form.primaryButton')} <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={primaryButton.en.text}
                                                    onChange={(e) => setPrimaryButton({ ...primaryButton, en: { ...primaryButton.en, text: e.target.value } })}
                                                    placeholder={t('form.placeholders.primaryButtonEn')}
                                                />
                                                <Input
                                                    value={primaryButton.en.url}
                                                    onChange={(e) => setPrimaryButton({ ...primaryButton, en: { ...primaryButton.en, url: e.target.value } })}
                                                    placeholder={t('form.placeholders.primaryButtonUrlEn')}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t('form.secondaryButton')} <span className="text-muted-foreground">({t('form.secondaryButtonOptional')})</span></Label>
                                                <Input
                                                    value={secondaryButton.en.text}
                                                    onChange={(e) => setSecondaryButton({ ...secondaryButton, en: { ...secondaryButton.en, text: e.target.value } })}
                                                    placeholder={t('form.placeholders.secondaryButtonEn')}
                                                />
                                                <Input
                                                    value={secondaryButton.en.url}
                                                    onChange={(e) => setSecondaryButton({ ...secondaryButton, en: { ...secondaryButton.en, url: e.target.value } })}
                                                    placeholder={t('form.placeholders.secondaryButtonUrlEn')}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        {/* Görsel ve Ayarlar */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('form.backgroundImage')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ImageUpload
                                        value={backgroundImage}
                                        onChange={setBackgroundImage}
                                        uploadEndpoint="heroSliderImage"
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('form.sliderSettings')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <Label>{t('form.publishStatus')}</Label>
                                            <p className="text-sm text-muted-foreground">
                                                {t('form.publishStatusDescription')}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={isActive}
                                            onCheckedChange={setIsActive}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="order">{t('form.order')}</Label>
                                        <Input
                                            id="order"
                                            type="number"
                                            value={order}
                                            onChange={(e) => setOrder(Number(e.target.value))}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {t('form.sortingDescription')}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* İstatistikler */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('form.statistics')} <span className="text-muted-foreground text-sm">({t('form.statisticsOptional')})</span></CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {statistics.map((stat, index) => (
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg relative">
                                            <button
                                                onClick={() => removeStatistic(index)}
                                                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                            <Tabs defaultValue="tr_stat" className="w-full">
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="tr_stat">
                                                        <FlagWrapper locale="tr" className="mr-2" /> {t('languages.tr')}
                                                    </TabsTrigger>
                                                    <TabsTrigger value="en_stat">
                                                        <FlagWrapper locale="en" className="mr-2" /> {t('languages.en')}
                                                    </TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="tr_stat" className="space-y-2 pt-2">
                                                    <Input
                                                        value={stat.tr.value}
                                                        onChange={(e) => updateStatistic(index, 'tr', 'value', e.target.value)}
                                                        placeholder={t('form.placeholders.statisticsValue')}
                                                    />
                                                    <Input
                                                        value={stat.tr.label}
                                                        onChange={(e) => updateStatistic(index, 'tr', 'label', e.target.value)}
                                                        placeholder={t('form.placeholders.statisticsLabel')}
                                                    />
                                                </TabsContent>
                                                <TabsContent value="en_stat" className="space-y-2 pt-2">
                                                    <Input
                                                        value={stat.en.value}
                                                        onChange={(e) => updateStatistic(index, 'en', 'value', e.target.value)}
                                                        placeholder={t('form.placeholders.statisticsValue')}
                                                    />
                                                    <Input
                                                        value={stat.en.label}
                                                        onChange={(e) => updateStatistic(index, 'en', 'label', e.target.value)}
                                                        placeholder={t('form.placeholders.statisticsLabelEn')}
                                                    />
                                                </TabsContent>
                                            </Tabs>
                                        </div>
                                    ))}
                                    {statistics.length < 4 && (
                                        <Button variant="outline" onClick={addStatistic}>
                                            <Plus className="mr-2 h-4 w-4" /> {t('form.addStatistic')}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>

                <div className="flex-shrink-0 p-6 pt-0 mt-4 border-t">
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            <X className="mr-2 h-4 w-4" />
                            {t('actions.cancel')}
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                                    {t('actions.updating')}
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {t('actions.update')}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
