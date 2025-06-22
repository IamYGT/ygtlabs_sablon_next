'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function MainContent() {
    const t = useTranslations('MainContent');

    const features = [
        { text: t('features.dealership'), link: '/landing/dealership' },
        { text: t('features.onsiteService'), link: '/landing/onsite-service' },
        { text: t('features.reviews'), link: '#reviews' },
        { text: t('features.faq'), link: '/landing/faq' }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                            {t('title.line1')}<br />
                          <span className="text-primary relative">
                                {t('title.highlight')}
                                <span className="absolute -right-4 top-0 text-primary">.</span>
                            </span>
                        </h2>
                        
                        <p className="text-gray-600 text-lg leading-relaxed">
                            {t('description')}
                        </p>
                        
                        <ul className="space-y-4">
                            {features.map((feature, index) => (
                                <motion.li 
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    <a 
                                        href={feature.link}
                                        className="group flex items-center space-x-3 text-lg text-gray-700 hover:text-primary transition-colors duration-300"
                                    >
                                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                            <Check className="w-3 h-3 text-primary" />
                                        </span>
                                        <span className="font-medium">{feature.text}</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <Image 
                                src="/images/car-tuning.jpg" 
                                alt="Car Tuning"
                                width={600}
                                height={600}
                                className="w-full h-[600px] object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                        
                        {/* Experience Badge */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="absolute -bottom-8 -left-8 bg-primary text-white p-6 rounded-xl shadow-xl"
                        >
                            <div className="text-4xl font-bold mb-2">15+</div>
                            <div className="text-sm opacity-90 font-medium">{t('experience')}</div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
} 