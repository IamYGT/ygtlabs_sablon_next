'use client';

import { motion } from 'framer-motion';
import {
  Award,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '../../../../../src/i18n/navigation';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

export default function CorporateClient() {
  const t = useTranslations('LandingCorporate');
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: t('values.items.0.title'),
      description: t('values.items.0.description')
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('values.items.1.title'),
      description: t('values.items.1.description')
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t('values.items.2.title'),
      description: t('values.items.2.description')
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t('values.items.3.title'),
      description: t('values.items.3.description')
    }
  ];

  const team = [
    {
      name: 'Ahmet Taş',
      position: t('team.items.0.position'),
      image: '/images/team/ceo.jpg',
      description: t('team.items.0.description')
    },
    {
      name: 'Mehmet Yılmaz',
      position: t('team.items.1.position'),
      image: '/images/team/tech-director.jpg',
      description: t('team.items.1.description')
    },
    {
      name: 'Ayşe Kaya',
      position: t('team.items.2.position'),
      image: '/images/team/operations.jpg',
      description: t('team.items.2.description')
    }
  ];

  const milestones = [
    {
      year: '2018',
      title: t('timeline.items.0.title'),
      description: t('timeline.items.0.description')
    },
    {
      year: '2019',
      title: t('timeline.items.1.title'),
      description: t('timeline.items.1.description')
    },
    {
      year: '2020',
      title: t('timeline.items.2.title'),
      description: t('timeline.items.2.description')
    },
    {
      year: '2021',
      title: t('timeline.items.3.title'),
      description: t('timeline.items.3.description')
    },
    {
      year: '2022',
      title: t('timeline.items.4.title'),
      description: t('timeline.items.4.description')
    },
    {
      year: '2023',
      title: t('timeline.items.5.title'),
      description: t('timeline.items.5.description')
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
              {t('subtitle')}
            </p>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24"
          >
            <div>
              <h2 className="text-3xl font-bold mb-6">{t('about.title')}<span className="text-primary">.</span></h2>
              <p className="text-gray-600 mb-6">
                {t('about.p1')}
              </p>
              <p className="text-gray-600 mb-6">
                {t('about.p2')}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-lg">
                  <div className="text-2xl font-bold text-primary mb-2">{t('about.stats.0.value')}</div>
                  <div className="text-gray-600">{t('about.stats.0.label')}</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-lg">
                  <div className="text-2xl font-bold text-primary mb-2">{t('about.stats.1.value')}</div>
                  <div className="text-gray-600">{t('about.stats.1.label')}</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/about-hero.jpg"
                alt="Revv Tuned"
                width={600}
                height={400}
                className="w-full h-full object-cover rounded-xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </motion.div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-xl"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('mission.title')}</h3>
              <p className="text-gray-600">
                {t('mission.description')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-xl"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('vision.title')}</h3>
              <p className="text-gray-600">
                {t('vision.description')}
              </p>
            </motion.div>
          </div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">{t('values.title')}<span className="text-primary">.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 group text-center"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-6 mx-auto group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">{t('timeline.title')}<span className="text-primary">.</span></h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-primary/20"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <div className="bg-white p-6 rounded-xl shadow-xl">
                        <div className="text-primary font-bold text-lg mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="relative z-10">
                      <div className="w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg"></div>
                    </div>
                    <div className="w-1/2"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">{t('team.title')}<span className="text-primary">.</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 text-center group"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/images/team/default-avatar.jpg';
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600">{member.description}</p>
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
              <Link
                href="/landing/contact"
                className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
              >
                {t('cta.button')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 