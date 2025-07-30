# Project Structure & Organization

## Root Directory Layout

```
├── app/                    # Next.js App Router pages and layouts
├── components/             # Reusable React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries and configurations
├── messages/               # Internationalization message files
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/                    # Source code (i18n configuration)
└── oldlanding_page/        # Legacy landing page (deprecated)
```

## Key Directories

### `/app` - Next.js App Router
- **`layout.tsx`** - Root layout component
- **`page.tsx`** - Home page component
- **`api/`** - API route handlers
- **`[locale]/`** - Internationalized routes (en/tr)

### `/components` - UI Components
- **`ui/`** - Base UI components (buttons, inputs, dialogs)
- **`panel/`** - Admin panel specific components
- Follow component composition patterns with Radix UI

### `/lib` - Core Libraries
- **`api-client.ts`** - API communication layer
- **`prisma.ts`** - Database client configuration
- **`utils.ts`** - Utility functions (cn, parseJSONField, performance optimizations)
- **`types.ts`** - TypeScript type definitions
- **`constants.ts`** - Application constants
- **`hooks/`** - Shared custom hooks
- **`stores/`** - Zustand state management
- **`providers/`** - React context providers

### `/messages` - Internationalization
- **`en.json`** - English translations
- **`tr.json`** - Turkish translations
- **`admin/`** - Admin-specific translations
- Nested JSON structure for organized translations

### `/prisma` - Database
- **`schema.prisma`** - Database schema with multi-schema support
- **`migrations/`** - Database migration files
- **`seed.ts`** - Database seeding script

### `/public` - Static Assets
- **`images/`** - Image assets
- **`uploads/`** - User uploaded files
- **`logo/`** - Brand assets
- **`slider/`** - Hero slider images

## File Naming Conventions

### Components
- **PascalCase** for component files: `UserProfile.tsx`
- **kebab-case** for utility files: `api-client.ts`
- **camelCase** for hooks: `usePermissions.ts`

### Pages (App Router)
- **lowercase** for route segments: `dashboard`, `users`
- **[brackets]** for dynamic routes: `[locale]`, `[id]`
- **page.tsx** for page components
- **layout.tsx** for layout components

### API Routes
- **lowercase** with hyphens: `/api/auth/login`
- **RESTful conventions**: GET, POST, PUT, DELETE

## Import Path Aliases

```typescript
// Configured in tsconfig.json
"@/*": ["./*"]

// Usage examples:
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { usePermissions } from "@/hooks/usePermissions"
```

## Architecture Patterns

### Component Organization
- **Atomic Design** principles for UI components
- **Compound Components** for complex UI patterns
- **Render Props** and **Custom Hooks** for logic sharing

### State Management
- **Zustand** for global application state
- **TanStack Query** for server state and caching
- **React Hook Form** for form state
- **Local state** with useState for component-specific state

### Database Schema
- **Multi-schema** PostgreSQL setup
- **Audit trails** for user actions and changes
- **Soft deletes** with isActive flags
- **JSON fields** for flexible multilingual content

### Internationalization Structure
- **Route-based** locale detection (`/`, `/tr`)
- **JSON message files** with nested structure
- **Locale-specific** URL pathnames
- **Server-side** and **client-side** translation support

## Code Organization Best Practices

### Component Structure
```typescript
// Component file structure
import statements
type definitions
main component
default export
```

### Utility Functions
- **Pure functions** in `/lib/utils.ts`
- **Performance optimized** helpers (debounceRAF, throttleRAF)
- **Type-safe** JSON parsing utilities

### API Layer
- **Centralized** API client in `/lib/api-client.ts`
- **Type-safe** request/response handling
- **Error handling** and loading states