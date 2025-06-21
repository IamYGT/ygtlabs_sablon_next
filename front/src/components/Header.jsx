import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaBars, FaTimes, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    { path: '/', label: 'ANASAYFA' },
    { path: '/chiptuning', label: 'CHIPTUNING' },
    { path: '/corporate', label: 'KURUMSAL' },
    { path: '/services', label: 'HİZMETLER' },
    { path: '/onsite-service', label: 'YERİNDE HİZMET' },
    { path: '/blog', label: 'BLOG' },
    { path: '/dealers', label: 'BAYİLER' }
  ];

  return (
    <>
      <header 
        className={`fixed w-full z-[999] transform transition-all duration-300 ${
          isMenuOpen ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'
        }`}
      >
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-primary to-primary/95 text-white transition-all duration-300">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-8">
              <div className="flex items-center space-x-2">
                <span className="text-white/90">★★★★★</span>
                <span className="text-sm font-medium text-white/90">5/5.0</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <FaFacebookF />
                </a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">
                  <FaInstagram />
                </a>
                <a 
                  href="https://ataperformance.co.uk" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  ataperformance.co.uk
                </a>
                <Link 
                  to="/dealership" 
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Bayilik Başvurusu
                </Link>
                <Link 
                  to="/faq" 
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Sık Sorulan Sorular
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav 
          className={`bg-white/95 backdrop-blur-md transition-all duration-300 ${
            isScrolled ? 'py-2 shadow-lg' : 'py-3'
          }`}
        >
          <div className="container mx-auto px-4 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex-shrink-0 mr-8 lg:mr-16">
                <img 
                  src="/images/ata_yan_siyah.webp" 
                  alt="ATA Performance" 
                  className={`w-auto transition-all duration-300 ${
                    isScrolled ? 'h-7 lg:h-8' : 'h-8 lg:h-10'
                  }`}
                />
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center justify-end flex-1 md:space-x-3 lg:space-x-5 xl:space-x-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative text-gray-800 text-[13px] lg:text-sm font-medium group overflow-hidden px-1 py-2 whitespace-nowrap"
                  >
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-primary">
                      {item.label}
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                  </Link>
                ))}
                <Link 
                  to="/contact"
                  className="relative overflow-hidden bg-primary text-white px-4 lg:px-6 py-2 rounded-lg text-[13px] lg:text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group ml-2 lg:ml-4"
                >
                  <span className="relative z-10">İLETİŞİM</span>
                  <span className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:text-primary transition-colors rounded-lg hover:bg-gray-100"
              >
                <FaBars className="text-xl" />
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] md:hidden"
              onClick={closeMenu}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-2xl z-[999] md:hidden overflow-hidden"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="sticky top-0 flex items-center justify-between px-4 py-3 sm:p-6 border-b border-gray-100 bg-white/95 backdrop-blur-md z-10">
                  <img 
                    src="/images/ata_yan_siyah.webp" 
                    alt="ATA Performance" 
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
                      <FaTimes className="text-xl" />
                    </motion.div>
                  </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50">
                  <div className="p-6 space-y-2">
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeMenu}
                        className="flex items-center text-gray-800 hover:text-primary hover:bg-white transition-all duration-300 px-6 py-4 rounded-xl text-sm font-medium group relative overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                        <span className="relative z-10">{item.label}</span>
                        <span className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                          <FaArrowRight className="text-primary text-sm" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Menu Footer */}
                <div className="p-6 border-t border-gray-100 bg-white">
                  <Link
                    to="/contact"
                    onClick={closeMenu}
                    className="flex items-center justify-center bg-primary text-white px-6 py-4 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-2px] relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                    <span className="relative z-10">İLETİŞİM</span>
                  </Link>

                  <div className="flex justify-center items-center space-x-8 mt-6">
                    <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                      <FaFacebookF />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                      <FaInstagram />
                    </a>
                    <a
                      href="https://ataperformance.co.uk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                    >
                      ataperformance.co.uk
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;