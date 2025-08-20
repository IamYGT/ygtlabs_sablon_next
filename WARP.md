# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Memsidea Landing with Admin** - A comprehensive ECU management system for automotive chiptuning services built with Next.js 15 App Router, TypeScript, and modern web technologies.

### Business Domain
- **ECU chiptuning and remapping services**
- **Performance optimization for vehicles**
- **Fleet management solutions**
- **Dealer network management**
- **Multi-language support (EN/TR)**

### Architecture
- **Multi-tier application**: Landing page, Admin panel, customer panel
- **Session-based routing**: Different content based on authentication status
- **Role-based access control**: Granular permissions system
- **Database-managed roles**: All roles stored in PostgreSQL

## Technology Stack

### Core
- **Next.js 15.3.1** with App Router and Turbopack
- **React 19** with latest concurrent features
- **TypeScript 5** with strict mode enabled
- **PostgreSQL** with Prisma ORM 6.13.0

### State Management
- **Zustand 5.0.2** for client state (auth, UI)
- **TanStack Query 5.66.1** for server state and caching
- **React Hook Form 7.56.1** for form management

### UI/UX
- **Tailwind CSS 4.1.5** with custom design system
- **Radix UI** for accessible components
- **Framer Motion 12.18.1** for animations
- **Lucide React** for icons

### Internationalization
- **next-intl 4.1.0** with locale-based routing
- **Supported languages**: English (default), Turkish (/tr)

## Common Development Commands

### Development Server
```bash
npm run dev          # Start with Turbopack (recommended)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Management
```bash
# Migrations
npm run db:migrate         # Run Prisma migrations (development)
npm run db:migrate:deploy  # Deploy migrations (production)

# Database utilities
npm run db:seed            # Seed database with initial data
npm run db:studio          # Open Prisma Studio GUI
npm run db:reset           # DANGER: Reset database (dev only - never production!)

# Prisma commands
npx prisma generate        # Regenerate Prisma client after schema changes
npx prisma migrate dev --name migration_name  # Create new migration
```

### Permission System
```bash
# Core commands
npm run permissions              # Show help menu
npm run permissions:sync         # Sync config to database
npm run permissions:check        # Check config vs database
npm run permissions:validate     # Validate configuration
npm run permissions:list         # List all permissions
npm run permissions:dev          # Run all validations

# Force sync (overwrites database)
npm run permissions:force-sync   # Force sync permissions
```

### Testing
```bash
npm run test         # Run Vitest tests
npm run test:ui      # Run tests with UI interface
```

### Internationalization
```bash
npm run i18n:generate  # Generate locale files
npm run i18n:routing   # Generate routing configuration
```

## High-Level Architecture

### Directory Structure
```
app/
├── [locale]/              # Internationalized pages
│   ├── page.tsx           # Landing page (root URL)
│   ├── admin/             # Admin panel routes
│   ├── auth/              # Authentication pages
│   └── customer/             # customer dashboard
├── api/                   # API endpoints
└── layout.tsx             # Root layout

components/
├── panel/                 # Shared panel components
└── ui/                    # Shadcn/UI components

lib/
├── api-client.ts          # Modern API client with TanStack Query
├── stores/                # Zustand state management
│   ├── auth-store.ts      # Authentication state
│   └── ui-store.ts        # UI state (modals, loading)
├── hooks/                 # Custom React hooks
├── permissions/           # Centralized permission system
│   ├── config.ts          # Single source of truth
│   ├── helpers.ts         # Permission utilities
│   └── scripts/           # CLI tools
├── types.ts               # TypeScript definitions
├── constants.ts           # Application constants
└── utils.ts               # Utility functions

messages/                  # i18n translation files
├── en.json                # English translations
└── tr.json                # Turkish translations

prisma/
├── schema.prisma          # Database schema
├── migrations/            # Database migrations
└── seed.ts                # Database seeding
```

### State Management Architecture

#### Client State (Zustand)
- **Auth Store**: User authentication, permissions, session tracking
- **UI Store**: Loading states, modals, notifications, sidebar state

#### Server State (TanStack Query)
- **Query Keys Factory**: Organized cache keys for invalidation
- **API Client**: Type-safe request/response handling
- **Optimistic Updates**: Better UX with immediate feedback
- **Cache Configuration**: Stale time and garbage collection settings

#### API Client Pattern
```typescript
// Organized API functions
apiClient.authAPI.login(data)
apiClient.usersAPI.getUsers(filters)
apiClient.rolesAPI.updateRole(id, data)

// Query key factories for cache management
queryKeys.users.list(filters)
queryKeys.auth.currentUser()
```

### Permission System

#### Central Configuration (`lib/permissions/config.ts`)
- **Single source of truth** for all permissions
- **Three categories**: layout, view, function
- **Auto-generated TypeScript types**
- **Navigation auto-configuration**

#### Permission Categories
1. **layout**: Panel access (`admin.layout`, `user.layout`)
2. **view**: Page viewing (`admin.dashboard.view`)
3. **function**: CRUD operations (`users.create`, `roles.update`)

#### Usage Patterns
```typescript
// Component permission check
const canCreate = useHasPermission("users.create");

// API endpoint protection
export const GET = withPermission("admin.users.view", async (req, user) => {
  // Permission auto-validated
});

// Navigation (automatic)
const links = useAdminNavigation(); // Permission-based navigation
```

### Database Schema

#### Key Models
- **User**: Core user model with role assignment
- **Session**: Enhanced multi-session support with device tracking
- **AuthRole**: Database-managed roles
- **Permission**: Granular permissions with categories
- **RoleHasPermission**: Role-permission mapping

#### Session Management Features
- **Multi-session support**: Multiple tabs/devices
- **Device fingerprinting**: Security tracking
- **Session hierarchy**: Parent-child sessions
- **Activity tracking**: Last active, heartbeat
- **Revocation management**: Session termination

### Routing and Internationalization

#### URL Structure
- `/` - English (default, no prefix)
- `/tr` - Turkish with localized pathnames
- `/auth/login` → `/tr/auth/giris` (Turkish)
- `/admin/dashboard` - Admin panel (permission-protected)
- `/customer/dashboard` - User panel (permission-protected)

#### Session-Based Routing
- **Landing page (`/`)**: Shows landing content or redirects to dashboard
- **Protected routes**: Automatic redirect to login if not authenticated
- **Permission checks**: Client-side guards for unauthorized access

### Security Patterns

#### Authentication Flow
1. **Middleware**: Basic session validation
2. **Client Guards**: Permission-based route protection
3. **API Protection**: Server-side permission validation
4. **Double Protection**: Frontend + Backend checks

#### Security Principles
- **Default Deny**: No access without explicit permission
- **Session-Based**: Real-time permission updates
- **Type Safety**: Compile-time permission validation
- **Token Versioning**: Invalidate tokens on password change

## Development Workflow

### Adding New Features

#### 1. New Page with Permissions
```typescript
// 1. Add permission in lib/permissions/config.ts
export const VIEW_PERMISSIONS = [
  {
    name: "admin.new-feature.view",
    category: "view",
    displayName: { tr: "Yeni Özellik", en: "New Feature" },
    // ...
  }
];

// 2. Sync to database
npm run permissions:sync

// 3. Navigation auto-appears if permission granted
```

#### 2. New API Endpoint
```typescript
// Use withPermission HOC for automatic validation
export const POST = withPermission("resource.create", async (req, user) => {
  // User is validated, has permission
  const data = await req.json();
  return Response.json(await createResource(data));
});
```

#### 3. New Database Model
```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_new_model
# 3. Generate client
npx prisma generate
```

### Environment Variables

Required environment variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## Code Conventions

### TypeScript
- **Strict mode enabled**
- **Path alias**: `@/*` maps to root directory
- **Prefer interfaces over types for objects**
- **Use discriminated unions for state**

### Component Structure
```typescript
// 1. Imports (external, internal, relative)
// 2. Type definitions
// 3. Component implementation
// 4. Default export
```

### File Naming
- **Components**: PascalCase (`UserProfile.tsx`)
- **Utilities**: kebab-case (`api-client.ts`)
- **Hooks**: camelCase with use prefix (`usePermissions.ts`)
- **Pages**: lowercase (`dashboard`, `users`)

### State Management
- **Client State**: Zustand for UI and auth
- **Server State**: TanStack Query for API data
- **Form State**: React Hook Form
- **Local State**: useState for component-specific

## Performance Optimizations

- **Turbopack**: Fast development builds
- **Code Splitting**: Automatic with App Router
- **Image Optimization**: Next.js Image with AVIF/WebP
- **Query Caching**: TanStack Query with stale-while-revalidate
- **Lazy Loading**: Dynamic imports for heavy components

## Troubleshooting

### Permission Issues
```bash
# Validate and sync permissions
npm run permissions:validate
npm run permissions:sync
npm run permissions:check
```

### Database Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Check migration status
npx prisma migrate status

# Open Prisma Studio to inspect data
npm run db:studio
```

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Critical Notes

1. **NEVER use `db:reset` on production** - This will delete all data
2. **Always validate permissions** before syncing to database
3. **Session tokens** are UUIDs stored in cookies
4. **Middleware** handles basic auth, complex permission checks are client-side
5. **Role management** is entirely database-driven via AuthRole table
6. **Permission system** uses a single config file as source of truth

## Key Integration Points

### Authentication Flow
1. User logs in via `/auth/login`
2. Session created with UUID token
3. Token stored in `ecu_session` cookie
4. Middleware validates token format
5. Client components check permissions
6. API endpoints validate permissions server-side

### Permission Flow
1. Permissions defined in `lib/permissions/config.ts`
2. Synced to database via CLI command
3. Roles assigned permissions in database
4. Users assigned roles
5. Navigation auto-generated based on permissions
6. Components check permissions via hooks
7. APIs protected with withPermission HOC

This architecture provides a scalable, secure, and maintainable foundation for the ECU management system with comprehensive permission control and multi-language support.
