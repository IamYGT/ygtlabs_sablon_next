import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaTools } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

function DealersPage() {
  const dealers = [
    {
      name: 'ATA Performance İstanbul',
      region: 'Marmara Bölgesi',
      address: 'Yenişehir Mah. Hacışakir 2545 sok. D:2 34517 Esenyurt/İstanbul',
      phone: '+90 543 553 94 36',
      email: 'istanbul@ataperformance.com',
      workingHours: 'Hafta içi: 09:00 - 18:00\nCumartesi: 09:00 - 14:00',
      services: ['Chiptuning', 'DPF-EGR Çözümleri', 'Yerinde Hizmet']
    },
    {
      name: 'ATA Performance Ankara',
      region: 'İç Anadolu Bölgesi',
      address: 'Çankaya/Ankara',
      phone: '+90 555 123 45 67',
      email: 'ankara@ataperformance.com',
      workingHours: 'Hafta içi: 09:00 - 18:00\nCumartesi: 09:00 - 14:00',
      services: ['Chiptuning', 'DPF-EGR Çözümleri', 'Yerinde Hizmet']
    },
    {
      name: 'ATA Performance İzmir',
      region: 'Ege Bölgesi',
      address: 'Bornova/İzmir',
      phone: '+90 555 987 65 43',
      email: 'izmir@ataperformance.com',
      workingHours: 'Hafta içi: 09:00 - 18:00\nCumartesi: 09:00 - 14:00',
      services: ['Chiptuning', 'DPF-EGR Çözümleri', 'Yerinde Hizmet']
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
              # BAYİLERİMİZ
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Yetkili Bayiler<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Size en yakın ATA Performance bayisini bulun ve profesyonel chiptuning hizmetlerimizden faydalanın.
            </p>
          </motion.div>

          {/* Dealers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dealers.map((dealer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500"
              >
                {/* Region Badge */}
                <div className="bg-primary/10 px-6 py-3 text-primary font-medium">
                  {dealer.region}
                </div>

                {/* Dealer Info */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    {dealer.name}
                  </h2>

                  {/* Contact Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-primary mt-1" />
                      <p className="text-gray-600">{dealer.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-primary" />
                      <a href={`tel:${dealer.phone}`} className="text-gray-600 hover:text-primary transition-colors">
                        {dealer.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-primary" />
                      <a href={`mailto:${dealer.email}`} className="text-gray-600 hover:text-primary transition-colors">
                        {dealer.email}
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaClock className="text-primary mt-1" />
                      <p className="text-gray-600 whitespace-pre-line">{dealer.workingHours}</p>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FaTools className="text-primary" />
                      Hizmetler
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {dealer.services.map((service, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-primary/10 hover:text-primary transition-colors duration-300"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-6 pb-6">
                  <button className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-white py-3 rounded-lg transition-all duration-300 font-medium">
                    Randevu Al
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Become a Dealer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-bold mb-4">
              Siz de ATA Performance Bayisi Olmak İster misiniz?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Türkiye'nin lider chiptuning markası ile işinizi büyütün ve geleceğe yatırım yapın.
            </p>
            <a
              href="/dealership"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
            >
              Bayilik Başvurusu Yap
            </a>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default DealersPage;