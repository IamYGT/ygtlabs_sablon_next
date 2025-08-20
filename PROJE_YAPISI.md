# ECU Sablon Projesi - Yapı Dokümantasyonu

## Proje Genel Yapısı

Bu Next.js 15 projesi, modern web teknolojileri kullanılarak geliştirilmiş bir ECU chip tuning yönetim sistemidir.

### Ana Klasörler

```
ecu_sablon/
├── app/                          # Next.js App Router yapısı
│   ├── [locale]/                 # Çok dilli sayfa yapısı
│   │   ├── page.tsx              # 🎯 Landing page (root URL)
│   │   ├── layout.tsx            # Ana layout
│   │   ├── globals.css           # Global stiller
│   │   ├── landing/              # Landing page bileşenleri
│   │   │   ├── layout.tsx        # Landing page layout'u
│   │   │   └── page.tsx          # Landing page içeriği (component)
│   │   ├── admin/                # Admin paneli
│   │   ├── auth/                 # Kimlik doğrulama sayfaları
│   │   └── customer/                # Kullanıcı paneli
│   └── api/                      # API rotaları
├── components/                   # Yeniden kullanılabilir bileşenler
│   ├── panel/                    # Panel bileşenleri (admin/customer/landing)
│   └── ui/                       # UI bileşenleri (shadcn/ui)
├── lib/                          # Yardımcı kütüphaneler
├── messages/                     # Çok dilli mesajlar
├── prisma/                       # Veritabanı şeması ve migrasyonlar
├── public/                       # Statik dosyalar
├── src/i18n/                     # Uluslararasılaştırma konfigürasyonu
└── landing_page/                 # Ayrı React projesi (eski)
```

## Sayfa Yapısı

### 🎯 **Ana Sayfa (`/`) - Landing Page**
- **Konum**: `app/[locale]/page.tsx`
- **Davranış**: 
  - **Giriş yapmamış kullanıcılar**: Landing page içeriğini görür
  - **Giriş yapmış kullanıcılar**: Dashboard'a otomatik yönlendirilir
- **Özellikler**:
  - Modern responsive tasarım
  - Framer Motion animasyonları
  - Panel bileşenlerini kullanır (Logo, ThemeToggle, LanguageSwitcher)
  - Hero, Services, Stats, Contact bölümleri
  - SEO optimizasyonu

### 📁 **Landing Page Bileşenleri (`/landing`)**
- **Konum**: `app/[locale]/landing/`
- **Amaç**: Landing page içeriğinin organize edilmesi
- **Yapı**:
  - `layout.tsx`: Landing page için özel layout
  - `page.tsx`: Ana landing page bileşeni (LandingPageContent)
- **Gelecek Genişlemeler**: Alt sayfalar eklenebilir

### 🔐 **Admin Paneli (`/admin`)**
- **Dashboard**: Genel istatistikler ve sistem durumu
- **Kullanıcı Yönetimi**: CRUD işlemleri, rol atama
- **Rol Yönetimi**: Rol oluşturma, düzenleme, yetki atama
- **Yetki Yönetimi**: Sistem yetkileri tanımlama
- **Profil**: Admin profil yönetimi

### 🔑 **Kimlik Doğrulama (`/auth`)**
- **Giriş**: Kullanıcı girişi
- **Kayıt**: Yeni kullanıcı kaydı
- **Şifremi Unuttum**: Şifre sıfırlama
- **Özel Auth Layout**: Modern glassmorphism tasarım

### 👤 **Kullanıcı Paneli (`/customer`)**
- **Dashboard**: Kullanıcı özgü istatistikler
- **Profil**: Kullanıcı profil yönetimi

## Routing Sistemi

### URL Yapısı
```
/ (root)                        → Landing page / Dashboard (session'a göre)
/auth/login (/tr/auth/giris)    → Giriş sayfası
/auth/register (/tr/auth/kayit-ol) → Kayıt sayfası
/admin/dashboard                → Admin dashboard
/customer/dashboard                → Kullanıcı dashboard
```

### Çok Dilli Destek
- **İngilizce** (en): Varsayılan, prefix yok
- **Türkçe** (tr): `/tr` prefix'i ile
- **Pathname Çevirileri**: URL'ler yerelleştirilmiş

### Session Yönetimi
- **Middleware**: Session kontrolü ve yönlendirme
- **AuthGuards**: Client-side yetki kontrolleri
- **Akıllı Yönlendirme**: Kullanıcı durumuna göre otomatik yönlendirme

## Bileşen Mimarisi

### Panel Bileşenleri (`/components/panel/`)
Tüm panel türleri arasında paylaşılan bileşenler:
- `Logo.tsx`: Uygulama logosu
- `ThemeToggle.tsx`: Karanlık/aydınlık mod
- `LanguageSwitcher.tsx`: Dil değiştirici
- `AdminSidebar.tsx`: Admin kenar çubuğu
- `AuthGuards.tsx`: Yetki kontrolleri

### UI Bileşenleri (`/components/ui/`)
Shadcn/ui tabanlı temel UI bileşenleri

## Teknoloji Stack

### Frontend
- **Next.js 15**: React framework
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Stil sistemi
- **Framer Motion**: Animasyonlar
- **Shadcn/ui**: UI bileşen kütüphanesi
- **Zustand**: State yönetimi
- **React Query**: Server state yönetimi

### Backend
- **Next.js API Routes**: Backend API
- **Prisma**: ORM ve veritabanı yönetimi
- **PostgreSQL**: Veritabanı

### Araçlar
- **ESLint**: Kod kalitesi
- **Prettier**: Kod formatı
- **TypeScript**: Tip kontrolü

## Geliştirme Notları

### 🎯 **Landing Page Yaklaşımı**
1. **Root URL'de**: Ana sayfa direkt `/` adresinde
2. **Session Bazlı**: Kullanıcı durumuna göre farklı içerik
3. **Modüler Yapı**: Landing içeriği ayrı klasörde organize
4. **Paylaşılan Bileşenler**: Panel bileşenlerini kullanır
5. **SEO Optimizasyonu**: Özel meta etiketleri

### 🔐 **Güvenlik**
- **Middleware**: Server-side session kontrolü
- **Route Guards**: Client-side yetki kontrolü
- **API Protection**: Endpoint güvenliği
- **Session Management**: Güvenli oturum yönetimi

### ⚡ **Performans**
- **Code Splitting**: Sayfa bazlı kod bölme
- **Lazy Loading**: Gerektiğinde yükleme
- **Image Optimization**: Next.js resim optimizasyonu
- **Bundle Analysis**: Paket boyutu analizi

### 🔄 **Session Akışı**

#### Giriş Yapmamış Kullanıcı:
```
1. → / (root URL)
2. → Middleware: Session yok
3. → Landing page gösterilir
4. → Kullanıcı "Giriş Yap" butonuna tıklar
5. → /auth/login sayfasına yönlendirilir
```

#### Giriş Yapmış Kullanıcı:
```
1. → / (root URL)
2. → Middleware: Session var
3. → Dashboard'a otomatik yönlendirme
4. → /admin/dashboard veya /customer/dashboard
```

## Deployment

### Gereksinimler
- Node.js 18+
- PostgreSQL veritabanı
- Vercel/Netlify (önerilen)

### Ortam Değişkenleri
```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## 🚀 **Avantajlar**

1. **Kullanıcı Dostu**: Direkt root URL'de landing page
2. **Akıllı Yönlendirme**: Session durumuna göre otomatik yönlendirme
3. **Modüler Yapı**: Landing page bileşenleri organize
4. **Paylaşılan Bileşenler**: Kod tekrarı yok
5. **SEO Optimizasyonu**: Ana sayfa için özel meta etiketleri
6. **Performans**: Sadece gerekli bileşenler yüklenir
7. **Gelecek Genişlemeler**: Kolayca alt sayfalar eklenebilir

Bu yapı, modern web standartlarına uygun, kullanıcı dostu ve gelecekteki büyüme için hazır bir landing page sistemi sağlar. 