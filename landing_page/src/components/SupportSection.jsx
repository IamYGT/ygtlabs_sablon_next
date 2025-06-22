import React from 'react';
import { motion } from 'framer-motion';
import { FaTools, FaClock, FaUserTie, FaShieldAlt } from 'react-icons/fa';

function SupportSection() {
  const features = [
    {
      icon: <FaTools className="text-3xl text-primary" />,
      title: 'Uzman Ekip',
      description: 'Deneyimli ve profesyonel ekibimizle en iyi hizmeti sunuyoruz.'
    },
    {
      icon: <FaClock className="text-3xl text-primary" />,
      title: 'Hızlı Servis',
      description: 'Aynı gün içinde hizmet garantisi ile zamanınızı değerlendiriyoruz.'
    },
    {
      icon: <FaUserTie className="text-3xl text-primary" />,
      title: 'Kişisel Destek',
      description: 'Her müşterimize özel, kişiselleştirilmiş çözümler sunuyoruz.'
    },
    {
      icon: <FaShieldAlt className="text-3xl text-primary" />,
      title: 'Güvenli Hizmet',
      description: 'En yüksek güvenlik standartlarıyla çalışıyoruz.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="text-primary font-medium"># NEDEN BİZİ SEÇMELİSİNİZ?</div>
          <h2 className="text-4xl font-bold">
            Hızlı yanıt ve mükemmel destek<span className="text-primary">.</span>
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Müşterilerimizi dinliyor, anlıyor ve en iyi tuning çözümleri sunan bir şirket olarak deneyimimizden güç alıyoruz.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-custom hover:shadow-hover transition-all duration-300 group"
              >
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-6"
        >
          <div className="space-y-6">
            <img src="/images/engine.jpg" alt="Engine" className="rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300" />
            <img src="/images/dashboard.jpg" alt="Dashboard" className="rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 translate-y-12" />
          </div>
          <div className="space-y-6 -translate-y-12">
            <img src="/images/car-service.jpg" alt="Service" className="rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300" />
            <img src="/images/red-sports-car.jpg" alt="Sports Car" className="rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 translate-y-12" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SupportSection;