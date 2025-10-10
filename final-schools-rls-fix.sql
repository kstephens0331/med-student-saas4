-- FINAL FIX: Disable RLS on schools table completely
-- Schools are public data that everyone should be able to read

-- Simply disable RLS - schools don't need row-level security
ALTER TABLE IF EXISTS public.schools DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'schools';

-- Test that we can read schools
SELECT COUNT(*) as total_schools FROM public.schools;
