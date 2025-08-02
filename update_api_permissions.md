# API Permission Mapping Update

## Permission Mapping (Eski → Yeni)

### Layout Permissions

- `layout.admin.access` → `admin.layout`
- `layout.user.access` → `user.layout`

### View Permissions

- `view./admin/dashboard.view` → `admin.dashboard`
- `view./admin/users.view` → `admin.users`
- `view./admin/roles.view` → `admin.roles`
- `view./admin/permissions.view` → `admin.permissions`
- `view./admin/profile.view` → `admin.profile`
- `view./admin/hero-slider.view` → `admin.hero-slider`

### Function Permissions

- `function.users.create` → `users.create`
- `function.users.edit` → `users.edit`
- `function.users.delete` → `users.delete`
- `function.roles.create` → `roles.create`
- `function.roles.edit` → `roles.edit`
- `function.roles.delete` → `roles.delete`
- `function.permissions.create` → `permissions.create`
- `function.permissions.edit` → `permissions.edit`
- `function.permissions.delete` → `permissions.delete`

### Custom/System Permissions

- `system.status` → `admin.dashboard`
- `sessions.admin` → `admin.dashboard`
- `users.list` → `admin.users`

## Güncellenecek Dosyalar

✅ lib/index.ts (hasAdminAccess, canEditUser, canToggleUserStatus)
✅ app/api/users/route.ts (users.list → admin.users)  
✅ app/api/users/[userId]/route.ts (users.edit, users.delete) [Zaten doğru]
✅ app/api/admin/system-status/route.ts (system.status → admin.dashboard)
✅ app/api/admin/sessions/route.ts (sessions.admin → admin.dashboard)
✅ app/api/admin/permissions/route.ts (view./admin/permissions.view → admin.permissions, function.permissions.create → permissions.create)

🔄 app/api/admin/permissions/[permissionId]/route.ts
🔄 app/api/admin/roles/ (tüm dosyalar)
🔄 app/api/admin/hero-slider/ (tüm dosyalar)

## Not

Roles API'lerinde rollerle permission arasındaki ilişki yönetimi var, bu dosyalar daha dikkatli güncellenmeli.
