'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import type { Block } from '@/lib/types/database'

export default function StudyPage() {
  const router = useRouter()
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedBlockId, setSelectedBlockId] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBlocks()
  }, [])

  const loadBlocks = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('school_id')
      .eq('id', session?.user?.id!)
      .single()

    const { data } = await supabase
      .from('blocks')
      .select('*')
      .eq('school_id', profile?.school_id!)
      .order('block_number')

    if (data) setBlocks(data)
  }

  const startSession = async () => {
    if (!selectedBlockId) return

    setLoading(true)

    try {
      // Create study session
      const response = await fetch('/api/study/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockId: selectedBlockId }),
      })

      const { sessionId } = await response.json()

      router.push(`/dashboard/study/session/${sessionId}`)
    } catch (error) {
      console.error('Error starting session:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Study Mode</h1>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Start a Study Session</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Block</label>
            <select
              value={selectedBlockId}
              onChange={(e) => setSelectedBlockId(e.target.value)}
              className="input-field"
            >
              <option value="">Choose a block...</option>
              {blocks.map((block) => (
                <option key={block.id} value={block.id}>
                  Block {block.block_number} - {block.name}
                  {block.is_review ? ' (Review)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">How Study Mode Works:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• AI prioritizes questions from your weak topics</li>
              <li>• Avoids recently answered questions (last 7 days)</li>
              <li>• Get immediate feedback on each answer</li>
              <li>• Rate difficulty to improve future sessions</li>
              <li>• Track mastery progress automatically</li>
            </ul>
          </div>

          <button
            onClick={startSession}
            disabled={!selectedBlockId || loading}
            className="btn-primary w-full"
          >
            {loading ? 'Starting...' : 'Start Study Session'}
          </button>
        </div>
      </div>
    </div>
  )
}
