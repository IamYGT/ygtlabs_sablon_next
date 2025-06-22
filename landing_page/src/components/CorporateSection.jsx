import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUsers, FaCertificate, FaHandshake } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

function CorporateSection() {
  const features = [
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: 'Güvenilir Hizmet',
      description: '15 yılı aşkın sektör deneyimi ile profesyonel chiptuning hizmetleri sunuyoruz.'
    },
    {
      icon: <FaUsers className="text-3xl" />,
      title: 'Uzman Ekip',
      description: 'Alanında uzman mühendis kadromuz ile en iyi hizmeti garanti ediyoruz.'
    },
    {
      icon: <FaCertificate className="text-3xl" />,
      title: 'Sertifikalı Çözümler',
      description: 'Tüm yazılımlarımız uluslararası standartlara uygun ve sertifikalıdır.'
    },
    {
      icon: <FaHandshake className="text-3xl" />,
      title: 'Müşteri Memnuniyeti',
      description: '%100 müşteri memnuniyeti odaklı çalışma prensibi.'
    }
  ];

  return (
    <div className="bg-light py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium"># KURUMSAL</span>
          <h2 className="text-4xl font-bold mt-2">
            Neden Biz<span className="text-primary">?</span>
          </h2>
        </motion.div>
        <div>
          {/* Mobile Slider */}
          <div className="md:hidden">
            <Swiper
              modules={[Pagination]}
              spaceBetween={20}
              slidesPerView={1.2}
              centeredSlides={true}
              loop={true}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              className="pb-12"
            >
              {features.map((feature, index) => (
                <SwiperSlide key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-xl shadow-custom hover:shadow-hover transition-all duration-300 group"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-custom hover:shadow-hover transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CorporateSection;