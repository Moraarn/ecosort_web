# EcoSort AI USSD Setup Guide

## Overview

This guide covers setting up the EcoSort AI USSD service with Africa's Talking for production deployment.

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Africa's Talking│───▶│  USSD Callback   │───▶│  Menu Service   │
│   USSD Gateway  │    │   /api/ussd      │    │   (Flows)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ Notification     │    │  AI Integration │
                       │ /api/ussd/notify │    │  (Classifier)   │
                       └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Analytics      │    │  Multi-language │
                       │   Service        │    │   Support       │
                       └──────────────────┘    └─────────────────┘
```

## Prerequisites

1. **Africa's Talking Account**
   - Sign up at [talking.com](https://africastalking.com)
   - Get your API key
   - Request USSD service activation

2. **Development Environment**
   - Node.js 18+
   - Next.js project (already set up)
   - ngrok for local testing

## Setup Steps

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# Africa's Talking Configuration
AFRICASTALKING_API_KEY=your_api_key_here
AFRICASTALKING_USERNAME=your_username
AFRICASTALKING_USSD_CODE=384303

# Application URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
USSD_CALLBACK_URL=https://yourdomain.com/api/ussd
USSD_NOTIFY_URL=https://yourdomain.com/api/ussd/notify

# Database (for analytics)
DATABASE_URL=your_database_url
```

### 2. Local Development Setup

#### Install ngrok for tunneling:

```bash
npm install -g ngrok
```

#### Start your Next.js app:

```bash
npm run dev
```

#### Start ngrok tunnel:

```bash
ngrok http 3000
```

You'll get a URL like: `https://abcd1234.ngrok.io`

### 3. Africa's Talking Configuration

1. **Login to Africa's Talking Dashboard**
2. **Go to USSD → Service Codes**
3. **Create new USSD service:**
   - Service Code: `384303` (sandbox) or your custom code
   - Callback URL: `https://abcd1234.ngrok.io/api/ussd`
   - Notification URL: `https://abcd1234.ngrok.io/api/ussd/notify`

### 4. Testing the USSD Service

#### Basic Test Flow:

1. **Dial the USSD code:** `*384303#`
2. **Welcome menu appears:**
   ```
   Welcome to EcoSort AI Recycling Service
   Main Menu:
   1. Waste Disposal Guide
   2. Recycling Points
   3. Collection Schedule
   4. Environmental Tips
   5. My Points
   99. Change Language
   ```

3. **Test waste classification:**
   - Press `1` (Waste Disposal Guide)
   - Press `1` (Plastic)
   - Should return plastic disposal instructions

#### API Testing:

```bash
# Test USSD callback
curl -X POST http://localhost:3000/api/ussd \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=test123&serviceCode=384303&phoneNumber=+254712345678&text="

# Test classification endpoint
curl -X POST http://localhost:3000/api/ussd/classify \
  -H "Content-Type: application/json" \
  -d '{"description": "plastic bottle", "phoneNumber": "+254712345678", "language": "en"}'
```

## Production Deployment

### 1. Domain Setup

- Get a custom domain
- Configure SSL certificate
- Ensure HTTPS is working

### 2. Update Africa's Talking URLs

```env
USSD_CALLBACK_URL=https://yourdomain.com/api/ussd
USSD_NOTIFY_URL=https://yourdomain.com/api/ussd/notify
```

### 3. Database Setup

Create tables for USSD analytics:

```sql
-- USSD Sessions
CREATE TABLE ussd_sessions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  service_code VARCHAR(50),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration INTEGER,
  total_interactions INTEGER DEFAULT 0,
  path TEXT[],
  completion_status VARCHAR(20) DEFAULT 'active',
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW()
);

-- USSD Interactions
CREATE TABLE ussd_interactions (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50) NOT NULL,
  user_input TEXT NOT NULL,
  system_response TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_ussd_sessions_phone ON ussd_sessions(phone_number);
CREATE INDEX idx_ussd_sessions_start_time ON ussd_sessions(start_time);
CREATE INDEX idx_ussd_interactions_session ON ussd_interactions(session_id);
```

### 4. Monitoring

Set up monitoring for:

- **Response times** (should be < 3 seconds)
- **Error rates** (should be < 1%)
- **Session completion rates**
- **Most used menu paths**

## USSD Menu Structure

```
Main Menu (Level 0)
├── 1. Waste Disposal Guide
│   ├── 1. Plastic → END: Instructions
│   ├── 2. Glass → END: Instructions
│   ├── 3. Metal → END: Instructions
│   ├── 4. Organic → END: Instructions
│   ├── 5. Paper → END: Instructions
│   ├── 6. E-waste → END: Instructions
│   └── 0. Back → Main Menu
├── 2. Recycling Points
│   ├── 1. Find nearest center → END: Location info
│   ├── 2. Points balance → END: User points
│   ├── 3. Redeem rewards → END: Instructions
│   └── 0. Back → Main Menu
├── 3. Collection Schedule
│   ├── 1. Residential areas → END: Schedule
│   ├── 2. Commercial areas → END: Schedule
│   ├── 3. Special collections → END: Info
│   └── 0. Back → Main Menu
├── 4. Environmental Tips
│   ├── 1. Daily tips → END: Tip
│   ├── 2. Recycling guide → END: Guide
│   ├── 3. Composting tips → END: Tips
│   ├── 4. Energy saving → END: Tips
│   └── 0. Back → Main Menu
├── 5. My Points → END: Points info
├── 99. Change Language
│   ├── 1-7. Language selection → END: Confirmation
│   └── 0. Back → Main Menu
```

## Language Support

The USSD service supports 7 languages:

1. **English (en)** - Default
2. **Swahili (sw)** - Kenya
3. **Luganda (lg)** - Uganda
4. **Kikuyu (ki)** - Kenya
5. **Luo (lu)** - Kenya
6. **Kalenjin (ka)** - Kenya
7. **Runyankole (rn)** - Uganda

Language is auto-detected based on phone number prefix:
- `+254` → Swahili
- `+256` → Luganda
- Others → English

## Performance Optimization

### 1. Response Time Targets

- **Menu navigation:** < 500ms
- **Waste classification:** < 2 seconds
- **Points lookup:** < 1 second

### 2. Caching Strategy

- Menu responses are cached in memory
- Classification results cached for 24 hours
- User points cached for 5 minutes

### 3. Database Optimization

- Use indexes for phone numbers and timestamps
- Archive old sessions monthly
- Use connection pooling

## Troubleshooting

### Common Issues

1. **"Service temporarily unavailable"**
   - Check server logs
   - Verify database connection
   - Check Africa's Talking configuration

2. **Slow responses**
   - Check database queries
   - Verify caching is working
   - Monitor server resources

3. **Session timeouts**
   - Africa's Talking timeout is 10 seconds
   - Keep responses under 3 seconds
   - Use async operations carefully

### Debug Mode

Enable debug logging:

```env
USSD_DEBUG=true
```

This will log all USSD requests and responses to console.

## Analytics

The system tracks:

- **Session metrics:** Duration, completion rate, path analysis
- **User behavior:** Most used features, language preferences
- **Performance:** Response times, error rates
- **Business metrics:** Points awarded, recycling engagement

Access analytics via:

```bash
# Get usage stats
GET /api/ussd/analytics/usage

# Get session details
GET /api/ussd/analytics/sessions/:sessionId
```

## Security Considerations

1. **Input Validation:** All user inputs are sanitized
2. **Rate Limiting:** Implement per-phone-number limits
3. **Data Privacy:** Minimal data collection, anonymize analytics
4. **Access Control:** Secure callback URLs with API keys if needed

## Next Steps

1. **Database Integration:** Connect to Supabase for persistent storage
2. **SMS Integration:** Add SMS notifications for collection reminders
3. **WhatsApp Integration:** Extend to WhatsApp for richer interactions
4. **Mobile App Integration:** Link USSD points to mobile app accounts
5. **Gamification:** Add rewards and challenges for recycling

## Support

For issues:
1. Check application logs
2. Verify Africa's Talking configuration
3. Test with ngrok for local debugging
4. Monitor response times and error rates
