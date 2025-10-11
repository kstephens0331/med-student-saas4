-- Fix existing user by creating missing profile and subscription
-- Replace the user_id with your actual user ID: 439ecdcb-dacd-455b-a648-eafdeacc3449

-- Insert user profile if it doesn't exist
INSERT INTO public.user_profiles (id, email, full_name, onboarding_completed)
VALUES (
  '439ecdcb-dacd-455b-a648-eafdeacc3449',
  'info@stephenscode.dev',
  'Kyle stephens',
  false
)
ON CONFLICT (id) DO NOTHING;

-- Insert subscription if it doesn't exist
INSERT INTO public.subscriptions (user_id, tier, status)
VALUES (
  '439ecdcb-dacd-455b-a648-eafdeacc3449',
  'free',
  'active'
)
ON CONFLICT (user_id) DO NOTHING;

-- Verify
SELECT * FROM user_profiles WHERE id = '439ecdcb-dacd-455b-a648-eafdeacc3449';
SELECT * FROM subscriptions WHERE user_id = '439ecdcb-dacd-455b-a648-eafdeacc3449';
