# Installation Guide

## Quick Fix for Dependencies

The app is now running with a simplified version. To install all dependencies and get the full UI components:

### Option 1: Install with npm (Recommended)
```bash
npm install
```

### Option 2: Install with pnpm
```bash
pnpm install
```

### Option 3: Install with yarn
```bash
yarn install
```

## After Installation

Once dependencies are installed, you can restore the full UI components:

1. **Restore the complex layout and page:**
```bash
# If you want to switch back to the full UI components
mv app/layout.tsx app/layout-simple.tsx
mv app/layout-complex.tsx app/layout.tsx
mv app/page.tsx app/page-simple.tsx  
mv app/page-complex.tsx app/page.tsx
```

2. **Restart the development server:**
```bash
npm run dev
```

## Current Status

✅ **Working:** Simplified landing page with TailwindCSS styling
⏳ **Pending:** Full shadcn/ui components (requires dependency installation)

## What's Working Now

- ✅ Landing page with hero section
- ✅ Feature cards with emojis
- ✅ Responsive design
- ✅ TailwindCSS styling
- ✅ Navigation links (ready for auth pages)

## What's Coming After Dependencies

- 🎨 Beautiful shadcn/ui components
- 🔄 Theme switching (dark/light mode)
- 📱 Enhanced mobile experience
- 🎯 Interactive elements
- 📊 Charts and analytics
- 🤖 AI integration components

## Troubleshooting

If you still see errors after installation:

1. **Clear node_modules and reinstall:**
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Check for specific missing packages:**
```bash
npm list lucide-react
npm list @radix-ui/react-slot
npm list class-variance-authority
```

3. **Install missing packages manually:**
```bash
npm install lucide-react @radix-ui/react-slot class-variance-authority clsx tailwind-merge next-themes
```

## Environment Setup

Don't forget to set up your environment variables:

1. Copy the example:
```bash
cp ENV_EXAMPLE.md .env.local
```

2. Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Next Steps

1. Install dependencies
2. Set up Supabase project
3. Configure environment variables
4. Run database migrations
5. Start building the full features!

The simplified version gives you a working foundation while we resolve the dependency issues.
