"use client";

import { useState, useEffect } from "react";
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
    Info,
    Image as ImageIcon
} from "lucide-react";
import { FlagWrapper } from '@/components/ui/flag-wrapper';
import { ImageUpload } from "@/components/ui/image-upload";
import { validateHeroSliderByLanguage } from "@/app/api/admin/hero-slider/validations";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface CreateSliderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

interface MultilingualField {
    [key: string]: string;
}

interface ButtonField {
    [key: string]: { text: string; url: string };
}

interface StatisticField {
    value: string;
    label: string;
}

interface Language {
    id: string;
    code: string;
    name: string;
    nativeName: string | null;
    isActive: boolean;
    isDefault: boolean;
}

export function CreateSliderDialog({ open, onOpenChange, onSuccess }: CreateSliderDialogProps) {
    const t = useTranslations('HeroSlider');
    const [loading, setLoading] = useState(false);
    
    // Fetch languages from database
    const { data: languagesData } = useSWR('/api/admin/i18n/languages', fetcher);
    const languages = languagesData?.languages || [];
    const activeLanguages = languages.filter((lang: Language) => lang.isActive);
    const defaultLanguage = activeLanguages.find((lang: Language) => lang.isDefault) || activeLanguages[0];
    const [selectedTab, setSelectedTab] = useState<string>('');

    // Initialize form data with dynamic language support
    const [title, setTitle] = useState<MultilingualField>({});
    const [subtitle, setSubtitle] = useState<MultilingualField>({});
    const [description, setDescription] = useState<MultilingualField>({});
    const [badge, setBadge] = useState<MultilingualField>({});
    const [backgroundImage, setBackgroundImage] = useState("");
    const [primaryButton, setPrimaryButton] = useState<ButtonField>({});
    const [secondaryButton, setSecondaryButton] = useState<ButtonField>({});
    const [statistics, setStatistics] = useState<StatisticField[]>([
        { value: "", label: "" },
        { value: "", label: "" },
        { value: "", label: "" },
        { value: "", label: "" }
    ]);
    const [isActive, setIsActive] = useState(true);
    const [order, setOrder] = useState(0);

    // Initialize fields when languages are loaded
    useEffect(() => {
        if (activeLanguages.length > 0 && Object.keys(title).length === 0) {
            const emptyFields: MultilingualField = {};
            const emptyButtons: ButtonField = {};
            
            activeLanguages.forEach((lang: Language) => {
                emptyFields[lang.code] = "";
                emptyButtons[lang.code] = { text: "", url: "" };
            });
            
            setTitle(emptyFields);
            setSubtitle(emptyFields);
            setDescription(emptyFields);
            setBadge(emptyFields);
            setPrimaryButton(emptyButtons);
            setSecondaryButton(emptyButtons);
            
            // Set default tab
            if (defaultLanguage) {
                setSelectedTab(defaultLanguage.code);
            }
        }
    }, [activeLanguages, defaultLanguage, title]);

    const resetForm = () => {
        const emptyFields: MultilingualField = {};
        const emptyButtons: ButtonField = {};
        
        activeLanguages.forEach((lang: Language) => {
            emptyFields[lang.code] = "";
            emptyButtons[lang.code] = { text: "", url: "" };
        });
        
        setTitle(emptyFields);
        setSubtitle(emptyFields);
        setDescription(emptyFields);
        setBadge(emptyFields);
        setBackgroundImage("");
        setPrimaryButton(emptyButtons);
        setSecondaryButton(emptyButtons);
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
        // Validation using the validation function
        const validationResult = validateHeroSliderByLanguage({
            title,
            subtitle,
            description,
            badge,
            backgroundImage,
            primaryButton,
            secondaryButton: Object.values(secondaryButton).some(b => b?.text) ? secondaryButton : undefined,
            statistics: statistics.filter(stat => stat.value && stat.label),
            isActive,
            order
        });

        if (!validationResult.isValid) {
            // Show validation errors
            const errorMessages = [];
            if (validationResult.errors.general) {
                errorMessages.push(...validationResult.errors.general);
            }
            
            // Dynamic language error handling
            activeLanguages.forEach((lang: Language) => {
                if (validationResult.errors[lang.code] && validationResult.errors[lang.code].length > 0) {
                    const langName = lang.nativeName || lang.name;
                    errorMessages.push(`${langName}: ${validationResult.errors[lang.code].join(', ')}`);
                }
            });
            
            toast.error(errorMessages.join(' | '));
            return;
        }

        try {
            setLoading(true);

            // Prepare statistics data in the format expected by backend
            const preparedStatistics = statistics
                .filter(stat => stat.value && stat.label)
                .map(stat => {
                    const multilingualStat: Record<string, { label: string; value: string }> = {};
                    activeLanguages.forEach((lang: Language) => {
                        multilingualStat[lang.code] = { label: stat.label, value: stat.value };
                    });
                    return multilingualStat;
                });

            // Prepare button data with proper URL format (href -> url)
            const preparedPrimaryButton: Record<string, { text: string; href: string }> = {};
            const preparedSecondaryButton: Record<string, { text: string; href: string }> = {};
            let hasSecondary = false;
            
            activeLanguages.forEach((lang: Language) => {
                preparedPrimaryButton[lang.code] = {
                    text: primaryButton[lang.code]?.text || "",
                    href: primaryButton[lang.code]?.url || ""
                };
                
                if (secondaryButton[lang.code]?.text) {
                    hasSecondary = true;
                    preparedSecondaryButton[lang.code] = {
                        text: secondaryButton[lang.code].text,
                        href: secondaryButton[lang.code].url || ""
                    };
                }
            });
            
            // Check if any subtitle or badge has content
            const hasSubtitle = Object.values(subtitle).some(v => v);
            const hasBadge = Object.values(badge).some(v => v);

            const sliderData = {
                title,
                subtitle: hasSubtitle ? subtitle : undefined,
                description,
                badge: hasBadge ? badge : undefined,
                backgroundImage,
                primaryButton: preparedPrimaryButton,
                secondaryButton: hasSecondary ? preparedSecondaryButton : undefined,
                statistics: preparedStatistics.length > 0 ? preparedStatistics : undefined,
                isActive,
                order
            };

            const response = await fetch("/api/admin/hero-slider", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sliderData),
            });

            const result = await response.json();
            if (!result.success) {
                if (result.details && Array.isArray(result.details)) {
                    // Handle validation errors from Zod
                    const errorMessages = result.details.map((err: { path: (string | number)[]; message: string }) => 
                        `${err.path.join('.')}: ${err.message}`
                    ).join(', ');
                    throw new Error(`Validation failed: ${errorMessages}`);
                }
                throw new Error(result.error || t('messages.createError'));
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
            <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 -m-6 mb-0 p-6 rounded-t-lg">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span>
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
                    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full mt-6">
                        <TabsList className={`grid w-full grid-cols-${activeLanguages.length} bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 p-1 rounded-xl shadow-inner`}>
                            {activeLanguages.map((lang: Language) => (
                                <TabsTrigger
                                    key={lang.code}
                                    value={lang.code}
                                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 font-semibold"
                                >
                                    <div className="flex items-center gap-2">
                                        <FlagWrapper locale={lang.code} className="w-5 h-3 rounded-sm object-cover shadow-sm" />
                                        <span>{lang.nativeName || lang.name}</span>
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <div className="mt-6 space-y-6">
                            {/* İçerik Sekmeleri */}
                            {activeLanguages.map((lang: Language) => (
                                <TabsContent key={lang.code} value={lang.code} className="space-y-6 mt-0">
                                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center gap-3 text-blue-800 dark:text-blue-300">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                                    <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                {lang.code === 'tr' ? t('form.turkishContent') : t('form.englishContent')}
                                                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 flex items-center gap-1">
                                                    <FlagWrapper locale={lang.code} className="w-4 h-2.5 rounded-sm object-cover" />
                                                    {t(`form.${lang.code}`)}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`title-${lang.code}`}>{lang.code === 'tr' ? t('form.title') : t('form.titleEn')} <span className="text-red-500">*</span></Label>
                                                    <Input 
                                                        id={`title-${lang.code}`} 
                                                        value={title[lang.code]} 
                                                        onChange={(e) => setTitle({ ...title, [lang.code]: e.target.value })} 
                                                        placeholder={lang.code === 'tr' ? t('form.placeholders.titleTr') : t('form.placeholders.titleEn')} 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`subtitle-${lang.code}`}>{lang.code === 'tr' ? t('form.subtitle') : t('form.subtitleEn')}</Label>
                                                    <Input 
                                                        id={`subtitle-${lang.code}`} 
                                                        value={subtitle[lang.code]} 
                                                        onChange={(e) => setSubtitle({ ...subtitle, [lang.code]: e.target.value })} 
                                                        placeholder={lang.code === 'tr' ? t('form.placeholders.subtitleTr') : t('form.placeholders.subtitleEn')} 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`description-${lang.code}`}>{lang.code === 'tr' ? t('form.description') : t('form.descriptionEn')} <span className="text-red-500">*</span></Label>
                                                <Textarea 
                                                    id={`description-${lang.code}`} 
                                                    value={description[lang.code]} 
                                                    onChange={(e) => setDescription({ ...description, [lang.code]: e.target.value })} 
                                                    placeholder={lang.code === 'tr' ? t('form.placeholders.descriptionTr') : t('form.placeholders.descriptionEn')} 
                                                    rows={3} 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor={`badge-${lang.code}`}>{lang.code === 'tr' ? t('form.badge') : t('form.badgeEn')}</Label>
                                                <Input 
                                                    id={`badge-${lang.code}`} 
                                                    value={badge[lang.code]} 
                                                    onChange={(e) => setBadge({ ...badge, [lang.code]: e.target.value })} 
                                                    placeholder={lang.code === 'tr' ? t('form.placeholders.badgeTr') : t('form.placeholders.badgeEn')} 
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Butonlar */}
                                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl">
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
                                                            value={primaryButton[lang.code].text}
                                                            onChange={(e) => setPrimaryButton({
                                                                ...primaryButton,
                                                                [lang.code]: { ...primaryButton[lang.code], text: e.target.value }
                                                            })}
                                                            placeholder={lang.code === 'tr' ? t('form.placeholders.primaryButtonTr') : t('form.placeholders.primaryButtonEn')}
                                                            className="border-emerald-200 dark:border-emerald-800"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium">{t('form.url')}</Label>
                                                        <Input
                                                            value={primaryButton[lang.code].url}
                                                            onChange={(e) => setPrimaryButton({
                                                                ...primaryButton,
                                                                [lang.code]: { ...primaryButton[lang.code], url: e.target.value }
                                                            })}
                                                            placeholder={lang.code === 'tr' ? t('form.placeholders.primaryButtonUrlTr') : t('form.placeholders.primaryButtonUrlEn')}
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
                                                            value={secondaryButton[lang.code].text}
                                                            onChange={(e) => setSecondaryButton({
                                                                ...secondaryButton,
                                                                [lang.code]: { ...secondaryButton[lang.code], text: e.target.value }
                                                            })}
                                                            placeholder={lang.code === 'tr' ? t('form.placeholders.secondaryButtonTr') : t('form.placeholders.secondaryButtonEn')}
                                                            className="border-gray-200 dark:border-gray-700"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium">{t('form.url')}</Label>
                                                        <Input
                                                            value={secondaryButton[lang.code].url}
                                                            onChange={(e) => setSecondaryButton({
                                                                ...secondaryButton,
                                                                [lang.code]: { ...secondaryButton[lang.code], url: e.target.value }
                                                            })}
                                                            placeholder={lang.code === 'tr' ? t('form.placeholders.secondaryButtonUrlTr') : t('form.placeholders.secondaryButtonUrlEn')}
                                                            className="border-gray-200 dark:border-gray-700"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}



                            <div className="space-y-6">
                                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-3 text-purple-800 dark:text-purple-300">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                                <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            {t('form.backgroundImage')}
                                            <Badge variant="destructive" className="h-4 text-xs">{t('form.required')}</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ImageUpload
                                            value={backgroundImage}
                                            onChange={setBackgroundImage}
                                            uploadEndpoint="/api/upload/hero-slider"
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {t('form.imageHint')}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl">
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

                                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm rounded-xl">
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

                <div className="flex-shrink-0 px-6 py-4 mt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            className="bg-white dark:bg-gray-700"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            <X className="h-4 w-4 mr-2" />
                            {t('actions.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="shadow h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs px-4"
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