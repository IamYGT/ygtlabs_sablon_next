"use client";

import { motion } from "framer-motion";
import { Car, ChartLine, Cog, Fuel, Shield, Wrench } from "lucide-react";
import { Link } from "../../../../../lib/i18n/navigation";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function ChiptuningClient() {
  const stages = [
    {
      title: "Stage 1",
      description: "Temel performans artışı ve yakıt optimizasyonu",
      benefits: [
        "Güç artışı: +25-30%",
        "Tork artışı: +20-25%",
        "Yakıt tasarrufu: -10%",
        "Orijinal donanım korunur",
      ],
      recommended: "Günlük kullanım için ideal",
    },
    {
      title: "Stage 2",
      description: "Gelişmiş performans ve donanım güncellemeleri",
      benefits: [
        "Güç artışı: +35-40%",
        "Tork artışı: +30-35%",
        "Performans odaklı",
        "Donanım güncellemesi gerekir",
      ],
      recommended: "Yüksek performans arayanlar için",
    },
    {
      title: "Stage 3",
      description: "Maksimum performans ve yarış düzeyi modifikasyonlar",
      benefits: [
        "Güç artışı: +45-50%",
        "Tork artışı: +40-45%",
        "Yarış performansı",
        "Kapsamlı donanım değişimi",
      ],
      recommended: "Profesyonel kullanım için",
    },
  ];

  const features = [
    {
      icon: <ChartLine className="w-8 h-8" />,
      title: "Performans Artışı",
      description: "Motor gücü ve tork değerlerinde optimize edilmiş artış",
    },
    {
      icon: <Fuel className="w-8 h-8" />,
      title: "Yakıt Tasarrufu",
      description: "Optimize edilmiş yazılım ile yakıt tüketiminde azalma",
    },
    {
      icon: <Cog className="w-8 h-8" />,
      title: "Özel Yazılım",
      description: "Her araca özel geliştirilmiş yazılım çözümleri",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Güvenli İşlem",
      description: "Güvenlik sınırları içinde performans optimizasyonu",
    },
  ];

  const process = [
    {
      icon: <Car className="w-8 h-8" />,
      title: "Araç Analizi",
      description: "Aracınızın mevcut durumu detaylı olarak analiz edilir",
    },
    {
      icon: <Cog className="w-8 h-8" />,
      title: "Yazılım Hazırlığı",
      description: "Aracınıza özel chiptuning yazılımı hazırlanır",
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Uygulama",
      description: "Hazırlanan yazılım profesyonel ekipmanlarla yüklenir",
    },
    {
      icon: <ChartLine className="w-8 h-8" />,
      title: "Test ve Kontrol",
      description: "Performans testleri ve son kontroller yapılır",
    },
  ];

  return (
    <div className="min-h-screen bg-light">
      <Header />

      <div className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-primary font-medium inline-block px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4">
              # CHIPTUNING
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Profesyonel Chiptuning<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aracınızın performansını artırın, yakıt tüketimini optimize edin.
              Uzman ekibimizle güvenli ve profesyonel chiptuning hizmeti.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Stages Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Chiptuning Aşamaları<span className="text-primary">.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stages.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 group"
                >
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    {stage.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{stage.description}</p>
                  <ul className="space-y-3 mb-6">
                    {stage.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <span className="w-2 h-2 bg-primary/50 rounded-full"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="text-primary font-medium text-sm">
                      {stage.recommended}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Process Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Chiptuning Süreci<span className="text-primary">.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 group">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/20"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-dark rounded-2xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6">
                Aracınızın Gücünü Keşfedin
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Profesyonel chiptuning hizmetimiz ile aracınızın performansını
                artırın.
              </p>
              <Link
                href="/landing/contact"
                className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
              >
                Hemen Başlayın
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
