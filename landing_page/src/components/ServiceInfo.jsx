import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaCog, FaGasPump } from 'react-icons/fa';

function ServiceInfo() {
  const services = [
    {
      title: 'Chiptuning Nedir',
      description: 'Dijital motor yazılımı, dahili kontrol ünitesinin (ECU) optimizasyonu ile aracınızın güç, tork ve yakıt tüketimi parametrelerini iyileştiren bir yazılım güncellemesidir.',
      image: '/images/chiptuning-bg.jpg',
      stats: [
        { label: 'Güç Artışı', value: '+30%', icon: <FaChartLine /> },
        { label: 'Tork Artışı', value: '+25%', icon: <FaCog /> },
        { label: 'Yakıt Tasarrufu', value: '-15%', icon: <FaGasPump /> }
      ]
    },
    {
      title: 'AdBlue Nedir',
      description: 'Dizel araçlarda, dizel motorların emisyon ve güvenlik sistemlerini optimize eden bir çözümdür.',
      image: '/images/adblue-bg.jpg',
      stats: [
        { label: 'Emisyon Azaltma', value: '-40%', icon: <FaChartLine /> },
        { label: 'Performans', value: '+20%', icon: <FaCog /> },
        { label: 'Verimlilik', value: '+25%', icon: <FaGasPump /> }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-primary font-medium"># TEKNİK BİLGİLER</span>
        <h2 className="text-4xl font-bold mt-2">
          Hizmet Detayları<span className="text-primary">.</span>
        </h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="relative group overflow-hidden rounded-xl shadow-2xl bg-dark"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/60 to-dark group-hover:via-dark/40 transition-all duration-500"></div>
            <img 
              src={service.image} 
              alt={service.title} 
              className="w-full h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-dark/80 backdrop-blur-sm p-6 rounded-xl border border-white/10 transform group-hover:translate-y-0 transition-transform duration-500"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-300 mb-6">{service.description}</p>
                <div className="grid grid-cols-3 gap-4">
                  {service.stats.map((stat, i) => (
                    <div key={i} className="text-center group">
                      <div className="text-primary mb-2 text-xl">{stat.icon}</div>
                      <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ServiceInfo;