import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master USMLE with AI-Powered Learning
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your study materials and get thousands of personalized USMLE-style questions.
            Track your mastery, get instant answers from your materials, and practice teaching concepts.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="btn-primary text-lg px-8 py-3"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="btn-secondary text-lg px-8 py-3"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Upload & Generate</h3>
            <p className="text-gray-600">
              Upload PDFs, lectures, and notes. Get 1,200-1,400 USMLE-style questions per block automatically.
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Adaptive Learning</h3>
            <p className="text-gray-600">
              AI tracks your mastery and focuses on weak topics. Study smarter, not harder.
            </p>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold mb-2">RAG Q&A</h3>
            <p className="text-gray-600">
              Ask questions and get instant answers from YOUR uploaded materials only.
            </p>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-8">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="card border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-4xl font-bold mb-4">$0</p>
              <ul className="text-left space-y-2 mb-6">
                <li>✓ 5 questions/day</li>
                <li>✓ Basic features</li>
                <li>✓ Limited access</li>
              </ul>
              <Link href="/signup" className="btn-secondary w-full">
                Start Free
              </Link>
            </div>

            <div className="card border-2 border-primary-500 transform scale-105">
              <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm w-fit mx-auto mb-2">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Individual</h3>
              <p className="text-4xl font-bold mb-4">$20<span className="text-lg">/mo</span></p>
              <ul className="text-left space-y-2 mb-6">
                <li>✓ Unlimited questions</li>
                <li>✓ All features</li>
                <li>✓ Feynman mode</li>
                <li>✓ Mastery tracking</li>
              </ul>
              <Link href="/signup" className="btn-primary w-full">
                Get Started
              </Link>
            </div>

            <div className="card border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Cohort</h3>
              <p className="text-4xl font-bold mb-4">$15<span className="text-lg">/student</span></p>
              <ul className="text-left space-y-2 mb-6">
                <li>✓ Everything in Individual</li>
                <li>✓ Shared materials</li>
                <li>✓ Group pricing</li>
                <li>✓ Admin dashboard</li>
              </ul>
              <a href="mailto:info@stephenscode.dev" className="btn-secondary w-full">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
