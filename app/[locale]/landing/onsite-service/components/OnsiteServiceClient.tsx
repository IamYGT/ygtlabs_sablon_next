'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  Shield, 
  Car, 
  CheckCircle, 
  Phone,
  Wrench,
  Zap,
  Settings,
  Users
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function OnsiteServiceClient() {
  const features = [
    {
      icon: <Clock className="w-12 h-12" />,
      title: '7/24 Hizmet',
      description: 'Dilediğiniz zaman ve yerde hizmet alın'
    },
    {
      icon: <Wrench className="w-12 h-12" />,
      title: 'Profesyonel Ekipman',
      description: 'En son teknoloji ekipmanlarla yerinde müdahale'
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Güvenli İşlem',
      description: 'Tam güvenlikli ve garantili hizmet'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Uzman Ekip',
      description: 'Deneyimli teknisyenlerimizle profesyonel hizmet'
    }
  ];

  const services = [
    {
      title: 'Chiptuning',
      description: 'Aracınızın performansını bulunduğunuz yerde optimize ediyoruz',
      icon: <Zap className="w-8 h-8" />,
      items: [
        'Motor yazılımı güncellemesi',
        'DPF-EGR çözümleri',
        'Performans artırımı',
        'Yakıt optimizasyonu'
      ]
    },
    {
      title: 'Arıza Çözümü',
      description: 'Yerinde arıza tespiti ve çözüm hizmeti',
      icon: <Settings className="w-8 h-8" />,
      items: [
        'Elektronik arıza tespiti',
        'Hata kodu okuma',
        'Sensör kontrolü',
        'Sistem optimizasyonu'
      ]
    },
    {
      title: 'Bakım Hizmeti',
      description: 'Periyodik bakım ve kontrol işlemleri',
      icon: <Car className="w-8 h-8" />,
      items: [
        'Yazılım kontrolü',
        'Sistem güncellemesi',
        'Performans testi',
        'Genel kontrol'
      ]
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Randevu Alın',
      description: 'Size uygun gün ve saati belirleyin',
      icon: <Phone className="w-8 h-8" />
    },
    {
      step: '02',
      title: 'Lokasyon Bildirin',
      description: 'Aracınızın bulunduğu konumu paylaşın',
      icon: <MapPin className="w-8 h-8" />
    },
    {
      step: '03',
      title: 'Hizmeti Alın',
      description: 'Uzman ekibimiz yanınıza gelsin',
      icon: <Wrench className="w-8 h-8" />
    }
  ];

  const advantages = [
    'Zaman tasarrufu - Aracınızı getirmenize gerek yok',
    'Esnek randevu sistemi - Size uygun saatte hizmet',
    'Güvenli lokasyon - Kendi alanınızda işlem',
    'Hızlı müdahale - Aynı gün hizmet imkanı',
    'Profesyonel ekipman - Tam donanımlı servis aracı',
    'Garanti kapsamı - Tüm işlemler garantili'
  ];

  return (
    <div className="min-h-screen bg-light">
      <Header />
      
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium inline-block px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4">
              # YERİNDE HİZMET
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Size Bir Tık Kadar Yakınız<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Profesyonel ekibimiz ve mobil servis araçlarımızla dilediğiniz yerde chiptuning hizmeti sunuyoruz.
            </p>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Yerinde Hizmetlerimiz<span className="text-primary">.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Process Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Nasıl Çalışır<span className="text-primary">?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {process.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="text-center relative"
                >
                  <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-6">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-10 -right-4 w-8 h-0.5 bg-primary/20"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Advantages Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Yerinde Hizmetin Avantajları<span className="text-primary">.</span>
            </h2>
            <div className="bg-white rounded-xl shadow-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {advantages.map((advantage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                    <span className="text-gray-700">{advantage}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Pricing Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Yerinde Hizmet Fiyatları<span className="text-primary">.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Şehir İçi',
                  price: '+200₺',
                  description: 'Şehir merkezi ve yakın çevre',
                  features: ['Aynı gün hizmet', 'Hızlı ulaşım', 'Standart ekipman']
                },
                {
                  title: 'Şehir Dışı',
                  price: '+350₺',
                  description: '50km çapındaki bölgeler',
                  features: ['1-2 gün önceden randevu', 'Tam donanımlı ekip', 'Geniş servis alanı'],
                  featured: true
                },
                {
                  title: 'Uzak Mesafe',
                  price: 'Özel Fiyat',
                  description: '50km+ uzaklıktaki bölgeler',
                  features: ['Özel planlama', 'Kapsamlı hizmet', 'Konaklama dahil']
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 ${
                    plan.featured ? 'border-2 border-primary relative' : ''
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                        En Popüler
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-4">{plan.title}</h3>
                  <div className="text-3xl font-bold text-primary mb-2">{plan.price}</div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-dark rounded-2xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6">
                Hemen Randevu Alın
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Size en yakın uzman ekibimiz, en kısa sürede hizmet vermek için hazır.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/landing/contact"
                  className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                >
                  Randevu Oluştur
                </Link>
                <a
                  href="tel:+905551234567"
                  className="inline-block border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-dark transition-all duration-300"
                >
                  Hemen Ara
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 