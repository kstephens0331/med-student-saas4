'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      console.log('[Login] Successful login:', data.user.id)

      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed, school_id')
        .eq('id', data.user.id)
        .single()

      console.log('[Login] Profile:', profile)

      if (profile?.onboarding_completed && profile?.school_id) {
        console.log('[Login] Redirecting to dashboard')
        window.location.href = '/dashboard'
      } else {
        console.log('[Login] Redirecting to onboarding')
        window.location.href = '/onboarding'
      }
    } catch (err: any) {
      console.error('[Login] Error:', err)
      setError(err.message || 'Failed to login')
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
