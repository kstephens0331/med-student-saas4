-- COMPLETE FIX FOR SCHOOLS TABLE ACCESS
-- This will ensure the schools table is readable by everyone

-- Step 1: Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'schools' AND schemaname = 'public';

-- Step 2: Drop ALL policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT policyname
        FROM pg_policies
        WHERE tablename = 'schools' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON schools';
    END LOOP;
END $$;

-- Step 3: Ensure RLS is enabled
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Step 4: Create a permissive policy for SELECT that allows everyone
CREATE POLICY "allow_all_select_schools"
ON schools
FOR SELECT
USING (true);

-- Step 5: Create policy for INSERT (authenticated users only)
CREATE POLICY "allow_authenticated_insert_schools"
ON schools
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Step 6: Verify policies were created
SELECT
    policyname,
    cmd,
    qual::text as using_expression,
    with_check::text as with_check_expression
FROM pg_policies
WHERE tablename = 'schools' AND schemaname = 'public';

-- Step 7: Test that we can read schools
SELECT COUNT(*) as total_schools FROM schools;
