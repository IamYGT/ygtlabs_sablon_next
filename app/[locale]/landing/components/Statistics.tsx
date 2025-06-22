'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Statistics() {
  const stats = [
    { number: "5000+", label: "Mutlu Müşteri" },
    { number: "15+", label: "Yıl Deneyim" },
    { number: "50+", label: "Marka Desteği" },
    { number: "24/7", label: "Destek Hattı" }
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center text-white"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.number}
              </div>
              <div className="text-lg opacity-90">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 