import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'ATA Performance - Chiptuning ve Performans Hizmetleri',
    description: 'Profesyonel chiptuning ve araç performans hizmetleri. Uzman ekibimizle aracınızın gücünü keşfedin.',
};

export default function FrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white">
            {children}
        </div>
    );
} 