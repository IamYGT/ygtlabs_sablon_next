import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaQuestionCircle, FaLightbulb, FaTools, FaCar, FaCreditCard, FaClock, FaHeadset } from 'react-icons/fa';

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const faqs = [
    {
      question: 'Chiptuning nedir ve aracıma zarar verir mi?',
      answer: 'Chiptuning, aracınızın motor kontrol ünitesinin (ECU) yazılımını optimize ederek performans ve yakıt tüketimini iyileştiren bir işlemdir. Profesyonel ekibimiz tarafından yapılan chiptuning işlemi, aracınızın güvenlik sınırları içinde kalarak motora zarar vermez.',
      icon: <FaLightbulb />
    },
    {
      question: 'Chiptuning garantimi etkiler mi?',
      answer: 'Chiptuning işlemi, araç üreticisinin garantisini etkileyebilir. Ancak firmamız, yaptığımız tüm işlemler için kendi garantimizi sunmaktadır. Detaylı bilgi için müşteri temsilcilerimizle görüşebilirsiniz.',
      icon: <FaTools />
    },
    {
      question: 'Yerinde hizmet nasıl çalışır?',
      answer: 'Yerinde hizmet kapsamında, uzman ekibimiz belirlediğiniz adrese gelir ve chiptuning işlemini aracınızın bulunduğu yerde gerçekleştirir. İşlem ortalama 2-3 saat sürer ve tüm gerekli ekipmanlar ekibimiz tarafından getirilir.',
      icon: <FaCar />
    },
    {
      question: 'DPF/EGR sistemleri devre dışı bırakılabilir mi?',
      answer: 'Evet, DPF ve EGR sistemleri yasal sınırlar içerisinde devre dışı bırakılabilir. Bu işlem, aracınızın performansını artırırken yakıt tüketimini optimize eder.',
      icon: <FaTools />
    },
    {
      question: 'Stage 1, Stage 2 ve Stage 3 arasındaki fark nedir?',
      answer: 'Stage seviyeleri, chiptuning işleminin yoğunluğunu belirtir. Stage 1 temel optimizasyonu, Stage 2 orta seviye modifikasyonları, Stage 3 ise maksimum performans için gerekli donanım değişiklikleriyle birlikte yapılan ileri düzey modifikasyonları içerir.',
      icon: <FaLightbulb />
    },
    {
      question: 'Ödeme seçenekleri nelerdir?',
      answer: 'Nakit, kredi kartı ve kurumsal ödemeler kabul edilmektedir. Ayrıca anlaşmalı bankalarla 12 aya varan taksit seçenekleri sunuyoruz.',
      icon: <FaCreditCard />
    },
    {
      question: 'İşlem ne kadar sürer?',
      answer: 'Standart chiptuning işlemi ortalama 2-3 saat sürer. Ancak bu süre, aracınızın modeli ve yapılacak işlemlerin kapsamına göre değişiklik gösterebilir.',
      icon: <FaClock />
    },
    {
      question: 'İşlem sonrası destek hizmeti var mı?',
      answer: 'Evet, tüm müşterilerimize 7/24 teknik destek sağlıyoruz. İşlem sonrası herhangi bir sorunla karşılaşmanız durumunda ekibimiz size yardımcı olmak için hazır beklemektedir.',
      icon: <FaHeadset />
    }
  ];

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-light pt-32 pb-24">
      <div className="container mx-auto px-4 relative">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative"
        >
          <span className="text-primary font-medium inline-block px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-4 shadow-glow animate-pulse-soft">
            # YARDIM MERKEZİ
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sık Sorulan Sorular<span className="text-primary">.</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Chiptuning hizmetlerimiz hakkında sık sorulan soruları ve cevaplarını burada bulabilirsiniz.
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="grid gap-6 max-w-4xl mx-auto relative z-10">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-custom hover:shadow-hover transition-all duration-300 border border-gray-100 ${
                activeIndex === index ? 'ring-2 ring-primary/20' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <button
                onClick={() => handleToggle(index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none group relative overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 ${
                    activeIndex === index ? 'bg-primary/20' : ''
                  }`}>
                    <span className="text-primary text-lg">{faq.icon}</span>
                  </div>
                  <span className="font-semibold text-gray-800 group-hover:text-primary transition-all duration-300">
                    {faq.question}
                  </span>
                </div>
                <FaChevronDown
                  className={`text-primary transition-all duration-300 ${
                    activeIndex === index ? 'rotate-180' : ''
                  } ${hoveredIndex === index ? 'animate-bounce-soft' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-600 border-t border-gray-100 pt-4 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-gray-600 mb-6 text-lg">
            Aradığınız cevabı bulamadınız mı?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 text-primary font-medium hover:text-primary-dark transition-all duration-300 group bg-primary/10 px-6 py-3 rounded-full hover:bg-primary/20"
          >
            Bizimle İletişime Geçin
            <FaChevronDown className="rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}

export default FAQ;