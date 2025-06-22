'use client';

import React from 'react';
import Header from './Header';
import Hero from './Hero';
import ServiceIcons from './ServiceIcons';
import MainContent from './MainContent';
import ServiceCards from './ServiceCards';
import VehicleSelector from './VehicleSelector';
import Statistics from './Statistics';
import CorporateSection from './CorporateSection';
import ServiceInfo from './ServiceInfo';
import Testimonials from './Testimonials';
import BlogSection from './BlogSection';
import Footer from './Footer';

export default function LandingClient() {
    return (
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
    );
} 