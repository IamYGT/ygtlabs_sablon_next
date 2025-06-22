'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowRight,
    Phone,
    Mail,
    MapPin,
    ChevronRight,
    Car,
    Gauge,
    Settings} from 'lucide-react';

// Panel componentlerini import et
import Logo from '@/components/panel/Logo';
import { ThemeToggle } from '@/components/panel/ThemeToggle';
import LanguageSwitcher from '@/components/panel/LanguageSwitcher';

export default function LandingPageContent() {
    const [isVisible, setIsVisible] = useState(false);
    const [stats, setStats] = useState({
        customers: 0,
        projects: 0,
        experience: 0,
        satisfaction: 0
    });

    useEffect(() => {
        setIsVisible(true);

        // Animate stats
        const timer = setTimeout(() => {
            setStats({
                customers: 5000,
                projects: 12000,
                experience: 15,
                satisfaction: 98
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

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
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Logo />

                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="#services" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Hizmetler
                            </Link>
                            <Link href="#about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Hakkımızda
                            </Link>
                            <Link href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                İletişim
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <LanguageSwitcher />
                            <ThemeToggle />
                            <Link
                                href="/auth/login"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Giriş Yap
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
                        >
                            Aracınızın{' '}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Performansını
                            </span>
                            <br />
                            Maksimuma Çıkarın
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
                        >
                            Profesyonel chip tuning ve ECU optimizasyonu ile aracınızın gizli potansiyelini ortaya çıkarın.
                            15 yıllık deneyim, binlerce memnun müşteri.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link
                                href="#contact"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center group"
                            >
                                Hemen Başlayın
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="#services"
                                className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
                            >
                                Hizmetleri İncele
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white dark:bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                                {stats.customers.toLocaleString()}+
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">Müşteri</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-center"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                                {stats.projects.toLocaleString()}+
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">Proje</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-center"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                                {stats.experience}+
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">Yıl Deneyim</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-center"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                                %{stats.satisfaction}
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">Memnuniyet</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20 bg-gray-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Hizmetlerimiz
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Aracınız için en iyi performans çözümlerini sunuyoruz
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg mb-6">
                                    <service.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    {service.description}
                                </p>
                                <ul className="space-y-2">
                                    {service.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                                            <ChevronRight className="h-4 w-4 text-blue-600 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-white dark:bg-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            İletişime Geçin
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Uzman ekibimizle hemen iletişime geçin
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4 mx-auto">
                                <Phone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Telefon</h3>
                            <p className="text-gray-600 dark:text-gray-300">+90 555 123 45 67</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-center"
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4 mx-auto">
                                <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">E-posta</h3>
                            <p className="text-gray-600 dark:text-gray-300">info@ecusistem.com</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-center"
                        >
                            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4 mx-auto">
                                <MapPin className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Adres</h3>
                            <p className="text-gray-600 dark:text-gray-300">İstanbul, Türkiye</p>
                        </motion.div>
                    </div>

                    <div className="mt-16 text-center">
                        <Link
                            href="/auth/register"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center group"
                        >
                            Hemen Kayıt Olun
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <Logo />
                            <p className="text-gray-400 mt-4">
                                Profesyonel chip tuning ve ECU optimizasyonu hizmetleri
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Hizmetler</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>Chip Tuning</li>
                                <li>ECU Yazılımı</li>
                                <li>Performans Optimizasyonu</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Şirket</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>Hakkımızda</li>
                                <li>İletişim</li>
                                <li>Gizlilik Politikası</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">İletişim</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>+90 555 123 45 67</li>
                                <li>info@ecusistem.com</li>
                                <li>İstanbul, Türkiye</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 ECU Sistem. Tüm hakları saklıdır.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
} 