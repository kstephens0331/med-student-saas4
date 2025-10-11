-- Grant explicit permissions to anon and authenticated roles for schools table
-- This should work even if RLS is disabled

-- Grant SELECT permission to anon role (public access)
GRANT SELECT ON public.schools TO anon;
GRANT SELECT ON public.schools TO authenticated;

-- Grant INSERT permission to authenticated users (for custom school creation)
GRANT INSERT ON public.schools TO authenticated;

-- Ensure RLS is disabled
ALTER TABLE public.schools DISABLE ROW LEVEL SECURITY;

-- Verify permissions
SELECT
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'schools'
ORDER BY grantee, privilege_type;

-- Test SELECT
SELECT COUNT(*) as total_schools FROM public.schools;
SELECT id, name FROM public.schools ORDER BY name LIMIT 5;
