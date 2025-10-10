-- Drop ALL existing policies on schools table
DROP POLICY IF EXISTS "Users can view their own school" ON schools;
DROP POLICY IF EXISTS "Admins can insert schools" ON schools;
DROP POLICY IF EXISTS "Anyone can view schools" ON schools;
DROP POLICY IF EXISTS "Authenticated users can insert schools" ON schools;
DROP POLICY IF EXISTS "Admins can manage schools" ON schools;

-- Create simple policy: Everyone (even anonymous) can read schools
CREATE POLICY "public_schools_read" ON schools
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Authenticated users can insert schools (for custom school creation)
CREATE POLICY "authenticated_schools_insert" ON schools
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Test: This should return schools
SELECT COUNT(*) as total_schools FROM schools;
SELECT id, name FROM schools ORDER BY name LIMIT 5;
