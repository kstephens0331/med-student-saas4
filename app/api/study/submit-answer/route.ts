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

    const {
      questionId,
      selectedAnswer,
      sessionId,
      timeSpentSeconds,
      difficultyRating,
    } = await request.json()

    if (!questionId || !selectedAnswer) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get question details
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*, blocks(*)')
      .eq('id', questionId)
      .single()

    if (questionError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const isCorrect = selectedAnswer === question.correct_answer

    // Record attempt
    const { error: attemptError } = await supabase
      .from('student_question_attempts')
      .insert({
        user_id: session.user.id,
        question_id: questionId,
        session_id: sessionId || null,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        time_spent_seconds: timeSpentSeconds || null,
        difficulty_rating: difficultyRating || null,
      })

    if (attemptError) {
      console.error('Error recording attempt:', attemptError)
      return NextResponse.json({ error: 'Failed to record attempt' }, { status: 500 })
    }

    // Update study session
    if (sessionId) {
      await supabase.rpc('increment', {
        row_id: sessionId,
        x_total: 1,
        x_correct: isCorrect ? 1 : 0,
      })
    }

    // Update mastery tracking
    if (question.topic) {
      const { data: existingMastery } = await supabase
        .from('student_mastery')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('block_id', question.block_id)
        .eq('topic', question.topic)
        .single()

      const totalAttempts = (existingMastery?.total_attempts || 0) + 1
      const correctAttempts = (existingMastery?.correct_attempts || 0) + (isCorrect ? 1 : 0)
      const accuracyPercentage = (correctAttempts / totalAttempts) * 100

      let masteryLevel: 'needs_more_work' | 'understands' | 'masters' = 'needs_more_work'
      if (accuracyPercentage >= 95) {
        masteryLevel = 'masters'
      } else if (accuracyPercentage >= 80) {
        masteryLevel = 'understands'
      }

      await supabase
        .from('student_mastery')
        .upsert({
          user_id: session.user.id,
          block_id: question.block_id,
          topic: question.topic,
          total_attempts: totalAttempts,
          correct_attempts: correctAttempts,
          accuracy_percentage: accuracyPercentage,
          mastery_level: masteryLevel,
          last_attempted_at: new Date().toISOString(),
        })
    }

    return NextResponse.json({
      isCorrect,
      correctAnswer: question.correct_answer,
      explanation: question.explanation,
    })
  } catch (error) {
    console.error('Submit answer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
