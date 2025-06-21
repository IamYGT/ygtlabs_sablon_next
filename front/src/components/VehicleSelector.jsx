import React from 'react';
import { FaSearch, FaCar, FaCogs, FaChartLine, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

function VehicleSelector() {
  const features = [
    { 
      icon: <FaCar className="text-2xl" />, 
      title: '1000+ Araç',
      text: 'Geniş araç veritabanı' 
    },
    { 
      icon: <FaCogs className="text-2xl" />, 
      title: 'Özel Yazılım',
      text: 'Aracınıza özel çözümler' 
    },
    { 
      icon: <FaChartLine className="text-2xl" />, 
      title: 'Performans',
      text: 'Optimize güç artışı' 
    }
  ];

  return (
    <div className="bg-dark py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium inline-block px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4">
            # GÜCÜNÜ KEŞFET
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Aracının Potansiyelini<br />
            <span className="text-primary">Ortaya Çıkar</span>
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Aracınızın tüm spesifikasyonlarını çevrimiçi görüntüleyin ve size özel chiptuning seçeneklerini keşfedin
          </p>
        </motion.div>

        {/* Features - Mobile */}
        <div className="md:hidden -mx-4 mb-12">
          <Swiper
            modules={[Pagination, FreeMode]}
            spaceBetween={20}
            slidesPerView="auto"
            freeMode={true}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            className="pb-12 px-4"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index} style={{ width: '85%' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 group hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                  <p className="text-white/60">{feature.text}</p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Features - Desktop */}
        <div className="hidden md:flex justify-center gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 group hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-white font-bold mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Selector Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <select className="bg-white/5 text-white border border-white/10 p-4 rounded-lg focus:outline-none focus:border-primary transition-all duration-300 appearance-none hover:bg-white/10">
              <option value="">Bir marka seçin</option>
              <option value="bmw">BMW</option>
              <option value="mercedes">Mercedes</option>
              <option value="audi">Audi</option>
            </select>
            <select className="bg-white/5 text-white border border-white/10 p-4 rounded-lg focus:outline-none focus:border-primary transition-all duration-300 appearance-none hover:bg-white/10">
              <option value="">Bir model seçin</option>
            </select>
            <select className="bg-white/5 text-white border border-white/10 p-4 rounded-lg focus:outline-none focus:border-primary transition-all duration-300 appearance-none hover:bg-white/10">
              <option value="">Bir nesil seçin</option>
            </select>
            <select className="bg-white/5 text-white border border-white/10 p-4 rounded-lg focus:outline-none focus:border-primary transition-all duration-300 appearance-none hover:bg-white/10">
              <option value="">Bir motor seçin</option>
            </select>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary hover:bg-primary/90 text-white py-4 px-8 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 group"
          >
            <FaSearch className="text-lg" />
            <span className="font-medium mx-2">ARAMAYA BAŞLA</span>
            <FaArrowRight className="transform group-hover:translate-x-2 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default VehicleSelector;