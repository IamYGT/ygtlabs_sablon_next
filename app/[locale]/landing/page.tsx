import React from 'react';
import { Metadata } from 'next';
import LandingClient from './components/LandingClient';

export const metadata: Metadata = {
    title: 'Revv Tuned - Özel Chiptuning Hizmetleri',
    description: 'Profesyonel chiptuning hizmetleri ve uzman ekibimizle araç performansınızı en üst seviyeye çıkarın. Yerinde hizmet ve premium kalite.',
    keywords: 'chiptuning, ecu tuning, araç performansı, revv tuned, yerinde hizmet',
    openGraph: {
        title: 'Revv Tuned - Özel Chiptuning Hizmetleri',
        description: 'Profesyonel chiptuning hizmetleri ve uzman ekibimizle araç performansınızı en üst seviyeye çıkarın.',
        images: ['/images/red-sports-car.jpg'],
    },
};

export default function LandingPage() {
    return <LandingClient />;
} 