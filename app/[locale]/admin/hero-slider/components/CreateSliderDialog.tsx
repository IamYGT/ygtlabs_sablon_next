"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Trash2,
    Sparkles,
    Globe,
    Link,
    BarChart3,
    Settings,
    Save,
    X,
    Info
} from "lucide-react";
import { FlagWrapper } from '@/components/ui/flag-wrapper';

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
            toast.error(t('validation.titleRequired'));
            return;
        }

        if (!description.tr || !description.en) {
            toast.error(t('validation.descriptionRequired'));
            return;
        }

        if (!backgroundImage) {
            toast.error(t('validation.imageRequired'));
            return;
        }

        if (!primaryButton.tr.text || !primaryButton.en.text) {
            toast.error(t('validation.primaryButtonRequired'));
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
                throw new Error(error.error || t('messages.createError'));
            }

            toast.success(t('messages.createSuccess'));
            resetForm();
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Create slider error:", error);
            toast.error(error instanceof Error ? error.message : t('messages.createError'));
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
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                                {t('createSlider')}
                            </span>
                            <p className="text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
                                {t('createSliderDescription')}
                            </p>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        {t('createSliderDescription')}
                    </DialogDescription>
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
                                    <span>{t('form.turkishContent')}</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="en"
                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 font-semibold"
                            >
                                <div className="flex items-center gap-2">
                                    <FlagWrapper locale="en" className="w-5 h-3 rounded-sm object-cover shadow-sm" />
                                    <span>{t('form.englishContent')}</span>
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
                                            {t('form.turkishContent')}
                                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                                                <FlagWrapper locale="tr" className="w-4 h-2.5 rounded-sm object-cover" />
                                                {t('form.tr')}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="title-tr">{t('form.title')} <span className="text-red-500">*</span></Label>
                                                <Input id="title-tr" value={title.tr} onChange={(e) => setTitle({ ...title, tr: e.target.value })} placeholder={t('form.placeholders.titleTr')} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="subtitle-tr">{t('form.subtitle')}</Label>
                                                <Input id="subtitle-tr" value={subtitle.tr} onChange={(e) => setSubtitle({ ...subtitle, tr: e.target.value })} placeholder={t('form.placeholders.subtitleTr')} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description-tr">{t('form.description')} <span className="text-red-500">*</span></Label>
                                            <Textarea id="description-tr" value={description.tr} onChange={(e) => setDescription({ ...description, tr: e.target.value })} placeholder={t('form.placeholders.descriptionTr')} rows={3} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="badge-tr">{t('form.badge')}</Label>
                                            <Input id="badge-tr" value={badge.tr} onChange={(e) => setBadge({ ...badge, tr: e.target.value })} placeholder={t('form.placeholders.badgeTr')} />
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
                                            {t('form.buttonSettings')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4 p-4 bg-white/60 dark:bg-gray-900/60 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-300">{t('form.primaryButton')}</h4>
                                                    <Badge variant="destructive" className="h-4 text-xs">{t('form.required')}</Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">{t('form.buttonText')}</Label>
                                                    <Input
                                                        value={primaryButton.tr.text}
                                                        onChange={(e) => setPrimaryButton({
                                                            ...primaryButton,
                                                            tr: { ...primaryButton.tr, text: e.target.value }
                                                        })}
                                                        placeholder={t('form.placeholders.primaryButtonTr')}
                                                        className="border-emerald-200 dark:border-emerald-800"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">{t('form.url')}</Label>
                                                    <Input
                                                        value={primaryButton.tr.url}
                                                        onChange={(e) => setPrimaryButton({
                                                            ...primaryButton,
                                                            tr: { ...primaryButton.tr, url: e.target.value }
                                                        })}
                                                        placeholder={t('form.placeholders.primaryButtonUrlTr')}
                                                        className="border-emerald-200 dark:border-emerald-800"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 p-4 bg-white/60 dark:bg-gray-900/60 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300">{t('form.secondaryButton')}</h4>
                                                    <Badge variant="secondary" className="h-4 text-xs">{t('form.optional')}</Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">{t('form.buttonText')}</Label>
                                                    <Input
                                                        value={secondaryButton.tr.text}
                                                        onChange={(e) => setSecondaryButton({
                                                            ...secondaryButton,
                                                            tr: { ...secondaryButton.tr, text: e.target.value }
                                                        })}
                                                        placeholder={t('form.placeholders.secondaryButtonTr')}
                                                        className="border-gray-200 dark:border-gray-700"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">{t('form.url')}</Label>
                                                    <Input
                                                        value={secondaryButton.tr.url}
                                                        onChange={(e) => setSecondaryButton({
                                                            ...secondaryButton,
                                                            tr: { ...secondaryButton.tr, url: e.target.value }
                                                        })}
                                                        placeholder={t('form.placeholders.secondaryButtonUrlTr')}
                                                        className="border-gray-200 dark:border-gray-700"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* English Content Tab */}
                            <TabsContent value="en" className="space-y-6 mt-0">
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-green-800 dark:text-green-300">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                                <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            {t('form.englishContent')}
                                            <Badge variant="outline" className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 flex items-center gap-1">
                                                <FlagWrapper locale="en" className="w-4 h-2.5 rounded-sm object-cover" />
                                                {t('form.en')}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="title-en">{t('form.titleEn')} <span className="text-red-500">*</span></Label>
                                                <Input id="title-en" value={title.en} onChange={(e) => setTitle({ ...title, en: e.target.value })} placeholder={t('form.placeholders.titleEn')} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="subtitle-en">{t('form.subtitleEn')}</Label>
                                                <Input id="subtitle-en" value={subtitle.en} onChange={(e) => setSubtitle({ ...subtitle, en: e.target.value })} placeholder={t('form.placeholders.subtitleEn')} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="description-en">{t('form.descriptionEn')} <span className="text-red-500">*</span></Label>
                                            <Textarea id="description-en" value={description.en} onChange={(e) => setDescription({ ...description, en: e.target.value })} placeholder={t('form.placeholders.descriptionEn')} rows={3} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="badge-en">{t('form.badgeEn')}</Label>
                                            <Input id="badge-en" value={badge.en} onChange={(e) => setBadge({ ...badge, en: e.target.value })} placeholder={t('form.placeholders.badgeEn')} />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Buton Ayarları */}
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-950/20 dark:to-violet-950/20">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-3 text-purple-800 dark:text-purple-300">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                            <Link className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        {t('form.buttonSettings')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Tabs defaultValue="primary-tr" className="w-full">
                                        <TabsList className="grid w-full grid-cols-4">
                                            <TabsTrigger value="primary-tr">{t('form.primaryButton')} {t('form.tr_parentheses')}</TabsTrigger>
                                            <TabsTrigger value="primary-en">{t('form.primaryButton')} {t('form.en_parentheses')}</TabsTrigger>
                                            <TabsTrigger value="secondary-tr">{t('form.secondaryButton')} {t('form.tr_parentheses')}</TabsTrigger>
                                            <TabsTrigger value="secondary-en">{t('form.secondaryButton')} {t('form.en_parentheses')}</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="primary-tr" className="pt-4 space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="primary-button-text-tr">{t('form.buttonText')} <span className="text-red-500">*</span></Label>
                                                <Input id="primary-button-text-tr" value={primaryButton.tr.text} onChange={(e) => setPrimaryButton({ ...primaryButton, tr: { ...primaryButton.tr, text: e.target.value } })} placeholder={t('form.placeholders.primaryButtonTr')} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="primary-button-url-tr">{t('form.buttonUrl')}</Label>
                                                <Input id="primary-button-url-tr" value={primaryButton.tr.url} onChange={(e) => setPrimaryButton({ ...primaryButton, tr: { ...primaryButton.tr, url: e.target.value } })} placeholder={t('form.placeholders.primaryButtonUrlTr')} />
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="primary-en" className="pt-4 space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="primary-button-text-en">{t('form.buttonTextEn')} <span className="text-red-500">*</span></Label>
                                                <Input id="primary-button-text-en" value={primaryButton.en.text} onChange={(e) => setPrimaryButton({ ...primaryButton, en: { ...primaryButton.en, text: e.target.value } })} placeholder={t('form.placeholders.primaryButtonEn')} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="primary-button-url-en">{t('form.buttonUrl')}</Label>
                                                <Input id="primary-button-url-en" value={primaryButton.en.url} onChange={(e) => setPrimaryButton({ ...primaryButton, en: { ...primaryButton.en, url: e.target.value } })} placeholder={t('form.placeholders.primaryButtonUrlEn')} />
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="secondary-tr" className="pt-4 space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="secondary-button-text-tr">{t('form.buttonText')}</Label>
                                                <Input id="secondary-button-text-tr" value={secondaryButton.tr.text} onChange={(e) => setSecondaryButton({ ...secondaryButton, tr: { ...secondaryButton.tr, text: e.target.value } })} placeholder={t('form.placeholders.secondaryButtonTr')} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="secondary-button-url-tr">{t('form.buttonUrl')}</Label>
                                                <Input id="secondary-button-url-tr" value={secondaryButton.tr.url} onChange={(e) => setSecondaryButton({ ...secondaryButton, tr: { ...secondaryButton.tr, url: e.target.value } })} placeholder={t('form.placeholders.secondaryButtonUrlTr')} />
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="secondary-en" className="pt-4 space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="secondary-button-text-en">{t('form.buttonTextEn')}</Label>
                                                <Input id="secondary-button-text-en" value={secondaryButton.en.text} onChange={(e) => setSecondaryButton({ ...secondaryButton, en: { ...secondaryButton.en, text: e.target.value } })} placeholder={t('form.placeholders.secondaryButtonEn')} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="secondary-button-url-en">{t('form.buttonUrl')}</Label>
                                                <Input id="secondary-button-url-en" value={secondaryButton.en.url} onChange={(e) => setSecondaryButton({ ...secondaryButton, en: { ...secondaryButton.en, url: e.target.value } })} placeholder={t('form.placeholders.secondaryButtonUrlEn')} />
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-950/20 dark:to-amber-950/20">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-yellow-800 dark:text-yellow-300">
                                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                                                <BarChart3 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                            </div>
                                            {t('form.statistics')}
                                            <Badge variant="outline">{t('form.statisticsOptional')}</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {statistics.map((stat, index) => (
                                            <div key={index} className="flex items-end gap-2 p-3 bg-white/60 dark:bg-gray-900/60 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                                <div className="flex-1 space-y-2">
                                                    <Label htmlFor={`stat-value-${index}`}>{t('form.statisticsNumber', { number: index + 1 })} - {t('form.statisticsValue')}</Label>
                                                    <Input id={`stat-value-${index}`} value={stat.value} onChange={(e) => updateStatistic(index, 'value', e.target.value)} placeholder={t('form.placeholders.statisticsValue')} />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <Label htmlFor={`stat-label-${index}`}>{t('form.statisticsLabel')}</Label>
                                                    <Input id={`stat-label-${index}`} value={stat.label} onChange={(e) => updateStatistic(index, 'label', e.target.value)} placeholder={t('form.placeholders.statisticsLabel')} />
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeStatistic(index)} disabled={statistics.length === 1}>
                                                    <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                                                </Button>
                                            </div>
                                        ))}
                                        {statistics.length < 4 && (
                                            <Button type="button" variant="outline" onClick={addStatistic} className="w-full border-dashed">
                                                <Plus className="h-4 w-4 mr-2" />
                                                {t('form.addStatistic')}
                                            </Button>
                                        )}
                                        {statistics.length === 4 && (
                                            <p className="text-xs text-center text-gray-500">{t('form.maxStatistics')}</p>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50/50 to-rose-50/50 dark:from-red-950/20 dark:to-rose-950/20">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-red-800 dark:text-red-300">
                                            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                                                <Settings className="h-5 w-5 text-red-600 dark:text-red-400" />
                                            </div>
                                            {t('form.generalSettings')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="p-4 bg-white/60 dark:bg-gray-900/60 rounded-lg border border-red-200 dark:border-red-800">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label htmlFor="is-active" className="font-medium">{t('form.publishStatus')}</Label>
                                                    <p className="text-sm text-gray-500">{t('form.publishStatusDescription')}</p>
                                                </div>
                                                <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-white/60 dark:bg-gray-900/60 rounded-lg border border-red-200 dark:border-red-800">
                                            <div className="space-y-2">
                                                <Label htmlFor="order">{t('form.sorting')}</Label>
                                                <Input id="order" type="number" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
                                                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                                    <Info className="h-3 w-3" />
                                                    {t('form.sortingDescription')}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </Tabs>
                </div>

                <div className="flex justify-between items-center p-6 bg-gray-100/80 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700 mt-auto rounded-b-lg">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Info className="h-4 w-4" />
                        <span>{t('validation.rememberSave')}</span>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="bg-white dark:bg-gray-700" onClick={() => onOpenChange(false)} disabled={loading}>
                            <X className="h-4 w-4 mr-2" />
                            {t('actions.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:from-blue-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    {t('actions.creating')}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {t('actions.create')}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 