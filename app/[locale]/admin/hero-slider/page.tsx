import { Metadata } from "next";
import { HeroSliderPageClient } from "./components/HeroSliderPageClient";

export const metadata: Metadata = {
    title: "Hero Slider Yönetimi",
    description: "Ana sayfa slider'larını yönetin",
};

export default function HeroSliderPage() {
    return <HeroSliderPageClient />;
} 