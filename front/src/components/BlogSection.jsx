import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaClock, FaUser } from 'react-icons/fa';

function BlogSection() {
  const posts = [
    {
      title: 'Stage 1 Chiptuning Nedir?',
      excerpt: 'Stage 1 chiptuning, aracınızın motor yazılımında yapılan temel optimizasyonları içerir. Bu işlem ile...',
      image: '/images/blog-1.jpg',
      author: 'Teknik Ekip',
      date: '17 Ocak 2024',
      category: 'Teknik Bilgi'
    },
    {
      title: 'DPF Egzoz Filtresi',
      excerpt: 'Dizel Partikül Filtresi (DPF), dizel motorlu araçlarda egzoz emisyonlarını azaltmak için kullanılan...',
      image: '/images/blog-2.jpg',
      author: 'Servis Ekibi',
      date: '16 Ocak 2024',
      category: 'Bakım'
    },
    {
      title: 'EGR Sistemi ve İşlevi',
      excerpt: 'EGR (Exhaust Gas Recirculation) sistemi, motor emisyonlarını azaltmak için tasarlanmış önemli bir...',
      image: '/images/blog-3.jpg',
      author: 'Teknik Ekip',
      date: '15 Ocak 2024',
      category: 'Teknik Bilgi'
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
          <span className="text-primary font-medium"># BLOG</span>
          <h2 className="text-4xl font-bold mt-2">
            Son Yazılar<span className="text-primary">.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl overflow-hidden shadow-custom hover:shadow-hover transition-all duration-300 group"
            >
              <div className="relative overflow-hidden aspect-video">
                <div className="absolute inset-0 bg-dark/20 group-hover:bg-dark/40 transition-colors duration-300 z-10"></div>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-primary text-white text-sm px-3 py-1 rounded-full z-20">
                  {post.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <FaUser className="text-primary" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-primary" />
                    {post.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <a
                  href="#"
                  className="inline-flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300"
                >
                  <span>Devamını Oku</span>
                  <FaArrowRight className="ml-2" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogSection;