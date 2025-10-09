# Medical Student SaaS Platform

A comprehensive medical education platform for USMLE exam preparation with AI-powered question generation, RAG Q&A, and mastery tracking.

## Features

### Core Functionality (Phase 1 - MVP)
- ✅ **Authentication**: Supabase Auth with email/password
- ✅ **School Onboarding**: Select or create medical school with 10 blocks
- ✅ **File Upload**: Upload PDFs, lectures, notes with SHA-256 deduplication
- ✅ **Question Generation**: AI generates 100+ USMLE-style questions per file
- ✅ **RAG Q&A System**: Ask questions, get answers from YOUR materials only
- ✅ **Study Mode**: Adaptive questioning prioritizing weak topics
- ✅ **Mastery Tracking**: Track progress by topic (needs work <80%, understands 80-95%, masters >95%)
- ✅ **Feynman Text Mode**: Write explanations, get AI feedback (4 criteria, 0-100 score)
- ✅ **Stripe Payments**: Individual ($20/mo) and Cohort ($15/student) plans
- ✅ **Free Tier**: 5 RAG questions/day limit

### Coming Soon (Phase 2 & 3)
- 🔄 Railway Background Workers (transcription, full question generation)
- 🔄 Photo Question Upload (Claude Vision or GPT-4 Vision)
- 🔄 Feynman Voice/Video Mode
- 🔄 Blocks 9-10 Review Mode (15,000-20,000 questions)
- 🔄 Admin Dashboard & Analytics

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Vector Search**: pgvector extension
- **LLM Strategy**:
  - Together.ai (primary - Llama 3.1 70B + m2-bert embeddings) - cost-efficient
  - Anthropic Claude Sonnet 4 (fallback & evaluation)
- **Payments**: Stripe
- **Hosting**: Vercel (Next.js), Railway (background workers)

## Project Structure

```
medschoolstudy/
├── app/
│   ├── (auth)/              # Auth pages (login, signup, onboarding)
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/       # Main dashboard
│   │   ├── blocks/          # Block management
│   │   ├── upload/          # File upload
│   │   ├── study/           # Study mode
│   │   ├── mastery/         # Mastery tracking
│   │   ├── feynman/         # Feynman teaching mode
│   │   └── settings/        # User settings
│   ├── api/                 # API routes
│   │   ├── files/           # File upload/management
│   │   ├── questions/       # Question generation & retrieval
│   │   ├── rag/             # RAG Q&A
│   │   ├── study/           # Study sessions
│   │   ├── feynman/         # Feynman evaluation
│   │   └── payments/        # Stripe integration
│   ├── pricing/             # Pricing page
│   └── success/             # Payment success page
├── lib/
│   ├── supabase/            # Supabase clients
│   ├── llm/                 # LLM factory & utilities
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── supabase/
│   └── migrations/          # Database migrations
└── middleware.ts            # Route protection
```

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- npm or pnpm
- Supabase account
- Stripe account
- API keys for: Together.ai, Anthropic

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# LLM APIs
TOGETHER_API_KEY=your_together_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Transcription (Phase 2)
ASSEMBLYAI_API_KEY=your_assemblyai_api_key

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID_INDIVIDUAL=price_xxx
STRIPE_PRICE_ID_COHORT=price_xxx

# Queue (Phase 2 - Railway)
REDIS_URL=redis://localhost:6379

# App
NEXT_PUBLIC_URL=http://localhost:3000
```

### 4. Setup Supabase

#### Initialize Supabase
```bash
supabase init
```

#### Link to your project
```bash
supabase link --project-ref your-project-ref
```

#### Run migrations
```bash
supabase db push
```

#### Create Storage Bucket
In Supabase Dashboard:
1. Go to Storage
2. Create new bucket: `study-materials`
3. Set to public or private (recommended: private with RLS)

### 5. Setup Stripe

#### Create Products
1. Go to Stripe Dashboard → Products
2. Create two products:
   - **Individual**: $20/month recurring
   - **Cohort**: $15/month recurring
3. Copy the Price IDs to `.env.local`

#### Setup Webhook
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy webhook secret to `.env.local`

### 6. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Deployment

### Deploy to Vercel

#### Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# ... add all other env vars

# Deploy
vercel --prod
```

#### Using GitHub
1. Push code to GitHub
2. Import repo in Vercel
3. Add environment variables
4. Deploy

### Setup Railway (Phase 2 - Background Workers)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy workers
railway up
```

## Database Schema

### Core Tables
- `schools` - Medical schools
- `user_profiles` - User profiles (extends Supabase auth)
- `subscriptions` - Payment tiers
- `blocks` - 10 blocks per school
- `files` - Uploaded materials with deduplication
- `file_embeddings` - Vector embeddings for RAG
- `questions` - Generated USMLE questions
- `study_sessions` - Practice sessions
- `student_question_attempts` - Answer history
- `student_mastery` - Mastery tracking
- `feynman_sessions` - Teaching mode sessions
- `daily_usage` - Rate limiting for free tier

### Key Features
- Row Level Security (RLS) on all tables
- File deduplication by SHA-256 hash
- Vector similarity search with pgvector
- Automatic timestamp updates

## API Endpoints

### Files
- `POST /api/files/upload` - Upload file with deduplication

### Questions
- `POST /api/questions/generate` - Generate questions from file
- `POST /api/questions/random` - Get random questions for study

### RAG
- `POST /api/rag/ask` - Ask question, get answer from materials

### Study
- `POST /api/study/sessions` - Create study session
- `POST /api/study/submit-answer` - Submit answer, get feedback

### Feynman
- `POST /api/feynman/text` - Evaluate text explanation

### Payments
- `POST /api/payments/create-checkout` - Create Stripe checkout
- `POST /api/payments/webhook` - Handle Stripe webhooks

## Multi-LLM Strategy

### Cost Optimization
- **Together.ai** (Primary): $0.88/1M tokens - bulk question generation, $0.01/1M tokens for embeddings
- **Claude Sonnet** (Fallback): $3/1M tokens - complex reasoning, evaluation

### Usage by Feature
- Question Generation: Together.ai → Claude fallback
- RAG Answers: Together.ai → Claude fallback
- Feynman Evaluation: Claude only (best reasoning)
- Embeddings: Together.ai m2-bert-80M-8k-retrieval
- Image OCR: Phase 2 (will use Claude Vision or GPT-4 Vision)

## Pricing Tiers

### Free
- 5 RAG questions/day
- Limited features
- Perfect for trial

### Individual - $20/month
- Unlimited RAG questions
- 1,200-1,400 questions/block
- All features
- Feynman mode
- Mastery tracking

### Cohort - $15/student/month
- Everything in Individual
- Shared materials across school
- Group pricing
- Admin dashboard
- Email: info@stephenscode.dev

## Critical Implementation Notes

### File Deduplication
- SHA-256 hash calculated for each file
- Duplicate files (same school + block + hash) are detected
- Newer version kept automatically

### Question Generation
- **Target**: 1,200-1,400 questions per block (blocks 1-8)
- Textbook PDFs: ~350 questions
- PowerPoints: ~125 questions
- Lectures: ~225 questions
- Notes: ~75-100 questions
- **MVP**: 100 questions for testing

### RAG Q&A
- Vector similarity search with pgvector
- Top 10 most similar chunks
- Answer ONLY from provided context
- Free tier: 5 questions/day limit

### Mastery Tracking
- Per topic accuracy percentage
- <80% = needs_more_work (orange)
- 80-95% = understands (blue)
- ≥95% = masters (green)
- Updates after each question attempt

### Adaptive Questioning
- Prioritizes weak topics (needs_more_work)
- Avoids recently answered questions (last 7 days)
- Balanced difficulty distribution

## Next Steps (Phase 2)

1. **Railway Workers**
   - Transcription worker (AssemblyAI)
   - Full question generation (1,200-1,400 per block)
   - Embedding worker

2. **Photo Question Upload**
   - Claude Vision or GPT-4 Vision for text extraction
   - Normal RAG flow

3. **Feynman Voice Mode**
   - Real-time transcription
   - AI probing questions every 2-3 minutes
   - Comprehensive evaluation

4. **Blocks 9-10 Review**
   - Pull from ALL blocks (1-8)
   - 15,000-20,000 total questions
   - Adaptive until >95% mastery

## Support

For issues or questions:
- Email: info@stephenscode.dev
- GitHub Issues: [Create Issue](https://github.com/yourusername/med-student-saas/issues)

## License

MIT License - See LICENSE file for details
