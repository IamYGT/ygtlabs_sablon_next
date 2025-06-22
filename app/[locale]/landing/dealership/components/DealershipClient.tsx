'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store, 
  Handshake, 
  TrendingUp, 
  Users, 
  Phone,
  Mail,
  Building,
  Award,
  Target,
  DollarSign
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function DealershipClient() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    experience: '',
    message: ''
  });

  const benefits = [
    {
      icon: <Store className="w-12 h-12" />,
      title: 'Marka Gücü',
      description: 'Sektörün lider markası ile güçlü bir iş ortaklığı kurma fırsatı'
    },
    {
      icon: <Handshake className="w-12 h-12" />,
      title: 'Sürekli Destek',
      description: 'Teknik, pazarlama ve operasyonel konularda tam destek'
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: 'Yüksek Karlılık',
      description: 'Rekabetçi fiyatlar ve yüksek kar marjı ile karlı iş modeli'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Eğitim Programı',
      description: 'Kapsamlı eğitim ve sertifikasyon programları'
    }
  ];

  const requirements = [
    {
      icon: <Building className="w-8 h-8" />,
      title: 'Fiziksel Mekan',
      description: 'Minimum 100m² kapalı alan ve uygun lokasyon'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'Yatırım Kapasitesi',
      description: 'Başlangıç yatırımı için yeterli sermaye'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Deneyim',
      description: 'Otomotiv sektöründe minimum 2 yıl deneyim'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Hedef Odaklılık',
      description: 'Satış hedeflerine ulaşma kararlılığı'
    }
  ];

  const supportServices = [
    'Kapsamlı teknik eğitim programı',
    'Pazarlama ve reklam desteği',
    'Sürekli teknik destek hattı',
    'Ürün ve hizmet güncellemeleri',
    'Satış ve müşteri yönetimi eğitimi',
    'Operasyonel süreçlerde rehberlik',
    'Bölgesel toplantı ve etkinlikler',
    'Online eğitim platformu erişimi'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Form submitted:', formData);
    alert('Başvurunuz alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.');
  };

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
              # BAYİLİK FIRSATI
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Revv Tuned Ailesine Katılın<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Türkiye&apos;nin lider chiptuning markası ile işinizi büyütün ve geleceğe yatırım yapın.
            </p>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"
          >
            {[
              { number: '25+', label: 'Bayi Sayısı' },
              { number: '50+', label: 'Şehir' },
              { number: '15+', label: 'Yıllık Deneyim' },
              { number: '95%', label: 'Memnuniyet' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-xl text-center"
              >
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Bayilik Avantajları<span className="text-primary">.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Requirements Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Bayilik Şartları<span className="text-primary">.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {requirements.map((req, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-xl text-center"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-4">
                    {req.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{req.title}</h3>
                  <p className="text-gray-600 text-sm">{req.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Support Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Size Sunduğumuz Destekler<span className="text-primary">.</span>
            </h2>
            <div className="bg-white rounded-xl shadow-xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {supportServices.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.4 + index * 0.05 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">{service}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8"
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              Bayilik Başvuru Formu<span className="text-primary">.</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Ad Soyad <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Telefon <span className="text-primary">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="0(5XX) XXX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    E-posta <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="ornek@mail.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Şehir <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Hangi şehirde bayilik yapmak istiyorsunuz?"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    İş Deneyimi <span className="text-primary">*</span>
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  >
                    <option value="">Seçiniz</option>
                    <option value="0-2">0-2 yıl</option>
                    <option value="2-5">2-5 yıl</option>
                    <option value="5-10">5-10 yıl</option>
                    <option value="10+">10+ yıl</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Mesajınız
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder="Mevcut iş deneyiminiz, bayilik planlarınız ve yatırım kapasiteleriniz hakkında bilgi veriniz..."
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-primary text-white px-12 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Başvuruyu Gönder
                </button>
              </div>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-16 bg-dark rounded-2xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6">
                Daha Fazla Bilgi İçin
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Bayilik şartları ve detayları hakkında daha fazla bilgi almak için bizimle iletişime geçin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+905551234567"
                  className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  Hemen Ara
                </a>
                <a
                  href="mailto:bayilik@ataperformance.com"
                  className="inline-flex items-center gap-3 border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-dark transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  E-posta Gönder
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