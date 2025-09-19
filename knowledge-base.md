# Bilgi Bankası - Hata ve Çözüm Arşivi

## Hydration Hataları

### adminNavItems.map is not a function
Çözüm: AdminHeader component'inde useAdminNavigation hook'unun yanlış kullanımı. Hook { crmItems, otherItems } objesi döndürüyor, destructuring gerekli.
Tarih: 2025-09-19
Teknoloji: React/Next.js/TypeScript
Bağlam: Admin panel navigation sistemi
Süreç Dosyası: process-2025-09-19-04-33-51.md
Model: grok-code-fast-1

### Hydration Mismatch - Attribute Uyumsuzluğu
Çözüm: Sunucu ve istemci taraflı render arasında attribute farkları. Genellikle client component'lerde oluşur.
Tarih: 2025-09-19
Teknoloji: Next.js/React
Bağlam: SSR/CSR uyumsuzluğu
Süreç Dosyası: process-2025-09-19-04-33-51.md
Model: grok-code-fast-1
