'use client';

import React from 'react';
import Image from 'next/image';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-dark text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo ve Açıklama */}
          <div className="md:col-span-2">
            <Image 
              src="/images/ata-logo.png" 
              alt="ATA Performance" 
              width={120}
              height={48}
              className="h-12 w-auto mb-4"
            />
            <p className="text-gray-400 mb-6 max-w-md">
              ATA Performance olarak, araç performansınızı en üst seviyeye çıkarmak için 
              profesyonel chiptuning hizmetleri sunuyoruz.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-primary transition-colors">Anasayfa</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-primary transition-colors">Hizmetler</a></li>
              <li><a href="#corporate" className="text-gray-400 hover:text-primary transition-colors">Kurumsal</a></li>
              <li><a href="#blog" className="text-gray-400 hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-gray-400">+90 XXX XXX XX XX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-gray-400">info@ataperformance.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-gray-400">İstanbul, Türkiye</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 ATA Performance. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
} 