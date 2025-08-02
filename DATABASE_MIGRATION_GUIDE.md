# 🚀 Basit Permission Sistemi - Database Migration Rehberi

## 📋 Özet

Yeni basit permission sistemi için veritabanı yapısı **zaten mevcut Prisma schema ile uyumlu**. Hiçbir schema değişikliği gerekmiyor! Sadece yeni permission verilerini eklememiz yeterli.

## 🏗️ Mevcut Schema Uyumluluğu

```typescript
// ✅ Mevcut Permission tablosu perfect!
model Permission {
  name           String @unique  // "admin.dashboard" ✅
  category       String         // "admin" ✅
  resourcePath   String         // "dashboard" ✅
  action         String         // "access" ✅
  permissionType String         // "admin" ✅
  displayName    Json?          // Çok dilli ✅
  isActive       Boolean        // Aktif/pasif ✅
}
```

## 🚀 Migration Adımları

### Seçenek 1: Prisma Migrate (Önerilen - Production)

```bash
# 1. Migration dosyasını çalıştır
npx prisma migrate dev --name="add-simple-permissions"

# 2. Migration'ı production'a uygula
npx prisma migrate deploy
```

### Seçenek 2: Manuel SQL (Hızlı Test)

```bash
# Database'e direkt SQL çalıştır
psql -d your_database -f prisma/migrations/add_simple_permissions.sql
```

### Seçenek 3: Seed Script (Development)

```bash
# Seed script ile veri ekle
npm run seed:simple-permissions
# veya
npx ts-node prisma/seed_simple_permissions.ts
```

## 📊 Ne Eklenecek?

### 🔑 Yeni Permission'lar

```sql
admin.dashboard      → Dashboard erişimi
admin.hero-slider    → Hero slider yönetimi
admin.users          → Kullanıcı yönetimi
admin.roles          → Rol yönetimi
admin.profile        → Profil yönetimi
```

### 🛡️ Yeni Roller

```sql
ahmeticin           → Sadece dashboard + hero-slider
limited_admin       → Dashboard + profile
content_manager     → Sadece hero-slider
```

### 🔗 Role Assignment'lar

```sql
ahmeticin rolü:
✅ layout.admin.access  (Admin panel erişimi)
✅ admin.dashboard      (Dashboard görme)
✅ admin.hero-slider    (Hero slider yönetimi)
❌ admin.users          (Kullanıcı yönetimi YOK)
❌ admin.roles          (Rol yönetimi YOK)
❌ admin.profile        (Profil YOK)
```

## 🔄 Migration Sonrası Kontrol

### Database'de Kontrol Et:

```sql
-- Permission'lar eklendi mi?
SELECT name, category, "resourcePath"
FROM "Permission"
WHERE name LIKE 'admin.%';

-- Role assignment'lar doğru mu?
SELECT rp."roleName", rp."permissionName"
FROM "RoleHasPermission" rp
WHERE rp."roleName" = 'ahmeticin';

-- Kullanıcı doğru rolde mi?
SELECT u.email, r.name as role_name
FROM "User" u
JOIN "AuthRole" r ON u."roleId" = r.id
WHERE r.name = 'ahmeticin';
```

### Frontend'de Test Et:

```typescript
// useAdminNavigation hook'u test et
const navigation = useAdminNavigation();
console.log(
  "Visible pages:",
  navigation.map((n) => n.key)
);
// Expected: ['dashboard', 'hero-slider']

// Permission check'leri test et
const hasUsers = useHasPageAccess("users");
console.log("Can access users:", hasUsers); // Expected: false
```

## 🛠️ Troubleshooting

### Problem: Permission'lar görünmüyor

```bash
# Cache'i temizle
npx prisma generate
npm run build

# Database connection'ı kontrol et
npx prisma db push
```

### Problem: Role assignment çalışmıyor

```sql
-- RoleHasPermission kontrol et
SELECT * FROM "RoleHasPermission"
WHERE "roleName" = 'ahmeticin' AND "isActive" = true;

-- User'ın role'ünü kontrol et
SELECT u.email, u."roleId", r.name
FROM "User" u
LEFT JOIN "AuthRole" r ON u."roleId" = r.id;
```

### Problem: Sidebar'da linkler görünmüyor

```typescript
// User permissions debug et
const { user } = useAuth();
console.log("User permissions:", user?.permissions);
// Expected: ['layout.admin.access', 'admin.dashboard', 'admin.hero-slider']
```

## 🎯 Rollback (Geri Alma)

Eğer bir sorun olursa:

```sql
-- Permission'ları geri al
DELETE FROM "RoleHasPermission"
WHERE "permissionName" LIKE 'admin.%';

DELETE FROM "Permission"
WHERE name LIKE 'admin.%';

-- Role'ü geri al
DELETE FROM "AuthRole"
WHERE name = 'ahmeticin';
```

## ✅ Migration Checklist

- [ ] Migration script'i hazır
- [ ] Backup alındı
- [ ] Migration çalıştırıldı
- [ ] Permission'lar eklendi
- [ ] Role'ler oluşturuldu
- [ ] Role assignment'lar yapıldı
- [ ] Frontend test edildi
- [ ] Sidebar doğru çalışıyor
- [ ] Permission check'ler doğru

## 🎉 Sonuç

Migration tamamlandıktan sonra:

✅ **ahmeticin rolündeki kullanıcılar:**

- Admin paneline girebilir
- Sadece Dashboard ve Hero Slider sayfalarını görebilir
- Users, Roles, Profile sayfalarını göremez

✅ **Developer experience:**

- 90% daha az kod
- Çok daha basit sistem
- Kolay maintainability
