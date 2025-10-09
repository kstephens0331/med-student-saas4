import Link from 'next/link'

export default function FeynmanPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Feynman Teaching Mode</h1>
        <p className="text-gray-600">
          Teach medical concepts and get AI-powered feedback on your understanding
        </p>
      </div>

      <div className="card bg-blue-50 border border-blue-200">
        <h3 className="font-semibold mb-2 text-blue-900">What is the Feynman Technique?</h3>
        <p className="text-blue-800 text-sm">
          The Feynman Technique is a learning method where you teach a concept in simple terms.
          If you can&apos;t explain it simply, you don&apos;t understand it well enough. Our AI evaluates
          your explanations and helps you identify gaps in your knowledge.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Text Mode */}
        <Link href="/dashboard/feynman/text" className="card hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-3">✍️</div>
          <h3 className="text-xl font-bold mb-2">Text Mode</h3>
          <p className="text-gray-600 mb-4">
            Write a detailed explanation of a medical concept and receive comprehensive AI feedback
          </p>
          <div className="text-sm text-gray-500">
            <div className="font-semibold mb-2">Evaluation Criteria:</div>
            <ul className="space-y-1">
              <li>• Accuracy (0-25 points)</li>
              <li>• Completeness (0-25 points)</li>
              <li>• Clarity (0-25 points)</li>
              <li>• Depth (0-25 points)</li>
            </ul>
          </div>
          <div className="mt-4 text-primary-600 font-medium">Start Text Mode →</div>
        </Link>

        {/* Voice Mode */}
        <div className="card bg-gray-100 border-2 border-gray-300 opacity-75">
          <div className="text-4xl mb-3">🎤</div>
          <h3 className="text-xl font-bold mb-2">Voice/Video Mode</h3>
          <p className="text-gray-600 mb-4">
            Record yourself teaching and get real-time AI probing questions
          </p>
          <div className="text-sm text-gray-500">
            <div className="font-semibold mb-2">Features:</div>
            <ul className="space-y-1">
              <li>• Real-time transcription</li>
              <li>• AI probing questions every 2-3 min</li>
              <li>• Comprehensive feedback report</li>
              <li>• Download as Word/Google Doc</li>
            </ul>
          </div>
          <div className="mt-4 text-gray-500 font-medium">Coming in Phase 3</div>
        </div>
      </div>
    </div>
  )
}
