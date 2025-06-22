'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Award, 
  TrendingUp
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function CorporateClient() {
  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Kalite',
      description: 'En yüksek kalite standartlarında hizmet sunmak'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Müşteri Odaklılık',
      description: 'Müşteri memnuniyetini her şeyin üstünde tutarız'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Güvenilirlik',
      description: 'Güvenilir ve şeffaf iş anlayışı'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'İnovasyon',
      description: 'Sürekli gelişim ve yeniliği benimseriz'
    }
  ];

  const team = [
    {
      name: 'Ahmet Taş',
      position: 'Kurucu & CEO',
      image: '/images/team/ceo.jpg',
      description: '15 yıllık otomotiv sektörü deneyimi'
    },
    {
      name: 'Mehmet Yılmaz',
      position: 'Teknik Direktör',
      image: '/images/team/tech-director.jpg',
      description: 'Chiptuning uzmanı, 12 yıllık deneyim'
    },
    {
      name: 'Ayşe Kaya',
      position: 'Operasyon Müdürü',
      image: '/images/team/operations.jpg',
      description: 'Operasyonel mükemmellik uzmanı'
    }
  ];

  const milestones = [
    {
      year: '2018',
      title: 'Şirket Kuruluşu',
      description: 'Revv Tuned olarak faaliyetlerimize başladık'
    },
    {
      year: '2019',
      title: 'İlk Büyük Proje',
      description: '500+ araç için toplu chiptuning projesi'
    },
    {
      year: '2020',
      title: 'Teknoloji Yatırımı',
      description: 'Son teknoloji ekipmanlarla donatıldık'
    },
    {
      year: '2021',
      title: 'Uluslararası Sertifika',
      description: 'Avrupa standartlarında sertifikasyon'
    },
    {
      year: '2022',
      title: 'Bayi Ağı',
      description: 'Türkiye genelinde bayi ağımızı genişlettik'
    },
    {
      year: '2023',
      title: '10.000+ Müşteri',
      description: '10.000+ memnun müşteriye ulaştık'
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
              # KURUMSAL
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Revv Tuned<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              2018 yılından beri otomotiv sektöründe profesyonel chiptuning ve performans hizmetleri sunuyoruz.
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
              <h2 className="text-3xl font-bold mb-6">
                Hakkımızda<span className="text-primary">.</span>
              </h2>
              <p className="text-gray-600 mb-6">
                Revv Tuned olarak, otomotiv sektöründe kaliteli ve güvenilir hizmet anlayışıyla 
                müşterilerimizin araçlarının performansını en üst düzeye çıkarmayı hedefliyoruz.
              </p>
              <p className="text-gray-600 mb-6">
                Uzman ekibimiz ve son teknoloji ekipmanlarımızla, her marka ve model araç için 
                özel çözümler geliştiriyoruz. Müşteri memnuniyeti odaklı yaklaşımımızla sektörde 
                güvenilir bir partner olmayı sürdürüyoruz.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-lg">
                  <div className="text-2xl font-bold text-primary mb-2">10,000+</div>
                  <div className="text-gray-600">Memnun Müşteri</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-lg">
                  <div className="text-2xl font-bold text-primary mb-2">5+</div>
                  <div className="text-gray-600">Yıllık Deneyim</div>
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
              <h3 className="text-2xl font-bold mb-4">Misyonumuz</h3>
              <p className="text-gray-600">
                Otomotiv sektöründe en kaliteli chiptuning ve performans hizmetlerini sunarak, 
                müşterilerimizin araçlarından maksimum verim almalarını sağlamak. Güvenilir, 
                şeffaf ve müşteri odaklı hizmet anlayışımızla sektörde öncü olmak.
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
              <h3 className="text-2xl font-bold mb-4">Vizyonumuz</h3>
              <p className="text-gray-600">
                Türkiye&apos;nin en güvenilir ve tercih edilen otomotiv performans merkezi olmak. 
                Sürekli gelişim ve yenilikçi yaklaşımımızla uluslararası standartlarda hizmet 
                vererek, müşterilerimizin beklentilerini aşmak.
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
            <h2 className="text-3xl font-bold text-center mb-12">
              Değerlerimiz<span className="text-primary">.</span>
            </h2>
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
            <h2 className="text-3xl font-bold text-center mb-12">
              Tarihçemiz<span className="text-primary">.</span>
            </h2>
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
            <h2 className="text-3xl font-bold text-center mb-12">
              Ekibimiz<span className="text-primary">.</span>
            </h2>
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
              <h2 className="text-3xl font-bold text-white mb-6">
                Bizimle Çalışmaya Hazır mısınız?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Profesyonel ekibimiz ve kaliteli hizmetimizle aracınızın performansını artırmak için buradayız.
              </p>
              <Link
                href="/landing/contact"
                className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
              >
                İletişime Geçin
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 