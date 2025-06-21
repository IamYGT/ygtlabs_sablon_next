import React from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ContactPage() {
  const contactInfo = [
    {
      icon: <FaPhone />,
      title: 'Telefon',
      info: '+90 543 553 94 36',
      link: 'tel:+905435539436'
    },
    {
      icon: <FaWhatsapp />,
      title: 'WhatsApp',
      info: '+90 543 553 94 36',
      link: 'https://wa.me/905435539436'
    },
    {
      icon: <FaEnvelope />,
      title: 'E-posta',
      info: 'info@ecushift.com',
      link: 'mailto:info@ecushift.com'
    },
    {
      icon: <FaClock />,
      title: 'Çalışma Saatleri',
      info: 'Hafta içi: 09:00 - 18:00\nCumartesi: 09:00 - 14:00'
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
              # İLETİŞİM
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Bize Ulaşın<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sorularınız için bize ulaşabilir, randevu alabilir veya detaylı bilgi edinebilirsiniz.
            </p>
          </motion.div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6">İletişim Formu</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Ad Soyad</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Adınız Soyadınız"
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
                  <label className="block text-gray-700 mb-2">Konu</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300">
                    <option value="">Seçiniz</option>
                    <option value="chiptuning">Chiptuning Hizmeti</option>
                    <option value="appointment">Randevu Talebi</option>
                    <option value="info">Bilgi Talebi</option>
                    <option value="support">Teknik Destek</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Mesajınız</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 h-32"
                    placeholder="Mesajınızı yazın..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Gönder
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Contact Cards */}
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-custom hover:shadow-hover transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-gray-600 hover:text-primary transition-colors duration-300"
                        >
                          {item.info}
                        </a>
                      ) : (
                        <p className="text-gray-600 whitespace-pre-line">{item.info}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-6 rounded-xl shadow-custom hover:shadow-hover transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-xl">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Adres</h3>
                    <p className="text-gray-600">
                      Yenişehir Mahallesi, Hacışakir 2545 sokak, D:2 34517 Esenyurt/İstanbul
                    </p>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden h-[300px] relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.2755772243707!2d28.6728!3d41.0334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAxJzU4LjQiTiAyOMKwNDAnMjIuMSJF!5e0!3m2!1str!2str!4v1620831691087!5m2!1str!2str"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ContactPage;