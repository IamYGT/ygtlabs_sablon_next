'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ArrowRight, MapPin } from 'lucide-react';

export default function Hero() {
    const t = useTranslations('Hero');

    return (
        <div id="home" className="relative min-h-screen bg-white">
            {/* Background Image */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/slider/wallpaperflare.com_wallpaper.jpg')"
                    }}
                />
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-block"
                        >
                            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium border border-primary/20">
                                {t('badge')}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                        >
                            {t('title.line1')} <br />
                            <span className="text-primary">{t('title.line2')}</span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-xl text-gray-200 max-w-2xl mx-auto"
                        >
                            {t('description')}
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center space-x-2">
                                <span>{t('buttons.discoverPower')}</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <button className="border-2 border-white/30 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
                                <MapPin className="w-5 h-5" />
                                <span>{t('buttons.onsiteService')}</span>
                            </button>
                        </motion.div>

                        {/* Simple Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16"
                        >
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">5K+</div>
                                <div className="text-gray-300 text-sm">Customers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">15+</div>
                                <div className="text-gray-300 text-sm">Years</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">98%</div>
                                <div className="text-gray-300 text-sm">Success</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">24/7</div>
                                <div className="text-gray-300 text-sm">Support</div>
                            </div>
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
                    Scroll
                </motion.span>
            </motion.div>
        </div>
    );
} 