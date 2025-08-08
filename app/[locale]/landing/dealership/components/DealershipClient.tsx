'use client';

import { motion } from 'framer-motion';
import {
  Award,
  Building,
  DollarSign,
  Handshake,
  Mail,
  Phone,
  Store,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

export default function DealershipClient() {
  const t = useTranslations('Dealership');
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
      title: t('benefits.brandPower.title'),
      description: t('benefits.brandPower.description')
    },
    {
      icon: <Handshake className="w-12 h-12" />,
      title: t('benefits.continuousSupport.title'),
      description: t('benefits.continuousSupport.description')
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: t('benefits.highProfit.title'),
      description: t('benefits.highProfit.description')
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: t('benefits.training.title'),
      description: t('benefits.training.description')
    }
  ];

  const requirements = [
    {
      icon: <Building className="w-8 h-8" />,
      title: t('requirements.physicalSpace.title'),
      description: t('requirements.physicalSpace.description')
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: t('requirements.investment.title'),
      description: t('requirements.investment.description')
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t('requirements.experience.title'),
      description: t('requirements.experience.description')
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: t('requirements.target.title'),
      description: t('requirements.target.description')
    }
  ];

  const supportServices: string[] = [
    t('supportServices.0'),
    t('supportServices.1'),
    t('supportServices.2'),
    t('supportServices.3'),
    t('supportServices.4'),
    t('supportServices.5'),
    t('supportServices.6'),
    t('supportServices.7'),
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
    alert(t('form.success'));
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
            <span className="text-primary font-medium inline-block px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4">{t('badge')}</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}<span className="text-primary">.</span></h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('description')}</p>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"
          >
            {[0, 1, 2, 3].map((i) => ({ number: t(`stats.${i}.number`), label: t(`stats.${i}.label`) })).map((stat, index) => (
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
            <h2 className="text-3xl font-bold text-center mb-12">{t('benefits.title')}<span className="text-primary">.</span></h2>
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
            <h2 className="text-3xl font-bold text-center mb-12">{t('requirements.title')}<span className="text-primary">.</span></h2>
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
            <h2 className="text-3xl font-bold text-center mb-12">{t('support.title')}<span className="text-primary">.</span></h2>
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
            <h2 className="text-3xl font-bold text-center mb-8">{t('form.title')}<span className="text-primary">.</span></h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {t('form.name')} <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder={t('placeholders.name')}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {t('form.phone')} <span className="text-primary">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder={t('placeholders.phone')}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {t('form.email')} <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder={t('placeholders.email')}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    {t('form.city')} <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder={t('placeholders.city')}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    {t('form.experience')} <span className="text-primary">*</span>
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  >
                    <option value="">{t('form.select')}</option>
                    <option value="0-2">{t('form.years0to2')}</option>
                    <option value="2-5">{t('form.years2to5')}</option>
                    <option value="5-10">{t('form.years5to10')}</option>
                    <option value="10+">{t('form.years10plus')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {t('form.message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  placeholder={t('placeholders.message')}
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-primary text-white px-12 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {t('form.submit')}
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
              <h2 className="text-3xl font-bold text-white mb-6">{t('moreInfo.title')}</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">{t('moreInfo.description')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+905551234567"
                  className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                >
                  <Phone className="w-5 h-5" />
                  {t('moreInfo.callNow')}
                </a>
                <a
                  href="mailto:bayilik@ataperformance.com"
                  className="inline-flex items-center gap-3 border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-dark transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  {t('moreInfo.sendEmail')}
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