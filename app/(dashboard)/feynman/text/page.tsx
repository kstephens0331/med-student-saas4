'use client'

import { useState } from 'react'

export default function FeynmanTextPage() {
  const [topic, setTopic] = useState('')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (explanation.length < 500) {
      alert('Please write at least 500 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/feynman/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, explanation }),
      })

      const result = await response.json()
      setFeedback(result)
    } catch (error) {
      console.error('Evaluation error:', error)
      alert('Failed to evaluate explanation')
    } finally {
      setLoading(false)
    }
  }

  const downloadFeedback = () => {
    const content = `# Feynman Teaching Mode - Evaluation Report

## Topic: ${topic}

## Your Explanation:
${explanation}

## Evaluation Scores (Total: ${feedback.total}/100)
- Accuracy: ${feedback.accuracy}/25
- Completeness: ${feedback.completeness}/25
- Clarity: ${feedback.clarity}/25
- Depth: ${feedback.depth}/25

## Strengths:
${feedback.feedback.strengths.map((s: string) => `- ${s}`).join('\n')}

## Areas for Improvement:
${feedback.feedback.improvements.map((i: string) => `- ${i}`).join('\n')}

## Follow-up Questions:
${feedback.feedback.followUpQuestions.map((q: string) => `- ${q}`).join('\n')}
`

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `feynman-${topic.replace(/\s+/g, '-').toLowerCase()}.md`
    a.click()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Feynman Text Mode</h1>
        <p className="text-gray-600">Explain a medical concept and get AI feedback</p>
      </div>

      {!feedback ? (
        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Pathophysiology of Myocardial Infarction"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Your Explanation (500-2000 words)
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Teach this concept as if explaining to a fellow student..."
              className="input-field min-h-[400px]"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {explanation.length} characters (minimum 500)
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-blue-900">Evaluation Criteria:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Accuracy:</strong> Is the medical information correct?</li>
              <li>• <strong>Completeness:</strong> Does it cover all key aspects?</li>
              <li>• <strong>Clarity:</strong> Is it well-organized and easy to understand?</li>
              <li>• <strong>Depth:</strong> Does it show deep understanding beyond memorization?</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading || explanation.length < 500}
            className="btn-primary w-full"
          >
            {loading ? 'Evaluating...' : 'Get AI Feedback'}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Scores */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Evaluation Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{feedback.accuracy}</div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{feedback.completeness}</div>
                <div className="text-sm text-gray-600">Completeness</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{feedback.clarity}</div>
                <div className="text-sm text-gray-600">Clarity</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{feedback.depth}</div>
                <div className="text-sm text-gray-600">Depth</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{feedback.total}</div>
                <div className="text-sm text-gray-600">Total / 100</div>
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="card bg-green-50 border border-green-200">
            <h3 className="font-bold mb-3 text-green-900">✓ Strengths</h3>
            <ul className="space-y-2">
              {feedback.feedback.strengths.map((strength: string, i: number) => (
                <li key={i} className="text-green-800">{strength}</li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="card bg-orange-50 border border-orange-200">
            <h3 className="font-bold mb-3 text-orange-900">→ Areas for Improvement</h3>
            <ul className="space-y-2">
              {feedback.feedback.improvements.map((improvement: string, i: number) => (
                <li key={i} className="text-orange-800">{improvement}</li>
              ))}
            </ul>
          </div>

          {/* Follow-up Questions */}
          <div className="card bg-blue-50 border border-blue-200">
            <h3 className="font-bold mb-3 text-blue-900">? Follow-up Questions</h3>
            <ul className="space-y-2">
              {feedback.feedback.followUpQuestions.map((question: string, i: number) => (
                <li key={i} className="text-blue-800">{question}</li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button onClick={downloadFeedback} className="btn-primary">
              Download Report
            </button>
            <button
              onClick={() => {
                setFeedback(null)
                setTopic('')
                setExplanation('')
              }}
              className="btn-secondary"
            >
              New Explanation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
