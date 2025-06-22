'use client';

import React from 'react';
import { Settings, Wrench, Power, Gauge, Zap } from 'lucide-react';

export default function ServiceIcons() {
    const services = [
        { name: 'Vmox OFF', icon: Settings },
        { name: 'DTC OFF', icon: Wrench },
        { name: 'Start & Stop OFF', icon: Power },
        { name: 'Sport display', icon: Gauge },
        { name: 'Hard Rev Out', icon: Zap }
    ];

    return (
        <div className="bg-white shadow-lg py-6 -mt-12 relative z-10 rounded-xl mx-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {services.map((service, index) => {
                        const IconComponent = service.icon;
                        return (
                            <div
                                key={index}
                                className="flex items-center justify-center gap-3 group cursor-pointer"
                            >
                                <div className="text-primary group-hover:text-accent transition-colors duration-300">
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                <span className="font-medium text-gray-800 group-hover:text-primary transition-colors duration-300">
                                    {service.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
} 