-- NUCLEAR OPTION: Complete reset of schools table RLS
-- This will 100% fix the schools access issue

-- Step 1: Disable RLS temporarily
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;

-- Step 2: Verify we can read schools without RLS
SELECT 'Schools in database:' as info, COUNT(*) as count FROM schools;

-- Step 3: Drop all existing policies
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN
        SELECT policyname
        FROM pg_policies
        WHERE schemaname = 'public' AND tablename = 'schools'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON schools', pol.policyname);
    END LOOP;
END $$;

-- Step 4: Re-enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Step 5: Create a single permissive policy for SELECT
-- USING (true) means everyone can read, no conditions
CREATE POLICY "schools_select_policy"
ON public.schools
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

-- Step 6: Create INSERT policy for authenticated users
CREATE POLICY "schools_insert_policy"
ON public.schools
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Step 7: Verify the policies
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual IS NOT NULL as has_using,
    with_check IS NOT NULL as has_with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'schools'
ORDER BY policyname;

-- Step 8: Test SELECT as if we were an anon user
SET ROLE anon;
SELECT 'Test as anon role:' as info, COUNT(*) FROM schools;
RESET ROLE;

-- Step 9: Test SELECT as if we were authenticated user
SET ROLE authenticated;
SELECT 'Test as authenticated role:' as info, COUNT(*) FROM schools;
RESET ROLE;

-- Step 10: Show first few schools
SELECT id, name, domain FROM schools ORDER BY name LIMIT 5;
