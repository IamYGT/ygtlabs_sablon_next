'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';

interface HeroSlider {
    id: string;
    title: any; // JSON
    subtitle?: any; // JSON
    description: any; // JSON
    badge?: any; // JSON
    backgroundImage: string;
    primaryButton: any; // JSON
    secondaryButton?: any; // JSON
    statistics: any; // JSON
    order: number;
}

// JSON field parse etme fonksiyonu
function parseJSONField(value: any, locale: string): string {
    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value);
            return parsed?.[locale] || parsed?.en || value;
        } catch {
            return value;
        }
    }

    if (typeof value === 'object' && value !== null) {
        return value[locale] || value.en || Object.values(value)[0] || '';
    }

    return value || '';
}

export default function Hero() {
    const t = useTranslations('Hero');
    const locale = useLocale();
    const [sliders, setSliders] = useState<HeroSlider[]>([]);
    const [currentSlider, setCurrentSlider] = useState<HeroSlider | null>(null);
    const [loading, setLoading] = useState(true);

    // API'den slider verilerini çek
    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const response = await fetch('/api/hero-slider?limit=1');
                if (response.ok) {
                    const data = await response.json();
                    setSliders(data.sliders || []);
                    if (data.sliders && data.sliders.length > 0) {
                        setCurrentSlider(data.sliders[0]);
                    }
                }
            } catch (error) {
                console.error('Hero slider fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSliders();
    }, []);

    // Fallback veriler (API'den veri gelmezse)
    const fallbackData = {
        title: t('title.line1') + ' ' + t('title.line2'),
        subtitle: '',
        description: t('description'),
        badge: t('badge'),
        backgroundImage: '/slider/wallpaperflare.com_wallpaper.jpg',
        primaryButton: {
            text: t('buttons.discoverPower'),
            url: '/contact'
        },
        secondaryButton: {
            text: t('buttons.onsiteService'),
            url: '/services'
        },
        statistics: [
            { value: '5K+', label: t('stats.customers') },
            { value: '15+', label: t('stats.years') },
            { value: '98%', label: t('stats.success') },
            { value: '24/7', label: t('stats.support') }
        ]
    };

    // Mevcut slider verilerini parse et
    const getSliderData = () => {
        if (!currentSlider) return fallbackData;

        const title = parseJSONField(currentSlider.title, locale);
        const subtitle = parseJSONField(currentSlider.subtitle, locale);
        const description = parseJSONField(currentSlider.description, locale);
        const badge = parseJSONField(currentSlider.badge, locale);

        // Buton verilerini parse et
        let primaryButton = fallbackData.primaryButton;
        let secondaryButton = fallbackData.secondaryButton;

        if (currentSlider.primaryButton) {
            try {
                const parsed = typeof currentSlider.primaryButton === 'string'
                    ? JSON.parse(currentSlider.primaryButton)
                    : currentSlider.primaryButton;
                primaryButton = {
                    text: parsed?.[locale]?.text || parsed?.en?.text || fallbackData.primaryButton.text,
                    url: parsed?.[locale]?.url || parsed?.en?.url || fallbackData.primaryButton.url
                };
            } catch {
                // ignore
            }
        }

        if (currentSlider.secondaryButton) {
            try {
                const parsed = typeof currentSlider.secondaryButton === 'string'
                    ? JSON.parse(currentSlider.secondaryButton)
                    : currentSlider.secondaryButton;
                secondaryButton = {
                    text: parsed?.[locale]?.text || parsed?.en?.text || fallbackData.secondaryButton.text,
                    url: parsed?.[locale]?.url || parsed?.en?.url || fallbackData.secondaryButton.url
                };
            } catch {
                // ignore
            }
        }

        // İstatistikleri parse et
        let statistics = fallbackData.statistics;
        if (currentSlider.statistics) {
            try {
                const parsed = typeof currentSlider.statistics === 'string'
                    ? JSON.parse(currentSlider.statistics)
                    : currentSlider.statistics;

                if (Array.isArray(parsed)) {
                    statistics = parsed.map(stat => ({
                        value: stat?.[locale]?.value || stat?.en?.value || '',
                        label: stat?.[locale]?.label || stat?.en?.label || ''
                    })).filter(stat => stat.value && stat.label);
                }

                // Eğer parse edilen istatistik yoksa fallback kullan
                if (statistics.length === 0) {
                    statistics = fallbackData.statistics;
                }
            } catch {
                statistics = fallbackData.statistics;
            }
        }

        return {
            title: title || fallbackData.title,
            subtitle: subtitle || '',
            description: description || fallbackData.description,
            badge: badge || fallbackData.badge,
            backgroundImage: currentSlider.backgroundImage || fallbackData.backgroundImage,
            primaryButton,
            secondaryButton,
            statistics
        };
    };

    const sliderData = getSliderData();

    // Loading state
    if (loading) {
        return (
            <div id="home" className="relative min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div id="home" className="relative min-h-screen bg-white">
            {/* Background Image */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('${sliderData.backgroundImage}')`
                    }}
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen">
                <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Badge */}
                        {sliderData.badge && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="inline-block"
                            >
                                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
                                    {sliderData.badge}
                                </span>
                            </motion.div>
                        )}

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                        >
                            {sliderData.title.split(' ').map((word, index, words) => {
                                const isLastTwo = index >= words.length - 2;
                                return (
                                    <span key={index} className={isLastTwo ? 'text-primary' : ''}>
                                        {word}
                                        {index < words.length - 1 && ' '}
                                        {index === words.length - 3 && <br />}
                                    </span>
                                );
                            })}
                        </motion.h1>

                        {/* Subtitle */}
                        {sliderData.subtitle && (
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-2xl md:text-3xl text-gray-200 font-medium"
                            >
                                {sliderData.subtitle}
                            </motion.h2>
                        )}

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-xl text-gray-200 max-w-2xl mx-auto"
                        >
                            {sliderData.description}
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href={sliderData.primaryButton.url}>
                                <button className="group relative bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-10 py-4 rounded-xl font-bold transition-all duration-500 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-primary/25 hover:scale-105 transform">
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10 text-lg tracking-wide">{sliderData.primaryButton.text}</span>
                                    <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                </button>
                            </Link>

                            <Link href={sliderData.secondaryButton.url}>
                                <button className="border-2 border-white/30 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
                                    <MapPin className="w-5 h-5" />
                                    <span>{sliderData.secondaryButton.text}</span>
                                </button>
                            </Link>
                        </motion.div>

                        {/* Statistics */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16"
                        >
                            {sliderData.statistics.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                                    <div className="text-gray-300 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-3 z-20"
            >
                {/* Animated Arrow */}
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center space-y-1"
                >
                    <div className="w-px h-8 bg-gradient-to-b from-transparent via-white/60 to-white/20"></div>
                    <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-4 h-4 border-r-2 border-b-2 border-white/70 transform rotate-45"
                    ></motion.div>
                </motion.div>

                {/* Text */}
                <motion.span
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-white/70 text-xs font-light tracking-[0.2em] uppercase"
                >
                    {t('scroll')}
                </motion.span>
            </motion.div>
        </div>
    );
} 