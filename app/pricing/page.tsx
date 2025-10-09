'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PricingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (tier: 'individual' | 'cohort') => {
    setLoading(tier)

    try {
      const priceId = tier === 'individual'
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_INDIVIDUAL
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_COHORT

      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">
            Start your USMLE preparation journey today
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="card border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-4xl font-bold mb-6">$0</p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>5 RAG questions/day</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Limited study access</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Basic features</span>
              </li>
            </ul>
            <Link
              href="/signup"
              className="btn-secondary w-full block text-center"
            >
              Get Started Free
            </Link>
          </div>

          {/* Individual Tier */}
          <div className="card border-2 border-primary-500 transform scale-105">
            <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm w-fit mb-2">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Individual</h3>
            <p className="text-4xl font-bold mb-6">
              $20<span className="text-lg text-gray-600">/month</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Unlimited RAG questions</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>1,200-1,400 questions/block</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Feynman teaching mode</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Mastery tracking</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Adaptive learning</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>All features</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('individual')}
              disabled={loading === 'individual'}
              className="btn-primary w-full"
            >
              {loading === 'individual' ? 'Loading...' : 'Subscribe Now'}
            </button>
          </div>

          {/* Cohort Tier */}
          <div className="card border-2 border-gray-200">
            <h3 className="text-2xl font-bold mb-2">Cohort</h3>
            <p className="text-4xl font-bold mb-6">
              $15<span className="text-lg text-gray-600">/student</span>
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Everything in Individual</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Shared study materials</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Group pricing</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Admin dashboard</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Priority support</span>
              </li>
            </ul>
            <a
              href="mailto:info@stephenscode.dev"
              className="btn-secondary w-full block text-center"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
