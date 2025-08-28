"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Globe, Save, Sun, Moon, Monitor, Check, Languages } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations, useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { routing } from '@/lib/i18n/routing';
import useSWR from 'swr';
import TR from 'country-flag-icons/react/3x2/TR';
import US from 'country-flag-icons/react/3x2/US';

export default function ProfilePreferences() {
    const t = useTranslations('AdminProfile.preferences');
    const tLang = useTranslations('Language');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    
    // Fetch languages from database
    const { data: languageData } = useSWR('/api/admin/i18n/languages', (url: string) =>
        fetch(url).then((r) => r.json())
    );

    // Initialize preferences from current theme and locale
    const [preferences, setPreferences] = useState({
        theme: theme || 'system',
        language: locale || 'tr',
    });

    // Update preferences when theme or locale changes
    useEffect(() => {
        setPreferences({
            theme: theme || 'system',
            language: locale || 'tr',
        });
    }, [theme, locale]);

    const handleSavePreferences = async () => {
        setIsLoading(true);
        try {
            // Apply theme using the provider
            if (preferences.theme !== theme) {
                setTheme(preferences.theme);
                // Save to localStorage automatically via next-themes
            }

            // Apply language change
            if (preferences.language !== locale) {
                router.push(pathname, { locale: preferences.language });
            }

            // Optional: Save preferences to backend
            const response = await fetch('/api/admin/profile/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences),
            });

            if (!response.ok) {
                console.warn('Backend preference save failed, but local changes applied');
            }

            toast.success(t('notifications.saveSuccess'));
        } catch (_error) {
            toast.error(t('notifications.saveError'));
        } finally {
            setIsLoading(false);
        }
    };

    const themeOptions = [
        { value: 'light', label: t('themePreference.options.light.label'), icon: Sun, description: t('themePreference.options.light.description') },
        { value: 'dark', label: t('themePreference.options.dark.label'), icon: Moon, description: t('themePreference.options.dark.description') },
        { value: 'system', label: t('themePreference.options.system.label'), icon: Monitor, description: t('themePreference.options.system.description') }
    ];

    // Get language flag component
    const getLanguageFlag = (code: string) => {
        switch (code) {
            case 'tr':
                return <TR className="w-5 h-4 rounded-sm shadow-sm" />;
            case 'en':
                return <US className="w-5 h-4 rounded-sm shadow-sm" />;
            default:
                return <Languages className="w-4 h-4" />;
        }
    };

    // Get languages from database or use default
    const activeLanguages = languageData?.languages?.filter((lang: { isActive: boolean; code: string; nativeName?: string; name: string }) => lang.isActive) || [];
    const languageOptions = activeLanguages.length > 0 
        ? activeLanguages.map((lang: { code: string; nativeName?: string; name: string }) => ({
            value: lang.code,
            label: lang.nativeName || lang.name,
            flag: lang.code
        }))
        : routing.locales.map((loc) => ({
            value: loc,
            label: loc === 'tr' ? tLang('turkish') : tLang('english'),
            flag: loc
        }));

    return (
        <div className="space-y-6">
            {/* Theme Settings */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                        <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-sm">
                            <Palette className="h-4 w-4" />
                        </div>
                        {t('themePreference.title')}
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400 ml-11">
                        {t('themePreference.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                    <RadioGroup
                        value={preferences.theme}
                        onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                        className="space-y-3"
                    >
                        {themeOptions.map((option) => {
                            const IconComponent = option.icon;
                            const isSelected = preferences.theme === option.value;
                            return (
                                <label
                                    key={option.value}
                                    className={`group flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${isSelected
                                        ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                                        }`}
                                    htmlFor={option.value}
                                    onClick={() => setPreferences({ ...preferences, theme: option.value })}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setPreferences({ ...preferences, theme: option.value });
                                        }
                                    }}
                                    tabIndex={0}
                                >
                                    <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                                    <div className={`p-2 rounded-lg transition-colors duration-200 ${isSelected
                                        ? 'bg-blue-100 dark:bg-blue-900/40'
                                        : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                                        }`}>
                                        <IconComponent className={`h-4 w-4 ${isSelected
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-400'
                                            }`} />
                                    </div>
                                    <div className="flex-1">
                                        <span
                                            className={`font-medium cursor-pointer transition-colors duration-200 ${isSelected
                                                ? 'text-blue-900 dark:text-blue-100'
                                                : 'text-gray-700 dark:text-gray-300'
                                                }`}
                                        >
                                            {option.label}
                                        </span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                            {option.description}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    )}
                                </label>
                            );
                        })}
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Language Settings */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                        <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-sm">
                            <Globe className="h-4 w-4" />
                        </div>
                        {t('languagePreference.title')}
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400 ml-11">
                        {t('languagePreference.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                    <Select
                        value={preferences.language}
                        onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                    >
                        <SelectTrigger className="w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:border-green-500">
                                                         <SelectValue>
                                 {preferences.language && (
                                     <div className="flex items-center gap-2">
                                         {getLanguageFlag(preferences.language)}
                                         <span>{languageOptions.find((opt: { value: string; label: string }) => opt.value === preferences.language)?.label || preferences.language}</span>
                                     </div>
                                 )}
                             </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                                         {languageOptions.map((option: { value: string; label: string; flag: string }) => {
                                 const isSelected = preferences.language === option.value;
                                 return (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        className={`text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 ${
                                            isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-2">
                                                {getLanguageFlag(option.flag)}
                                                <span>{option.label}</span>
                                            </div>
                                            {isSelected && (
                                                <Check className="h-4 w-4 ml-2 text-blue-600 dark:text-blue-400" />
                                            )}
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Save Button */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-200">
                <CardContent className="pt-6">
                    <Button
                        onClick={handleSavePreferences}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 text-white"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? t('actions.savingPreferences') : t('actions.savePreferences')}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}