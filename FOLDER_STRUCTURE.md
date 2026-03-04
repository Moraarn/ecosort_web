# EcoSort AI - Next.js Folder Structure

```
ecosort_web/
├── README.md
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.local
├── .env.example
├── DATABASE_SCHEMA.sql
├── ECOSORT_ARCHITECTURE.md
├── FOLDER_STRUCTURE.md
├── DEVELOPMENT_ROADMAP.md
├── DEPLOYMENT_GUIDE.md
│
├── app/                          # Next.js App Router
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx                  # Landing page
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx              # User dashboard
│   │   ├── wallet/
│   │   │   └── page.tsx
│   │   ├── history/
│   │   │   └── page.tsx
│   │   ├── achievements/
│   │   │   └── page.tsx
│   │   └── leaderboard/
│   │       └── page.tsx
│   ├── scan/
│   │   ├── page.tsx              # QR scanning
│   │   └── success/
│   │       └── page.tsx
│   ├── classify/
│   │   ├── page.tsx              # AI waste classification
│   │   └── result/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── bins/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── users/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   └── api/
│       ├── auth/
│       │   └── callback/
│       │       └── route.ts
│       ├── classify/
│       │   └── route.ts
│       ├── scan/
│       │   └── route.ts
│       ├── rewards/
│       │   └── route.ts
│       └── admin/
│           ├── analytics/
│           │   └── route.ts
│           └── bins/
│               └── route.ts
│
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── tabs.tsx
│   │   ├── avatar.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── select.tsx
│   │   ├── switch.tsx
│   │   └── separator.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   ├── footer.tsx
│   │   └── navigation.tsx
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── auth-guard.tsx
│   ├── waste/
│   │   ├── image-upload.tsx
│   │   ├── classification-result.tsx
│   │   ├── waste-card.tsx
│   │   └── category-icon.tsx
│   ├── qr/
│   │   ├── qr-scanner.tsx
│   │   ├── qr-upload.tsx
│   │   └── scan-result.tsx
│   ├── rewards/
│   │   ├── points-display.tsx
│   │   ├── reward-card.tsx
│   │   ├── achievement-badge.tsx
│   │   └── leaderboard-table.tsx
│   ├── dashboard/
│   │   ├── stats-card.tsx
│   │   ├── chart-container.tsx
│   │   ├── waste-chart.tsx
│   │   ├── activity-feed.tsx
│   │   └── quick-actions.tsx
│   ├── admin/
│   │   ├── analytics-chart.tsx
│   │   ├── bin-status-card.tsx
│   │   ├── user-management.tsx
│   │   └── system-metrics.tsx
│   └── common/
│       ├── loading-spinner.tsx
│       ├── error-boundary.tsx
│       ├── theme-toggle.tsx
│       └── mobile-nav.tsx
│
├── lib/                          # Utility libraries
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   └── storage.ts
│   ├── ai/
│   │   ├── classifier.ts
│   │   ├── tensorflow-model.ts
│   │   └── replicate-api.ts
│   ├── qr/
│   │   ├── scanner.ts
│   │   └── validator.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validations.ts
│   │   └── formatters.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-waste-classification.ts
│   │   ├── use-qr-scanner.ts
│   │   ├── use-rewards.ts
│   │   └── use-admin.ts
│   ├── stores/
│   │   ├── auth-store.ts
│   │   ├── waste-store.ts
│   │   └── rewards-store.ts
│   └── types/
│       ├── auth.ts
│       ├── waste.ts
│       ├── rewards.ts
│       ├── admin.ts
│       └── api.ts
│
├── public/                       # Static assets
│   ├── icons/
│   │   ├── plastic.svg
│   │   ├── organic.svg
│   │   ├── metal.svg
│   │   ├── glass.svg
│   │   ├── paper.svg
│   │   ├── ewaste.svg
│   │   └── achievements/
│   ├── images/
│   │   ├── hero-bg.jpg
│   │   ├── app-demo.png
│   │   └── waste-examples/
│   ├── favicon.ico
│   ├── logo.svg
│   └── manifest.json
│
├── styles/                       # Global styles
│   ├── globals.css
│   └── components.css
│
├── hooks/                        # Custom React hooks
│   ├── use-auth.ts
│   ├── use-camera.ts
│   ├── use-geolocation.ts
│   └── use-offline.ts
│
├── middleware.ts                 # Next.js middleware
├── instrumentation.ts           # Monitoring setup
└── .env.example                  # Environment variables template
```

## Key Files Explanation

### App Router Structure
- **`app/`**: Next.js 13+ App Router structure
- **`app/auth/`**: Authentication pages (login, signup, callback)
- **`app/dashboard/`**: User dashboard and related pages
- **`app/scan/`**: QR code scanning functionality
- **`app/classify/`**: AI waste classification
- **`app/admin/`**: Admin dashboard and management
- **`app/api/`**: API routes for server actions

### Components Organization
- **`components/ui/`**: shadcn/ui base components
- **`components/layout/`**: Layout components (header, sidebar, etc.)
- **`components/waste/`**: Waste classification components
- **`components/qr/`**: QR code scanning components
- **`components/rewards/`**: Rewards and gamification components
- **`components/dashboard/`**: Dashboard analytics components
- **`components/admin/`**: Admin-specific components

### Library Structure
- **`lib/supabase/`**: Supabase client and server configurations
- **`lib/ai/`**: AI classification logic (TensorFlow/Replicate)
- **`lib/qr/`**: QR code scanning and validation
- **`lib/hooks/`**: Custom React hooks
- **`lib/stores/`**: State management (Zustand)
- **`lib/types/`**: TypeScript type definitions

### Static Assets
- **`public/icons/`**: Waste category icons and achievement badges
- **`public/images/`**: Marketing and demo images
- **`public/manifest.json`**: PWA configuration

## Best Practices

1. **Component Organization**: Group components by feature, not by type
2. **Type Safety**: All components and functions have proper TypeScript types
3. **Server Components**: Use React Server Components where possible for performance
4. **Client Components**: Mark components with 'use client' only when necessary
5. **Environment Variables**: Keep all secrets in `.env.local`
6. **Code Splitting**: Large components are split into smaller, focused modules
7. **Error Handling**: Proper error boundaries and validation throughout
8. **Performance**: Lazy loading and optimized images for mobile users
