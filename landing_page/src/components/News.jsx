import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

function News() {
  const articles = [
    {
      title: 'DPF Nedir',
      description: 'Dizel Partikül Filtresi (Dizel Partikül Filtresi) olarak bilinen bir Filtre Sistemidir.',
      date: '2024-01-17 16:26:13'
    },
    {
      title: 'Adblue Nedir',
      description: 'AdBlue, Dizel araçlarda kullanılan ve zararlı emisyonları azaltmak için kullanılan bir çözü...',
      date: '2024-01-17 16:26:13'
    },
    {
      title: 'Chiptuning Nedir',
      description: 'ECU yazılımı değişikliği yapılarak daha güçlü değerlerde yüksek motor performans...',
      date: '2024-01-17 16:26:13'
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
          className="text-center mb-12"
        >
          <span className="text-primary font-medium"># CHİPTUNİNG BİLGİLER</span>
          <h2 className="text-4xl font-bold mt-2">
            Haberler<span className="text-primary">.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group cursor-pointer bg-white p-8 rounded-xl shadow-custom hover:shadow-hover transition-all duration-300"
            >
              <div className="mb-4">
                <span className="text-sm text-primary/80">{article.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-600 mb-6">{article.description}</p>
              <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
                <span>Daha Fazlası</span>
                <FaArrowRight className="ml-2 text-sm" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default News;