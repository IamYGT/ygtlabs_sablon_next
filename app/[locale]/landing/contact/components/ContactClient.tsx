'use client';

import { motion } from 'framer-motion';
import {
  Car,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  User
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

export default function ContactClient() {
  const t = useTranslations('Contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    service: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Form submitted:', formData);
    alert(t('form.success'));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('info.phone'),
      info: t('info.phoneValue'),
      link: 'tel:+905551234567'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: t('info.email'),
      info: t('info.emailValue'),
      link: 'mailto:info@ataperformance.com'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('info.address'),
      info: t('info.addressValue'),
      link: 'https://maps.google.com'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('info.hours'),
      info: t('info.hoursValue'),
      link: null
    }
  ];

  const services: string[] = [
    t('services.0'),
    t('services.1'),
    t('services.2'),
    t('services.3'),
    t('services.4'),
    t('services.5'),
    t('services.6'),
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
            <span className="text-primary font-medium inline-block px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4">{t('badge')}</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}<span className="text-primary">.</span></h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('description')}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-6">{t('form.title')}<span className="text-primary">.</span></h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      {t('form.name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder={t('placeholders.name')}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      {t('form.email')} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder={t('placeholders.email')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      {t('form.phone')} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder={t('placeholders.phone')}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      <Car className="w-4 h-4 inline mr-2" />
                      {t('form.vehicle')}
                    </label>
                    <input
                      type="text"
                      name="vehicle"
                      value={formData.vehicle}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                      placeholder={t('placeholders.vehicle')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {t('form.service')}
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  >
                    <option value="">{t('form.selectService')}</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    {t('form.message')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder={t('placeholders.message')}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {t('form.submit')}
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
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  {t('info.title')}<span className="text-primary">.</span>
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="text-gray-600 hover:text-primary transition-colors"
                          >
                            {item.info}
                          </a>
                        ) : (
                          <p className="text-gray-600">{item.info}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white p-6 rounded-xl shadow-xl"
              >
                <h3 className="text-xl font-bold mb-4">{t('map.title')}</h3>
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                    <p className="text-gray-600">{t('map.comingSoon')}</p>
                  </div>
                </div>
              </motion.div>

              {/* Emergency Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-primary rounded-xl p-6 text-white"
              >
                <h3 className="text-xl font-bold mb-4">{t('emergency.title')}</h3>
                <p className="text-white/80 mb-4">
                  {t('emergency.description')}
                </p>
                <a
                  href="tel:+905551234567"
                  className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +90 555 123 45 67
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">{t('faq.title')}<span className="text-primary">.</span></h2>
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1, 2, 3].map((i) => ({ question: t(`faq.items.${i}.q`), answer: t(`faq.items.${i}.a`) })).map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg"
                >
                  <h3 className="font-bold mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 