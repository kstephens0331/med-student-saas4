-- Grant all necessary permissions to anon and authenticated roles
-- Run this in Supabase SQL Editor

-- USER_PROFILES table
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;

-- SCHOOLS table
GRANT SELECT ON public.schools TO anon;
GRANT SELECT, INSERT ON public.schools TO authenticated;

-- SUBSCRIPTIONS table
GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO authenticated;

-- BLOCKS table
GRANT SELECT, INSERT ON public.blocks TO authenticated;

-- FILES table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.files TO authenticated;

-- QUESTIONS table
GRANT SELECT ON public.questions TO authenticated;

-- STUDY_SESSIONS table
GRANT SELECT, INSERT, UPDATE ON public.study_sessions TO authenticated;

-- STUDENT_QUESTION_ATTEMPTS table
GRANT SELECT, INSERT ON public.student_question_attempts TO authenticated;

-- STUDENT_MASTERY table
GRANT SELECT, INSERT, UPDATE ON public.student_mastery TO authenticated;

-- TEST_GRADES table
GRANT SELECT, INSERT ON public.test_grades TO authenticated;

-- FEYNMAN_SESSIONS table
GRANT SELECT, INSERT, UPDATE ON public.feynman_sessions TO authenticated;

-- REVIEW_PROGRESS table
GRANT SELECT, INSERT, UPDATE ON public.review_progress TO authenticated;

-- DAILY_USAGE table
GRANT SELECT, INSERT, UPDATE ON public.daily_usage TO authenticated;

-- COHORTS table
GRANT SELECT ON public.cohorts TO authenticated;

-- COHORT_MEMBERS table
GRANT SELECT, INSERT ON public.cohort_members TO authenticated;

-- FILE_EMBEDDINGS table
GRANT SELECT ON public.file_embeddings TO authenticated;

-- AUDIT_LOGS table
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;

-- Verify permissions were granted
SELECT
    table_name,
    grantee,
    string_agg(privilege_type, ', ' ORDER BY privilege_type) as privileges
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated')
GROUP BY table_name, grantee
ORDER BY table_name, grantee;
