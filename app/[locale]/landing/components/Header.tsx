'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Facebook,
    Instagram,
    Menu,
    X,
    ArrowRight,
    Star
} from 'lucide-react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleScroll = useCallback(() => {
        setIsScrolled(window.scrollY > 0);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [isMenuOpen]);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const menuItems = [
        { href: '/', label: 'ANASAYFA' },
        { href: '/landing/chiptuning', label: 'CHIPTUNING' },
        { href: '/landing/corporate', label: 'KURUMSAL' },
        { href: '/landing/services', label: 'HİZMETLER' },
        { href: '/landing/onsite-service', label: 'YERİNDE HİZMET' },
        { href: '/landing/blog', label: 'BLOG' },
        { href: '/landing/dealers', label: 'BAYİLER' }
    ];

    return (
        <>
            <header
                className={`fixed w-full z-[999] transform transition-all duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'
                    }`}
            >
                {/* Top Bar */}
                <div className="bg-gradient-to-r from-primary to-primary/95 text-white transition-all duration-300">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center h-8">
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-current text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-white/90">5/5.0</span>
                            </div>
                            <div className="hidden md:flex items-center space-x-6">
                                <a href="#" className="text-white/80 hover:text-white transition-colors">
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a href="#" className="text-white/80 hover:text-white transition-colors">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a
                                    href="https://ataperformance.co.uk"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-white/80 hover:text-white transition-colors"
                                >
                                    ataperformance.co.uk
                                </a>
                                <Link
                                    href="/landing/dealership"
                                    className="text-sm text-white/80 hover:text-white transition-colors"
                                >
                                    Bayilik Başvurusu
                                </Link>
                                <Link
                                    href="/landing/faq"
                                    className="text-sm text-white/80 hover:text-white transition-colors"
                                >
                                    Sık Sorulan Sorular
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav
                    className={`bg-white/95 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'py-2 shadow-lg' : 'py-3'
                        }`}
                >
                    <div className="container mx-auto px-4 lg:px-8 xl:px-12">
                        <div className="flex items-center justify-between">
                            <Link href="#home" className="flex-shrink-0 mr-8 lg:mr-16">
                                <Image
                                    src="/images/ata_yan_siyah.webp"
                                    alt="ATA Performance"
                                    width={200}
                                    height={40}
                                    className={`w-auto transition-all duration-300 ${isScrolled ? 'h-7 lg:h-8' : 'h-8 lg:h-10'
                                        }`}
                                />
                            </Link>

                            {/* Desktop Menu */}
                            <div className="hidden md:flex items-center justify-end flex-1 md:space-x-3 lg:space-x-5 xl:space-x-8">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="relative text-gray-800 text-[13px] lg:text-sm font-medium group overflow-hidden px-1 py-2 whitespace-nowrap"
                                    >
                                        <span className="relative z-10 transition-colors duration-300 group-hover:text-primary">
                                            {item.label}
                                        </span>
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                                    </Link>
                                ))}
                                <Link
                                    href="/landing/contact"
                                    className="relative overflow-hidden bg-primary text-white px-4 lg:px-6 py-2 rounded-lg text-[13px] lg:text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group ml-2 lg:ml-4"
                                >
                                    <span className="relative z-10">İLETİŞİM</span>
                                    <span className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                                </Link>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:text-primary transition-colors rounded-lg hover:bg-gray-100"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] md:hidden"
                            onClick={closeMenu}
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
                            className="fixed top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-2xl z-[999] md:hidden overflow-hidden"
                        >
                            <div className="flex flex-col h-full">
                                {/* Menu Header */}
                                <div className="sticky top-0 flex items-center justify-between px-4 py-3 sm:p-6 border-b border-gray-100 bg-white/95 backdrop-blur-md z-10">
                                    <Image
                                        src="/images/ata_yan_siyah.webp"
                                        alt="ATA Performance"
                                        width={120}
                                        height={32}
                                        className="h-6 sm:h-8 w-auto transform hover:scale-105 transition-transform duration-300"
                                    />
                                    <button
                                        onClick={closeMenu}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary transition-all duration-300 rounded-lg hover:bg-gray-100 ml-2"
                                    >
                                        <motion.div
                                            initial={{ rotate: 0 }}
                                            animate={{ rotate: 180 }}
                                            exit={{ rotate: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <X className="w-6 h-6" />
                                        </motion.div>
                                    </button>
                                </div>

                                {/* Menu Items */}
                                <div className="flex-1 overflow-y-auto bg-gray-50/50">
                                    <div className="p-6 space-y-2">
                                        {menuItems.map((item, index) => (
                                            <motion.div
                                                key={item.href}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Link
                                                    href={item.href}
                                                    onClick={closeMenu}
                                                    className="block px-4 py-3 text-gray-800 font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{item.label}</span>
                                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Contact Button */}
                                <div className="p-6 border-t border-gray-100 bg-white">
                                    <Link
                                        href="/landing/contact"
                                        onClick={closeMenu}
                                        className="flex items-center justify-center bg-primary text-white px-6 py-4 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] relative overflow-hidden group"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                                        <span className="relative z-10">İLETİŞİM</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
} 