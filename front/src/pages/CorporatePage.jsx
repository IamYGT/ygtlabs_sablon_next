import React from 'react';
import { motion } from 'framer-motion';
import { FaHistory, FaAward, FaBullseye, FaHandshake, FaUsers, FaCertificate, FaChartLine, FaGlobe } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

function CorporatePage() {
  const milestones = [
    { year: '2008', title: 'Kuruluş', description: 'ECU SHIFT markası İstanbul\'da kuruldu.' },
    { year: '2012', title: 'İlk Şube', description: 'İlk şubemiz Ankara\'da açıldı.' },
    { year: '2015', title: 'Teknoloji Yatırımı', description: 'En son teknoloji chiptuning ekipmanları.' },
    { year: '2018', title: 'Bayi Ağı', description: 'Türkiye genelinde bayi ağı genişletildi.' },
    { year: '2020', title: 'AR-GE Merkezi', description: 'Yazılım geliştirme merkezi kuruldu.' },
    { year: '2023', title: 'Uluslararası Pazar', description: 'Yurtdışı operasyonları başlatıldı.' }
  ];

  const values = [
    {
      icon: <FaUsers />,
      title: 'Müşteri Odaklılık',
      description: 'Müşterilerimizin ihtiyaçlarını en iyi şekilde anlayarak çözüm üretiyoruz.'
    },
    {
      icon: <FaCertificate />,
      title: 'Kalite',
      description: 'En yüksek kalite standartlarında hizmet sunuyoruz.'
    },
    {
      icon: <FaHandshake />,
      title: 'Güvenilirlik',
      description: 'Dürüst ve şeffaf iş anlayışıyla çalışıyoruz.'
    },
    {
      icon: <FaChartLine />,
      title: 'İnovasyon',
      description: 'Sürekli gelişim ve yenilikçi çözümler üretiyoruz.'
    }
  ];

  const stats = [
    { number: '15+', label: 'Yıllık Deneyim' },
    { number: '50K+', label: 'Mutlu Müşteri' },
    { number: '25+', label: 'Uzman Personel' },
    { number: '30+', label: 'Bayi Ağı' }
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
              Bizi Tanıyın<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              15 yılı aşkın süredir otomotiv sektöründe profesyonel chiptuning hizmetleri sunuyoruz.
            </p>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl p-8 mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Hakkımızda<span className="text-primary">.</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  ECU SHIFT, 2008 yılından bu yana otomotiv sektöründe faaliyet gösteren, araç performans optimizasyonu ve chiptuning konusunda uzmanlaşmış bir firmadır. Müşteri memnuniyetini ön planda tutarak, en son teknoloji ekipmanlarla profesyonel hizmet sunmaktayız.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Deneyimli mühendis kadromuz ve teknisyenlerimizle, araçlarınızın performansını en üst seviyeye çıkarmak için çalışıyoruz. Türkiye genelinde 30'dan fazla bayimizle hizmet vermekteyiz.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="bg-primary/5 p-6 rounded-xl text-center"
                  >
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
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
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Kilometre Taşları<span className="text-primary">.</span>
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                    className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="w-1/2"></div>
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold relative z-10">
                      {milestone.year.slice(2)}
                    </div>
                    <div className="w-1/2 p-6">
                      <div className="bg-white p-6 rounded-xl shadow-xl">
                        <div className="text-primary font-bold mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Vision & Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="bg-white p-8 rounded-xl shadow-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-6">
                <FaBullseye />
              </div>
              <h3 className="text-2xl font-bold mb-4">Misyonumuz</h3>
              <p className="text-gray-600 leading-relaxed">
                Müşterilerimize en yüksek kalitede chiptuning hizmetleri sunarak, araçlarının performansını ve verimliliğini optimize etmek. Sürekli gelişen teknoloji ve uzman kadromuzla sektörde öncü olmak.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-6">
                <FaGlobe />
              </div>
              <h3 className="text-2xl font-bold mb-4">Vizyonumuz</h3>
              <p className="text-gray-600 leading-relaxed">
                Türkiye'nin ve bölgenin en güvenilir ve tercih edilen chiptuning markası olmak. Yenilikçi çözümlerimizle global pazarda söz sahibi olmak ve müşterilerimize dünya standartlarında hizmet sunmak.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CorporatePage;