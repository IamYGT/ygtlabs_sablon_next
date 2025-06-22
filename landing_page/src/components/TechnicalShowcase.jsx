import React from 'react';

function TechnicalShowcase() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-4xl font-bold mb-4">
            Pratik tecrübe<span className="text-red-600">.</span>
          </h2>
          <p className="text-gray-600 mb-8">
            Müşterilerimizin tüm ihtiyaçları otomotiv sektörü tuning deneyimimizi kullanıyoruz. Bu sayede müşterilerimize daha etkili çözümler sunabiliyor ve onların beklentilerine hızlı bir şekilde cevap verebiliyoruz.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="/images/tech-1.jpg" 
              alt="Technical Equipment 1"
              className="rounded-lg"
            />
            <img 
              src="/images/tech-2.jpg" 
              alt="Technical Equipment 2"
              className="rounded-lg"
            />
          </div>
        </div>
        <div>
          <img 
            src="/images/tech-main.jpg" 
            alt="Main Technical Showcase"
            className="rounded-lg w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default TechnicalShowcase;