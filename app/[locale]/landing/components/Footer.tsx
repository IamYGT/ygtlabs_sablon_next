'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Link } from '../../../../src/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Facebook, Instagram, Mail, Phone, MapPin, Clock, Send, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const t = useTranslations('Footer');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic here
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer id="contact" className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] bg-repeat opacity-20"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      <div className="relative container mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Logo ve Açıklama */}
          <div className="lg:col-span-2 space-y-6">
            <div className="group">
              <Image
                src="/images/revv-tuned-logo.png"
                alt="Revv Tuned"
                width={140}
                height={56}
                className="h-14 w-auto mb-6 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="text-gray-300 leading-relaxed max-w-md text-sm lg:text-base">
              {t('description')}
            </p>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wide">
                {t('followUs')}
              </h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="group w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
                >
                  <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="#"
                  className="group w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/25"
                >
                  <Instagram className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div className="space-y-6">
            <h3 className="text-white text-lg font-bold relative">
              {t('quickLinks')}
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/landing"
                  className="text-gray-300 hover:text-primary transition-all duration-300 flex items-center group text-sm"
                >
                  <ArrowRight className="w-4 h-4 mr-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">{t('home')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/landing/services"
                  className="text-gray-300 hover:text-primary transition-all duration-300 flex items-center group text-sm"
                >
                  <ArrowRight className="w-4 h-4 mr-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">{t('services')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/landing/corporate"
                  className="text-gray-300 hover:text-primary transition-all duration-300 flex items-center group text-sm"
                >
                  <ArrowRight className="w-4 h-4 mr-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">{t('corporate')}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/landing/blog"
                  className="text-gray-300 hover:text-primary transition-all duration-300 flex items-center group text-sm"
                >
                  <ArrowRight className="w-4 h-4 mr-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">{t('blog')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div className="space-y-6">
            <h3 className="text-white text-lg font-bold relative">
              {t('contact')}
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary"></span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-gray-300 text-sm block">{t('phone')}</span>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <a href={`mailto:${t('email')}`} className="text-gray-300 hover:text-primary transition-colors text-sm">
                    {t('email')}
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-gray-300 text-sm">{t('address')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Çalışma Saatleri & Newsletter */}
          <div className="space-y-6">
            <h3 className="text-white text-lg font-bold relative">
              {t('workingHours')}
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary"></span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">{t('weekdays')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">{t('saturday')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-gray-300 text-sm">{t('sunday')}</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <h4 className="text-white font-semibold mb-2">{t('newsletter')}</h4>
              <p className="text-gray-300 text-sm mb-4">{t('newsletterDesc')}</p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('enterEmail')}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 group text-sm"
                >
                  <span>{t('subscribe')}</span>
                  <Send className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              {t('copyright')}
            </p>
            <div className="flex items-center space-x-6">
              <a href="https://ataperformance.co.uk" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors text-sm">
                ataperformance.co.uk
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 