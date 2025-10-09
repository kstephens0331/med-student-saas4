-- Enable Row Level Security on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohort_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE feynman_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Schools policies
CREATE POLICY "Users can view their own school" ON schools
  FOR SELECT USING (
    id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can insert schools" ON schools
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Anyone can insert their profile on signup" ON user_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Subscriptions policies
CREATE POLICY "Users can view their own subscription" ON subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own subscription" ON subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own subscription" ON subscriptions
  FOR UPDATE USING (user_id = auth.uid());

-- Cohorts policies
CREATE POLICY "Users can view cohorts in their school" ON cohorts
  FOR SELECT USING (
    school_id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage cohorts" ON cohorts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Cohort members policies
CREATE POLICY "Users can view cohort members in their cohort" ON cohort_members
  FOR SELECT USING (
    cohort_id IN (
      SELECT cohort_id FROM cohort_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join cohorts" ON cohort_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Blocks policies
CREATE POLICY "Users can view blocks in their school" ON blocks
  FOR SELECT USING (
    school_id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can manage blocks" ON blocks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );

-- Files policies
CREATE POLICY "Users can view files in their school" ON files
  FOR SELECT USING (
    school_id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can upload files to their school blocks" ON files
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid() AND
    school_id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own files" ON files
  FOR UPDATE USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete their own files" ON files
  FOR DELETE USING (uploaded_by = auth.uid());

-- File embeddings policies
CREATE POLICY "Users can view embeddings for files in their school" ON file_embeddings
  FOR SELECT USING (
    file_id IN (
      SELECT id FROM files WHERE school_id IN (
        SELECT school_id FROM user_profiles WHERE id = auth.uid()
      )
    )
  );

-- Questions policies
CREATE POLICY "Users can view questions in their school" ON questions
  FOR SELECT USING (
    school_id IN (SELECT school_id FROM user_profiles WHERE id = auth.uid())
  );

-- Study sessions policies
CREATE POLICY "Users can view their own study sessions" ON study_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own study sessions" ON study_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own study sessions" ON study_sessions
  FOR UPDATE USING (user_id = auth.uid());

-- Student question attempts policies
CREATE POLICY "Users can view their own attempts" ON student_question_attempts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own attempts" ON student_question_attempts
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Student mastery policies
CREATE POLICY "Users can view their own mastery data" ON student_mastery
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own mastery data" ON student_mastery
  FOR ALL USING (user_id = auth.uid());

-- Test grades policies
CREATE POLICY "Users can view their own test grades" ON test_grades
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own test grades" ON test_grades
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Feynman sessions policies
CREATE POLICY "Users can view their own feynman sessions" ON feynman_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own feynman sessions" ON feynman_sessions
  FOR ALL USING (user_id = auth.uid());

-- Review progress policies
CREATE POLICY "Users can view their own review progress" ON review_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own review progress" ON review_progress
  FOR ALL USING (user_id = auth.uid());

-- Daily usage policies
CREATE POLICY "Users can view their own daily usage" ON daily_usage
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own daily usage" ON daily_usage
  FOR ALL USING (user_id = auth.uid());

-- Audit logs policies
CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = TRUE)
  );
