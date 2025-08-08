# Schema Change Notes

Bu dosya, mevcut şemadaki standardizasyon ve adlandırma notlarını içerir.

## 1) CamelCase yerine camelCase alanlar (mevcut)

Aşağıdaki relation alanları PascalCase kullanıyor; gelecekte camelCase'e geçirilebilir (karar: Şimdilik sadece raporlandı):

- `User.LoginHistory` → öneri: `loginHistory`
- `User.UserStats` → öneri: `userStats`
- `Session.LoginHistory` → öneri: `loginHistory`

Etkisi: Prisma Client'ta relation adları çağrılırken daha doğal camelCase isimler elde edilir. Refactor geniş kapsamlı olacağı için ayrı migration planı yapılmalı.

## 2) Standartlaştırılan alanlar (uygulandı)

- `Session.id` → `uuid()` (önceden `cuid()` idi)
- `Session.sessionType` → enum `SessionType { normal, incognito, mobile }`
- `AuthRole.layoutType` → enum `LayoutType { admin, user }`
- `Permission.category` → enum `PermissionCategory { layout, view, function }`
- `Permission.action` → enum `PermissionAction { access, view, create, read, update, delete, manage, edit }`
- `Permission.permissionType` → enum `PermissionType { admin, user }`

## 3) Kaldırılan alanlar

- `User.image` kaldırıldı; tekil alan olarak `User.profileImage` kullanılacak (karar: evet, tekilleştirildi)

## 4) İndeks ve ilişki iyileştirmeleri (uygulandı)

- `Session`: `@@index([userId, isActive])`, `@@index([expires])`
- `Session.parentSession` → `onDelete: SetNull`
- `User`: `@@index([roleId])`

## 5) Permission isim standardı (uygulandı)

- Kanonik isimler: `admin.layout`, `user.layout`
- Geriye dönük: `layout.*.access` kullanımından vazgeçildi

## 6) Açıkta kalan yapılacaklar

- (Opsiyonel) `RoleHasPermission` isim yerine ID tabanlı ilişkiye geçirilmesi → ileri aşama migration planı gerektirir.
- Tüm view/function permission adlandırmalarının `lib/permissions/config.ts` ile birebir hizalanması ve var olan seed/migration scriptlerinin sadeleştirilmesi.
