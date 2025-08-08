import { Metadata } from "next";
import "./styles/landing.css"; // Landing page'e özel stil dosyası

export const metadata: Metadata = {
    title: "RevvTuned - ECU Chip Tuning Hizmetleri",
    description: "Profesyonel ECU chip tuning hizmetleri ile aracınızın performansını artırın. Uzman ekibimiz ve son teknoloji ile güvenli tuning çözümleri.",
    keywords: "ecu tuning, chip tuning, performans artırma, motor tuning, araç modifikasyonu",
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "RevvTuned - ECU Chip Tuning Hizmetleri",
        description: "Profesyonel ECU chip tuning hizmetleri ile aracınızın performansını artırın.",
        type: "website",
        locale: "tr_TR",
    },
};


export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div data-scope="landing">{children}</div>;
} 