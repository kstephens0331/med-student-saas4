# Setup Checklist

Use this checklist to ensure you've completed all setup steps.

## ✅ Phase 1: Project Setup

- [x] Clone/download project
- [x] Install dependencies (`npm install`)
- [x] Verify all critical files exist
- [ ] Create `.env.local` from `.env.example`
- [ ] Run verification script (`node verify-setup.js`)

## ✅ Phase 2: Supabase Configuration

### Create Project
- [ ] Sign up at https://supabase.com
- [ ] Create new project
- [ ] Note Project URL: `https://xxxxx.supabase.co`
- [ ] Note Anon/Public Key
- [ ] Note Service Role Key

### Database Setup
- [ ] Run `supabase init`
- [ ] Run `supabase link --project-ref YOUR_REF`
- [ ] Run `supabase db push`
- [ ] Verify tables created (17 tables)
- [ ] Verify `match_embeddings` function exists

### Storage Setup
- [ ] Create bucket: `study-materials`
- [ ] Set bucket to private
- [ ] Configure RLS policies for storage

### Add to .env.local
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

## ✅ Phase 3: LLM API Keys

### Together.ai (Primary)
- [ ] Sign up at https://together.ai
- [ ] Create API key
- [ ] Add to .env.local: `TOGETHER_API_KEY`

### Anthropic Claude (Fallback)
- [ ] Sign up at https://console.anthropic.com
- [ ] Get API key
- [ ] Add to .env.local: `ANTHROPIC_API_KEY`

### Google AI (Vision)
- [ ] Get API key at https://ai.google.dev
- [ ] Add to .env.local: `GOOGLE_AI_API_KEY`

### OpenAI (Embeddings)
- [ ] Sign up at https://platform.openai.com
- [ ] Create API key
- [ ] Add to .env.local: `OPENAI_API_KEY`

## ✅ Phase 4: Stripe Configuration

### Create Account
- [ ] Sign up at https://dashboard.stripe.com
- [ ] Switch to Test Mode

### Create Products
- [ ] Create Individual Plan ($20/month)
- [ ] Copy Price ID
- [ ] Create Cohort Plan ($15/month)
- [ ] Copy Price ID

### Get Keys
- [ ] Get Publishable Key (pk_test_...)
- [ ] Get Secret Key (sk_test_...)
- [ ] Get Webhook Secret (whsec_...) *

\* For local testing, use any value. Update after deployment.

### Add to .env.local
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_PRICE_ID_INDIVIDUAL`
- [ ] `STRIPE_PRICE_ID_COHORT`

## ✅ Phase 5: App Configuration

### Set App URL
- [ ] Local: `NEXT_PUBLIC_URL=http://localhost:3000`
- [ ] Production: Update after Vercel deployment

### Optional (Phase 2)
- [ ] `ASSEMBLYAI_API_KEY` (transcription)
- [ ] `REDIS_URL` (background workers)

## ✅ Phase 6: Verification

### Run Checks
- [ ] Run `node verify-setup.js`
- [ ] All environment variables show ✅
- [ ] All critical files show ✅

### Test Locally
- [ ] Run `npm run dev`
- [ ] Visit http://localhost:3000
- [ ] Home page loads
- [ ] Sign up page works
- [ ] Can create account

## ✅ Phase 7: Feature Testing

### Authentication
- [ ] Sign up with email/password
- [ ] Verify email received (check Supabase dashboard)
- [ ] Log out
- [ ] Log back in

### Onboarding
- [ ] Select existing school OR
- [ ] Create new school
- [ ] Verify 10 blocks created
- [ ] Redirected to dashboard

### File Upload
- [ ] Go to /dashboard/upload
- [ ] Select a block
- [ ] Upload a PDF or text file
- [ ] Check file appears in block detail
- [ ] Verify SHA-256 deduplication works

### Question Generation
- [ ] Click "Generate Questions" on uploaded file
- [ ] Wait for completion
- [ ] Verify questions appear in database
- [ ] Check question format (A-E answers)

### Study Mode
- [ ] Go to /dashboard/study
- [ ] Select block with questions
- [ ] Start session
- [ ] Answer questions
- [ ] Verify feedback appears
- [ ] Check mastery updates

### RAG Q&A (if paid tier)
- [ ] Go to dashboard
- [ ] Ask question about uploaded material
- [ ] Verify answer uses only uploaded context
- [ ] Check source citations

### Feynman Mode
- [ ] Go to /dashboard/feynman
- [ ] Select Text Mode
- [ ] Write explanation (500+ chars)
- [ ] Submit for evaluation
- [ ] Verify 4-part scoring
- [ ] Download report

### Payments
- [ ] Go to /pricing
- [ ] Click Individual plan
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Complete checkout
- [ ] Verify redirect to /success
- [ ] Check subscription updated in dashboard

## ✅ Phase 8: Production Deployment

### GitHub Setup
- [ ] Run `git init`
- [ ] Run `git add .`
- [ ] Run `git commit -m "Initial commit"`
- [ ] Create GitHub repo
- [ ] Push code to GitHub

### Vercel Deployment
- [ ] Connect GitHub repo to Vercel
- [ ] Add all environment variables
- [ ] Deploy to production
- [ ] Verify deployment successful
- [ ] Get production URL

### Post-Deployment
- [ ] Update Stripe webhook URL
- [ ] Update `NEXT_PUBLIC_URL` in Vercel
- [ ] Redeploy
- [ ] Test production site end-to-end

## ✅ Phase 9: Production Testing

### Critical Paths
- [ ] Sign up flow works
- [ ] Email verification works
- [ ] Onboarding creates blocks
- [ ] File upload succeeds
- [ ] Question generation works
- [ ] Study mode functional
- [ ] Payment flow completes
- [ ] Webhook updates subscription

### Performance
- [ ] Page load times < 3s
- [ ] API responses < 2s
- [ ] Question generation < 30s
- [ ] No console errors

### Security
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] RLS policies working
- [ ] No exposed API keys
- [ ] Webhook signature validation

## ✅ Phase 10: Monitoring

### Setup Monitoring
- [ ] Check Vercel Analytics
- [ ] Monitor Supabase usage
- [ ] Track LLM API costs
- [ ] Monitor Stripe dashboard

### Set Alerts
- [ ] Vercel deployment failures
- [ ] Supabase quota warnings
- [ ] Stripe payment failures
- [ ] Error tracking (optional: Sentry)

## 🎉 Launch Ready!

When all items are checked:
- ✅ MVP is complete
- ✅ Production deployment successful
- ✅ All features tested
- ✅ Monitoring in place
- ✅ Ready for users!

## 📚 Reference Documentation

- **QUICKSTART.md** - Fast setup guide (15 min)
- **README.md** - Complete documentation
- **DEPLOYMENT.md** - Deployment guide
- **PROJECT_SUMMARY.md** - Project overview

## 🆘 Troubleshooting

### If Something Doesn't Work

1. **Check Environment Variables**
   - Run `node verify-setup.js`
   - Ensure all values are set (not "your_xxx")

2. **Check Database**
   - Verify migrations ran: `supabase db push`
   - Check tables exist in Supabase dashboard
   - Verify RLS policies enabled

3. **Check API Keys**
   - Test each API key individually
   - Check rate limits/quotas
   - Verify correct API format

4. **Check Logs**
   - Vercel: `vercel logs`
   - Supabase: Database logs in dashboard
   - Browser: Console errors

5. **Common Fixes**
   - Clear browser cache/cookies
   - Restart dev server
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Re-run migrations: `supabase db reset`

## 📞 Support

Stuck? Need help?
- Email: info@stephenscode.dev
- Documentation: Check all .md files
- Supabase: https://supabase.com/docs
- Next.js: https://nextjs.org/docs

---

**Current Status**: Ready for setup ✨
**Estimated Setup Time**: 30-45 minutes
**Next Step**: Create .env.local and add your API keys
