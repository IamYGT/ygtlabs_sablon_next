'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Wrench, Power, Gauge, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

const ServiceIcon = ({ icon: Icon, title, index }: { icon: React.ElementType, title: string, index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
            delay: index * 0.1, 
            duration: 0.6,
            type: 'spring',
            stiffness: 120,
            damping: 20
        }}
        whileHover={{ 
            y: -10, 
            scale: 1.08,
            transition: { type: 'spring', stiffness: 400, damping: 10 }
        }}
        className="group flex flex-col items-center space-y-3 text-center cursor-pointer"
    >
        <motion.div 
            className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/30 shadow-landing-custom overflow-hidden"
            whileHover={{ boxShadow: "0 0 30px rgba(255, 30, 30, 0.4)" }}
            transition={{ duration: 0.3 }}
        >
            {/* Gradient background overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-landing-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            
            <Icon className="relative h-7 w-7 sm:h-8 sm:w-8 text-white group-hover:text-landing-primary transition-colors duration-300" />
        </motion.div>
        
        <motion.p 
            className="text-xs sm:text-sm font-semibold text-white/90 group-hover:text-white transition-colors duration-300 leading-tight"
            whileHover={{ scale: 1.05 }}
        >
            {title}
        </motion.p>
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
                            return (
                                <ServiceIcon key={index} icon={IconComponent} title={service.title} index={index} />
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}