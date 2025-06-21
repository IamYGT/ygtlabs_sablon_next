import React from 'react';
import { motion } from 'framer-motion';
import FAQ from '../components/FAQ';
import Header from '../components/Header';
import Footer from '../components/Footer';

function FAQPage() {
  return (
    <div className="min-h-screen bg-light">
      <Header />
      <FAQ />
      <Footer />
    </div>
  );
}

export default FAQPage;