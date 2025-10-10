-- Simply disable RLS on schools table
-- Schools are public data that everyone should be able to read
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;

-- Verify schools can be read
SELECT COUNT(*) as total_schools FROM schools;
SELECT id, name FROM schools ORDER BY name LIMIT 5;
