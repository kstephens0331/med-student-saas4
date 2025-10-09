'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import type { School } from '@/lib/types/database'

export default function OnboardingPage() {
  const router = useRouter()
  const [schools, setSchools] = useState<School[]>([])
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('')
  const [newSchoolName, setNewSchoolName] = useState('')
  const [showNewSchool, setShowNewSchool] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSchools()
  }, [])

  const loadSchools = async () => {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name')

    if (data) setSchools(data)
    if (error) console.error('Error loading schools:', error)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let schoolId = selectedSchoolId

      // Create new school if needed
      if (showNewSchool && newSchoolName) {
        const { data: newSchool, error: schoolError } = await supabase
          .from('schools')
          .insert({ name: newSchoolName })
          .select()
          .single()

        if (schoolError) throw schoolError
        schoolId = newSchool.id

        // Create 10 blocks for the new school
        const blocks = Array.from({ length: 10 }, (_, i) => ({
          school_id: schoolId,
          block_number: i + 1,
          name: `Block ${i + 1}`,
          is_review: i >= 8, // Blocks 9-10 are review
        }))

        const { error: blocksError } = await supabase
          .from('blocks')
          .insert(blocks)

        if (blocksError) throw blocksError
      }

      if (!schoolId) {
        throw new Error('Please select or create a school')
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          school_id: schoolId,
          onboarding_completed: true,
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1 className="text-3xl font-bold text-center mb-2">Welcome!</h1>
      <p className="text-center text-gray-600 mb-6">Let&apos;s get you set up</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Select Your Medical School</label>

          {!showNewSchool ? (
            <>
              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="input-field mb-2"
              >
                <option value="">Choose a school...</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowNewSchool(true)}
                className="text-sm text-primary-600 hover:underline"
              >
                + Add my school (not listed)
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={newSchoolName}
                onChange={(e) => setNewSchoolName(e.target.value)}
                placeholder="Enter school name"
                className="input-field mb-2"
                required
              />

              <button
                type="button"
                onClick={() => {
                  setShowNewSchool(false)
                  setNewSchoolName('')
                }}
                className="text-sm text-gray-600 hover:underline"
              >
                ← Back to school list
              </button>
            </>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">What happens next?</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 10 study blocks will be created for your curriculum</li>
            <li>• Upload materials to each block (PDFs, lectures, notes)</li>
            <li>• AI generates 1,200-1,400 USMLE questions per block</li>
            <li>• Track your mastery and prepare for board exams</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading || (!selectedSchoolId && !newSchoolName)}
          className="btn-primary w-full"
        >
          {loading ? 'Setting up...' : 'Continue to Dashboard'}
        </button>
      </form>
    </div>
  )
}
