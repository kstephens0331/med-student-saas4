'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Block } from '@/lib/types/database'

export default function UploadPage() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [selectedBlockId, setSelectedBlockId] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !selectedBlockId) {
      setMessage({ type: 'error', text: 'Please select a block and file' })
      return
    }

    setUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('blockId', selectedBlockId)

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          type: 'success',
          text: data.isDuplicate
            ? 'This file already exists in this block'
            : 'File uploaded successfully! Questions will be generated in the background.',
        })
        setFile(null)
        setSelectedBlockId('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Study Materials</h1>

      <div className="card">
        {message && (
          <div
            className={`mb-4 px-4 py-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Block</label>
            <select
              value={selectedBlockId}
              onChange={(e) => setSelectedBlockId(e.target.value)}
              className="input-field"
              required
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

          <div>
            <label className="block text-sm font-medium mb-2">Upload File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.mp3,.mp4,.ppt,.pptx,.jpg,.jpeg,.png,.txt,.md,.doc,.docx"
              className="input-field"
              required
            />
            <p className="mt-2 text-sm text-gray-500">
              Supported: PDF, MP3, MP4, PPT, Images, Text files
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-blue-900">Expected Question Generation:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Textbook PDFs: ~350 questions</li>
              <li>• PowerPoint: ~125 questions</li>
              <li>• Lecture (MP3/MP4): ~225 questions</li>
              <li>• Notes: ~75-100 questions</li>
            </ul>
            <p className="mt-2 text-sm text-blue-800">
              Target: 1,200-1,400 questions per block
            </p>
          </div>

          <button type="submit" disabled={uploading} className="btn-primary w-full">
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      </div>
    </div>
  )
}
