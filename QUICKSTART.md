# Quick Start Guide

Get your Medical Student SaaS platform up and running in 15 minutes!

## Prerequisites

- Node.js 18+ installed
- npm installed
- Supabase account (free tier works)
- Stripe account (test mode works)
- API keys for: Together.ai, Anthropic

## Step 1: Clone & Install (2 minutes)

```bash
# Navigate to project
cd medschoolstudy

# Install dependencies (already done if you're reading this)
npm install

# Copy environment file
cp .env.example .env.local
```

## Step 2: Setup Supabase (5 minutes)

### Create Project
1. Go to https://supabase.com
2. Click "New Project"
3. Note: Project URL, Anon Key, Service Role Key

### Run Database Migrations
```bash
# Initialize Supabase
supabase init

# Link to your project (get ref from project URL)
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

### Create Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Click "New Bucket"
3. Name: `study-materials`
4. Public: No (keep private)
5. Click "Create bucket"

## Step 3: Get API Keys (3 minutes)

### Together.ai (Primary LLM + Embeddings)
1. Go to https://together.ai
2. Sign up / Log in
3. API → Create API Key
4. Copy key

### Anthropic Claude (Fallback & Evaluation)
1. Go to https://console.anthropic.com
2. Get API key
3. Copy key

## Step 4: Setup Stripe (3 minutes)

### Create Products
1. Go to https://dashboard.stripe.com
2. Products → Add Product

**Individual Plan:**
- Name: Individual Plan
- Price: $20/month
- Copy Price ID

**Cohort Plan:**
- Name: Cohort Plan
- Price: $15/month
- Copy Price ID

### Webhook (do this after deployment)
For now, use a placeholder webhook secret.

## Step 5: Configure Environment (2 minutes)

Edit `.env.local`:

```env
# Supabase (from Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# LLM APIs (from Step 3)
TOGETHER_API_KEY=your_together_key
ANTHROPIC_API_KEY=your_anthropic_key

# Stripe (from Step 4)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID_INDIVIDUAL=price_xxxxx
STRIPE_PRICE_ID_COHORT=price_xxxxx

# App
NEXT_PUBLIC_URL=http://localhost:3000
```

## Step 6: Run Development Server (1 minute)

```bash
npm run dev
```

Visit http://localhost:3000

## Test the Platform

### 1. Sign Up
- Create account at `/signup`
- Fill in name, email, password

### 2. Onboarding
- Select or create medical school
- This creates 10 blocks automatically

### 3. Upload Materials
- Go to `/dashboard/upload`
- Select a block
- Upload a PDF or text file
- Click "Generate Questions" button

### 4. Study Mode
- Go to `/dashboard/study`
- Select the block
- Start answering questions
- Get immediate feedback

### 5. Feynman Mode
- Go to `/dashboard/feynman`
- Choose Text Mode
- Write explanation of a concept
- Get AI feedback

### 6. Test Payment (Optional)
- Go to `/pricing`
- Click "Subscribe Now" on Individual
- Use test card: `4242 4242 4242 4242`
- Any future date, any CVC

## Common First-Time Issues

### Issue: Supabase Auth Not Working
**Fix:**
- Check project URL ends with `.supabase.co`
- Verify anon key is correct
- Clear browser cookies

### Issue: File Upload Fails
**Fix:**
- Ensure storage bucket named `study-materials`
- Check bucket policies (see README)
- Verify file size < 50MB

### Issue: Question Generation Fails
**Fix:**
- Verify Together.ai API key
- Check API credits/limits
- Monitor console for errors

### Issue: Vector Search Error
**Fix:**
- Ensure migrations ran successfully
- Check `match_embeddings` function exists:
  ```sql
  SELECT * FROM pg_proc WHERE proname = 'match_embeddings';
  ```

## Next Steps

### For Development
1. Review code in `/app` and `/lib`
2. Customize UI in Tailwind classes
3. Add more features from Phase 2

### For Production
1. Follow `DEPLOYMENT.md` guide
2. Deploy to Vercel
3. Setup Stripe webhook
4. Test end-to-end

## Key Files to Know

- `app/(dashboard)/dashboard/page.tsx` - Main dashboard
- `app/api/questions/generate/route.ts` - Question generation
- `app/api/rag/ask/route.ts` - RAG Q&A system
- `lib/llm/factory.ts` - Multi-LLM strategy
- `supabase/migrations/` - Database schema

## Support

Stuck? Check:
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment guide
- Email: info@stephenscode.dev

## What You Built

✅ Full authentication system
✅ School & block management
✅ File upload with deduplication
✅ AI question generation (100 per file)
✅ RAG Q&A from materials
✅ Adaptive study mode
✅ Mastery tracking
✅ Feynman teaching mode
✅ Stripe payment integration
✅ Free tier with rate limiting

## MVP is Complete!

You now have a working medical education platform. Next steps:
- Phase 2: Railway workers for background jobs
- Phase 3: Voice/video Feynman mode
- Scale: Add more features based on user feedback

Happy coding! 🚀
