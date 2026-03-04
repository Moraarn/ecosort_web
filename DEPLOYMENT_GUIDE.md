# EcoSort AI - Deployment Guide

## Overview
This guide covers deploying EcoSort AI to production using Vercel for the frontend and Supabase for the backend services.

## Prerequisites
- Node.js 18+ installed
- Git repository set up
- Vercel account
- Supabase account
- Domain name (optional)

## Environment Setup

### 1. Clone and Install Dependencies
```bash
git clone <your-repo-url>
cd ecosort_web
npm install
```

### 2. Environment Variables
Create `.env.local` file:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Model Configuration
REPLICATE_API_TOKEN=your_replicate_api_token

# Optional: Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token

# Development
NODE_ENV=production
```

## Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Choose a region close to your target users
4. Wait for project to be ready

### 2. Database Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Apply database schema
supabase db push
```

### 3. Authentication Configuration
In Supabase Dashboard → Authentication → Settings:
- Enable email/password authentication
- Set site URL to your Vercel domain
- Configure redirect URLs
- Enable email confirmations (optional)

### 4. Storage Setup
Create storage buckets:
```sql
-- Create storage for waste images
INSERT INTO storage.buckets (id, name, public)
VALUES ('waste-images', 'waste-images', true);

-- Create storage for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Set up RLS policies for storage
CREATE POLICY "Users can upload waste images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'waste-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view own waste images" ON storage.objects
FOR SELECT USING (bucket_id = 'waste-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Vercel Deployment

### 1. Connect to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link
```

### 2. Configure Vercel
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  },
  "build": {
    "env": {
      "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key",
      "REPLICATE_API_TOKEN": "@replicate-token"
    }
  }
}
```

### 3. Deploy to Vercel
```bash
# Deploy to production
vercel --prod

# Or deploy preview
vercel
```

### 4. Environment Variables in Vercel
In Vercel Dashboard → Settings → Environment Variables:
- Add all environment variables from `.env.local`
- Mark sensitive variables as "secret"
- Configure different values for preview/production

## AI Model Setup

### Option 1: TensorFlow.js (Recommended for Start)
1. Models run in browser - no API costs
2. Use pre-trained MobileNet model
3. Fine-tune with waste dataset

### Option 2: Replicate API (Higher Accuracy)
1. Sign up at [replicate.com](https://replicate.com)
2. Get API token
3. Choose waste classification model
4. Configure in environment variables

### Option 3: Custom Model
1. Train model with TensorFlow
2. Deploy to cloud service
3. Create API endpoint
4. Integrate with application

## Domain Configuration

### 1. Custom Domain
In Vercel Dashboard → Domains:
1. Add your custom domain
2. Configure DNS records
3. Wait for SSL certificate
4. Update Supabase site URL

### 2. SSL Certificate
- Vercel provides automatic SSL
- Supabase also provides SSL
- Ensure all URLs use HTTPS

## Performance Optimization

### 1. Image Optimization
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
}
```

### 2. Caching
- Enable Vercel Edge Caching
- Configure Supabase caching
- Use CDN for static assets

### 3. Bundle Optimization
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
```

## Monitoring & Analytics

### 1. Vercel Analytics
Enable in Vercel Dashboard → Analytics
- Page views
- Web Vitals
- Error tracking

### 2. Supabase Monitoring
- Database performance
- API usage
- Storage metrics

### 3. Custom Monitoring
```javascript
// lib/monitoring.ts
export const trackEvent = (event: string, data: any) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
  }
}
```

## Security Configuration

### 1. Environment Variables
- Never commit secrets to Git
- Use Vercel secrets for sensitive data
- Rotate keys regularly

### 2. CORS Configuration
```sql
-- Enable CORS for your domain
ALTER ROLE postgres SET pgaudit.log = 'all';
```

### 3. Rate Limiting
```javascript
// middleware.ts
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
})
```

## Backup & Recovery

### 1. Database Backups
- Enable daily backups in Supabase
- Test restore procedures
- Export data regularly

### 2. Code Backups
- Git version control
- Tag releases
- Maintain deployment history

### 3. Disaster Recovery
- Document recovery procedures
- Test backup restoration
- Maintain contact information

## Testing in Production

### 1. Staging Environment
```bash
# Deploy to staging
vercel --scope staging
```

### 2. Feature Flags
```javascript
// lib/flags.ts
export const FEATURE_AI_CLASSIFICATION = process.env.ENABLE_AI === 'true'
```

### 3. A/B Testing
- Test new features with subset of users
- Monitor performance metrics
- Roll back if issues occur

## Maintenance

### 1. Regular Updates
- Update dependencies monthly
- Review security advisories
- Test updates in staging

### 2. Performance Monitoring
- Monitor page load times
- Check error rates
- Optimize slow queries

### 3. User Feedback
- Collect user feedback
- Monitor support tickets
- Iterate based on usage

## Scaling Considerations

### 1. Database Scaling
- Monitor query performance
- Add read replicas if needed
- Optimize indexes

### 2. Frontend Scaling
- Vercel auto-scales automatically
- Monitor build times
- Optimize bundle size

### 3. AI Model Scaling
- Monitor API usage
- Implement caching
- Consider model optimization

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache
rm -rf .next
npm run build

# Check environment variables
vercel env ls
```

#### Database Connection
```bash
# Test connection
supabase status

# Check logs
supabase logs
```

#### Authentication Issues
- Check redirect URLs in Supabase
- Verify environment variables
- Clear browser cookies

### Debug Commands
```bash
# Check Vercel logs
vercel logs

# Check Supabase logs
supabase functions list

# Test API endpoints
curl -X POST https://your-app.vercel.app/api/classify
```

## Post-Launch Checklist

### Immediate (Day 1)
- [ ] Verify all pages load correctly
- [ ] Test authentication flows
- [ ] Check AI classification works
- [ ] Test QR code scanning
- [ ] Verify mobile responsiveness

### Week 1
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Review user feedback
- [ ] Test backup procedures
- [ ] Verify security measures

### Month 1
- [ ] Analyze user behavior
- [ ] Optimize based on metrics
- [ ] Plan feature improvements
- [ ] Review costs and usage
- [ ] Update documentation

## Support

### Documentation
- Keep this guide updated
- Document any custom configurations
- Maintain API documentation

### Community
- Join Supabase Discord
- Participate in Vercel community
- Contribute to open source projects

### Professional Support
- Supabase Pro Support
- Vercel Enterprise Support
- Third-party monitoring services

This deployment guide provides a comprehensive approach to launching EcoSort AI in production while maintaining security, performance, and reliability standards.
