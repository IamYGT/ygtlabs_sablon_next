
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Star, 
  Heart, 
  Zap, 
  Trophy,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function DenemePage() {
  const t = useTranslations();

  const features = [
    {
      icon: Rocket,
      title: "Hızlı Başlangıç",
      description: "Projelerinizi hızla hayata geçirin"
    },
    {
      icon: Star,
      title: "Kaliteli Çözümler",
      description: "En iyi teknolojilerle geliştirilmiş"
    },
    {
      icon: Heart,
      title: "Kullanıcı Dostu",
      description: "Kolay ve anlaşılır arayüz"
    },
    {
      icon: Zap,
      title: "Yüksek Performans",
      description: "Optimize edilmiş hız ve verimlilik"
    }
  ];

  const benefits = [
    "Modern teknolojiler kullanılarak geliştirildi",
    "Responsive ve mobil uyumlu tasarım",
    "SEO optimize edilmiş yapı",
    "Hızlı yükleme süreleri",
    "Güvenli ve güvenilir"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge 
              variant="outline" 
              className="mb-6 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-colors duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Deneme Sayfası
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
              Test ve Deneme
              <br />
              <span className="text-foreground">Alanı</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Bu sayfa yeni özellikler ve bileşenleri test etmek için özel olarak tasarlanmıştır. 
              Projemizin gelişim sürecinde kullanılan deneysel alandır.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" className="group">
                Keşfetmeye Başla
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button variant="outline" size="lg">
                Daha Fazla Bilgi
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Öne Çıkan <span className="text-primary">Özellikler</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Projemizin güçlü yanlarını keşfedin ve neler sunduğumuzu görün
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 border-border/50 hover:border-primary/20 group">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-primary">Avantajlarımız</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Size sunduğumuz değerli faydalar
            </p>
          </motion.div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="flex items-center space-x-4 p-6 bg-background rounded-xl border border-border/50 hover:border-primary/20 transition-colors duration-300"
              >
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="text-lg text-foreground">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl p-12 border border-primary/20"
          >
            <Trophy className="w-16 h-16 text-primary mx-auto mb-6" />
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Hemen <span className="text-primary">Başlayın</span>
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Deneme sayfamızda sunduğumuz özelliklerle tanışın ve projelerinizi bir üst seviyeye taşıyın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                Şimdi Dene
                <Zap className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
              </Button>
              <Button variant="outline" size="lg">
                İletişime Geç
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

