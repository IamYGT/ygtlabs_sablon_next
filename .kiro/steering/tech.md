# Technology Stack & Build System

## Core Technologies

### Frontend Framework
- **Next.js 15.3.1** - React-based full-stack framework with App Router
- **React 19** - Latest React version with concurrent features
- **TypeScript 5** - Type-safe JavaScript development

### Styling & UI
- **Tailwind CSS 4.1.5** - Utility-first CSS framework
- **Radix UI** - Headless UI components for accessibility
- **Framer Motion** - Animation library for smooth interactions
- **Lucide React** - Icon library
- **Class Variance Authority (CVA)** - Component variant management

### Database & Backend
- **Prisma 6.13.0** - Database ORM with PostgreSQL
- **PostgreSQL** - Primary database with multi-schema support
- **Iron Session** - Secure session management
- **Auth/Prisma Adapter** - Authentication integration

### State Management & Data Fetching
- **Zustand 5.0.2** - Lightweight state management
- **TanStack Query 5.66.1** - Server state management and caching
- **React Hook Form 7.56.1** - Form state management
- **Zod 3.24.3** - Schema validation

### Internationalization
- **Next-intl 4.1.0** - Internationalization with English/Turkish support
- **Locale-based routing** - URL structure: `/` (English), `/tr` (Turkish)

### Development Tools
- **ESLint 9** - Code linting with Next.js config
- **Vitest 3.2.2** - Testing framework
- **TypeScript ESLint 8.31.1** - TypeScript-specific linting
- **Turbopack** - Fast bundler for development

## Common Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build production application
npm run start        # Start production server
npm run lint         # Run ESLint checks
```

### Testing
```bash
npm run test         # Run Vitest tests
npm run test:ui      # Run tests with UI interface
```

### Database
```bash
npm run prisma:seed  # Seed database with initial data
npx prisma migrate dev    # Run database migrations
npx prisma generate       # Generate Prisma client
npx prisma studio        # Open Prisma Studio
```

## Build Configuration

### Next.js Config
- **Turbopack** enabled for faster development builds
- **Image optimization** with AVIF/WebP formats
- **Remote image patterns** configured for external sources
- **Next-intl plugin** integrated for internationalization

### TypeScript Config
- **Strict mode** enabled for type safety
- **Path aliases** configured (`@/*` maps to root)
- **ES2017 target** for modern browser support
- **Module resolution** set to bundler mode

### Environment Requirements
- **Node.js** - Modern version supporting ES modules
- **PostgreSQL** - Database server
- **Environment variables** - Configure in `.env` file