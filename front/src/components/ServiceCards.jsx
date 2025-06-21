import React from 'react';
import { FaWrench, FaTools, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function ServiceCards() {
  const services = [
    {
      title: 'Chiptuning',
      icon: <FaWrench className="text-4xl text-primary" />,
      tag: 'STAGE 1-2-3',
      description: 'Profesyonel chiptuning hizmetleri ile aracınızın performansını artırın.',
      features: ['Motor Gücü', 'Yakıt Tasarrufu', 'Performans']
    },
    {
      title: 'Arıza Çözümü',
      icon: <FaTools className="text-4xl text-primary" />,
      tag: 'DTC-OFF ANALIZ',
      description: 'Uzman ekibimizle araç sorunlarınıza hızlı ve kalıcı çözümler.',
      features: ['Hızlı Teşhis', 'Kalıcı Çözüm', 'Garanti']
    },
    {
      title: 'Yerinde Hizmet',
      icon: <FaMapMarkerAlt className="text-4xl text-primary" />,
      tag: 'YERINDE',
      description: 'Size özel yerinde servis hizmeti ile zaman kaybetmeyin.',
      features: ['7/24 Hizmet', 'Hızlı Müdahale', 'Profesyonel Ekip']
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
        <span className="text-primary font-medium"># HİZMETLERİMİZ</span>
        <h2 className="text-4xl font-bold mt-2">
          Öne Çıkan Hizmetler<span className="text-primary">.</span>
        </h2>
      </motion.div>
      
      {/* Mobile Slider */}
      <div className="md:hidden -mx-4">
        <Swiper
          modules={[Pagination, FreeMode]}
          spaceBetween={20}
          slidesPerView="auto"
          freeMode={true}
          loop={true}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          className="pb-12 px-4"
        >
          {services.map((service, index) => (
            <SwiperSlide key={index} style={{ width: '85%' }}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="card group hover:bg-primary transition-all duration-500 p-6 h-full"
              >
                <span className="inline-block bg-primary/10 text-primary group-hover:bg-white/10 group-hover:text-white text-sm px-3 py-1 rounded-full mb-6 font-medium transition-all duration-300">
                  {service.tag}
                </span>
                <div className="mb-4 transform transition-all duration-300 group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white/80 transition-colors duration-300 mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-600 group-hover:text-white/80 transition-colors duration-300">
                      <span className="w-2 h-2 bg-primary/50 group-hover:bg-white/50 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href="#" className="inline-flex items-center text-primary group-hover:text-white transition-colors duration-300 font-medium">
                  <span>Detaylı Bilgi</span>
                  <FaArrowRight className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="card group hover:bg-primary transition-all duration-500 p-8"
          >
            <span className="inline-block bg-primary/10 text-primary group-hover:bg-white/10 group-hover:text-white text-sm px-3 py-1 rounded-full mb-6 font-medium transition-all duration-300">
              {service.tag}
            </span>
            <div className="mb-4 transform transition-all duration-300 group-hover:scale-110">
              {service.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors duration-300">
              {service.title}
            </h3>
            <p className="text-gray-600 group-hover:text-white/80 transition-colors duration-300 mb-6">
              {service.description}
            </p>
            <ul className="space-y-2 mb-6">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-600 group-hover:text-white/80 transition-colors duration-300">
                  <span className="w-2 h-2 bg-primary/50 group-hover:bg-white/50 rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
            <a href="#" className="inline-flex items-center text-primary group-hover:text-white transition-colors duration-300 font-medium">
              <span>Detaylı Bilgi</span>
              <FaArrowRight className="ml-2 transform group-hover:translate-x-2 transition-transform duration-300" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ServiceCards;