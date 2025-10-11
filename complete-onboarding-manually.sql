-- Manually complete onboarding for the user
-- Replace user_id and school_id as needed

-- First, check current state
SELECT
    id,
    email,
    full_name,
    school_id,
    onboarding_completed
FROM user_profiles
WHERE id = '439ecdcb-dacd-455b-a648-eafdeacc3449';

-- Get the IUHS school ID
SELECT id, name FROM schools WHERE name LIKE '%International University%';

-- Update user profile to complete onboarding with IUHS
-- Replace the school_id below with the actual IUHS id from above query
UPDATE user_profiles
SET
    school_id = (SELECT id FROM schools WHERE name = 'International University of the Health Sciences'),
    onboarding_completed = true
WHERE id = '439ecdcb-dacd-455b-a648-eafdeacc3449';

-- Verify the update
SELECT
    id,
    email,
    school_id,
    onboarding_completed
FROM user_profiles
WHERE id = '439ecdcb-dacd-455b-a648-eafdeacc3449';
