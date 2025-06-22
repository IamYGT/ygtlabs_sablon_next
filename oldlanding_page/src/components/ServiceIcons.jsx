import React from 'react';
import { FaCog, FaWrench, FaPowerOff, FaTachometerAlt, FaBolt } from 'react-icons/fa';

function ServiceIcons() {
  const services = [
    { name: 'Vmox OFF', icon: <FaCog className="text-2xl" /> },
    { name: 'DTC OFF', icon: <FaWrench className="text-2xl" /> },
    { name: 'Start & Stop OFF', icon: <FaPowerOff className="text-2xl" /> },
    { name: 'Sport display', icon: <FaTachometerAlt className="text-2xl" /> },
    { name: 'Hard Rev Out', icon: <FaBolt className="text-2xl" /> }
  ];

  return (
    <div className="bg-white shadow-lg py-6 -mt-12 relative z-10 rounded-xl mx-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center gap-3 group cursor-pointer"
            >
              <div className="text-primary group-hover:text-accent transition-colors duration-300">
                {service.icon}
              </div>
              <span className="font-medium text-gray-800 group-hover:text-primary transition-colors duration-300">
                {service.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServiceIcons;