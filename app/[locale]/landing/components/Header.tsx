"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Facebook,
  Instagram,
  Menu,
  Star,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  Link,
  getPathname,
  usePathname,
  useRouter,
} from "../../../../lib/i18n/navigation";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");
  const tLang = useTranslations("Language");

  // Home page kontrolü: route key '/landing' için mevcut locale'e karşılık gelen gerçek yol
  const homePath = getPathname({ href: "/landing", locale });
  const isHomePage = pathname === homePath;

  const handleScroll = useCallback(() => {
    // Sadece home page'de scroll efekti aktif
    if (isHomePage) {
      setIsScrolled(window.scrollY > 0);
    } else {
      setIsScrolled(true); // Diğer sayfalarda her zaman solid background
    }
  }, [isHomePage]);

  useEffect(() => {
    // İlk yüklemede home page değilse solid background yap
    if (!isHomePage) {
      setIsScrolled(true);
    } else {
      setIsScrolled(window.scrollY > 0);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, isHomePage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isLangMenuOpen) {
        const target = event.target as Element;
        if (!target.closest(".language-switcher")) {
          setIsLangMenuOpen(false);
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isLangMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const languages = [
    {
      code: "en",
      name: tLang("english"),
      flag: "https://flagcdn.com/w160/gb.png",
    },
    {
      code: "tr",
      name: tLang("turkish"),
      flag: "https://flagcdn.com/w160/tr.png",
    },
  ];

  const currentLang =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    setIsLangMenuOpen(false);
    router.push(pathname, { locale: langCode });
  };

  const menuItems = [
    { href: "/landing/corporate", label: t("navigation.corporate") },
    { href: "/landing/services", label: t("navigation.services") },
    { href: "/landing/onsite-service", label: t("navigation.onsiteService") },
    { href: "/landing/blog", label: t("navigation.blog") },
    { href: "/landing/dealers", label: t("navigation.dealers") },
  ] as const;

  return (
    <>
      <header
        className={`fixed w-full z-[999] transform transition-all duration-300 ${
          isMenuOpen
            ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto"
            : "opacity-100"
        }`}
      >
        {/* Top Bar */}
        <div
          className={`transition-all duration-300 ${
            isScrolled ? "bg-black text-white" : "bg-transparent text-white"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-28 2xl:px-32">
            <div className="flex justify-between items-center h-8">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-current text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-xs font-normal text-white/90 font-sans">
                  5/5.0
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://ataperformance.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/80 hover:text-white transition-colors font-sans"
                >
                  ataperformance.co.uk
                </a>
                <Link
                  href="/landing/dealership"
                  className="text-xs text-white/80 hover:text-white transition-colors font-sans"
                >
                  {t("topBar.dealershipApplication")}
                </Link>
                <Link
                  href="/landing/faq"
                  className="text-xs text-white/80 hover:text-white transition-colors font-sans"
                >
                  {t("topBar.faq")}
                </Link>

                {/* Language Switcher */}
                <div className="relative language-switcher">
                  <button
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    className="flex items-center focus:outline-none"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-white/20 shadow-lg ring-1 ring-white/30 transition-all duration-200 hover:ring-2 hover:ring-white/50 hover:shadow-xl">
                        <Image
                          alt={currentLang.code}
                          className="h-full w-full object-cover"
                          src={currentLang.flag}
                          width={40}
                          height={40}
                        />
                      </div>
                      <ChevronDown className="h-4 w-4 text-white/80 transition-transform duration-200" />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isLangMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-3 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 backdrop-blur-sm"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-gray-50 transition-all duration-200 rounded-md group ${
                              locale === lang.code
                                ? "bg-primary/5 text-primary border-l-2 border-primary"
                                : "text-gray-700 hover:text-gray-900"
                            }`}
                          >
                            <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-gray-200 shadow-md ring-1 ring-gray-100 transition-all duration-200 group-hover:ring-2 group-hover:ring-primary/20 group-hover:shadow-lg">
                              <Image
                                alt={lang.code}
                                className="h-full w-full object-cover"
                                src={lang.flag}
                                width={40}
                                height={40}
                              />
                            </div>
                            <span className="font-medium transition-colors duration-200">
                              {lang.name}
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav
          className={`transition-all duration-300 ${
            isScrolled
              ? "bg-white py-1 sm:py-2 shadow-lg"
              : "bg-transparent py-2 sm:py-3"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-20 xl:px-28 2xl:px-32">
            <div className="flex items-center justify-between">
              <Link
                href="/landing"
                className="flex-shrink-0 mr-4 sm:mr-8 lg:mr-32 xl:mr-40"
              >
                <Image
                  src={
                    isScrolled ? "/logo/revvsiyah.png" : "/logo/RevvTuned.png"
                  }
                  alt="RevvTuned"
                  width={280}
                  height={60}
                  className={`w-auto transition-all duration-300 ${
                    isScrolled ? "h-6 sm:h-7 lg:h-8" : "h-10 sm:h-12 lg:h-14"
                  }`}
                />
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center justify-end flex-1 md:space-x-2 lg:space-x-6 xl:space-x-10 2xl:space-x-14">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative text-xs lg:text-sm font-normal group overflow-hidden px-1 py-2 whitespace-nowrap transition-colors duration-300 font-sans tracking-wide ${
                      isScrolled ? "text-gray-700" : "text-white/90"
                    }`}
                  >
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-primary">
                      {item.label}
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"></span>
                  </Link>
                ))}
                <Link
                  href="/landing/contact"
                  className="relative overflow-hidden bg-primary text-white px-3 md:px-4 lg:px-5 py-2 rounded-lg text-xs lg:text-sm font-normal transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group ml-2 md:ml-4 lg:ml-8 xl:ml-12 font-sans tracking-wide"
                >
                  <span className="relative z-10">
                    {t("navigation.contact")}
                  </span>
                  <span className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden w-10 h-10 flex items-center justify-center hover:text-primary transition-colors rounded-lg ${
                  isScrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[998] md:hidden"
              onClick={closeMenu}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-2xl z-[999] md:hidden overflow-hidden"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="sticky top-0 flex items-center justify-between px-4 py-3 sm:p-6 border-b border-gray-100 bg-white z-10">
                  <Image
                    src="/logo/revvsiyah.png"
                    alt="RevvTuned"
                    width={120}
                    height={32}
                    className="h-6 sm:h-8 w-auto transform hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={closeMenu}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary transition-all duration-300 rounded-lg hover:bg-gray-100 ml-2"
                  >
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 180 }}
                      exit={{ rotate: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50">
                  <div className="p-6 space-y-2">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="block px-4 py-3 text-gray-800 font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 group relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between">
                            <span className="relative z-10">{item.label}</span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 relative z-10" />
                          </div>
                          <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary transform origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"></span>
                        </Link>
                      </motion.div>
                    ))}

                    {/* Mobile Menu Additional Links */}
                    <div className="pt-4 border-t border-gray-200 mt-6 space-y-2">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: menuItems.length * 0.1 }}
                      >
                        <Link
                          href="/landing/dealership"
                          onClick={closeMenu}
                          className="block px-4 py-3 text-gray-600 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 group relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between">
                            <span className="relative z-10">
                              {t("topBar.dealershipApplication")}
                            </span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 relative z-10" />
                          </div>
                          <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary transform origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"></span>
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (menuItems.length + 1) * 0.1 }}
                      >
                        <Link
                          href="/landing/faq"
                          onClick={closeMenu}
                          className="block px-4 py-3 text-gray-600 text-sm font-medium rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 group relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between">
                            <span className="relative z-10">
                              {t("topBar.faq")}
                            </span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 relative z-10" />
                          </div>
                          <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary transform origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"></span>
                        </Link>
                      </motion.div>
                    </div>

                    {/* Language Switcher for Mobile */}
                    <div className="pt-4 border-t border-gray-200 mt-6">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (menuItems.length + 2) * 0.1 }}
                      >
                        <div className="px-4 py-2">
                          <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            {t("mobile.languageSelection")}
                          </h3>
                          <div className="space-y-2">
                            {languages.map((lang) => (
                              <button
                                key={lang.code}
                                onClick={() => {
                                  handleLanguageChange(lang.code);
                                  closeMenu();
                                }}
                                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
                                  locale === lang.code
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                              >
                                <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-gray-200 shadow-sm">
                                  <Image
                                    alt={lang.code}
                                    className="h-full w-full object-cover"
                                    src={lang.flag}
                                    width={24}
                                    height={24}
                                  />
                                </div>
                                <span className="font-medium">{lang.name}</span>
                                {locale === lang.code && (
                                  <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Social Links for Mobile */}
                    <div className="pt-4 border-t border-gray-200 mt-6">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (menuItems.length + 3) * 0.1 }}
                      >
                        <div className="px-4 py-2">
                          <h3 className="text-sm font-semibold text-gray-700 mb-3">
                            {t("mobile.socialMedia")}
                          </h3>
                          <div className="flex items-center space-x-4">
                            <a
                              href="#"
                              className="text-gray-600 hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
                            >
                              <Facebook className="w-5 h-5" />
                            </a>
                            <a
                              href="#"
                              className="text-gray-600 hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10"
                            >
                              <Instagram className="w-5 h-5" />
                            </a>
                            <a
                              href="https://ataperformance.co.uk"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-600 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-primary/10 font-medium"
                            >
                              ataperformance.co.uk
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Contact Button */}
                <div className="p-6 border-t border-gray-100 bg-white">
                  <Link
                    href="/landing/contact"
                    onClick={closeMenu}
                    className="flex items-center justify-center bg-primary text-white px-6 py-4 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                    <span className="relative z-10">
                      {t("navigation.contact")}
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
