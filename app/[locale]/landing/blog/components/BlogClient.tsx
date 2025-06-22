'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, User, Tag, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function BlogClient() {
  const blogPosts = [
    {
      id: 1,
      title: 'Chiptuning Nedir ve Nasıl Yapılır?',
      excerpt: 'Chiptuning hakkında bilmeniz gereken her şey. Performans artışı ve yakıt tasarrufu için...',
      image: '/images/blog/chiptuning-guide.jpg',
      author: 'Ahmet Taş',
      date: '15 Mart 2024',
      category: 'Chiptuning',
      readTime: '5 dk okuma'
    },
    {
      id: 2,
      title: 'Stage 1 vs Stage 2: Hangisi Sizin İçin Uygun?',
      excerpt: 'Chiptuning aşamaları arasındaki farkları ve hangisinin size uygun olduğunu öğrenin...',
      image: '/images/blog/stage-comparison.jpg',
      author: 'Mehmet Yılmaz',
      date: '12 Mart 2024',
      category: 'Performans',
      readTime: '7 dk okuma'
    },
    {
      id: 3,
      title: 'DPF İptali: Avantajları ve Dezavantajları',
      excerpt: 'Dizel partikül filtresi iptali hakkında objektif bir değerlendirme...',
      image: '/images/blog/dpf-delete.jpg',
      author: 'Ayşe Kaya',
      date: '10 Mart 2024',
      category: 'Teknik',
      readTime: '6 dk okuma'
    },
    {
      id: 4,
      title: 'Yakıt Tasarrufu İçin Chiptuning İpuçları',
      excerpt: 'Chiptuning ile yakıt tüketiminizi nasıl optimize edebileceğinizi öğrenin...',
      image: '/images/blog/fuel-economy.jpg',
      author: 'Ahmet Taş',
      date: '8 Mart 2024',
      category: 'Yakıt',
      readTime: '4 dk okuma'
    },
    {
      id: 5,
      title: 'Turbo Motorlarda Performans Artışı',
      excerpt: 'Turbo motorların chiptuning ile nasıl daha verimli hale getirilebileceği...',
      image: '/images/blog/turbo-performance.jpg',
      author: 'Mehmet Yılmaz',
      date: '5 Mart 2024',
      category: 'Turbo',
      readTime: '8 dk okuma'
    },
    {
      id: 6,
      title: 'ECU Remapping: Detaylı Rehber',
      excerpt: 'Motor kontrol ünitesi remapping işlemi hakkında kapsamlı bilgiler...',
      image: '/images/blog/ecu-remapping.jpg',
      author: 'Ayşe Kaya',
      date: '3 Mart 2024',
      category: 'ECU',
      readTime: '10 dk okuma'
    }
  ];

  const categories = [
    'Tümü',
    'Chiptuning',
    'Performans',
    'Teknik',
    'Yakıt',
    'Turbo',
    'ECU'
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
              Blog & Haberler<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chiptuning, otomotiv teknolojileri ve performans hakkında güncel yazılar, ipuçları ve haberler.
            </p>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  index === 0
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-primary hover:text-white shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Featured Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/blog/default-post.jpg';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Öne Çıkan
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {blogPosts[0].author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {blogPosts[0].date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {blogPosts[0].category}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{blogPosts[0].readTime}</span>
                    <button className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-300 transform hover:scale-105">
                      Devamını Oku
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {blogPosts.slice(1).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = '/images/blog/default-post.jpg';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                    <button className="text-primary font-medium text-sm hover:underline flex items-center gap-1">
                      Oku
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-dark rounded-2xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6">
                Güncel Kalın
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Yeni blog yazıları, chiptuning ipuçları ve özel tekliflerden haberdar olmak için e-posta listemize katılın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-4 py-3 rounded-lg border-none outline-none"
                />
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105">
                  Abone Ol
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 