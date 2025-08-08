'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from '../../../../../src/i18n/navigation';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

export default function FAQClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqCategories = [
    {
      title: 'Chiptuning Hakkında',
      faqs: [
        {
          question: 'Chiptuning nedir?',
          answer: 'Chiptuning, aracınızın motor kontrol ünitesi (ECU) yazılımını optimize ederek performans artışı ve yakıt tasarrufu sağlayan işlemdir. Motor yazılımındaki kısıtlamalar kaldırılarak aracın gerçek potansiyeli ortaya çıkarılır.'
        },
        {
          question: 'Chiptuning güvenli midir?',
          answer: 'Profesyonel chiptuning tamamen güvenlidir. Motorun güvenlik sınırları korunarak yapılan optimizasyonlar sayesinde hem performans artışı hem de motor ömrünün uzaması sağlanır. Tüm işlemlerimiz garanti kapsamındadır.'
        },
        {
          question: 'Hangi araçlara chiptuning yapılabilir?',
          answer: 'Benzinli, dizel, hibrit ve elektrikli araçların tamamına chiptuning yapılabilir. 2000 yılı sonrası tüm marka ve modellere hizmet veriyoruz. Aracınızın uygunluğu için bizimle iletişime geçebilirsiniz.'
        },
        {
          question: 'Chiptuning ne kadar sürer?',
          answer: 'Stage 1 chiptuning işlemi ortalama 2-3 saat sürmektedir. Stage 2 ve daha kapsamlı işlemler 4-6 saat arasında değişebilir. Aracınızın durumuna göre süre değişkenlik gösterebilir.'
        }
      ]
    },
    {
      title: 'Performans ve Garanti',
      faqs: [
        {
          question: 'Ne kadar performans artışı bekleyebilirim?',
          answer: 'Stage 1 chiptuning ile %25-30 güç artışı, %20-25 tork artışı sağlanır. Stage 2 ile %35-40 güç, %30-35 tork artışı mümkündür. Aracınızın mevcut durumuna göre değerler değişebilir.'
        },
        {
          question: 'Aracımın garantisi bozulur mu?',
          answer: 'Profesyonel chiptuning ile aracınızın garantisi bozulmaz. Gerektiğinde orijinal yazılıma geri dönülebilir. Servis kontrollerinde sorun yaşamamak için önceden bilgi verebiliriz.'
        },
        {
          question: 'Chiptuning garantisi var mı?',
          answer: 'Evet, tüm chiptuning hizmetlerimiz 2 yıl garanti ile sunulmaktadır. Bu süre içinde herhangi bir sorun yaşamanız durumunda ücretsiz müdahale sağlanır.'
        },
        {
          question: 'Yakıt tüketimi nasıl etkilenir?',
          answer: 'Doğru sürüş alışkanlıkları ile %10-15 yakıt tasarrufu sağlanabilir. Performans odaklı sürüşlerde tüketim artabilir, ancak normal kullanımda tasarruf elde edilir.'
        }
      ]
    },
    {
      title: 'Teknik Sorular',
      faqs: [
        {
          question: 'DPF/EGR iptali nedir?',
          answer: 'DPF (Dizel Partikül Filtresi) ve EGR (Egzoz Gazı Resirkülasyonu) sistemlerinin yazılımsal olarak devre dışı bırakılması işlemidir. Bu işlem emisyon değerlerini etkileyebileceği için sadece yarış araçlarında önerilir.'
        },
        {
          question: 'AdBlue sistemi iptal edilebilir mi?',
          answer: 'AdBlue sistemi yazılımsal olarak iptal edilebilir. Ancak bu işlem emisyon değerlerini etkilediği için yasal düzenlemelere uygun olarak sadece belirli koşullarda yapılmaktadır.'
        },
        {
          question: 'Launch Control nedir?',
          answer: 'Launch Control, araçların start performansını optimize eden sistemdir. Belirli bir rpm değerinde motor gücünü kontrol ederek mükemmel start performansı sağlar. Yarış ve performans araçları için idealdir.'
        },
        {
          question: 'Dyno testi nedir?',
          answer: 'Dyno testi, aracın gerçek güç ve tork değerlerinin ölçüldüğü profesyonel test işlemidir. Chiptuning öncesi ve sonrası karşılaştırmalı ölçümler yapılarak performans artışı belgelenir.'
        }
      ]
    },
    {
      title: 'Hizmet ve Fiyatlar',
      faqs: [
        {
          question: 'Chiptuning fiyatları nedir?',
          answer: 'Stage 1 chiptuning 1.500₺, Stage 2 chiptuning 2.500₺, ECU Remapping 2.000₺ başlangıç fiyatlarımızdır. Aracınızın özelliklerine göre fiyat değişkenlik gösterebilir.'
        },
        {
          question: 'Yerinde hizmet veriyor musunuz?',
          answer: 'Evet, mobil servis araçlarımızla dilediğiniz yerde hizmet veriyoruz. Yerinde hizmet için ek ücret alınmaktadır. Randevu için bizimle iletişime geçebilirsiniz.'
        },
        {
          question: 'Randevu almak zorunlu mu?',
          answer: 'Daha kaliteli hizmet verebilmek için randevu almanızı öneriyoruz. Randevusuz gelmeniz durumunda bekleme süresi olabilir. Online randevu sistemi ile kolayca randevu alabilirsiniz.'
        },
        {
          question: 'Ödeme seçenekleri nelerdir?',
          answer: 'Nakit, kredi kartı, banka kartı ve havale ile ödeme kabul edilmektedir. Kredi kartı ile taksitli ödeme imkanı bulunmaktadır. Kurumsal müşteriler için özel ödeme koşulları mevcuttur.'
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex: number, faqIndex: number) => {
    const globalIndex = categoryIndex * 1000 + faqIndex;
    setOpenIndex(openIndex === globalIndex ? null : globalIndex);
  };

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
              # SIK SORULAN SORULAR
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Merak Ettikleriniz<span className="text-primary">.</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chiptuning ve hizmetlerimiz hakkında en çok sorulan sorular ve detaylı cevapları.
            </p>
          </motion.div>

          {/* FAQ Categories */}
          <div className="max-w-4xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="bg-white rounded-xl shadow-xl overflow-hidden"
              >
                {/* Category Header */}
                <div className="bg-primary/5 px-8 py-6 border-b border-primary/10">
                  <h2 className="text-2xl font-bold text-primary">{category.title}</h2>
                </div>

                {/* FAQ Items */}
                <div className="divide-y divide-gray-100">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 1000 + faqIndex;
                    const isOpen = openIndex === globalIndex;

                    return (
                      <motion.div
                        key={faqIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: faqIndex * 0.05 }}
                        className="group"
                      >
                        <button
                          onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                          className="w-full px-8 py-6 text-left hover:bg-gray-50 transition-all duration-300 flex items-center justify-between group"
                        >
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300 pr-4">
                            {faq.question}
                          </h3>
                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex-shrink-0"
                          >
                            <ChevronDown className="w-5 h-5 text-primary" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 bg-dark rounded-2xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6">
                Sorunuz Cevaplandırılmadı mı?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Merak ettiğiniz diğer konular için uzman ekibimizle iletişime geçebilirsiniz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/landing/contact"
                  className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                >
                  Bize Sorun
                </Link>
                <a
                  href="tel:+905551234567"
                  className="inline-block border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-dark transition-all duration-300"
                >
                  Hemen Ara
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 