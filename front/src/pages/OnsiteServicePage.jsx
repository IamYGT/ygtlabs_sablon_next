import React from 'react';
import { motion } from 'framer-motion';
import { FaTools, FaClock, FaMapMarkedAlt, FaShieldAlt, FaCarAlt, FaCheckCircle } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

function OnsiteServicePage() {
  const features = [
    {
      icon: <FaClock />,
      title: '7/24 Hizmet',
      description: 'Dilediğiniz zaman ve yerde hizmet alın'
    },
    {
      icon: <FaTools />,
      title: 'Profesyonel Ekipman',
      description: 'En son teknoloji ekipmanlarla yerinde müdahale'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Güvenli İşlem',
      description: 'Tam güvenlikli ve garantili hizmet'
    }
  ];

  const services = [
    {
      title: 'Chiptuning',
      description: 'Aracınızın performansını bulunduğunuz yerde optimize ediyoruz',
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
      title: 'Randevu Alın',
      description: 'Size uygun gün ve saati belirleyin'
    },
    {
      title: 'Lokasyon Bildirin',
      description: 'Aracınızın bulunduğu konumu paylaşın'
    },
    {
      title: 'Hizmeti Alın',
      description: 'Uzman ekibimiz yanınıza gelsin'
    }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
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
                  <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700">
                        <FaCheckCircle className="text-primary flex-shrink-0" />
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
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-6">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
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
              <button className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105">
                Randevu Oluştur
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OnsiteServicePage;