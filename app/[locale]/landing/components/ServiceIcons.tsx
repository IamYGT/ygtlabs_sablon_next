'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Wrench, Power, Gauge, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

const ServiceIcon = ({ icon: Icon, title }: { icon: React.ElementType, title: string }) => (
    <motion.div
        whileHover={{ y: -8, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="flex flex-col items-center space-y-3 text-center"
    >
        <div className="bg-primary/10 p-4 rounded-full border-2 border-primary/20">
            <Icon className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm font-semibold text-gray-700">{title}</p>
    </motion.div>
);

export default function ServiceIcons() {
    const t = useTranslations('ServiceIcons');

    const services = [
        { icon: Settings, title: t('ecuTuning') },
        { icon: Wrench, title: t('performanceUpgrades') },
        { icon: Power, title: t('startStop') },
        { icon: Gauge, title: t('adblueDpf') },
        { icon: Zap, title: t('powerDyno') },
        { icon: Settings, title: t('ecuRemap') },
        { icon: Zap, title: t('turboBoost') }
    ];

    return (
        <div className="relative -mt-28 z-30 pb-20">
            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="backdrop-blur-xl bg-black/40 border border-white/20 rounded-xl py-4 shadow-2xl drop-shadow-2xl max-w-4xl mx-auto"
                    style={{
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px) saturate(180%)'
                    }}
                >
                    <div className="grid grid-cols-7 gap-3 px-8">
                        {services.map((service, index) => {
                            const IconComponent = service.icon;
                            const center = 3; // Ortadaki index
                            const distanceFromCenter = Math.abs(index - center);

                            // Ortaya doğru büyüme hesaplama
                            const getSize = (distance: number) => {
                                if (distance === 0) return { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-sm', spacing: 'space-y-3', padding: 'py-3', yOffset: -6 };
                                if (distance === 1) return { container: 'w-10 h-10', icon: 'w-5 h-5', text: 'text-xs', spacing: 'space-y-2', padding: 'py-2', yOffset: -3 };
                                if (distance === 2) return { container: 'w-9 h-9', icon: 'w-4 h-4', text: 'text-xs', spacing: 'space-y-2', padding: 'py-2', yOffset: -1 };
                                return { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-xs', spacing: 'space-y-2', padding: 'py-2', yOffset: 0 };
                            };

                            const size = getSize(distanceFromCenter);

                            return (
                                <ServiceIcon key={index} icon={IconComponent} title={service.title} />
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 