# Deployment Guide

## Step-by-Step Deployment Instructions

### 1. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: Medical Student SaaS MVP"
```

### 2. Create GitHub Repository

```bash
# Using GitHub CLI
gh repo create med-student-saas --public --source=. --push

# Or manually:
# 1. Go to github.com/new
# 2. Create repository
# 3. Push code:
git remote add origin https://github.com/yourusername/med-student-saas.git
git branch -M main
git push -u origin main
```

### 3. Setup Supabase Project

#### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down:
   - Project URL
   - Anon/Public key
   - Service role key

#### Run Migrations
```bash
# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push database schema
supabase db push
```

#### Create Storage Bucket
1. Go to Storage in Supabase Dashboard
2. Create bucket: `study-materials`
3. Set policies:
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'study-materials');

   -- Allow users to read their school's files
   CREATE POLICY "Users can read school files"
   ON storage.objects FOR SELECT
   TO authenticated
   USING (bucket_id = 'study-materials');
   ```

### 4. Setup Stripe

#### Create Products
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Go to Products → Add Product

**Individual Plan:**
- Name: Individual Plan
- Price: $20/month
- Recurring: Monthly
- Copy Price ID: `price_xxxxx`

**Cohort Plan:**
- Name: Cohort Plan
- Price: $15/month
- Recurring: Monthly
- Copy Price ID: `price_xxxxx`

#### Setup Webhook
1. Go to Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy webhook signing secret

### 5. Get LLM API Keys

#### Together.ai
1. Go to [together.ai](https://together.ai)
2. Sign up / Log in
3. API Keys → Create new key
4. Copy API key

#### Anthropic Claude
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Get API key
3. Copy API key

### 6. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add TOGETHER_API_KEY production
vercel env add ANTHROPIC_API_KEY production
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
vercel env add STRIPE_SECRET_KEY production
vercel env add STRIPE_WEBHOOK_SECRET production
vercel env add STRIPE_PRICE_ID_INDIVIDUAL production
vercel env add STRIPE_PRICE_ID_COHORT production
vercel env add NEXT_PUBLIC_URL production

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import Git Repository
3. Select your GitHub repo
4. Add environment variables (all from above)
5. Deploy

### 7. Update Stripe Webhook URL

After Vercel deployment:
1. Get your production URL: `https://your-app.vercel.app`
2. Go back to Stripe Dashboard → Webhooks
3. Update webhook URL to: `https://your-app.vercel.app/api/payments/webhook`

### 8. Test the Deployment

1. Visit your production URL
2. Sign up for an account
3. Complete onboarding (select/create school)
4. Test file upload
5. Test question generation
6. Test RAG Q&A
7. Test study mode
8. Test payment flow (use Stripe test cards)

### 9. Setup Automatic Deployments

Vercel automatically deploys on every push to `main` branch.

To deploy:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### 10. Railway Setup (Phase 2 - Background Workers)

When ready for background workers:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add Redis service
railway add redis

# Deploy workers
railway up

# Set environment variables in Railway dashboard
```

## Environment Variables Checklist

### Supabase (Required)
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

### LLM APIs (Required)
- ✅ `TOGETHER_API_KEY`
- ✅ `ANTHROPIC_API_KEY`

### Stripe (Required)
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- ✅ `STRIPE_SECRET_KEY`
- ✅ `STRIPE_WEBHOOK_SECRET`
- ✅ `STRIPE_PRICE_ID_INDIVIDUAL`
- ✅ `STRIPE_PRICE_ID_COHORT`

### App (Required)
- ✅ `NEXT_PUBLIC_URL` (production URL)

### Phase 2 (Optional for now)
- ⏳ `ASSEMBLYAI_API_KEY`
- ⏳ `REDIS_URL`

## Monitoring & Maintenance

### Check Logs
```bash
# Vercel logs
vercel logs

# Or in Vercel Dashboard → Deployments → View Logs
```

### Database Monitoring
- Supabase Dashboard → Database → Monitor queries
- Check RLS policies are working
- Monitor storage usage

### Cost Monitoring
- Together.ai Dashboard → Usage
- Anthropic Console → Usage
- Stripe Dashboard → Billing
- Vercel Dashboard → Usage

## Troubleshooting

### Common Issues

**1. Supabase Auth Not Working**
- Check RLS policies are enabled
- Verify environment variables
- Check Supabase URL format (should end with `.supabase.co`)

**2. File Upload Fails**
- Check storage bucket permissions
- Verify storage bucket name is `study-materials`
- Check file size limits (50MB default)

**3. Question Generation Fails**
- Verify LLM API keys are correct
- Check API rate limits
- Monitor Together.ai/Claude usage

**4. Payment Flow Issues**
- Verify Stripe webhook is receiving events
- Check webhook signature validation
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/payments/webhook`

**5. Vector Search Not Working**
- Ensure pgvector extension is enabled
- Check embeddings are being generated
- Verify `match_embeddings` function exists

## Production Checklist

Before going live:
- ✅ All environment variables set
- ✅ Database migrations applied
- ✅ Storage bucket created with RLS
- ✅ Stripe products created
- ✅ Stripe webhook configured
- ✅ All LLM API keys tested
- ✅ Test signup/login flow
- ✅ Test file upload
- ✅ Test question generation
- ✅ Test RAG Q&A
- ✅ Test payment flow
- ✅ SSL certificate active (automatic with Vercel)
- ✅ Custom domain configured (optional)

## Scaling Considerations

### When to Scale

**Database:**
- Upgrade Supabase plan when:
  - Storage > 500MB
  - Database size > 500MB
  - Need more concurrent connections

**LLM Usage:**
- Monitor Together.ai costs
- Switch to Claude only if Together.ai has issues
- Consider batch processing for question generation

**Vercel:**
- Upgrade if:
  - Bandwidth > 100GB/month
  - Need more serverless function executions
  - Need faster build times

**Railway (Phase 2):**
- Scale workers based on job queue length
- Add Redis persistence for reliability
- Monitor RAM/CPU usage

## Next Deployment: Phase 2

When ready for background workers:
1. Setup Railway project
2. Add Redis service
3. Deploy worker services
4. Update Next.js to queue jobs
5. Test end-to-end flow
6. Monitor worker performance

## Support

Need help? Email: info@stephenscode.dev
