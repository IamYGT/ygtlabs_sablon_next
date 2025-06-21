import React from 'react';

function PartnerLogos() {
  const partners = [
    { name: 'MAGIC', logo: '🔧' },
    { name: 'EVO', logo: '🔧' },
    { name: 'CMD', logo: '🔧' },
    { name: 'AUTOVARE', logo: '🔧' }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center">
        {partners.map((partner, index) => (
          <div key={index} className="text-center">
            <span className="text-4xl block mb-2">{partner.logo}</span>
            <span className="text-gray-600">{partner.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnerLogos;