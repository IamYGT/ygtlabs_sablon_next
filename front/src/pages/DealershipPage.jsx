import React from 'react';
import { motion } from 'framer-motion';
import { FaStore, FaHandshake, FaChartLine, FaUserTie, FaFileContract, FaMapMarkedAlt } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

function DealershipPage() {
  const benefits = [
    {
      icon: <FaStore />,
      title: 'Marka Gücü',
      description: 'Sektörün lider markası ile güçlü bir iş ortaklığı'
    },
    {
      icon: <FaHandshake />,
      title: 'Sürekli Destek',
      description: 'Teknik ve pazarlama konularında tam destek'
    },
    {
      icon: <FaChartLine />,
      title: 'Yüksek Karlılık',
      description: 'Rekabetçi fiyatlar ve yüksek kar marjı'
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
              # BAYİLİK FIRSATI
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">ATA Performance Ailesine Katılın<span className="text-primary">.</span></h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Türkiye'nin lider chiptuning markası ile işinizi büyütün ve geleceğe yatırım yapın.
            </p>
          </motion.div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 rounded-xl shadow-custom hover:shadow-hover transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary text-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Bayilik Başvuru Formu</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="0(5XX) XXX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="ornek@mail.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Şehir</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Şehir"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Mesajınız</label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 h-32"
                  placeholder="Mevcut iş deneyiminiz ve bayilik planlarınız hakkında bilgi veriniz..."
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Başvuruyu Gönder
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default DealershipPage;