import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function BlocksPage() {
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('school_id')
    .eq('id', session?.user?.id!)
    .single()

  const { data: blocks } = await supabase
    .from('blocks')
    .select('*, files(count)')
    .eq('school_id', profile?.school_id!)
    .order('block_number')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Study Blocks</h1>
        <p className="text-gray-600">Manage your 10 curriculum blocks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blocks?.map((block) => (
          <Link
            key={block.id}
            href={`/dashboard/blocks/${block.block_number}`}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-2xl font-bold">Block {block.block_number}</h3>
                <p className="text-gray-600">{block.name}</p>
              </div>
              {block.is_review && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                  Review
                </span>
              )}
            </div>

            {block.description && (
              <p className="text-sm text-gray-600 mb-3">{block.description}</p>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {block.files?.[0]?.count || 0} files uploaded
              </div>
              <div className="text-primary-600 font-medium">
                View Details →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
