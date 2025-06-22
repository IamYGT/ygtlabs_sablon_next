import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaUser, FaFolder, FaSearch, FaTags } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

function BlogPage() {
  const posts = [
    {
      title: 'Stage 1 Chiptuning Nedir?',
      excerpt: 'Stage 1 chiptuning, aracınızın motor yazılımında yapılan temel optimizasyonları içerir. Bu işlem ile motorunuzun performansı artırılırken yakıt tüketimi optimize edilir...',
      image: '/images/blog-1.jpg',
      author: 'Teknik Ekip',
      date: '17 Ocak 2024',
      category: 'Teknik Bilgi',
      tags: ['Chiptuning', 'Stage 1', 'Performans']
    },
    {
      title: 'DPF Egzoz Filtresi',
      excerpt: 'Dizel Partikül Filtresi (DPF), dizel motorlu araçlarda egzoz emisyonlarını azaltmak için kullanılan önemli bir bileşendir. Modern dizel araçlarda yaygın olarak...',
      image: '/images/blog-2.jpg',
      author: 'Servis Ekibi',
      date: '16 Ocak 2024',
      category: 'Bakım',
      tags: ['DPF', 'Egzoz', 'Dizel']
    },
    {
      title: 'EGR Sistemi ve İşlevi',
      excerpt: 'EGR (Exhaust Gas Recirculation) sistemi, motor emisyonlarını azaltmak için tasarlanmış önemli bir sistemdir. Bu yazımızda EGR sisteminin çalışma prensibini...',
      image: '/images/blog-3.jpg',
      author: 'Teknik Ekip',
      date: '15 Ocak 2024',
      category: 'Teknik Bilgi',
      tags: ['EGR', 'Emisyon', 'Motor']
    },
    {
      title: 'Adblue Nedir ve Ne İşe Yarar?',
      excerpt: 'AdBlue, dizel motorlu araçlarda kullanılan ve zararlı emisyonları azaltmak için tasarlanmış özel bir üre çözeltisidir. Bu yazımızda AdBlue kullanımının...',
      image: '/images/blog-4.jpg',
      author: 'Servis Ekibi',
      date: '14 Ocak 2024',
      category: 'Bakım',
      tags: ['AdBlue', 'Dizel', 'Emisyon']
    }
  ];

  const categories = [
    { name: 'Teknik Bilgi', count: 12 },
    { name: 'Bakım', count: 8 },
    { name: 'Performans', count: 6 },
    { name: 'Haberler', count: 4 }
  ];

  const popularTags = [
    'Chiptuning',
    'DPF',
    'EGR',
    'AdBlue',
    'Performans',
    'Dizel',
    'Stage 1',
    'Emisyon'
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
              # BLOG
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Son Yazılar<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chiptuning ve araç performansı hakkında en güncel bilgiler, teknik makaleler ve haberler.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-8">
                {posts.map((post, index) => (
                  <motion.article
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-white rounded-xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-video overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent z-10"></div>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <span className="absolute top-4 left-4 bg-primary text-white text-sm px-4 py-1 rounded-full z-20">
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-2">
                          <FaCalendar className="text-primary" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-2">
                          <FaUser className="text-primary" />
                          {post.author}
                        </span>
                      </div>

                      {/* Title & Excerpt */}
                      <h2 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 mb-6">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-primary/10 hover:text-primary transition-colors duration-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Read More Button */}
                      <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-6 py-2 rounded-lg transition-all duration-300 font-medium">
                        Devamını Oku
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Search */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Blog'da ara..."
                    className="w-full pl-4 pr-12 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  />
                  <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaFolder className="text-primary" />
                  Kategoriler
                </h3>
                <ul className="space-y-2">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="flex items-center justify-between py-2 text-gray-600 hover:text-primary transition-colors duration-300 group"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary/50 rounded-full group-hover:bg-primary transition-colors duration-300"></span>
                          {category.name}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded-full text-sm group-hover:bg-primary/10 transition-colors duration-300">
                          {category.count}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags Cloud */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FaTags className="text-primary" />
                  Popüler Etiketler
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <a
                      key={index}
                      href="#"
                      className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-primary/10 hover:text-primary transition-colors duration-300"
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default BlogPage;