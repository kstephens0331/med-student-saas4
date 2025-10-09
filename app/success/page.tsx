import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="max-w-md w-full card text-center">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your subscription has been activated. You now have full access to all features.
        </p>

        <div className="space-y-3">
          <Link href="/dashboard" className="btn-primary w-full block">
            Go to Dashboard
          </Link>
          <Link href="/dashboard/upload" className="btn-secondary w-full block">
            Upload Study Materials
          </Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">What's Next?</h3>
          <ul className="text-sm text-left text-gray-700 space-y-1">
            <li>• Upload your study materials (PDFs, lectures, notes)</li>
            <li>• AI generates 1,200-1,400 questions per block</li>
            <li>• Start studying with adaptive questioning</li>
            <li>• Use Feynman mode to test your understanding</li>
            <li>• Track your mastery progress</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
