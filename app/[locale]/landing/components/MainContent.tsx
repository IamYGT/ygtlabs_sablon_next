'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Users, BadgeCheck } from 'lucide-react';
import Image from 'next/image';

const FeatureItem = ({ text, delay }: { text: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: delay }}
        className="flex items-center space-x-3"
    >
        <BadgeCheck className="h-6 w-6 text-primary" />
        <span className="text-lg text-gray-700">{text}</span>
    </motion.div>
);

export default function MainContent() {
    const t = useTranslations('MainContent');

    const features = [
        t('features.dealership'),
        t('features.onsiteService'),
        t('features.reviews'),
        t('features.faq'),
    ];

    return (
        <section className="bg-white py-20 sm:py-28" id="about">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left side: Text content */}
                    <div className="space-y-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
                        >
                            {t.rich('title.line1', {
                                highlight: (chunks) => <span className="text-primary">{chunks}</span>,
                            })}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-gray-600 leading-relaxed"
                        >
                            {t('description')}
                        </motion.p>

                        <div className="grid grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <FeatureItem key={index} text={feature} delay={0.4 + index * 0.1} />
                            ))}
                        </div>
                    </div>

                    {/* Right side: Image and Experience card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/images/car-tuning.jpg"
                                alt={t('imageAlt')}
                                width={600}
                                height={450}
                                className="object-contain w-full h-full"
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">15</p>
                                    <p className="text-sm text-gray-500">{t('experience')}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
} 