import React from 'react';
import { motion } from 'framer-motion';
import { FaWrench, FaCogs, FaTools, FaCarAlt, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ServicesPage() {
  const services = [
    {
      icon: <FaWrench />,
      title: 'Chiptuning',
      description: 'Aracınızın performansını artırın, yakıt tüketimini optimize edin.',
      features: [
        'Stage 1-2-3 yazılımları',
        'DPF/EGR çözümleri',
        'Performans optimizasyonu',
        'Yakıt tasarrufu'
      ]
    },
    {
      icon: <FaCogs />,
      title: 'Motor Yazılımı',
      description: 'Profesyonel motor yazılım güncellemeleri ve optimizasyonları.',
      features: [
        'ECU programlama',
        'Güç artırımı',
        'Tork optimizasyonu',
        'Emisyon ayarları'
      ]
    },
    {
      icon: <FaTools />,
      title: 'Arıza Giderme',
      description: 'Elektronik arıza tespiti ve çözüm hizmetleri.',
      features: [
        'Diagnostik test',
        'Hata kodu silme',
        'Sensör kontrolü',
        'Sistem analizi'
      ]
    },
    {
      icon: <FaCarAlt />,
      title: 'Yerinde Hizmet',
      description: 'Size özel mobil servis hizmeti.',
      features: [
        '7/24 hizmet',
        'Profesyonel ekipman',
        'Hızlı müdahale',
        'Uzman ekip'
      ]
    },
    {
      icon: <FaChartLine />,
      title: 'Performans Testleri',
      description: 'Detaylı performans analizi ve raporlama.',
      features: [
        'Dyno testi',
        'Güç ölçümü',
        'Performans analizi',
        'Karşılaştırmalı raporlar'
      ]
    },
    {
      icon: <FaShieldAlt />,
      title: 'Garanti Hizmeti',
      description: 'Tüm hizmetlerimiz garanti kapsamındadır.',
      features: [
        '2 yıl yazılım garantisi',
        'Teknik destek',
        'Ücretsiz kontrol',
        'Sorun giderme'
      ]
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
              # HİZMETLERİMİZ
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Profesyonel Chiptuning Hizmetleri<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aracınızın performansını artırmak ve yakıt tüketimini optimize etmek için profesyonel çözümler sunuyoruz.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <span className="w-2 h-2 bg-primary/50 rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">
              Profesyonel Hizmet için Bize Ulaşın
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Aracınız için en uygun chiptuning çözümünü birlikte belirleyelim.
            </p>
            <a
              href="/contact"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
            >
              İletişime Geç
            </a>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ServicesPage;