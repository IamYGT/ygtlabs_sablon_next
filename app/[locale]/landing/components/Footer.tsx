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
    <footer id="contact" className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] bg-repeat opacity-30"></div>
      </div>

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-pulse"></div>

      {/* Top Glow Effect */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>



      <div className="relative w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Newsletter - Üstte Yatay */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 rounded-2xl border border-primary/30 p-8 backdrop-blur-sm shadow-2xl hover:shadow-primary/10 transition-all duration-500 group">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-white text-xl font-bold mb-2 group-hover:text-primary/90 transition-colors duration-300">{t('newsletter')}</h3>
              <p className="text-gray-300 text-sm mb-6 group-hover:text-gray-200 transition-colors duration-300">{t('newsletterDesc')}</p>
              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('enterEmail')}
                    className="w-full px-4 py-3 pl-4 pr-32 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary/50 backdrop-blur-md bg-gray-800/40 hover:bg-gray-800/50 text-white border-gray-600/50 border shadow-xl placeholder-gray-400 transition-all duration-300 text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-primary via-primary to-primary/80 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary/25 active:scale-95 hover:scale-105 flex items-center space-x-2 group text-sm"
                  >
                    <span>{t('subscribe')}</span>
                    <Send className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Logo ve Açıklama */}
          <div className="space-y-4 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Image
                src="/logo/RevvTuned.png"
                alt="Revv Tuned"
                width={140}
                height={56}
                className="relative h-12 w-auto mb-4 transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              />
            </div>
            <p className="text-gray-300 leading-relaxed max-w-md text-sm lg:text-base">
              {t('description')}
            </p>

            {/* Social Media */}
            <div className="space-y-3">
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
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold relative group">
              {t('quickLinks')}
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-500"></span>
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
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold relative group">
              {t('contact')}
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-500"></span>
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

          {/* Çalışma Saatleri */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold relative group">
              {t('workingHours')}
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-500"></span>
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
          </div>


        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 mt-16 pt-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              {t('copyright')}
            </p>
            <div className="flex items-center space-x-6">

              <a
                href="https://memsidea.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 group cursor-pointer"
              >
                <span className="text-gray-500 text-xs font-medium tracking-wider uppercase group-hover:text-gray-300 transition-all duration-500">
                  Crafted with ❤️ by
                </span>
                <div className="relative inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 backdrop-blur-sm group-hover:from-primary/20 group-hover:to-primary/10 group-hover:border-primary/40 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/20">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-lg border border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Logo */}
                  <div className="relative flex items-center space-x-2">
                    <Image
                      src="/logo/mems.png"
                      alt="Memsidea"
                      width={720}
                      height={192}
                      className="h-8 w-auto opacity-80 group-hover:opacity-100 group-hover:brightness-110 transition-all duration-500"
                      quality={100}
                    />
                    <div className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300 delay-200"></div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1000 ease-out"></div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}