import React from 'react';
import { FaStar, FaQuoteRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

function Testimonials() {
  const reviews = [
    {
      name: 'Volkan Sönmez',
      car: 'Volkswagen Polo',
      text: 'Bu zamana kadar aldığım tüm LG CAR Park şirketinin STI-STS yazılımları güvenle teslim edildi, kendime ait öğretici tecrübe.',
      rating: 5
    },
    {
      name: 'Murat Yavuz',
      car: 'Peugeot 301',
      text: '2019 model polo STD aracımda adblue sorunu vardı.Birçok yerde çözüm aradım servise bindim başarısız oldu.Hüseyin kardeşimiz aracımız p.',
      rating: 5
    }
  ];

  return (
    <div className="bg-gradient-to-b from-dark to-dark/95 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium"># MÜŞTERİ YORUMLARI</span>
          <h2 className="text-4xl font-bold text-white mt-2">
            Yorumlar<span className="text-primary">.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 relative group hover:border-primary/30 transition-colors duration-300"
            >
              <FaQuoteRight className="absolute top-6 right-6 text-4xl text-primary/10 group-hover:text-primary/20 transition-colors duration-300" />
              <div className="flex text-yellow-400 mb-4 gap-1">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
              <p className="text-gray-300 mb-6 relative z-10">{review.text}</p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-xl font-bold text-primary">
                  {review.name[0]}
                </div>
                <div>
                  <div className="text-white font-medium">{review.name}</div>
                  <div className="text-primary/80 text-sm">{review.car}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Testimonials;