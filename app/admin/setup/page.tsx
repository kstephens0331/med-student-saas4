'use client'

import { useState } from 'react'

export default function AdminSetupPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSetup = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/setup-schools', {
        method: 'POST',
      })
      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h1 className="text-2xl font-bold mb-4">Database Setup</h1>
          <p className="text-gray-600 mb-6">
            Click the button below to set up schools in the database and disable RLS.
          </p>

          <button
            onClick={handleSetup}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Setting up...' : 'Run Setup'}
          </button>

          {result && (
            <div className="mt-6">
              <h2 className="font-semibold mb-2">Result:</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
