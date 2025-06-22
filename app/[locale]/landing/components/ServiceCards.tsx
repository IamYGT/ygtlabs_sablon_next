'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Car, Gauge, Settings } from 'lucide-react';

export default function ServiceCards() {
    const services = [
        {
            icon: Car,
            title: "Chip Tuning",
            description: "Motor performansını artıran profesyonel chip tuning hizmetleri",
            features: ["Güç artışı", "Yakıt tasarrufu", "Garanti koruması"]
        },
        {
            icon: Gauge,
            title: "ECU Yazılımı",
            description: "Özel ECU yazılım geliştirme ve optimizasyon",
            features: ["Özel yazılım", "Test sürüşü", "Sürekli destek"]
        },
        {
            icon: Settings,
            title: "Performans Optimizasyonu",
            description: "Araç performansının maksimuma çıkarılması",
            features: ["Dinamometre testi", "Detaylı analiz", "Garanti"]
        }
    ];

    return (
        <section id="services" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Hizmetlerimiz
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Aracınız için en iyi performans çözümlerini sunuyoruz
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => {
                        const IconComponent = service.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card card-hover p-8 text-center"
                            >
                                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-6 mx-auto">
                                    <IconComponent className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {service.description}
                                </p>
                                <ul className="space-y-2">
                                    {service.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center justify-center text-gray-600">
                                            <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
} 