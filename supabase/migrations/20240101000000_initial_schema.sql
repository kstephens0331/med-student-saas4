-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Schools table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  domain TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  school_id UUID REFERENCES schools(id),
  is_admin BOOLEAN DEFAULT FALSE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription tiers
CREATE TYPE subscription_tier AS ENUM ('free', 'individual', 'cohort');

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  tier subscription_tier DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Cohorts for group pricing
CREATE TABLE cohorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id),
  name TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  price_per_student DECIMAL(10,2) DEFAULT 15.00,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cohort members
CREATE TABLE cohort_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cohort_id, user_id)
);

-- Blocks (10 per school: 1-8 content, 9-10 review)
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  block_number INTEGER NOT NULL CHECK (block_number >= 1 AND block_number <= 10),
  name TEXT NOT NULL,
  description TEXT,
  is_review BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, block_number)
);

-- File types
CREATE TYPE file_type AS ENUM ('pdf', 'mp3', 'mp4', 'image', 'note', 'ppt');

-- Files
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES user_profiles(id),
  school_id UUID REFERENCES schools(id),
  file_name TEXT NOT NULL,
  file_type file_type NOT NULL,
  file_size BIGINT,
  storage_path TEXT NOT NULL,
  sha256_hash TEXT NOT NULL,
  is_shared BOOLEAN DEFAULT FALSE,
  processing_status TEXT DEFAULT 'pending',
  processing_error TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, block_id, sha256_hash)
);

-- File embeddings for RAG
CREATE TABLE file_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_id UUID REFERENCES files(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX ON file_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
  file_id UUID REFERENCES files(id) ON DELETE SET NULL,
  school_id UUID REFERENCES schools(id),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  option_e TEXT NOT NULL,
  correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D', 'E')),
  explanation TEXT NOT NULL,
  topic TEXT,
  difficulty TEXT DEFAULT 'medium',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study sessions
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  block_id UUID REFERENCES blocks(id),
  exam_type TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  total_questions INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

-- Student question attempts
CREATE TABLE student_question_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  session_id UUID REFERENCES study_sessions(id) ON DELETE SET NULL,
  selected_answer CHAR(1) CHECK (selected_answer IN ('A', 'B', 'C', 'D', 'E')),
  is_correct BOOLEAN NOT NULL,
  time_spent_seconds INTEGER,
  difficulty_rating TEXT,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student mastery tracking
CREATE TYPE mastery_level AS ENUM ('needs_more_work', 'understands', 'masters');

CREATE TABLE student_mastery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  block_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  total_attempts INTEGER DEFAULT 0,
  correct_attempts INTEGER DEFAULT 0,
  accuracy_percentage DECIMAL(5,2) DEFAULT 0,
  mastery_level mastery_level DEFAULT 'needs_more_work',
  last_attempted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, block_id, topic)
);

-- Test grades
CREATE TABLE test_grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  block_id UUID REFERENCES blocks(id),
  test_name TEXT NOT NULL,
  score DECIMAL(5,2),
  max_score DECIMAL(5,2),
  percentage DECIMAL(5,2),
  test_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feynman sessions
CREATE TYPE feynman_mode AS ENUM ('text', 'voice', 'video');

CREATE TABLE feynman_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  block_id UUID REFERENCES blocks(id),
  topic TEXT NOT NULL,
  mode feynman_mode NOT NULL,
  content TEXT,
  transcription TEXT,
  recording_url TEXT,
  accuracy_score INTEGER,
  completeness_score INTEGER,
  clarity_score INTEGER,
  depth_score INTEGER,
  total_score INTEGER,
  feedback JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Review progress (blocks 9-10)
CREATE TABLE review_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  block_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
  exam_type TEXT NOT NULL,
  total_questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  topics_mastered JSONB DEFAULT '[]',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, block_id, exam_type)
);

-- Daily usage for rate limiting
CREATE TABLE daily_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  rag_questions_asked INTEGER DEFAULT 0,
  study_questions_answered INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, usage_date)
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_files_school_block ON files(school_id, block_id);
CREATE INDEX idx_files_hash ON files(sha256_hash);
CREATE INDEX idx_questions_block ON questions(block_id);
CREATE INDEX idx_questions_topic ON questions(topic);
CREATE INDEX idx_attempts_user ON student_question_attempts(user_id);
CREATE INDEX idx_attempts_question ON student_question_attempts(question_id);
CREATE INDEX idx_mastery_user_block ON student_mastery(user_id, block_id);
CREATE INDEX idx_daily_usage_user_date ON daily_usage(user_id, usage_date);

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_file_ids uuid[] DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  file_id uuid,
  chunk_text text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    file_embeddings.id,
    file_embeddings.file_id,
    file_embeddings.chunk_text,
    1 - (file_embeddings.embedding <=> query_embedding) as similarity
  FROM file_embeddings
  WHERE
    (filter_file_ids IS NULL OR file_embeddings.file_id = ANY(filter_file_ids))
    AND 1 - (file_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY file_embeddings.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Update timestamps function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_cohorts_updated_at BEFORE UPDATE ON cohorts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_blocks_updated_at BEFORE UPDATE ON blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_student_mastery_updated_at BEFORE UPDATE ON student_mastery FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_review_progress_updated_at BEFORE UPDATE ON review_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_daily_usage_updated_at BEFORE UPDATE ON daily_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at();
