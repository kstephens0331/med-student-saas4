-- Check current policies on schools table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'schools';

-- Test if we can select schools (this should work)
SELECT id, name FROM schools LIMIT 5;
