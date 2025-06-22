'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Gauge, 
  Settings, 
  Shield, 
  Wrench, 
  Car, 
  CheckCircle,
  Clock,
  Award,
  Users
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ServicesClient() {
  const services = [
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Stage 1 Chiptuning',
      description: 'Temel performans artışı ve yakıt optimizasyonu',
      features: [
        'Güç artışı: +25-30%',
        'Tork artışı: +20-25%',
        'Yakıt tasarrufu: -10%',
        'Orijinal donanım korunur'
      ],
      price: '1.500₺',
      duration: '2-3 saat'
    },
    {
      icon: <Gauge className="w-12 h-12" />,
      title: 'Stage 2 Chiptuning',
      description: 'Gelişmiş performans ve donanım güncellemeleri',
      features: [
        'Güç artışı: +35-40%',
        'Tork artışı: +30-35%',
        'Performans odaklı',
        'Donanım güncellemesi'
      ],
      price: '2.500₺',
      duration: '4-5 saat'
    },
    {
      icon: <Settings className="w-12 h-12" />,
      title: 'ECU Remapping',
      description: 'Motor kontrol ünitesi yazılım optimizasyonu',
      features: [
        'Özel yazılım geliştirme',
        'Motor karakteristik ayarı',
        'Emisyon optimizasyonu',
        'Güvenlik sınırları'
      ],
      price: '2.000₺',
      duration: '3-4 saat'
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'DPF/EGR İptali',
      description: 'Dizel partikül filtresi ve EGR valf iptali',
      features: [
        'DPF temizlik sorunu çözümü',
        'EGR valf arızası giderme',
        'Motor ömrü uzatma',
        'Bakım maliyeti azaltma'
      ],
      price: '1.200₺',
      duration: '2-3 saat'
    },
    {
      icon: <Wrench className="w-12 h-12" />,
      title: 'Performans Testi',
      description: 'Dyno test ve detaylı performans analizi',
      features: [
        'Güç ve tork ölçümü',
        'Hava/yakıt oranı analizi',
        'Egzoz gazı analizi',
        'Detaylı rapor'
      ],
      price: '500₺',
      duration: '1 saat'
    },
    {
      icon: <Car className="w-12 h-12" />,
      title: 'Launch Control',
      description: 'Yarış start sistemi kurulumu',
      features: [
        'Mükemmel start performansı',
        'Ayarlanabilir rpm limiti',
        'Anti-lag sistemi',
        'Profesyonel kalibrasyon'
      ],
      price: '1.800₺',
      duration: '3-4 saat'
    }
  ];

  const advantages = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Profesyonel Ekip',
      description: 'Uzman teknisyenlerimizle güvenli hizmet'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Hızlı Servis',
      description: 'Aynı gün teslim garantisi'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Kalite Garantisi',
      description: '1 yıl garanti ile hizmet veriyoruz'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '10.000+ Müşteri',
      description: 'Memnun müşteri portföyümüz'
    }
  ];

  return (
    <div className="min-h-screen bg-light">
      <Header />
      
      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium inline-block px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4">
              # HİZMETLER
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Profesyonel Hizmetlerimiz<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aracınızın performansını artırmak için ihtiyacınız olan tüm hizmetleri tek çatı altında sunuyoruz.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="border-t pt-6 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">{service.price}</div>
                    <div className="text-sm text-gray-500">Süre: {service.duration}</div>
                  </div>
                  <Link
                    href="/landing/contact"
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                  >
                    Randevu Al
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Advantages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Neden ATA Performance<span className="text-primary">?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-6 mx-auto">
                    {advantage.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{advantage.title}</h3>
                  <p className="text-gray-600">{advantage.description}</p>
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
              Hizmet Sürecimiz<span className="text-primary">.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Randevu',
                  description: 'Online veya telefon ile randevu alın'
                },
                {
                  step: '02',
                  title: 'Analiz',
                  description: 'Aracınızı detaylı olarak analiz ediyoruz'
                },
                {
                  step: '03',
                  title: 'Uygulama',
                  description: 'Seçilen hizmeti profesyonelce uyguluyoruz'
                },
                {
                  step: '04',
                  title: 'Test & Teslim',
                  description: 'Test edip aracınızı teslim ediyoruz'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white text-xl font-bold mb-6 mx-auto">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-primary/20"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Sık Sorulan Sorular<span className="text-primary">.</span>
            </h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: 'Chiptuning garantili mi?',
                  answer: 'Evet, tüm chiptuning hizmetlerimiz 1 yıl garanti ile sunulmaktadır.'
                },
                {
                  question: 'Aracımın garantisi bozulur mu?',
                  answer: 'Profesyonel chiptuning ile aracınızın garantisi bozulmaz. Gerektiğinde orijinal yazılıma geri dönülebilir.'
                },
                {
                  question: 'Hangi araçlara hizmet veriyorsunuz?',
                  answer: 'Tüm marka ve modellere hizmet veriyoruz. Benzinli, dizel ve hibrit araçlar için özel çözümlerimiz vardır.'
                },
                {
                  question: 'Randevu almak zorunlu mu?',
                  answer: 'Daha iyi hizmet verebilmek için randevu almanızı öneriyoruz. Acil durumlar için arayabilirsiniz.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg"
                >
                  <h3 className="text-lg font-bold mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
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
                Hizmetlerimiz Hakkında Daha Fazla Bilgi
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Uzman ekibimizden detaylı bilgi almak ve randevu oluşturmak için iletişime geçin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/landing/contact"
                  className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                >
                  Randevu Al
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