import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatFileSize } from '@/lib/utils/file-hash'

export default async function BlockDetailPage({ params }: { params: { blockNumber: string } }) {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('school_id')
    .eq('id', session?.user?.id!)
    .single()

  // Get block details
  const { data: block } = await supabase
    .from('blocks')
    .select('*')
    .eq('school_id', profile?.school_id!)
    .eq('block_number', parseInt(params.blockNumber))
    .single()

  // Get files for this block
  const { data: files } = await supabase
    .from('files')
    .select('*')
    .eq('block_id', block?.id!)
    .order('created_at', { ascending: false })

  // Get question count
  const { count: questionCount } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('block_id', block?.id!)

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard/blocks" className="text-primary-600 hover:underline mb-2 inline-block">
          ← Back to Blocks
        </Link>
        <h1 className="text-3xl font-bold mb-2">Block {params.blockNumber}</h1>
        <p className="text-gray-600">{block?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-sm font-medium text-gray-500">Files Uploaded</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{files?.length || 0}</div>
        </div>

        <div className="card">
          <div className="text-sm font-medium text-gray-500">Questions Generated</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{questionCount || 0}</div>
        </div>

        <div className="card">
          <div className="text-sm font-medium text-gray-500">Target Questions</div>
          <div className="mt-2 text-3xl font-bold text-primary-600">
            {block?.is_review ? '15,000+' : '1,200-1,400'}
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex gap-4">
        <Link href="/dashboard/upload" className="btn-primary">
          Upload Materials
        </Link>
        {(questionCount || 0) > 0 && (
          <Link href="/dashboard/study" className="btn-secondary">
            Start Studying
          </Link>
        )}
      </div>

      {/* Files List */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Uploaded Files</h2>

        {files && files.length > 0 ? (
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{file.file_name}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>{file.file_type.toUpperCase()}</span>
                      <span>{formatFileSize(file.file_size)}</span>
                      <span>
                        {file.processing_status === 'completed' && '✓ Processed'}
                        {file.processing_status === 'pending' && '⏳ Processing...'}
                        {file.processing_status === 'failed' && '✗ Failed'}
                      </span>
                    </div>
                  </div>

                  {file.processing_status === 'pending' && (
                    <button
                      onClick={() => {
                        fetch('/api/questions/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ fileId: file.id }),
                        })
                      }}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Generate Questions
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No files uploaded yet. Upload study materials to generate questions.
          </div>
        )}
      </div>
    </div>
  )
}
