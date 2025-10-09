export type SubscriptionTier = 'free' | 'individual' | 'cohort'
export type MasteryLevel = 'needs_more_work' | 'understands' | 'masters'
export type FileType = 'pdf' | 'mp3' | 'mp4' | 'image' | 'note' | 'ppt'
export type FeynmanMode = 'text' | 'voice' | 'video'

export interface School {
  id: string
  name: string
  domain: string | null
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  school_id: string | null
  is_admin: boolean
  onboarding_completed: boolean
  created_at: string
  updated_at: string
  schools?: School
  subscriptions?: Subscription
}

export interface Subscription {
  id: string
  user_id: string
  tier: SubscriptionTier
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: string
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface Block {
  id: string
  school_id: string
  block_number: number
  name: string
  description: string | null
  is_review: boolean
  created_at: string
  updated_at: string
}

export interface File {
  id: string
  block_id: string
  uploaded_by: string
  school_id: string
  file_name: string
  file_type: FileType
  file_size: number
  storage_path: string
  sha256_hash: string
  is_shared: boolean
  processing_status: string
  processing_error: string | null
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  block_id: string
  file_id: string | null
  school_id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e: string
  correct_answer: 'A' | 'B' | 'C' | 'D' | 'E'
  explanation: string
  topic: string | null
  difficulty: string
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface StudySession {
  id: string
  user_id: string
  block_id: string | null
  exam_type: string | null
  started_at: string
  ended_at: string | null
  total_questions: number
  correct_answers: number
  metadata: Record<string, any>
}

export interface StudentQuestionAttempt {
  id: string
  user_id: string
  question_id: string
  session_id: string | null
  selected_answer: 'A' | 'B' | 'C' | 'D' | 'E'
  is_correct: boolean
  time_spent_seconds: number | null
  difficulty_rating: string | null
  attempted_at: string
}

export interface StudentMastery {
  id: string
  user_id: string
  block_id: string
  topic: string
  total_attempts: number
  correct_attempts: number
  accuracy_percentage: number
  mastery_level: MasteryLevel
  last_attempted_at: string | null
  created_at: string
  updated_at: string
}

export interface FeynmanSession {
  id: string
  user_id: string
  block_id: string | null
  topic: string
  mode: FeynmanMode
  content: string | null
  transcription: string | null
  recording_url: string | null
  accuracy_score: number | null
  completeness_score: number | null
  clarity_score: number | null
  depth_score: number | null
  total_score: number | null
  feedback: Record<string, any> | null
  started_at: string
  completed_at: string | null
  metadata: Record<string, any>
}

export interface DailyUsage {
  id: string
  user_id: string
  usage_date: string
  rag_questions_asked: number
  study_questions_answered: number
  created_at: string
  updated_at: string
}
