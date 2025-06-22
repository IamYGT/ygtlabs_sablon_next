'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Ahmet Yılmaz",
      text: "Harika bir hizmet! Aracımın performansı inanılmaz derecede arttı.",
      rating: 5
    },
    {
      name: "Mehmet Kaya",
      text: "Profesyonel ekip ve kaliteli hizmet. Kesinlikle tavsiye ederim.",
      rating: 5
    },
    {
      name: "Ali Demir",
      text: "Yerinde hizmet çok pratik. Zamanımı hiç kaybetmedim.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Müşteri Yorumları
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Müşterilerimizin deneyimleri
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="font-semibold text-gray-900">
                {testimonial.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 