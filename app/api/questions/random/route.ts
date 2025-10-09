import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { blockId, count = 10, excludeRecent = true } = await request.json()

    if (!blockId) {
      return NextResponse.json({ error: 'Missing block ID' }, { status: 400 })
    }

    // Get user's mastery data to prioritize weak topics
    const { data: masteryData } = await supabase
      .from('student_mastery')
      .select('topic')
      .eq('user_id', session.user.id)
      .eq('block_id', blockId)
      .eq('mastery_level', 'needs_more_work')

    const weakTopics = masteryData?.map(m => m.topic) || []

    // Get recently answered question IDs (last 7 days)
    let recentQuestionIds: string[] = []
    if (excludeRecent) {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const { data: recentAttempts } = await supabase
        .from('student_question_attempts')
        .select('question_id')
        .eq('user_id', session.user.id)
        .gte('attempted_at', sevenDaysAgo.toISOString())

      recentQuestionIds = recentAttempts?.map(a => a.question_id) || []
    }

    // Build query to get questions
    let query = supabase
      .from('questions')
      .select('*')
      .eq('block_id', blockId)

    // Exclude recent questions
    if (recentQuestionIds.length > 0) {
      query = query.not('id', 'in', `(${recentQuestionIds.join(',')})`)
    }

    // Prioritize weak topics if available
    if (weakTopics.length > 0) {
      query = query.in('topic', weakTopics)
    }

    const { data: questions, error } = await query.limit(count)

    if (error) {
      console.error('Error fetching questions:', error)
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
    }

    // If not enough questions from weak topics, get more general questions
    if (!questions || questions.length < count) {
      const remainingCount = count - (questions?.length || 0)

      const { data: additionalQuestions } = await supabase
        .from('questions')
        .select('*')
        .eq('block_id', blockId)
        .not('id', 'in', `(${[...recentQuestionIds, ...(questions?.map(q => q.id) || [])].join(',')})`)
        .limit(remainingCount)

      const allQuestions = [...(questions || []), ...(additionalQuestions || [])]

      return NextResponse.json({ questions: allQuestions })
    }

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Random questions error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
