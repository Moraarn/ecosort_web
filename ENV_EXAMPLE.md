# Environment Variables Template
# Copy this to .env.local and fill in your values

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Model Configuration
# Option 1: Replicate API
REPLICATE_API_TOKEN=your_replicate_api_token
REPLICATE_MODEL=replicate_model_id

# Option 2: TensorFlow.js (no API key needed)
# AI_MODEL_PATH=/models/waste-classification

# QR Code Configuration
QR_CODE_SECRET=your_qr_code_secret_key

# Mapbox (optional)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Development
NODE_ENV=development
