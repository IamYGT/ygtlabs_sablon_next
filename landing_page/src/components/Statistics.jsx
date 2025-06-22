import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { FaCar, FaBolt, FaTools, FaCogs, FaTrophy, FaChartLine } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

function Statistics() {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const stats = [
    {
      number: '845+',
      label: 'UYGULAMA YAPILAN ARAÇ',
      icon: <FaCar className="text-4xl" />,
      description: 'Başarıyla tamamlanan chiptuning uygulamaları',
      achievement: 'Son 3 yılda %150 artış',
      trend: '+28% yıllık büyüme',
      countTo: 845
    },
    {
      number: '30K+',
      label: 'KAZANILAN HP',
      icon: <FaBolt className="text-4xl" />,
      description: 'Toplam güç artışı',
      achievement: 'Ortalama %25 performans artışı',
      trend: '+15K son 6 ayda',
      countTo: 30000
    },
    {
      number: '310+',
      label: 'YERİNDE HİZMET',
      icon: <FaTools className="text-4xl" />,
      description: 'Müşterilerimizin lokasyonunda gerçekleştirilen hizmet',
      achievement: '7/24 mobil destek',
      trend: '98% müşteri memnuniyeti'
    },
    {
      number: '21+',
      label: 'HİZMET TÜRÜ',
      icon: <FaCogs className="text-4xl" />,
      description: 'Farklı chiptuning ve optimizasyon seçenekleri',
      achievement: 'Sürekli gelişen hizmet ağı',
      trend: '4 yeni hizmet eklendi'
    }
  ];

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="relative py-32 overflow-hidden perspective-3d bg-white" ref={ref}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-[0.03]"></div>

      <div className="container mx-auto px-4 relative">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <span className="text-primary font-medium inline-block px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4 shadow-glow animate-pulse-soft">
            # BAŞARILARIMIZ
          </span>
          <h2 className="text-5xl md:text-6xl font-bold mt-4 mb-6">
            <span className="text-gray-900">Sayılarla </span>
            <span className="relative">
              <span className="text-primary neon-text animate-float">Biz</span>
              <span className="absolute -right-4 top-0 text-primary">.</span>
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Yılların deneyimi ve binlerce başarılı uygulama ile sektörün öncü firmasıyız
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group perspective-1000 hover:z-10 relative"
            >
              <div className="relative h-full">
                <div className="card-3d bg-white p-8 h-full relative z-10 rounded-2xl border border-gray-100 group-hover:border-primary/30 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/20">
                  {/* Icon Container */}
                  <div className="relative mb-8">
                    <div className="w-20 h-20 mx-auto relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent rounded-xl transform rotate-45 group-hover:rotate-90 transition-all duration-500 group-hover:scale-110"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-primary transform group-hover:scale-125 transition-all duration-500 drop-shadow-glow">
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Content with updated colors */}
                  <div className="relative z-10">
                    <div className="text-5xl font-bold mb-4 gradient-text animate-pulse-soft">
                      {stat.number}
                    </div>
                    <h3 className="text-gray-900 text-lg font-semibold mb-3 tracking-wider group-hover:text-primary transition-colors duration-300 group-hover:scale-105 transform">
                      {stat.label}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors duration-300">
                      {stat.description}
                    </p>

                    {/* Achievement Badge */}
                    <div className="bg-primary/5 rounded-lg p-3 transform group-hover:translate-y-1 transition-all duration-300 border border-primary/10 group-hover:border-primary/30">
                      <p className="text-primary text-sm font-medium transition-colors duration-300 flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary/50"></span>
                        {stat.achievement}
                      </p>
                    </div>

                    {/* Trend Indicator */}
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm group-hover:transform group-hover:translate-y-1 transition-transform duration-300">
                      <FaChartLine className="text-primary group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-gray-500">{stat.trend}</span>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  <div className="absolute -inset-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 rounded-2xl"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="btn-animate bg-primary text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 group relative overflow-hidden shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
          >
            <FaTrophy className="text-xl group-hover:rotate-12 transition-transform duration-300 animate-bounce-soft" />
            <span className="relative z-10">Başarı Hikayeleri</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shine"></div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Statistics;