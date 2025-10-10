-- Fix blocks policies to allow users to create blocks for their schools
DROP POLICY IF EXISTS "Users can view blocks in their school" ON blocks;
DROP POLICY IF EXISTS "Admins can manage blocks" ON blocks;

-- Allow users to view blocks in their school
CREATE POLICY "Users can view blocks in their school" ON blocks
  FOR SELECT USING (
    school_id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid())
  );

-- Allow authenticated users to insert blocks (needed during onboarding)
CREATE POLICY "Users can insert blocks" ON blocks
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to update blocks in their school
CREATE POLICY "Users can update blocks in their school" ON blocks
  FOR UPDATE USING (
    school_id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid())
  );

-- Admins can do everything
CREATE POLICY "Admins can manage all blocks" ON blocks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
