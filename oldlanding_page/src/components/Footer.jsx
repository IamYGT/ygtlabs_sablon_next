import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Footer() {
  const quickLinks = [
    { title: 'Chiptuning', href: '/chiptuning' },
    { title: 'Bayiler', href: '/dealers' },
    { title: 'Yerinde Hizmet', href: '/onsite-service' },
    { title: 'İletişim', href: '/contact' }
  ];

  const helpLinks = [
    { title: 'Neden EcuShift?', href: '/corporate' },
    { title: 'DPF Tuning Avantajları', href: '/services' },
    { title: 'Gizlilik Politikası', href: '/privacy' },
    { title: 'SSS', href: '/faq' }
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: '#', label: 'Facebook' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaWhatsapp />, href: '#', label: 'WhatsApp' }
  ];

  return (
    <footer className="bg-dark text-white">
      <div className="container mx-auto px-4">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-white/10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl font-bold mb-4"
            >
              Güncel Kalmak İster misiniz?
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-gray-400 mb-6"
            >
              En son chiptuning haberleri ve kampanyalarından haberdar olun.
            </motion.p>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="bg-white/5 border border-white/10 rounded-lg px-6 py-3 focus:outline-none focus:border-primary transition-colors w-full sm:w-auto"
              />
              <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 group">
                <span>Abone Ol</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16 border-b border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <img src="/images/ata_yan_siyah.webp" alt="ATA Performance" className="h-12 brightness-0 invert" />
              </div>
              <p className="text-gray-400 mb-6">
                Profesyonel chiptuning hizmetleri ve uzman ekibimizle araç performansınızı en üst seviyeye çıkarın.
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                >
                  {social.icon}
                </a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-6">Bağlantılar</h3>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-primary/50 rounded-full mr-2"></span>
                    {link.title}
                    <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Help Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-6">Yardım</h3>
              <ul className="space-y-4">
                {helpLinks.map((link, index) => (
                  <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center group">
                    <span className="w-2 h-2 bg-primary/50 rounded-full mr-2"></span>
                    {link.title}
                    <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-6">İletişime Geçin</h3>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-400 group hover:text-primary transition-colors duration-300">
                  <FaPhone className="mr-3 text-primary group-hover:scale-110 transition-transform duration-300" />
                  +90 543 553 94 36
                </li>
                <li className="flex items-center text-gray-400 group hover:text-primary transition-colors duration-300">
                  <FaEnvelope className="mr-3 text-primary group-hover:scale-110 transition-transform duration-300" />
                  info@ataperformance.com
                </li>
                <li className="flex items-start text-gray-400 group hover:text-primary transition-colors duration-300">
                  <FaMapMarkerAlt className="mr-3 text-primary mt-1 group-hover:scale-110 transition-transform duration-300" />
                  <span>Yenişehir Mahallesi, Hacışakir 2545 sokak, D:2 34517 Esenyurt/İstanbul</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="py-6 text-center text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} ATA Performance. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <a href="/privacy" className="hover:text-primary transition-colors">Gizlilik Politikası</a>
            <a href="/terms" className="hover:text-primary transition-colors">Kullanım Şartları</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;