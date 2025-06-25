'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, MapPin, Gauge } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Service {
    title: string;
    description: string;
    link: string;
}

const icons: { [key: string]: React.ElementType } = {
    "ECU Tuning": Cpu,
    "On-Site Service": MapPin,
    "Power Measurement": Gauge,
    "ECU Yazılım": Cpu,
    "Yerinde Hizmet": MapPin,
    "Güç Ölçümü": Gauge
};

export default function ServiceCards() {
    const t = useTranslations('ServiceCards');
    const services = t.raw('services') as Service[];

    return (
        <section id="services" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {t('title')}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {t('description')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {Array.isArray(services) && services.map((service, index) => {
                        const IconComponent = icons[service.title] || Cpu;
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
                                <div className="mt-6 flex-grow">
                                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                                    <p className="mt-2 text-gray-600">{service.description}</p>
                                </div>
                                <div className="mt-6 flex-shrink-0">
                                    <Link href={service.link || '#'} className="group inline-flex items-center text-primary font-semibold">
                                        {t('learnMore')}
                                        <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
} 