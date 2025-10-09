'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import type { Question } from '@/lib/types/database'

export default function StudySessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [blockId, setBlockId] = useState<string>('')

  useEffect(() => {
    loadSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadSession = async () => {
    // Get session details
    const { data: session } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()

    if (session?.block_id) {
      setBlockId(session.block_id)

      // Load questions
      const response = await fetch('/api/questions/random', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockId: session.block_id, count: 10 }),
      })

      const { questions: loadedQuestions } = await response.json()
      setQuestions(loadedQuestions || [])
    }

    setLoading(false)
  }

  const submitAnswer = async () => {
    if (!selectedAnswer) return

    const response = await fetch('/api/study/submit-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: currentQuestion.id,
        selectedAnswer,
        sessionId,
      }),
    })

    const result = await response.json()
    setFeedback(result)
    setShowFeedback(true)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
      setShowFeedback(false)
      setFeedback(null)
    } else {
      // End session
      router.push('/dashboard/mastery')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading session...</div>
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto card">
        <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
        <p className="text-gray-600 mb-4">
          There are no questions available for this block. Please upload study materials first.
        </p>
        <button onClick={() => router.push('/dashboard/upload')} className="btn-primary">
          Upload Materials
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h1>
        <button onClick={() => router.push('/dashboard/study')} className="text-gray-500 hover:text-gray-700">
          End Session
        </button>
      </div>

      <div className="card">
        {/* Question */}
        <div className="mb-6">
          <p className="text-lg whitespace-pre-wrap">{currentQuestion.question_text}</p>
        </div>

        {/* Answer Choices */}
        <div className="space-y-3 mb-6">
          {['A', 'B', 'C', 'D', 'E'].map((option) => {
            const optionText = currentQuestion[`option_${option.toLowerCase()}` as keyof Question] as string
            const isSelected = selectedAnswer === option
            const isCorrect = feedback?.correctAnswer === option
            const isWrong = showFeedback && isSelected && !feedback?.isCorrect

            return (
              <button
                key={option}
                onClick={() => !showFeedback && setSelectedAnswer(option)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  isCorrect && showFeedback
                    ? 'border-green-500 bg-green-50'
                    : isWrong
                    ? 'border-red-500 bg-red-50'
                    : isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-semibold">{option}.</span> {optionText}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {showFeedback && feedback && (
          <div className={`mb-6 p-4 rounded-lg ${feedback.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="font-semibold mb-2">
              {feedback.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </p>
            <p className="text-sm">{feedback.explanation}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!showFeedback ? (
            <button
              onClick={submitAnswer}
              disabled={!selectedAnswer}
              className="btn-primary flex-1"
            >
              Submit Answer
            </button>
          ) : (
            <button onClick={nextQuestion} className="btn-primary flex-1">
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Session'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
