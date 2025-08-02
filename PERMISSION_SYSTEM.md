# Permission System Documentation

## Genel Bakış

Bu proje, esnek ve güçlü bir permission (yetki) sistemi kullanmaktadır. Sistem 3 ana kategori üzerinde çalışır ve her kullanıcının hangi sayfalara erişebileceğini ve hangi işlemleri yapabileceğini kontrol eder.

## Sistem Yapısı

### 1. Categories (Kategoriler)

#### `layout` - Layout Erişim Yetkisi

- **Amaç**: Kullanıcının hangi ana layout'lara erişebileceğini kontrol eder
- **Örnekler**:
  - `admin.layout` - Admin paneli layout'una erişim
  - `user.layout` - Kullanıcı paneli layout'una erişim

#### `view` - Sayfa Görüntüleme Yetkisi

- **Amaç**: Belirli sayfaları görüntüleme yetkisi
- **Naming Convention**: `{module}.{resource}.view`
- **Örnekler**:
  - `admin.dashboard.view` - Admin dashboard sayfası
  - `admin.users.view` - Kullanıcı yönetimi sayfası
  - `admin.roles.view` - Rol yönetimi sayfası
  - `admin.permissions.view` - Yetki yönetimi sayfası
  - `admin.profile.view` - Admin profil sayfası
  - `admin.hero-slider.view` - Hero slider yönetimi sayfası

#### `function` - İşlevsel Yetkiler

- **Amaç**: CRUD operasyonları ve özel işlevler için yetkiler
- **Örnekler**:
  - `users.create` - Kullanıcı oluşturma
  - `users.edit` - Kullanıcı düzenleme
  - `users.delete` - Kullanıcı silme
  - `roles.create` - Rol oluşturma
  - `permissions.manage` - Yetki yönetimi

### 2. Actions (Eylemler)

#### `access` - Erişim

- Layout kategorisi için kullanılır
- Temel erişim yetkisi verir

#### `view` - Görüntüleme

- View kategorisi için kullanılır
- Sayfa görüntüleme yetkisi verir

#### Action Types

- **`access`** - Layout kategorisi için kullanılır, temel erişim yetkisi verir
- **`view`** - View kategorisi için kullanılır, sayfa görüntüleme yetkisi verir
- **`create`** - Function kategorisi için kullanılır, yeni kayıt oluşturma yetkisi
- **`read`** - Function kategorisi için kullanılır, veri okuma yetkisi
- **`update`** - Function kategorisi için kullanılır, veri güncelleme yetkisi
- **`delete`** - Function kategorisi için kullanılır, veri silme yetkisi
- **`manage`** - Function kategorisi için kullanılır, özel yönetim işlemleri

### 3. Permission Types (Yetki Türleri)

#### `admin` - Admin Yetkisi

- Admin panel ile ilgili tüm yetkiler
- Yönetimsel işlemler

#### `user` - Kullanıcı Yetkisi

- Normal kullanıcı panel yetkiler
- Sınırlı erişim

### 4. Resource Path (Kaynak Yolu)

Esnek alan - çeşitli formatlar desteklenir:

- `admin` - Admin genel
- `dashboard` - Dashboard specific
- `users` - Kullanıcı kaynakları
- `/admin/users` - Tam URL path
- `hero-slider` - Özel kaynak

## Yeni Permission Yapısı

### Layout Permissions

```
name: admin.layout
category: layout
resourcePath: admin
action: access
permissionType: admin
```

```
name: user.layout
category: layout
resourcePath: user
action: access
permissionType: user
```

### View Permissions

```
name: admin.dashboard
category: view
resourcePath: dashboard
action: view
permissionType: admin
```

```
name: admin.users
category: view
resourcePath: users
action: view
permissionType: admin
```

```
name: admin.roles
category: view
resourcePath: roles
action: view
permissionType: admin
```

```
name: admin.permissions
category: view
resourcePath: permissions
action: view
permissionType: admin
```

```
name: admin.profile
category: view
resourcePath: profile
action: view
permissionType: admin
```

```
name: admin.hero-slider
category: view
resourcePath: hero-slider
action: view
permissionType: admin
```

### Function Permissions

```
name: users.create
category: function
resourcePath: users
action: crud
permissionType: admin
```

```
name: users.edit
category: function
resourcePath: users
action: crud
permissionType: admin
```

```
name: users.delete
category: function
resourcePath: users
action: crud
permissionType: admin
```

```
name: roles.create
category: function
resourcePath: roles
action: crud
permissionType: admin
```

```
name: roles.edit
category: function
resourcePath: roles
action: crud
permissionType: admin
```

```
name: roles.delete
category: function
resourcePath: roles
action: crud
permissionType: admin
```

```
name: permissions.create
category: function
resourcePath: permissions
action: crud
permissionType: admin
```

```
name: permissions.edit
category: function
resourcePath: permissions
action: crud
permissionType: admin
```

```
name: permissions.delete
category: function
resourcePath: permissions
action: crud
permissionType: admin
```

## Migration Plan

### Mevcut Verilerin Dönüştürülmesi

1. **Layout Permissions**

   - `layout.admin.access` → `admin.layout`
   - `layout.user.access` → `user.layout`

2. **View Permissions**

   - `view./admin/dashboard.view` → `admin.dashboard`
   - `view./admin/users.view` → `admin.users`
   - `view./admin/roles.view` → `admin.roles`
   - `view./admin/permissions.view` → `admin.permissions`
   - `view./admin/profile.view` → `admin.profile`

3. **Function Permissions**
   - `function.users.create` → `users.create`
   - `function.users.edit` → `users.edit`
   - `function.users.delete` → `users.delete`
   - `function.roles.create` → `roles.create`
   - `function.roles.edit` → `roles.edit`
   - `function.roles.delete` → `roles.delete`
   - `function.permissions.create` → `permissions.create`
   - `function.permissions.edit` → `permissions.edit`
   - `function.permissions.delete` → `permissions.delete`

### Yeni Action Mapping

- Mevcut `access` → `access` (layout için)
- Mevcut `view` → `view` (view için)
- Mevcut `create`, `edit`, `delete` → `crud` (function için)

## Kod Entegrasyonu

### 1. usePermissions Hook Update

```typescript
const { hasPermission, hasLayoutAccess, hasViewAccess, hasFunctionAccess } =
  usePermissions();

// Kullanım örnekleri:
hasLayoutAccess("admin"); // Layout erişimi
hasViewAccess("admin.dashboard.view"); // Dashboard görüntüleme
hasFunctionAccess("users.create"); // Kullanıcı oluşturma
hasPermission("users.update"); // Kullanıcı güncelleme
```

### 2. Route Protection

```typescript
// Layout erişimi - AdminPageGuard
<AdminPageGuard requireLayout="admin">
  <AdminLayout />
</AdminPageGuard>

// Sayfa erişimi - View permission
<AdminPageGuard requiredPermission="admin.users.view">
  <UsersPage />
</AdminPageGuard>

// İşlev erişimi - Function permission
<FunctionGuard requiredPermission="users.create">
  <CreateUserButton />
</FunctionGuard>
```

### 3. API Endpoint Protection

```typescript
// View permission kontrolü
if (!user || !(await hasPermission(user, "admin.users.view"))) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Function permission kontrolü
if (!user || !(await hasPermission(user, "users.create"))) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Avantajlar

1. **Temiz İsimlendirme**: Karmaşık prefix'ler yok
2. **Esnek Yapı**: ResourcePath ile özelleştirilebilir
3. **Kategorize Edilmiş**: Layout, View, Function ayrımı
4. **Genişletilebilir**: Yeni permission'lar kolayca eklenebilir
5. **Çok Dilli Destek**: DisplayName ve Description JSON formatında
6. **Audit Trail**: Kim, ne zaman oluşturdu/güncelledi takibi

## Güvenlik

- Tüm permission kontrolleri hem frontend hem backend'de yapılır
- Default deny prensibi: Yetki yoksa erişim yok
- Session bazlı yetki kontrolü
- Gerçek zamanlı yetki güncellemeleri

## 🛠️ Developer Yönetim Sistemi

Permission sistemi tamamen kod tabanlı yönetiliyor. Tüm permission'lar `lib/permissions.config.ts` dosyasında tanımlanır.

### Yeni Permission Ekleme

1. **Config dosyasını düzenle**: `lib/permissions.config.ts`
2. **Validation yap**: `npm run permissions:validate`
3. **DB'ye sync et**: `npm run permissions:sync`
4. **Kontrol et**: `npm run permissions:check`

### Permission CLI Komutları

```bash
# Ana help menüsü
npm run permissions

# Config'den DB'ye sync
npm run permissions:sync

# Config vs DB karşılaştırması
npm run permissions:check

# Tüm permission'ları listele
npm run permissions:list

# Config dosyasını doğrula
npm run permissions:validate
```

### Permission Config Formatı

```typescript
{
  name: 'admin.dashboard.view',          // Unique identifier
  category: 'view',                      // layout | view | function
  resourcePath: 'dashboard',             // Resource identifier
  action: 'view',                        // access | view | create | read | update | delete | manage
  permissionType: 'admin',               // admin | user
  displayName: {                         // UI'da gösterilecek isim
    tr: 'Admin Dashboard Görüntüleme',
    en: 'Admin Dashboard View'
  },
  description: {                         // Açıklama
    tr: 'Admin dashboard sayfasını görüntüleme yetkisi',
    en: 'Permission to view admin dashboard page'
  },
  devNotes: 'Dashboard API endpointlerini kapsar',  // Developer notları
  dependencies: ['admin.layout'],        // Bağımlı permission'lar
  usedIn: ['AdminDashboardClient']       // Kullanıldığı yerler
}
```

### Developer Workflow

1. **Permission ihtiyacı belirlenir**
2. **Config dosyasına eklenir**: `lib/permissions.config.ts`
3. **Validation çalıştırılır**: `npm run permissions:validate`
4. **DB sync yapılır**: `npm run permissions:sync`
5. **Kodda kullanılır**: Components, API endpoints
6. **Test edilir**: Dev environment'ta

### Naming Conventions

- **Layout**: `{type}.layout` (örn: `admin.layout`)
- **View**: `{module}.{resource}.view` (örn: `admin.users.view`)
- **Function**: `{resource}.{action}` (örn: `users.create`, `roles.update`)

### Auto-generated Features

- ✅ Type-safe permission names
- ✅ Dependency validation
- ✅ Usage tracking
- ✅ Multi-language support
- ✅ Developer documentation
- ✅ DB synchronization
- ✅ Config validation

## Bakım

- Permission ekleme/çıkarma işlemleri config dosyasından yapılır
- Rol bazlı yetki ataması otomatik gerçekleşir
- Yetki geçmişi DB'de izlenebilir
- Aktif/pasif yetki durumu config'den kontrol edilir
- Tüm değişiklikler version control ile takip edilir
