-- Allow anyone (authenticated or not) to view schools list
DROP POLICY IF EXISTS "Users can view their own school" ON schools;
DROP POLICY IF EXISTS "Admins can insert schools" ON schools;

-- Allow anyone to view all schools (needed for onboarding dropdown)
CREATE POLICY "Anyone can view schools" ON schools
  FOR SELECT USING (true);

-- Only authenticated users can insert new schools (when adding custom school)
CREATE POLICY "Authenticated users can insert schools" ON schools
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Admins can manage schools
CREATE POLICY "Admins can manage schools" ON schools
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
