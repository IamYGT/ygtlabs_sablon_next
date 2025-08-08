'use client';

import { motion } from 'framer-motion';
import {
  Award,
  Car,
  CheckCircle,
  Clock,
  Gauge,
  Settings,
  Shield,
  Users,
  Wrench,
  Zap
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '../../../../../src/i18n/navigation';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

export default function ServicesClient() {
  const t = useTranslations('LandingServices');
  const services = [
    {
      icon: <Zap className="w-12 h-12" />,
      title: '',
      description: '',
      features: [],
      price: '',
      duration: ''
    },
    {
      icon: <Gauge className="w-12 h-12" />,
      title: '',
      description: '',
      features: [],
      price: '',
      duration: ''
    },
    {
      icon: <Settings className="w-12 h-12" />,
      title: '',
      description: '',
      features: [],
      price: '',
      duration: ''
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: '',
      description: '',
      features: [],
      price: '',
      duration: ''
    },
    {
      icon: <Wrench className="w-12 h-12" />,
      title: '',
      description: '',
      features: [],
      price: '',
      duration: ''
    },
    {
      icon: <Car className="w-12 h-12" />,
      title: '',
      description: '',
      features: [],
      price: '',
      duration: ''
    }
  ];

  const advantages = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: '',
      description: ''
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '',
      description: ''
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: '',
      description: ''
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '',
      description: ''
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
            <span className="text-primary font-medium inline-block px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4">{t('badge')}</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('title')}<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('description')}
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
                <h3 className="text-xl font-bold mb-4">{t(`cards.${index}.title`)}</h3>
                <p className="text-gray-600 mb-6">{t(`cards.${index}.description`)}</p>

                <ul className="space-y-3 mb-6">
                  {[0, 1, 2, 3].map((i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {t(`cards.${index}.features.${i}`)}
                    </li>
                  ))}
                </ul>

                <div className="border-t pt-6 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">{t(`cards.${index}.price`)}</div>
                    <div className="text-sm text-gray-500">{t('durationLabel')} {t(`cards.${index}.duration`)}</div>
                  </div>
                  <Link
                    href="/landing/contact"
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                  >
                    {t('buttons.appointment')}
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
            <h2 className="text-3xl font-bold text-center mb-12">{t('advantages.title')}<span className="text-primary">?</span></h2>
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
                  <h3 className="text-xl font-bold mb-4">{t(`advantages.items.${index}.title`)}</h3>
                  <p className="text-gray-600">{t(`advantages.items.${index}.description`)}</p>
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
            <h2 className="text-3xl font-bold text-center mb-12">{t('process.title')}<span className="text-primary">.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[0, 1, 2, 3].map((i) => ({ step: t(`process.steps.${i}.step`), title: t(`process.steps.${i}.title`), description: t(`process.steps.${i}.description`) })).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-white text-xl font-bold mb-6 mx-auto">{item.step}</div>
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
            <h2 className="text-3xl font-bold text-center mb-12">{t('faq.title')}<span className="text-primary">.</span></h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {[0, 1, 2, 3].map((i) => ({ question: t(`faq.items.${i}.q`), answer: t(`faq.items.${i}.a`) })).map((faq, index) => (
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
              <h2 className="text-3xl font-bold text-white mb-6">{t('cta.title')}</h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">{t('cta.description')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/landing/contact"
                  className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                >
                  {t('buttons.appointment')}
                </Link>
                <a
                  href="tel:+905551234567"
                  className="inline-block border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-dark transition-all duration-300"
                >
                  {t('buttons.callNow')}
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