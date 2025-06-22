'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Shield, Clock } from 'lucide-react';

export default function Hero() {
    const features = [
        { icon: Shield, title: 'Premium Hizmet', subtitle: 'Uzman Ekip' },
        { icon: Clock, title: 'Hızlı Teslimat', subtitle: 'Aynı Gün' }
    ];

    return (
        <div id="home" className="relative min-h-screen bg-dark">
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{
                    backgroundImage: "url('/images/red-sports-car.jpg')"
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-dark/95 to-dark/40"></div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative container mx-auto h-full flex flex-col justify-center pt-32 px-4"
                >
                    <div className="max-w-2xl space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-block"
                        >
                            <span className="bg-primary/20 text-primary px-6 py-2 rounded-full text-sm font-medium border border-primary/20 hover:border-primary/40 transition-colors duration-300">
                                #1 Chiptuning Merkezi
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-5xl md:text-7xl font-bold text-white space-y-4"
                        >
                            <span className="block">Özel Tuning</span>
                            <span className="gradient-text block">Zamanı</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                            className="text-xl text-gray-300 leading-relaxed max-w-xl"
                        >
                            Özel Chiptuning deneyimi için elinizden veya aracınızın bulunduğu yerde profesyonel hizmet
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                            className="flex flex-wrap gap-4"
                        >
                            <button className="btn btn-primary flex items-center space-x-2 group relative overflow-hidden">
                                <span className="relative z-10">GÜCÜ KEŞFET</span>
                                <ArrowRight className="relative z-10 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                            </button>
                            <button className="btn btn-outline flex items-center space-x-2 group relative overflow-hidden">
                                <MapPin className="relative z-10 w-5 h-5" />
                                <span className="relative z-10">YERİNDE HİZMET</span>
                                <div className="absolute inset-0 bg-primary/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                            </button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className="flex items-center space-x-8 pt-8"
                        >
                            {features.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div key={index} className="flex items-center space-x-3 group">
                                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                            <IconComponent className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold group-hover:text-primary transition-colors duration-300">
                                                {feature.title}
                                            </div>
                                            <div className="text-gray-400 text-sm">{feature.subtitle}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 