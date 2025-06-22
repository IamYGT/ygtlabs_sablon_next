'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Wrench, Power, Gauge, Zap } from 'lucide-react';

export default function ServiceIcons() {
    const services = [
        { name: 'Vmox OFF', icon: Settings },
        { name: 'DTC OFF', icon: Wrench },
        { name: 'Start & Stop OFF', icon: Power },
        { name: 'Sport Display', icon: Gauge },
        { name: 'Hard Rev Out', icon: Zap },
        { name: 'ECU Remap', icon: Settings },
        { name: 'Turbo Boost', icon: Zap }
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
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 + distanceFromCenter * 2 }}
                                    animate={{ opacity: 1, y: size.yOffset }}
                                    transition={{
                                        delay: 0.6 + index * 0.05,
                                        duration: 0.4
                                    }}
                                    className={`flex flex-col items-center text-center group cursor-pointer hover:bg-white/5 rounded-lg transition-all duration-200 ${size.spacing} ${size.padding}`}
                                >
                                    <div
                                        className={`rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:bg-primary/60 transition-all duration-200 shadow-xl ${size.container}`}
                                        style={{
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                                        }}
                                    >
                                        <IconComponent className={`text-white drop-shadow-lg transition-all duration-200 ${size.icon}`} />
                                    </div>
                                    <span className={`text-white font-medium drop-shadow-xl group-hover:text-primary transition-colors duration-200 ${size.text}`}>
                                        {service.name}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 