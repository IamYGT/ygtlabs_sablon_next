"use client";

import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "../../../../../lib/i18n/navigation";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function DealersClient() {
  const t = useTranslations("LandingDealers");
  const dealers = [
    {
      id: 1,
      name: "Revv Tuned Ankara",
      address: "Atatürk Cad. No:123 Çankaya/Ankara",
      phone: "+90 312 123 45 67",
      email: "ankara@ataperformance.com",
      hours: "Pzt-Cmt: 09:00 - 18:00",
      rating: 4.8,
      services: ["Chiptuning", "ECU Remapping", "DPF İptali"],
      image: "/images/dealers/ankara.jpg",
    },
    {
      id: 2,
      name: "Revv Tuned İstanbul",
      address: "Bağdat Cad. No:456 Kadıköy/İstanbul",
      phone: "+90 216 987 65 43",
      email: "istanbul@ataperformance.com",
      hours: "Pzt-Cmt: 08:30 - 19:00",
      rating: 4.9,
      services: ["Chiptuning", "Performans Testi", "Launch Control"],
      image: "/images/dealers/istanbul.jpg",
    },
    {
      id: 3,
      name: "Revv Tuned İzmir",
      address: "Kordon Boyu No:789 Konak/İzmir",
      phone: "+90 232 555 44 33",
      email: "izmir@ataperformance.com",
      hours: "Pzt-Cmt: 09:00 - 18:30",
      rating: 4.7,
      services: ["Chiptuning", "ECU Remapping", "Performans Testi"],
      image: "/images/dealers/izmir.jpg",
    },
    {
      id: 4,
      name: "Revv Tuned Bursa",
      address: "Atatürk Cad. No:321 Osmangazi/Bursa",
      phone: "+90 224 777 88 99",
      email: "bursa@ataperformance.com",
      hours: "Pzt-Cmt: 09:00 - 18:00",
      rating: 4.6,
      services: ["Chiptuning", "DPF İptali", "ECU Remapping"],
      image: "/images/dealers/bursa.jpg",
    },
    {
      id: 5,
      name: "Revv Tuned Antalya",
      address: "Lara Cad. No:654 Muratpaşa/Antalya",
      phone: "+90 242 333 22 11",
      email: "antalya@ataperformance.com",
      hours: "Pzt-Cmt: 09:30 - 18:30",
      rating: 4.8,
      services: ["Chiptuning", "Performans Testi", "Launch Control"],
      image: "/images/dealers/antalya.jpg",
    },
    {
      id: 6,
      name: "Revv Tuned Adana",
      address: "Seyhan Cad. No:987 Seyhan/Adana",
      phone: "+90 322 444 55 66",
      email: "adana@ataperformance.com",
      hours: "Pzt-Cmt: 09:00 - 18:00",
      rating: 4.5,
      services: ["Chiptuning", "ECU Remapping", "DPF İptali"],
      image: "/images/dealers/adana.jpg",
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
              {t("badge")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t("title")}
              <span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("description")}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="text-center p-6 bg-white rounded-xl shadow-lg"
              >
                <div className="text-3xl font-bold text-primary mb-2">
                  {t(`stats.${i}.value`)}
                </div>
                <div className="text-gray-600">{t(`stats.${i}.label`)}</div>
              </div>
            ))}
          </motion.div>

          {/* Dealers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {dealers.map((dealer, index) => (
              <motion.div
                key={dealer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={dealer.image}
                    alt={dealer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/images/dealers/default-dealer.jpg";
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{dealer.rating}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {dealer.name}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">{dealer.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                      <a
                        href={`tel:${dealer.phone}`}
                        className="text-sm hover:text-primary transition-colors"
                      >
                        {dealer.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                      <a
                        href={`mailto:${dealer.email}`}
                        className="text-sm hover:text-primary transition-colors"
                      >
                        {dealer.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{dealer.hours}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {t("services.title")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {dealer.services.map((service, i) => (
                        <span
                          key={i}
                          className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={`tel:${dealer.phone}`}
                      className="flex-1 bg-primary text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-all duration-300"
                    >
                      {t("buttons.call")}
                    </a>
                    <Link
                      href="/landing/contact"
                      className="flex-1 border border-primary text-primary text-center py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      {t("buttons.appointment")}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Become a Dealer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-2xl p-12 text-center shadow-xl mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">
              {t("become.title")}
              <span className="text-primary">?</span>
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {t("become.description")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-4 mx-auto">
                  💼
                </div>
                <h3 className="font-bold mb-2">{t("become.cards.0.title")}</h3>
                <p className="text-gray-600 text-sm">
                  {t("become.cards.0.description")}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-4 mx-auto">
                  🎓
                </div>
                <h3 className="font-bold mb-2">{t("become.cards.1.title")}</h3>
                <p className="text-gray-600 text-sm">
                  {t("become.cards.1.description")}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-2xl mb-4 mx-auto">
                  🤝
                </div>
                <h3 className="font-bold mb-2">{t("become.cards.2.title")}</h3>
                <p className="text-gray-600 text-sm">
                  {t("become.cards.2.description")}
                </p>
              </div>
            </div>
            <Link
              href="/landing/dealership"
              className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
            >
              {t("become.apply")}
            </Link>
          </motion.div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              {t("map.title")}
              <span className="text-primary">.</span>
            </h2>
            <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-gray-600">{t("map.comingSoon")}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {t("map.helpText")}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
