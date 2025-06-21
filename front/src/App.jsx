import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ServiceIcons from './components/ServiceIcons';
import MainContent from './components/MainContent';
import ServiceCards from './components/ServiceCards';
import VehicleSelector from './components/VehicleSelector';
import Statistics from './components/Statistics';
import CorporateSection from './components/CorporateSection';
import ServiceInfo from './components/ServiceInfo';
import Testimonials from './components/Testimonials';
import BlogSection from './components/BlogSection';
import Footer from './components/Footer';
import FAQPage from './pages/FAQPage';
import DealershipPage from './pages/DealershipPage';
import ContactPage from './pages/ContactPage';
import DealersPage from './pages/DealersPage';
import BlogPage from './pages/BlogPage';
import OnsiteServicePage from './pages/OnsiteServicePage';
import ServicesPage from './pages/ServicesPage';
import CorporatePage from './pages/CorporatePage';
import ChiptuningPage from './pages/ChiptuningPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-white relative">
            <Header />
            <div className="relative z-0">
              <Hero />
              <ServiceIcons />
              <MainContent />
              <ServiceCards />
              <CorporateSection />
              <VehicleSelector />
              <Statistics />
              <ServiceInfo />
              <Testimonials />
              <BlogSection />
            </div>
            <Footer />
          </div>
        } />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/dealership" element={<DealershipPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/dealers" element={<DealersPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/onsite-service" element={<OnsiteServicePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/corporate" element={<CorporatePage />} />
        <Route path="/chiptuning" element={<ChiptuningPage />} />
      </Routes>
    </Router>
  );
}

export default App;