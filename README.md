# EcoSort AI - Smart Waste Management Platform

AI-powered waste categorization and recycling incentive platform designed for African cities. Using image recognition, QR code tracking, and gamification to encourage proper waste disposal.

## 🌍 Features

- **🤖 AI Waste Classification** - Instant waste categorization using TensorFlow.js/Replicate
- **📱 QR Code Tracking** - Scan disposal locations to confirm and earn points
- **🏆 Rewards System** - Gamified experience with points, badges, and leaderboards
- **📊 Analytics Dashboard** - Real-time insights for users and municipalities
- **📱 Mobile-First** - Optimized for low bandwidth and mobile devices
- **🔐 Secure** - Supabase authentication with role-based access control

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ecosort_web
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp ENV_EXAMPLE.md .env.local
# Edit .env.local with your Supabase credentials
```

4. **Set up Supabase**
```bash
# Install Supabase CLI
npm install -g supabase

# Apply database schema
supabase db push
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Tech Stack

- **Frontend**: Next.js 14 (App Router, TypeScript)
- **UI**: shadcn/ui + TailwindCSS
- **Backend**: Supabase (Auth, Postgres, Storage, Edge Functions)
- **AI**: TensorFlow.js / Replicate API
- **Charts**: Recharts
- **QR Code**: qr-scanner library

## 🏗️ Project Structure

```
ecosort_web/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── classify/          # AI classification
│   ├── scan/              # QR scanning
│   └── admin/             # Admin dashboard
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── waste/            # Waste classification components
│   ├── qr/               # QR scanning components
│   └── rewards/          # Rewards system components
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase client
│   ├── ai/               # AI classification
│   ├── qr/               # QR code processing
│   └── types/            # TypeScript definitions
└── public/               # Static assets
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Database
npm run db:push      # Push schema to Supabase
npm run db:reset     # Reset database
npm run db:seed      # Seed database

# Supabase
npm run supabase:start   # Start local Supabase
npm run supabase:stop    # Stop local Supabase
```

### Environment Variables

Create `.env.local` with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

# AI Model
REPLICATE_API_TOKEN=your_replicate_api_token

# Optional
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token
```

## 🤖 AI Model Setup

### Option 1: TensorFlow.js (Recommended)
- Models run in browser (no API costs)
- Uses pre-trained MobileNet
- Can be fine-tuned with waste data

### Option 2: Replicate API
- Higher accuracy models
- Requires API token and costs
- Better for production scaling

## 📱 Mobile Optimization

- **Low Bandwidth**: Compressed images and optimized assets
- **Offline Support**: Core features work offline
- **PWA Ready**: Installable as mobile app
- **Responsive**: Works on all screen sizes

## 🔒 Security

- **Authentication**: Supabase Auth with email/password
- **Row Level Security**: Database access control
- **Input Validation**: Server-side validation
- **HTTPS**: SSL certificates automatically

## 📊 Analytics & Monitoring

- **User Analytics**: Track classification accuracy and engagement
- **System Metrics**: Performance and error monitoring
- **Business Insights**: Waste patterns and participation rates

## 🌍 Africa Context

Designed specifically for African waste management challenges:

- **Low Connectivity**: Offline-first architecture
- **Mobile-First**: Optimized for smartphone usage
- **Incentive-Based**: Points system compatible with local economies
- **Scalable**: Works for informal and formal waste sectors

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

### Manual Deployment
```bash
# Build application
npm run build

# Start production server
npm start
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📈 Development Roadmap

### Week 1: Foundation
- [x] Project setup and dependencies
- [x] Database schema and authentication
- [ ] Core UI components
- [ ] Basic authentication flows

### Week 2: Core Features
- [ ] AI waste classification
- [ ] QR code scanning
- [ ] Rewards system
- [ ] User dashboard

### Week 3: Advanced Features
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] IoT simulation
- [ ] Mobile optimization

### Week 4: Testing & Launch
- [ ] Testing and QA
- [ ] Performance optimization
- [ ] Documentation
- [ ] Production deployment

See [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) for complete timeline.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 Documentation

- [System Architecture](./ECOSORT_ARCHITECTURE.md)
- [Database Schema](./DATABASE_SCHEMA.sql)
- [Folder Structure](./FOLDER_STRUCTURE.md)
- [Development Roadmap](./DEVELOPMENT_ROADMAP.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Supabase for the amazing backend-as-a-service platform
- Vercel for seamless deployment experience
- TensorFlow.js for machine learning capabilities
- The open-source community for inspiration and tools

## 📞 Support

- 📧 Email: support@ecosort.ai
- 💬 Discord: [Join our community](https://discord.gg/ecosort)
- 📱 Twitter: [@EcoSortAI](https://twitter.com/ecosortai)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/ecosort-ai/issues)

---

**EcoSort AI** - Making waste management smart, simple, and rewarding for African communities. 🌍♻️
