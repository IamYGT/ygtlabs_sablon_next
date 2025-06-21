import React from 'react';
import { FaCheck, FaArrowRight } from 'react-icons/fa';

function MainContent() {
  const features = [
    { text: 'Bayilik Başvurusu', link: '#' },
    { text: 'Yerinde Hizmet', link: '#' },
    { text: 'Değerlendirmeler', link: '#' },
    { text: 'Sık Sorulan Sorular', link: '#' }
  ];

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Güvenilir Güç<br />
            Düşük <span className="text-primary relative">
              Yakıt
              <span className="absolute -right-4 top-0 text-primary">.</span>
            </span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Aracınızın performans potansiyelini en üst seviyeye çıkarın. Profesyonel ekibimiz ve son teknoloji ekipmanlarımızla hizmetinizdeyiz.
          </p>
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index}>
                <a 
                  href={feature.link}
                  className="group flex items-center space-x-3 text-lg text-gray-700 hover:text-primary transition-colors duration-300"
                >
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                    <FaCheck className="text-sm text-primary" />
                  </span>
                  <span>{feature.text}</span>
                  <FaArrowRight className="text-sm opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="/images/car-service.jpg" 
              alt="Car Service"
              className="w-full h-[600px] object-cover transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent"></div>
          </div>
          <div className="absolute -bottom-8 -left-8 bg-primary text-white p-6 rounded-xl shadow-xl">
            <div className="text-4xl font-bold mb-2">15+</div>
            <div className="text-sm opacity-90">Yıllık Deneyim</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainContent;