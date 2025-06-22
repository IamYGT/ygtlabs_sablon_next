'use client';

import React from 'react';

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Blog
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            En son haberler ve güncellemeler.
          </p>
        </div>
      </div>
    </section>
  );
} 